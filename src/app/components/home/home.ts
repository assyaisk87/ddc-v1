import { Component, OnInit, AfterViewInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { AiAvatarComponent } from '../ai-avatar/ai-avatar.component';
import {
  features, poweredByPartners, centerValues as centerData,
  CenterValue, ecosystemNodes, commandMetrics
} from '../../data/home.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, AiAvatarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  // Import data from separate file
  features = features;
  poweredByPartners = poweredByPartners;
  ecosystemNodes = ecosystemNodes;
  ecosystemFeatureNodes = features.map((feature, index) => ({
    ...feature,
    iconPath: ecosystemNodes[index]?.iconPath,
    orbitClass: ['card-api', 'card-ai', 'card-tenge', 'card-bank', 'card-pay'][index] || 'card-api'
  }));
  commandMetrics = commandMetrics;

  activeEcosystemNode: any = null;

  isPlaying = false;
  hasInteracted = false;
  @ViewChild('centerSection') centerSection!: ElementRef;
  centerVisible = false;
  greeting: { text: string; subtext: string } = { text: '', subtext: '' };

  // CENTER Framework values (loaded from home.data)
  centerValues: CenterValue[] = centerData;

  activeCenterIndex: number | null = null;
  hoveredCenterIndex: number | null = null;
  leftPartnersTrack: typeof poweredByPartners = [];
  rightPartnersTrack: typeof poweredByPartners = [];

  constructor(
    private elementRef: ElementRef
  ) { }
  ngOnInit(): void {
    this.setGreeting();

    this.leftPartnersTrack = this.createInfiniteTrack(this.poweredByPartners);
    this.rightPartnersTrack = this.createInfiniteTrack(this.poweredByPartners);
  }

  private createInfiniteTrack<T>(items: T[]): T[] {
    const shuffled = this.shuffleArray(items);
    return [...shuffled, ...shuffled];
  }

  private shuffleArray<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
  }

  ngAfterViewInit(): void {
    this.observeCenterAnimation();
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


  setActiveEcosystemNode(node: any): void {
    this.activeEcosystemNode = node;
  }

  clearActiveEcosystemNode(): void {
    this.activeEcosystemNode = null;
  }

  scrollToEcosystem(event: Event): void {
    event.preventDefault();
    const section = this.elementRef.nativeElement.querySelector('#ecosystem-map');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnDestroy(): void {

    try {
      const audioContext = (this as any).audioContext;
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  // CENTER Framework interaction methods
  onCenterMouseEnter(index: number): void {
    this.activeCenterIndex = index;
  }

  onCenterMouseLeave(): void {
    // ничего не сбрасываем
  }

  observeCenterAnimation(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.centerVisible = true;

            setTimeout(() => {
              this.activeCenterIndex = 0;
            }, this.centerValues.length * 140 + 500);

            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.35
      }
    );

    if (this.centerSection?.nativeElement) {
      observer.observe(this.centerSection.nativeElement);
    }
  }
}
