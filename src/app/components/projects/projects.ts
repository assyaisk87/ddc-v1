import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  PROJECT_CATEGORIES,
  Project
} from '../../data/projects.data';
import { SeoService } from '../../services/seo.service';
import { poweredByPartners } from '../../data/home.data';
import { ContentService } from '../../services/content.services';
import { StorageService } from '../../services/storage.service';
import { PageHeroComponent, SectionHeaderComponent, UiModalComponent } from '../../shared/ui';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageHeroComponent, SectionHeaderComponent, UiModalComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})

export class Projects implements OnInit {

  projects: any[] = [];
  loading = true;

  poweredByPartners = poweredByPartners;
  categories = PROJECT_CATEGORIES;
  selectedCategory: string = 'All';
  selectedProject: Project | null = null;
  leftPartnersTrack: typeof poweredByPartners = [];
  rightPartnersTrack: typeof poweredByPartners = [];

  constructor(private seo: SeoService,
    private contentService: ContentService,
    private translate: TranslateService,
    private storage: StorageService
  ) { }

  async ngOnInit() {
    await this.loadProjects();

    this.seo.updateSeo({
      title: 'Проекты DDC | Центр цифрового развития',
      description: 'Интерактивная аналитика, цифровые проекты, технологии и решения Центра цифрового развития.',
      image: '/assets/og/projects-og.webp',
      url: 'https://твой-сайт.netlify.app/projects'
    });
    this.leftPartnersTrack = this.createInfiniteTrack(this.poweredByPartners);
    this.rightPartnersTrack = this.createInfiniteTrack(this.poweredByPartners);
  }
  
  getImageUrl(path: string | null | undefined): string {
    return this.storage.getPublicUrl(path);
  }

  private createInfiniteTrack<T>(items: T[]): T[] {
    const shuffled = this.shuffleArray(items);
    return [...shuffled, ...shuffled];
  }

  private shuffleArray<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
  }

  openProject(project: Project) {
    this.selectedProject = project;
  }

  closeProject() {
    this.selectedProject = null;
  }

  filterProjects(category: string) {
    this.selectedCategory = category;
  }

  getFilteredProjects() {
    if (this.selectedCategory === 'All') {
      return this.projects;
    }
    return this.projects.filter(p => p.category === this.selectedCategory);
  }

  async loadProjects() {
    this.loading = true;

    const lang = this.translate.currentLang || 'ru';

    const { data, error } = await this.contentService.getProjects(lang);

    if (error) {
      console.error('Ошибка загрузки проектов:', error);
      this.loading = false;
      // this.projects = PROJECTS_DATA;
      return;
    }

    this.projects = (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.short_description,
      image: item.image_url,
      technologies: item.technologies || [],
      link: item.external_url,
      category: item.category,
      fullDescription: item.full_description,
      challenges: item.challenges || [],
      results: item.results || [],
      status: item.status,
      year: item.year,
      users: item.users
    }));

    this.loading = false;
    // console.log("projects", this.projects);
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Payments': '#00D4FF',
      'Mobile Banking': '#7B2CBF',
      'Analytics': '#FF006E',
      'Blockchain': '#00FFA3',
      'Investment': '#FFB800',
      'E-commerce': '#FF6B9D'
    };
    return colors[category] || '#00D4FF';
  }


}
