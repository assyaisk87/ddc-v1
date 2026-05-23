import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, Inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { AiAvatarComponent } from '../ai-avatar/ai-avatar.component';
import { DOCUMENT } from '@angular/common';
import { KineticTextService } from '../../services/kinetic-text.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink, AiAvatarComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
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
    // Frontend Technologies
    {
      name: 'Angular',
      description: 'Modern web framework',
      icon: '⚡',
      color: '#DD0031',
      category: 'Frontend'
    },
    {
      name: 'React',
      description: 'UI library',
      icon: '⚛️',
      color: '#61DAFB',
      category: 'Frontend'
    },
    {
      name: 'Vue.js',
      description: 'Progressive framework',
      icon: '🟢',
      color: '#42B883',
      category: 'Frontend'
    },
    {
      name: 'TypeScript',
      description: 'Typed JavaScript',
      icon: '🔷',
      color: '#3178C6',
      category: 'Frontend'
    },
    {
      name: 'SCSS',
      description: 'CSS preprocessing',
      icon: '🎨',
      color: '#CD6799',
      category: 'Frontend'
    },
    {
      name: 'Tailwind',
      description: 'Utility-first CSS',
      icon: '💨',
      color: '#38B2AC',
      category: 'Frontend'
    },

    // Backend Technologies
    {
      name: 'Node.js',
      description: 'JavaScript runtime',
      icon: '🟢',
      color: '#339933',
      category: 'Backend'
    },
    {
      name: 'Express',
      description: 'Web framework',
      icon: '🚂',
      color: '#4GP1FD',
      category: 'Backend'
    },
    {
      name: 'NestJS',
      description: 'Enterprise framework',
      icon: '🔷',
      color: '#E34733',
      category: 'Backend'
    },
    {
      name: 'Python',
      description: 'Versatile language',
      icon: '🐍',
      color: '#3776AB',
      category: 'Backend'
    },
    {
      name: 'Java',
      description: 'Enterprise platform',
      icon: '☕',
      color: '#007396',
      category: 'Backend'
    },
    {
      name: 'Go',
      description: 'Concurrent language',
      icon: '🔵',
      color: '#00ADD8',
      category: 'Backend'
    },

    // Databases
    {
      name: 'PostgreSQL',
      description: 'Relational database',
      icon: '🐘',
      color: '#336791',
      category: 'Databases'
    },
    {
      name: 'MongoDB',
      description: 'NoSQL database',
      icon: '🍃',
      color: '#47A248',
      category: 'Databases'
    },
    {
      name: 'Redis',
      description: 'In-memory store',
      icon: '🔴',
      color: '#DC382D',
      category: 'Databases'
    },
    {
      name: 'MySQL',
      description: 'Open-source RDBMS',
      icon: '🐬',
      color: '#4479A1',
      category: 'Databases'
    },
    {
      name: 'Elasticsearch',
      description: 'Search engine',
      icon: '🔍',
      color: '#005571',
      category: 'Databases'
    },

    // DevOps & Infrastructure
    {
      name: 'Docker',
      description: 'Container platform',
      icon: '🐳',
      color: '#2496ED',
      category: 'DevOps'
    },
    {
      name: 'Kubernetes',
      description: 'Container orchestration',
      icon: '☸️',
      color: '#326CE5',
      category: 'DevOps'
    },
    {
      name: 'AWS',
      description: 'Cloud platform',
      icon: '☁️',
      color: '#FF9900',
      category: 'Infrastructure'
    },
    {
      name: 'Azure',
      description: 'Microsoft cloud',
      icon: '🔵',
      color: '#0089D6',
      category: 'Infrastructure'
    },
    {
      name: 'GCP',
      description: 'Google cloud',
      icon: '🌈',
      color: '#4285F4',
      category: 'Infrastructure'
    },
    {
      name: 'Terraform',
      description: 'Infrastructure as code',
      icon: '🏗️',
      color: '#7B42BC',
      category: 'DevOps'
    },
    {
      name: 'Jenkins',
      description: 'CI/CD automation',
      icon: '🚀',
      color: '#D33833',
      category: 'DevOps'
    },

    // Data & Analytics
    {
      name: 'Apache Kafka',
      description: 'Event streaming',
      icon: '🦛',
      color: '#231F20',
      category: 'Data & Analytics'
    },
    {
      name: 'Apache Spark',
      description: 'Big data processing',
      icon: '⚡',
      color: '#E25A19',
      category: 'Data & Analytics'
    },
    {
      name: 'Tableau',
      description: 'Data visualization',
      icon: '📊',
      color: '#E97627',
      category: 'Data & Analytics'
    },
    {
      name: 'Power BI',
      description: 'Business analytics',
      icon: '📈',
      color: '#F2C811',
      category: 'Data & Analytics'
    },

    // AI & Machine Learning
    {
      name: 'TensorFlow',
      description: 'ML framework',
      icon: '🧠',
      color: '#FF6F00',
      category: 'AI & ML'
    },
    {
      name: 'PyTorch',
      description: 'Deep learning',
      icon: '🔥',
      color: '#EE4C2C',
      category: 'AI & ML'
    },
    {
      name: 'OpenAI',
      description: 'AI research',
      icon: '🤖',
      color: '#000000',
      category: 'AI & ML'
    },
    {
      name: 'Scikit-learn',
      description: 'ML library',
      icon: '📚',
      color: '#F7931E',
      category: 'AI & ML'
    },

    // Additional Tools
    {
      name: 'Git',
      description: 'Version control',
      icon: '📝',
      color: '#F05032',
      category: 'DevOps'
    },
    {
      name: 'GraphQL',
      description: 'Query language',
      icon: '◈',
      color: '#E10098',
      category: 'Backend'
    },
    {
      name: 'WebSocket',
      description: 'Real-time communication',
      icon: '🔌',
      color: '#00D4FF',
      category: 'Frontend'
    },
    {
      name: 'RxJS',
      description: 'Reactive programming',
      icon: '🔀',
      color: '#C5221F',
      category: 'Frontend'
    }
  ];

  isPlaying = false;
  hasInteracted = false;
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
    private kineticService: KineticTextService
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Apply kinetic text effect only to Powered By section titles
    const poweredByTitles = this.elementRef.nativeElement.querySelectorAll('.powered-by-title');
    poweredByTitles.forEach((title: Element) => {
      this.kineticService.registerElement(title as HTMLElement);
    });
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

  ngOnDestroy(): void {
    // Cleanup kinetic text
    this.kineticService.destroy();

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

