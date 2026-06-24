import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ACHIEVEMENTS_DATA, STATS_DATA } from '../../data/achievements.data';
import { ContentService } from '../../services/content.services';


@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss'
})
export class Achievements implements OnInit, AfterViewInit {
  // achievements = ACHIEVEMENTS_DATA;
  achievements: any[] = [];
  stats = STATS_DATA;
  loading = false;
  hasAnimated = false;

  constructor(
    private contentService: ContentService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    await this.loadAchievements();
  }
  
  async loadAchievements() {
    this.loading = true;
    const lang = this.translate.currentLang || 'ru';

    const { data, error } =
      await this.contentService.getAchievements(lang);

    if (error) {
      console.error(error);
      this.loading = false;
      return;
    }

    this.achievements = (data || []).map(item => ({
      title: item.title,
      description: item.description,
      year: item.year,
      icon: item.icon_url,
      color: item.color,
      id: item.sort_order
    }));
      this.loading = false;
  }

  ngAfterViewInit() {
    // Setup intersection observer for stats animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.animateStats();
            this.hasAnimated = true;
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateStats() {
    this.stats.forEach(stat => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.target / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        stat.value = Math.min(Math.round(increment * currentStep), stat.target);

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, duration / steps);
    });
  }

  getStatColor(statId: number): string {
    const colors = [
      '',
      '#00D4FF',
      '#7B2CBF',
      '#00FFA3',
      '#FF006E',
      '#FFB800',
      '#C77DFF'
    ];
    return colors[statId] || '#00D4FF';
  }
}

