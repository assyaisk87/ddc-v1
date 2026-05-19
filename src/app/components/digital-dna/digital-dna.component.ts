import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DigitalDnaService } from '../../services/digital-dna.service';

@Component({
  selector: 'app-digital-dna',
  template: `
    <div class="digital-dna-controls" [class.active]="showControls">
      <button 
        class="dna-btn dna-btn-complexity"
        (click)="increaseComplexity()"
        [disabled]="complexity >= 3"
        title="Increase complexity"
      >
        <span class="btn-icon">⟨⟨</span>
        <span class="btn-label">DNA+</span>
      </button>
      
      <button 
        class="dna-btn dna-btn-mutation"
        (click)="toggleMutation()"
        [class.active]="highMutation"
        title="Toggle mutation rate"
      >
        <span class="btn-icon">⚡</span>
        <span class="btn-label">Mutate</span>
      </button>
      
      <button 
        class="dna-btn dna-btn-pause"
        (click)="togglePause()"
        title="Pause/Resume"
      >
        <span class="btn-icon" [class.paused]="isPaused">{{ isPaused ? '▶' : '❚❚' }}</span>
        <span class="btn-label">{{ isPaused ? 'Play' : 'Pause' }}</span>
      </button>
      
      <button 
        class="dna-btn dna-btn-toggle"
        (click)="toggleControls()"
        title="Toggle controls"
      >
        <span class="btn-icon">⚙️</span>
      </button>
    </div>
  `,
  styleUrls: ['./digital-dna.component.scss']
})
export class DigitalDnaComponent implements OnInit, OnDestroy {
  showControls = true;
  isPaused = false;
  highMutation = false;
  complexity = 1;
  
  constructor(private digitalDnaService: DigitalDnaService) {}

  ngOnInit(): void {
    // Controls auto-hide after 5 seconds of inactivity
    this.setupAutoHide();
  }

  ngOnDestroy(): void {
    // Service cleanup handled automatically
  }

  @HostListener('document:mousemove')
  onMouseMove(): void {
    this.resetAutoHide();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.digital-dna-controls')) {
      this.showControls = false;
    }
  }

  private autoHideTimeout: ReturnType<typeof setTimeout> | null = null;

  private setupAutoHide(): void {
    this.resetAutoHide();
  }

  private resetAutoHide(): void {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
    
    if (this.showControls) {
      this.autoHideTimeout = setTimeout(() => {
        this.showControls = false;
      }, 5000);
    }
  }

  increaseComplexity(): void {
    this.digitalDnaService.increaseComplexity();
    this.complexity = Math.min(3, this.complexity + 0.5);
  }

  decreaseComplexity(): void {
    this.digitalDnaService.decreaseComplexity();
    this.complexity = Math.max(0.5, this.complexity - 0.5);
  }

  toggleMutation(): void {
    this.highMutation = !this.highMutation;
    this.digitalDnaService.setMutationRate(this.highMutation ? 0.15 : 0.05);
  }

  togglePause(): void {
    this.digitalDnaService.togglePause();
    this.isPaused = !this.isPaused;
  }

  toggleControls(): void {
    this.showControls = !this.showControls;
    if (this.showControls) {
      this.resetAutoHide();
    }
  }
}