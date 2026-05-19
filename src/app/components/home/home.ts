import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { AiAvatarComponent } from '../ai-avatar/ai-avatar.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink, AiAvatarComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  features = [
    {
      icon: '🤖',
      titleKey: 'home.features.title1',
      descKey: 'home.features.desc1',
      color: '#00D4FF'
    },
    {
      icon: '⛓️',
      titleKey: 'home.features.title2',
      descKey: 'home.features.desc2',
      color: '#7B2CBF'
    },
    {
      icon: '⚡',
      titleKey: 'home.features.title3',
      descKey: 'home.features.desc3',
      color: '#FF006E'
    }
  ];

  stats = [
    { value: '50+', label: 'Банковских Партнеров', color: '#00D4FF' },
    { value: '100M+', label: 'Транзакций', color: '#7B2CBF' },
    { value: '99.9%', label: 'Uptime', color: '#FF006E' },
    { value: '15+', label: 'Наград', color: '#00D4FF' }
  ];

  technologies = [
    'Angular', 'Node.js', 'Blockchain', 'AI/ML',
    'Kubernetes', 'PostgreSQL', 'Redis', 'AWS'
  ];

  poweredByPartners = [
    {
      name: 'Angular',
      description: 'Modern web framework',
      icon: '⚡',
      color: '#00D4FF'
    },
    {
      name: 'TypeScript',
      description: 'Typed JavaScript',
      icon: '🔷',
      color: '#7B2CBF'
    },
    {
      name: 'RxJS',
      description: 'Reactive programming',
      icon: '🔀',
      color: '#FF006E'
    },
    {
      name: 'SCSS',
      description: 'CSS preprocessing',
      icon: '🎨',
      color: '#00FFA3'
    }
  ];

  // AI Avatar state
  isPlaying: boolean = false;
  hasInteracted: boolean = false;
  greeting: { text: string; subtext: string } = { text: '', subtext: '' };
  showPlaceholder: boolean = false;
  audio: HTMLAudioElement | null = null;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.setGreeting();
    this.initAudio();
  }

  // Initialize audio
  initAudio() {
    try {
      // Create audio element
      this.audio = this.renderer.createElement('audio');
      
      // Set audio source (you can replace with your actual audio file)
      // For now, using a simple beep tone
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Store audio context for later use
      (this as any).audioContext = audioContext;
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }

  // Dynamic greeting based on time of day
  setGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      this.greeting = { 
        text: 'Доброе утро', 
        subtext: 'Начните день с будущего' 
      };
    } else if (hour >= 12 && hour < 18) {
      this.greeting = { 
        text: 'Добрый день', 
        subtext: 'Время для инноваций' 
      };
    } else {
      this.greeting = { 
        text: 'Добрый вечер', 
        subtext: 'Добро пожаловать в будущее' 
      };
    }
  }

  // Toggle AI voice greeting
  toggleVoice(event?: Event) {
    // Prevent event propagation to avoid clicking issues
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (this.isPlaying) {
      // Stop playing
      this.stopAudio();
      this.isPlaying = false;
    } else {
      // Start playing
      this.playAudio();
      this.isPlaying = true;
      this.hasInteracted = true;
      
      // Auto-stop after 5 seconds
      setTimeout(() => {
        if (this.isPlaying) {
          this.stopAudio();
          this.isPlaying = false;
        }
      }, 5000);
    }
  }

  // Play audio with increased volume
  playAudio() {
    try {
      // Using Web Audio API for better control
      const audioContext = (this as any).audioContext || 
        new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for test tone (replace with actual audio)
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set volume to maximum
      gainNode.gain.value = 1.0;
      
      // Create a pleasant greeting tone
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5); // A5
      
      // Fade in
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(1.0, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      
      // Fade out and stop
      gainNode.gain.setValueAtTime(1.0, audioContext.currentTime + 2);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2.5);
      oscillator.stop(audioContext.currentTime + 2.5);
      
      console.log('🔊 Playing greeting audio...');
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }

  // Stop audio
  stopAudio() {
    try {
      const audioContext = (this as any).audioContext;
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
      console.log('🔇 Stopped audio');
    } catch (error) {
      console.error('Audio stop failed:', error);
    }
  }

  ngOnDestroy() {
    try {
      const audioContext = (this as any).audioContext;
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}
