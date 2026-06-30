import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContentService } from '../../services/content.services';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss'
})
export class Achievements implements OnInit {
  achievements: any[] = [];
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

}

