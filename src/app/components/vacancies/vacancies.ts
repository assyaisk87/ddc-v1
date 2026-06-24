import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { vacancies, Vacancy, Category, categories, officePhotos, teamBuildingPhotos } from '../../data/vacancies.data';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../services/content.services';
@Component({
  selector: 'app-vacancies',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './vacancies.html',
  styleUrl: './vacancies.scss'
})
export class Vacancies {

  vacancies: any[] = [];
  loading = true;
  categories = categories;
  officePhotos = officePhotos;
  teamBuildingPhotos = teamBuildingPhotos;

  activeCategory: Category = 'all';
  selectedVacancy: Vacancy | null = null;

  constructor(
    private contentService: ContentService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    await this.loadVacancies();
  }

  async loadVacancies() {
    this.loading = true;

    const lang = this.translate.currentLang || 'ru';

    const { data, error } =
      await this.contentService.getVacancies(lang);

    if (error ) {
      console.error(error);
      this.loading = false;
      // this.vacancies = vacancies;
      return;
    }

    this.vacancies = (data || []).map(item => ({
      title: item.title,
      city: item.city,
      experience: item.experience,
      salary: item.salary,
      category: item.category,

      company: item.company,

      aboutCompany: item.about_company || [],
      aboutVacancy: item.about_vacancy || [],

      stack: item.stack || [],
      tasks: item.tasks || [],
      requirements: item.requirements || [],
      advantages: item.advantages || []
    }));

    this.loading = false;
  }

  openVacancy(vacancy: Vacancy): void {
    this.selectedVacancy = vacancy;
    document.body.style.overflow = 'hidden';
  }

  closeVacancy(): void {
    this.selectedVacancy = null;
    document.body.style.overflow = '';
  }

  get filteredVacancies(): Vacancy[] {
    if (this.activeCategory === 'all') {
      return this.vacancies;
    }

    return this.vacancies.filter(v => v.category === this.activeCategory);
  }

  getCategoryCount(category: Category): number {
    if (category === 'all') {
      return this.vacancies.length;
    }

    return this.vacancies.filter(v => v.category === category).length;
  }

  setCategory(category: Category): void {
    this.activeCategory = category;
  }
}