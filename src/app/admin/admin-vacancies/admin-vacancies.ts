import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-admin-vacancies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-vacancies.html',
  styleUrl: './admin-vacancies.scss'
})
export class AdminVacancies implements OnInit {
  vacancies: any[] = [];
  selected: any = null;
  baseVacancy: any = null;
  selectedLang: 'ru' | 'kk' = 'ru';
  loading = false;

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
    private alert: AlertService
  ) {}

  async ngOnInit() {
    await this.loadVacancies();
  }

  async loadVacancies() {
    const { data, error } = await this.supabaseService.client
      .from('vacancies')
      .select('*')
      .eq('lang', 'ru')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    this.vacancies = data || [];
    this.cdr.detectChanges();
  }

  async edit(vacancy: any) {
    this.baseVacancy = vacancy;
    this.selectedLang = 'ru';
    this.selected = null;
    await this.loadVacancyVersion(vacancy.slug, 'ru');
  }

  async changeEditLang(lang: 'ru' | 'kk') {
    if (!this.baseVacancy) return;
    this.selectedLang = lang;
    await this.loadVacancyVersion(this.baseVacancy.slug, lang);
  }

  async loadVacancyVersion(slug: string, lang: 'ru' | 'kk') {
    const { data, error } = await this.supabaseService.client
      .from('vacancies')
      .select('*')
      .eq('slug', slug)
      .eq('lang', lang)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    this.selected = data
      ? this.toFormModel(data)
      : this.createEmptyTranslation(this.baseVacancy, lang);

    this.selectedLang = lang;
    this.cdr.detectChanges();
  }

  toFormModel(vacancy: any) {
    return {
      ...vacancy,
      aboutCompanyText: (vacancy.about_company || []).join('\n'),
      aboutVacancyText: (vacancy.about_vacancy || []).join('\n'),
      stackText: (vacancy.stack || []).join(', '),
      tasksText: (vacancy.tasks || []).join('\n'),
      requirementsText: (vacancy.requirements || []).join('\n'),
      advantagesText: (vacancy.advantages || []).join('\n'),
      isNewTranslation: false
    };
  }

  createEmptyTranslation(base: any, lang: 'ru' | 'kk') {
    return {
      id: null,
      lang,
      slug: base.slug,
      title: '',
      city: base.city,
      experience: '',
      salary: base.salary,
      category: base.category,
      company: base.company,
      aboutCompanyText: '',
      aboutVacancyText: '',
      stackText: (base.stack || []).join(', '),
      tasksText: '',
      requirementsText: '',
      advantagesText: '',
      sort_order: base.sort_order,
      is_published: base.is_published,
      isNewTranslation: true
    };
  }

  newVacancy() {
    this.baseVacancy = null;
    this.selectedLang = 'ru';

    this.selected = {
      id: null,
      lang: 'ru',
      slug: '',
      title: '',
      city: '',
      experience: '',
      salary: '',
      category: 'development',
      company: '',
      aboutCompanyText: '',
      aboutVacancyText: '',
      stackText: '',
      tasksText: '',
      requirementsText: '',
      advantagesText: '',
      sort_order: 0,
      is_published: true,
      isNewTranslation: false
    };
  }

  async save() {
    if (!this.selected) return;

    this.loading = true;

    const payload = {
      lang: this.selected.lang,
      slug: this.selected.slug,
      title: this.selected.title,
      city: this.selected.city,
      experience: this.selected.experience,
      salary: this.selected.salary,
      category: this.selected.category,
      company: this.selected.company,
      about_company: this.toArray(this.selected.aboutCompanyText, '\n'),
      about_vacancy: this.toArray(this.selected.aboutVacancyText, '\n'),
      stack: this.toArray(this.selected.stackText, ','),
      tasks: this.toArray(this.selected.tasksText, '\n'),
      requirements: this.toArray(this.selected.requirementsText, '\n'),
      advantages: this.toArray(this.selected.advantagesText, '\n'),
      sort_order: Number(this.selected.sort_order || 0),
      is_published: !!this.selected.is_published
    };

    const request = this.selected.id
      ? this.supabaseService.client.from('vacancies').update(payload).eq('id', this.selected.id)
      : this.supabaseService.client.from('vacancies').insert(payload).select().single();

    const { data, error } = await request;

    this.loading = false;

    if (error) {
      console.error(error);
      await this.alert.error('Ошибка', 'Не удалось сохранить вакансию');
      return;
    }

    if (data) this.selected = this.toFormModel(data);

    await this.loadVacancies();
    await this.alert.success('Сохранено', 'Вакансия сохранена');
  }

  async deleteVacancy(vacancy: any) {
    const confirmed = await this.alert.confirmDelete(
      'вакансию',
      `<div style="text-align:left">
        <p>Будут удалены все языковые версии:</p>
        <b>${vacancy.title || vacancy.slug}</b>
      </div>`
    );

    if (!confirmed) return;

    const { error } = await this.supabaseService.client
      .from('vacancies')
      .delete()
      .eq('slug', vacancy.slug);

    if (error) {
      console.error(error);
      await this.alert.error('Ошибка', 'Не удалось удалить вакансию');
      return;
    }

    this.selected = null;
    this.baseVacancy = null;
    this.selectedLang = 'ru';

    await this.loadVacancies();
    await this.alert.success('Удалено', 'Вакансия удалена на всех языках');
  }

  private toArray(value: string, separator: string): string[] {
    return (value || '').split(separator).map(x => x.trim()).filter(Boolean);
  }
}