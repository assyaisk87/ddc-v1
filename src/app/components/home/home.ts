import { Component, OnInit, AfterViewInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import {
  features, centerValues as centerData,
  CenterValue, ecosystemNodes
} from '../../data/home.data';
import { ContentService } from '../../services/content.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  // Import data from separate file
  stats: any[] = [];
  vacancies: any[] = [];
  loading = false;
  features = features;
  ecosystemNodes = ecosystemNodes;
  ecosystemFeatureNodes = features.map((feature, index) => ({
    ...feature,
    iconPath: ecosystemNodes[index]?.iconPath,
    orbitClass: ['card-api', 'card-ai', 'card-tenge', 'card-bank', 'card-pay'][index] || 'card-api'
  }));

  activeEcosystemNode: any = null;

  isPlaying = false;
  hasInteracted = false;
  @ViewChild('centerSection') centerSection!: ElementRef;
  centerVisible = false;

  // IntersectionObserver instance for cleanup
  private centerObserver: IntersectionObserver | null = null;

  // CENTER Framework values (loaded from home.data)
  centerValues: CenterValue[] = centerData;

  activeCenterIndex: number | null = null;
  hoveredCenterIndex: number | null = null;

  constructor(
    private elementRef: ElementRef,
    private contentService: ContentService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    await Promise.all([
      this.loadStats(),
    this.loadVacancies()
    ]);
  }

  async loadStats() {
    this.loading = true;
    const lang = this.translate.currentLang || 'ru';

    const { data, error } =
      await this.contentService.getStats(lang);

    if (error) {
      console.error(error);
    this.loading = false;
      return;
    }

    this.stats = (data || []).map(item => ({
      value: item.value || `${item.target ?? ''}${item.suffix || ''}`,
      target: item.target,
      label: item.label,
      icon: item.icon,
      suffix: item.suffix,
      color: item.color
    }));
    this.loading = false;
  }

  async loadVacancies() {
  const lang =
    this.translate.currentLang ||
    localStorage.getItem('lang') ||
    'ru';

  const { data, error } =
    await this.contentService.getVacancies(lang);

  if (error) {
    console.error(error);
    return;
  }

  this.vacancies = (data || []).slice(0, 3);
}
  
  ngAfterViewInit(): void {
    this.observeCenterAnimation();
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

  // CENTER Framework interaction methods
  onCenterMouseEnter(index: number): void {
    this.activeCenterIndex = index;
  }

  onCenterMouseLeave(): void {
    // ничего не сбрасываем
  }

  observeCenterAnimation(): void {
    this.centerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.centerVisible = true;

            setTimeout(() => {
              this.activeCenterIndex = 0;
            }, this.centerValues.length * 140 + 500);

            if (this.centerObserver) {
              this.centerObserver.disconnect();
            }
          }
        });
      },
      {
        threshold: 0.35
      }
    );

    if (this.centerSection?.nativeElement) {
      this.centerObserver.observe(this.centerSection.nativeElement);
    }
  }

  ngOnDestroy(): void {
    // Disconnect IntersectionObserver to prevent memory leaks
    if (this.centerObserver) {
      this.centerObserver.disconnect();
    }

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


