import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { vacancies, Vacancy, Category, categories, officePhotos, teamBuildingPhotos } from '../../data/vacancies.data';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-vacancies',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './vacancies.html',
  styleUrl: './vacancies.scss'
})
export class Vacancies {

  vacancies: Vacancy[] = vacancies;
  categories = categories;
  officePhotos = officePhotos;
  teamBuildingPhotos = teamBuildingPhotos;

  activeCategory: Category = 'all';
  selectedVacancy: Vacancy | null = null;

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