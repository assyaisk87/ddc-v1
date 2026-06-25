import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-services.html',
  styleUrl: './admin-services.scss'
})
export class AdminServices implements OnInit {
  services: any[] = [];
  selected: any = null;
  baseService: any = null;
  selectedLang: 'ru' | 'kk' = 'ru';
  loading = false;

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
    private alert: AlertService
  ) {}

  async ngOnInit() {
    await this.loadServices();
  }

  async loadServices() {
    const { data, error } = await this.supabaseService.client
      .from('services')
      .select('*')
      .eq('lang', 'ru')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    this.services = data || [];
    this.cdr.detectChanges();
  }

  async edit(service: any) {
    this.baseService = service;
    this.selectedLang = 'ru';
    this.selected = null;
    await this.loadServiceVersion(service.service_key, 'ru');
  }

  async changeEditLang(lang: 'ru' | 'kk') {
    if (!this.baseService) return;
    this.selectedLang = lang;
    await this.loadServiceVersion(this.baseService.service_key, lang);
  }

  async loadServiceVersion(serviceKey: string, lang: 'ru' | 'kk') {
    const { data, error } = await this.supabaseService.client
      .from('services')
      .select('*')
      .eq('service_key', serviceKey)
      .eq('lang', lang)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    this.selected = data
      ? this.toFormModel(data)
      : this.createEmptyTranslation(this.baseService, lang);

    this.selectedLang = lang;
    this.cdr.detectChanges();
  }

  toFormModel(service: any) {
    return {
      ...service,
      featuresText: (service.features || []).join('\n'),
      isNewTranslation: false
    };
  }

  createEmptyTranslation(base: any, lang: 'ru' | 'kk') {
    return {
      id: null,
      lang,
      service_key: base.service_key,
      title: '',
      description: '',
      featuresText: '',
      icon: base.icon,
      color: base.color,
      sort_order: base.sort_order,
      is_published: base.is_published,
      isNewTranslation: true
    };
  }

  newService() {
    this.baseService = null;
    this.selectedLang = 'ru';

    this.selected = {
      id: null,
      lang: 'ru',
      service_key: '',
      title: '',
      description: '',
      featuresText: '',
      icon: '',
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
      service_key: this.selected.service_key,
      title: this.selected.title,
      description: this.selected.description,
      features: this.toArray(this.selected.featuresText, '\n'),
      icon: this.selected.icon,
      color: this.selected.color,
      sort_order: Number(this.selected.sort_order || 0),
      is_published: !!this.selected.is_published
    };

    const request = this.selected.id
      ? this.supabaseService.client.from('services').update(payload).eq('id', this.selected.id)
      : this.supabaseService.client.from('services').insert(payload).select().single();

    const { data, error } = await request;

    this.loading = false;

    if (error) {
      console.error(error);
      await this.alert.error('Ошибка', 'Не удалось сохранить сервис');
      return;
    }

    if (data) this.selected = this.toFormModel(data);

    await this.loadServices();
    await this.alert.success('Сохранено', 'Сервис сохранен');
  }

  async deleteService(service: any) {
    const confirmed = await this.alert.confirmDelete(
      'сервис',
      `<div style="text-align:left">
        <p>Будут удалены все языковые версии:</p>
        <b>${service.title || service.service_key}</b>
      </div>`
    );

    if (!confirmed) return;

    const { error } = await this.supabaseService.client
      .from('services')
      .delete()
      .eq('service_key', service.service_key);

    if (error) {
      console.error(error);
      await this.alert.error('Ошибка', 'Не удалось удалить сервис');
      return;
    }

    this.selected = null;
    this.baseService = null;
    this.selectedLang = 'ru';

    await this.loadServices();
    await this.alert.success('Удалено', 'Сервис удален на всех языках');
  }

  private toArray(value: string, separator: string): string[] {
    return (value || '').split(separator).map(x => x.trim()).filter(Boolean);
  }
}