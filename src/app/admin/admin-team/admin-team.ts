import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';
import { ImageUploadComponent } from '../image-upload/image-upload';

@Component({
  selector: 'app-admin-team',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  templateUrl: './admin-team.html',
  styleUrl: './admin-team.scss'
})
export class AdminTeam implements OnInit {
  members: any[] = [];
  selected: any = null;
  baseMember: any = null;
  selectedLang: 'ru' | 'kk' = 'ru';
  loading = false;
  groupFilter: 'directors' | 'ceo' = 'directors';

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
    private storage: StorageService,
    private alert: AlertService
  ) { }

  async ngOnInit() {
    await this.loadMembers();
  }

  async loadMembers() {
    const { data, error } = await this.supabaseService.client
      .from('team_members')
      .select('*')
      .eq('lang', 'ru')
      .eq('group_type', this.groupFilter)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    this.members = data || [];
    this.cdr.detectChanges();
  }

  async changeGroup(group: 'directors' | 'ceo') {
    this.groupFilter = group;
    this.selected = null;
    this.baseMember = null;
    this.selectedLang = 'ru';
    await this.loadMembers();
  }

  async edit(member: any) {
    this.baseMember = member;
    this.selectedLang = 'ru';
    this.selected = null;

    await this.loadMemberVersion(member.member_key, member.group_type, 'ru');
  }

  async changeEditLang(lang: 'ru' | 'kk') {
    if (!this.baseMember) return;

    this.selectedLang = lang;

    await this.loadMemberVersion(
      this.baseMember.member_key,
      this.baseMember.group_type,
      lang
    );
  }

  async loadMemberVersion(memberKey: string, groupType: string, lang: 'ru' | 'kk') {
    const { data, error } = await this.supabaseService.client
      .from('team_members')
      .select('*')
      .eq('member_key', memberKey)
      .eq('group_type', groupType)
      .eq('lang', lang)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    this.selected = data
      ? this.toFormModel(data)
      : this.createEmptyTranslation(this.baseMember, lang);

    this.selectedLang = lang;
    this.cdr.detectChanges();
  }

  toFormModel(member: any) {
    return {
      ...member,
      isNewTranslation: false
    };
  }

  createEmptyTranslation(base: any, lang: 'ru' | 'kk') {
    return {
      id: null,
      lang,
      member_key: base.member_key,
      full_name: '',
      position: '',
      biography: '',
      greeting: '',
      message_title: '',
      message_text: '',
      image_url: base.image_url,
      group_type: base.group_type,
      sort_order: base.sort_order,
      is_main: base.is_main,
      is_published: base.is_published,
      isNewTranslation: true
    };
  }

  newMember() {
    this.baseMember = null;
    this.selectedLang = 'ru';

    this.selected = {
      id: null,
      lang: 'ru',
      member_key: '',
      full_name: '',
      position: '',
      biography: '',
      greeting: '',
      message_title: '',
      message_text: '',
      image_url: '',
      group_type: this.groupFilter,
      sort_order: 0,
      is_main: false,
      is_published: true,
      isNewTranslation: false
    };
  }

  async save() {
    if (!this.selected) return;

    this.loading = true;

    const payload = {
      lang: this.selected.lang,
      member_key: this.selected.member_key,
      full_name: this.selected.full_name,
      position: this.selected.position,
      biography: this.selected.biography,
      greeting: this.selected.greeting,
      message_title: this.selected.message_title,
      message_text: this.selected.message_text,
      image_url: this.selected.image_url,
      group_type: this.selected.group_type,
      sort_order: Number(this.selected.sort_order || 0),
      is_main: !!this.selected.is_main,
      is_published: !!this.selected.is_published
    };

    const request = this.selected.id
      ? this.supabaseService.client.from('team_members').update(payload).eq('id', this.selected.id)
      : this.supabaseService.client.from('team_members').insert(payload).select().single();

    const { data, error } = await request;

    this.loading = false;

    if (error) {
      console.error(error);
      await this.alert.error('Ошибка', 'Не удалось сохранить сотрудника');
      return;
    }

    if (data) this.selected = this.toFormModel(data);

    await this.loadMembers();
    await this.alert.success('Сохранено', 'Сотрудник сохранен');
  }

  async deleteMember(member: any) {
    const confirmed = await this.alert.confirmDelete(
      'сотрудника',
      `<div style="text-align:left">
        <p>Будут удалены все языковые версии:</p>
        <b>${member.full_name || member.member_key}</b>
      </div>`
    );

    if (!confirmed) return;

    const { error } = await this.supabaseService.client
      .from('team_members')
      .delete()
      .eq('member_key', member.member_key)
      .eq('group_type', member.group_type);

    if (error) {
      console.error(error);
      await this.alert.error('Ошибка', 'Не удалось удалить сотрудника');
      return;
    }

    this.selected = null;
    this.baseMember = null;
    this.selectedLang = 'ru';

    await this.loadMembers();
    await this.alert.success('Удалено', 'Сотрудник удален на всех языках');
  }
}