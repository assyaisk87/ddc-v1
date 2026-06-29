import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { ChangeDetectorRef } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ImageUploadComponent } from '../image-upload/image-upload';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  templateUrl: './admin-projects.html',
  styleUrl: './admin-projects.scss'
})
export class AdminProjects implements OnInit {
  projects: any[] = [];
  selected: any = null;
  loading = false;
  baseProject: any = null;
  selectedLang: 'ru' | 'kk' = 'ru';

  constructor(private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
    private alert: AlertService
  ) { }

  async ngOnInit() {
    await this.loadProjects();
  }

  async loadProjects() {
    this.loading = true;

    const { data, error } = await this.supabaseService.client
      .from('projects')
      .select('*')
      .eq('lang', 'ru')
      .order('sort_order', { ascending: true });

    this.loading = false;

    if (error) {
      console.error(error);
      return;
    }

    this.projects = data || [];
    this.cdr.detectChanges();
  }

  async edit(project: any) {
    this.baseProject = project;
    this.selectedLang = 'ru';
    this.selected = null;

    await this.loadProjectVersion(project.slug, 'ru');
  }

  async changeEditLang(lang: 'ru' | 'kk') {
    if (!this.baseProject) return;

    this.selectedLang = lang;

    await this.loadProjectVersion(this.baseProject.slug, lang);
  }

  async loadProjectVersion(slug: string, lang: 'ru' | 'kk') {
    this.selected = null;

    const { data, error } = await this.supabaseService.client
      .from('projects')
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
      : this.createEmptyTranslation(this.baseProject, lang);

    this.selectedLang = lang;
    this.cdr.detectChanges();
  }

  toFormModel(project: any) {
    return {
      ...project,
      technologiesText: (project.technologies || []).join(', '),
      challengesText: (project.challenges || []).join('\n'),
      resultsText: (project.results || []).join('\n'),
      isNewTranslation: false
    };
  }

  createEmptyTranslation(base: any, lang: 'kk' | 'ru') {
    return {
      id: null,
      lang,
      slug: base.slug,

      name: '',
      short_description: '',
      full_description: '',

      image_url: base.image_url,
      external_url: base.external_url,
      category: base.category,
      status: base.status,
      year: base.year,
      users: base.users,

      technologiesText: (base.technologies || []).join(', '),

      challengesText: '',
      resultsText: '',

      sort_order: base.sort_order,
      is_published: base.is_published,

      isNewTranslation: true
    };
  }

  async save() {
    if (!this.selected) return;

    this.loading = true;

    const payload = {
      lang: this.selected.lang,
      slug: this.selected.slug,
      name: this.selected.name,
      short_description: this.selected.short_description,
      full_description: this.selected.full_description,
      image_url: this.selected.image_url,
      external_url: this.selected.external_url,
      category: this.selected.category,
      status: this.selected.status,
      year: this.selected.year,
      users: this.selected.users,
      technologies: this.toArray(this.selected.technologiesText, ','),
      challenges: this.toArray(this.selected.challengesText, '\n'),
      results: this.toArray(this.selected.resultsText, '\n'),
      sort_order: Number(this.selected.sort_order || 0),
      is_published: !!this.selected.is_published
    };

    const request = this.selected.id
      ? this.supabaseService.client
        .from('projects')
        .update(payload)
        .eq('id', this.selected.id)
      : this.supabaseService.client
        .from('projects')
        .insert(payload)
        .select()
        .single();

    const { data, error } = await request;

    this.loading = false;

    if (error) {
      console.error(error);
      alert('Ошибка сохранения');
      return;
    }

    if (data) {
      this.selected = this.toFormModel(data);
    }

    await this.loadProjects();
  }

  newProject() {
  this.baseProject = null;
  this.selectedLang = 'ru';

  this.selected = {
    id: null,
    lang: 'ru',
    slug: '',
    name: '',
    short_description: '',
    full_description: '',
    image_url: '',
    external_url: '',
    category: '',
    status: 'Production',
    year: '2026',
    users: '',
    technologiesText: '',
    challengesText: '',
    resultsText: '',
    sort_order: 0,
    is_published: true,
    isNewTranslation: false
  };
}

  async deleteProject(project: any) {
  const confirmed = await this.alert.confirmDelete(
    'проект',
    `
      <div style="text-align:left">
        <p>Будут удалены все языковые версии:</p>
        <b>${project.name || project.slug}</b>
      </div>
    `
  );

  if (!confirmed) return;

  const { error } = await this.supabaseService.client
    .from('projects')
    .delete()
    .eq('slug', project.slug);

  if (error) {
    console.error(error);
    await this.alert.error('Ошибка', 'Не удалось удалить проект');
    return;
  }

  this.selected = null;
  this.baseProject = null;
  this.selectedLang = 'ru';

  await this.loadProjects();
  await this.alert.success('Удалено', 'Проект удален на всех языках');
}

  private toArray(value: string, separator: string): string[] {
    return (value || '')
      .split(separator)
      .map(x => x.trim())
      .filter(Boolean);
  }
}