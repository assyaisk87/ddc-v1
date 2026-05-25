import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ACHIEVEMENTS_DATA, STATS_DATA } from '../../data/achievements-data';

export interface Achievement {
  id: number;
  title: string;
  description: string;
  year: string;
  icon: string;
  color: string;
}

export interface Stat {
  id: number;
  value: number;
  target: number;
  label: string;
  icon: string;
  suffix?: string;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss'
})
export class Achievements implements OnInit, AfterViewInit {
  achievements = ACHIEVEMENTS_DATA;
  stats = STATS_DATA;
  hasAnimated = false;

  ngOnInit() {
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

