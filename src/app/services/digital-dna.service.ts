import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: 'binary' | 'data' | 'embedding' | 'pattern';
  value?: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class DigitalDnaService implements OnDestroy {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private isPaused = false;
  private isInitialized = false;
  private mutationRate = new BehaviorSubject<number>(0.05);
  private complexityLevel = new BehaviorSubject<number>(1);
  
  private binaryChars = ['0', '1'];
  private dataChars = ['A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  private embeddingColors = ['#0d1b2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd', '#000000'];
  
  private colors: Record<Particle['type'], string> = {
    binary: '#00ff41',
    data: '#008f11',
    embedding: '#0a3d62',
    pattern: '#1a365d'
  };

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.initCanvas(), 100);
    });
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private initCanvas(): void {
    if (this.isInitialized) return;
    
    try {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'digital-dna-canvas';
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
      `;
      document.body.appendChild(this.canvas);
      
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) {
        console.error('Failed to get canvas 2D context');
        return;
      }
      
      this.resizeCanvas();
      this.initParticles();
      this.startAnimation();
      
      window.addEventListener('resize', () => this.resizeCanvas());
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing Digital DNA canvas:', error);
    }
  }

  private resizeCanvas(): void {
    if (!this.canvas || !this.ctx) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initParticles();
  }

  private initParticles(): void {
    this.particles = [];
    const complexity = this.complexityLevel.getValue();
    const particleCount = Math.floor(50 * complexity);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createRandomParticle());
    }
  }

  private createRandomParticle(): Particle {
    const types: Particle['type'][] = ['binary', 'data', 'embedding', 'pattern'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const canvasWidth = this.canvas?.width || window.innerWidth;
    const canvasHeight = this.canvas?.height || window.innerHeight;
    
    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: type === 'embedding' ? Math.random() * 3 + 2 : Math.random() * 14 + 10,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      type,
      value: this.generateValue(type),
      color: this.colors[type]
    };
  }

  private generateValue(type: Particle['type']): string {
    switch (type) {
      case 'binary':
        return this.binaryChars[Math.floor(Math.random() * this.binaryChars.length)];
      case 'data':
        return this.dataChars[Math.floor(Math.random() * this.dataChars.length)];
      case 'embedding':
        return '';
      case 'pattern':
        return ['◆', '◇', '●', '○', '■', '□'][Math.floor(Math.random() * 6)];
      default:
        return '';
    }
  }

  private updateParticles(): void {
    if (!this.canvas) return;
    
    const mutationRate = this.mutationRate.getValue();
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    
    this.particles.forEach((particle) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = canvasWidth;
      if (particle.x > canvasWidth) particle.x = 0;
      if (particle.y < 0) particle.y = canvasHeight;
      if (particle.y > canvasHeight) particle.y = 0;
      
      // Random mutation
      if (Math.random() < mutationRate) {
        particle.value = this.generateValue(particle.type);
        particle.opacity = Math.random() * 0.5 + 0.2;
        
        // Occasionally change type
        if (Math.random() < 0.3) {
          const types: Particle['type'][] = ['binary', 'data', 'embedding', 'pattern'];
          particle.type = types[Math.floor(Math.random() * types.length)];
          particle.color = this.colors[particle.type];
          particle.value = this.generateValue(particle.type);
        }
      }
      
      // Occasional speed change
      if (Math.random() < mutationRate * 2) {
        particle.speedX = (Math.random() - 0.5) * 0.5;
        particle.speedY = (Math.random() - 0.5) * 0.5;
      }
    });
  }

  private drawParticles(): void {
    if (!this.ctx) return;
    
    this.particles.forEach(particle => {
      if (particle.type === 'embedding') {
        // Draw embedding visualization (glowing circles)
        const gradient = this.ctx!.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, this.hexToRgba(particle.color, particle.opacity));
        gradient.addColorStop(0.5, this.hexToRgba(particle.color, particle.opacity * 0.3));
        gradient.addColorStop(1, this.hexToRgba(particle.color, 0));
        
        this.ctx!.fillStyle = gradient;
        this.ctx!.beginPath();
        this.ctx!.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        this.ctx!.fill();
      } else {
        // Draw text/pattern characters
        this.ctx!.fillStyle = this.hexToRgba(particle.color, particle.opacity);
        this.ctx!.font = `${particle.size}px 'JetBrains Mono', monospace`;
        this.ctx!.fillText(particle.value || '', particle.x, particle.y);
      }
    });
  }

  private drawConnections(): void {
    if (!this.ctx || this.particles.length < 2) return;
    
    const maxDistance = 150;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2 * p1.opacity;
          this.ctx.strokeStyle = this.hexToRgba(p1.color, opacity);
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
  }

  private drawDataStreams(): void {
    if (!this.ctx || !this.canvas) return;
    
    const streamCount = 3;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < streamCount; i++) {
      const y = (this.canvas.height / streamCount) * i + this.canvas.height / (streamCount * 2);
      
      // Animated data packets
      for (let j = 0; j < 5; j++) {
        const x = ((time * 50 + j * 200 + i * 100) % (this.canvas.width + 200)) - 100;
        const height = Math.sin(time + j) * 5 + 10;
        
        this.ctx.fillStyle = this.hexToRgba(this.embeddingColors[j % this.embeddingColors.length], 0.2);
        this.ctx.fillRect(x, y - height / 2, 30, height);
      }
    }
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private animate(): void {
    if (!this.ctx || !this.canvas || this.isPaused) return;
    
    // Clear canvas with trail effect
    this.ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw data streams
    this.drawDataStreams();
    
    // Update and draw particles
    this.updateParticles();
    this.drawParticles();
    
    // Draw connections
    this.drawConnections();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private startAnimation(): void {
    if (this.animationId === null && !this.isPaused) {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  public pause(): void {
    this.isPaused = true;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public resume(): void {
    this.isPaused = false;
    this.startAnimation();
  }

  public setMutationRate(rate: number): void {
    this.mutationRate.next(Math.max(0, Math.min(0.2, rate)));
  }

  public setComplexity(level: number): void {
    this.complexityLevel.next(Math.max(0.5, Math.min(3, level)));
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.initParticles(), 50);
    });
  }

  public increaseComplexity(): void {
    const current = this.complexityLevel.getValue();
    this.setComplexity(current + 0.5);
  }

  public decreaseComplexity(): void {
    const current = this.complexityLevel.getValue();
    this.setComplexity(current - 0.5);
  }

  public togglePause(): void {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  public destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    if (this.canvas?.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.isInitialized = false;
  }
}