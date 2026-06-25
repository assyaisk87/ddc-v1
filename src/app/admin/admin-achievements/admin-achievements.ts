import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-admin-achievements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-achievements.html',
  styleUrl: './admin-achievements.scss'
})
export class AdminAchievements implements OnInit {
  achievements: any[] = [];
  selected: any = null;
  baseAchievement: any = null;
  selectedLang: 'ru' | 'kk' = 'ru';
  loading = false;

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
    private alert: AlertService
  ) {}

  async ngOnInit() {
    await this.loadAchievements();
  }

  async loadAchievements() {
    const { data, error } = await this.supabaseService.client
      .from('achievements')
      .select('*')
      .eq('lang', 'ru')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    this.achievements = data || [];
    this.cdr.detectChanges();
  }

  async edit(achievement: any) {
    this.baseAchievement = achievement;
    this.selectedLang = 'ru';
    this.selected = null;

    await this.loadAchievementVersion(achievement.slug, 'ru');
  }

  async changeEditLang(lang: 'ru' | 'kk') {
    if (!this.baseAchievement) return;

    this.selectedLang = lang;

    await this.loadAchievementVersion(this.baseAchievement.slug, lang);
  }

  async loadAchievementVersion(slug: string, lang: 'ru' | 'kk') {
    const { data, error } = await this.supabaseService.client
      .from('achievements')
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
      : this.createEmptyTranslation(this.baseAchievement, lang);

    this.selectedLang = lang;
    this.cdr.detectChanges();
  }

  toFormModel(item: any) {
    return {
      ...item,
      isNewTranslation: false
    };
  }

  createEmptyTranslation(base: any, lang: 'ru' | 'kk') {
    return {
      id: null,
      lang,
      slug: base.slug,
      title: '',
      description: '',
      year: base.year,
      icon_url: base.icon_url,
      color: base.color,
      sort_order: base.sort_order,
      is_published: base.is_published,
      isNewTranslation: true
    };
  }

  newAchievement() {
    this.baseAchievement = null;
    this.selectedLang = 'ru';

    this.selected = {
      id: null,
      lang: 'ru',
      slug: '',
      title: '',
      description: '',
      year: '',
      icon_url: '',
      color: '#00D4FF',
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
      description: this.selected.description,
      year: this.selected.year,
      icon_url: this.selected.icon_url,
      color: this.selected.color,
      sort_order: Number(this.selected.sort_order || 0),
      is_published: !!this.selected.is_published
    };

    const request = this.selected.id
      ? this.supabaseService.client.from('achievements').update(payload).eq('id', this.selected.id)
      : this.supabaseService.client.from('achievements').insert(payload).select().single();

    const { data, error } = await request;

    this.loading = false;

    if (error) {
      console.error(error);
      await this.alert.error('Ошибка', 'Не удалось сохранить достижение');
      return;
    }

    if (data) this.selected = this.toFormModel(data);

    await this.loadAchievements();
    await this.alert.success('Сохранено', 'Достижение сохранено');
  }

  async deleteAchievement(item: any) {
    const confirmed = await this.alert.confirmDelete(
      'достижение',
      `<div style="text-align:left">
        <p>Будут удалены все языковые версии:</p>
        <b>${item.title || item.slug}</b>
      </div>`
    );

    if (!confirmed) return;

    const { error } = await this.supabaseService.client
      .from('achievements')
      .delete()
      .eq('slug', item.slug);

    if (error) {
      console.error(error);
      await this.alert.error('Ошибка', 'Не удалось удалить достижение');
      return;
    }

    this.selected = null;
    this.baseAchievement = null;
    this.selectedLang = 'ru';

    await this.loadAchievements();
    await this.alert.success('Удалено', 'Достижение удалено на всех языках');
  }
}