import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(private supabaseService: SupabaseService) { }

  getServices(lang = 'ru') {
    return this.getLocalizedData('services', 'service_key', lang);
  }

  getProjects(lang = 'ru') {
    return this.getLocalizedData('projects', 'slug', lang);
  }

  getVacancies(lang = 'ru') {
    return this.getLocalizedData('vacancies', 'slug', lang);
  }

  getAchievements(lang = 'ru') {
    return this.getLocalizedData('achievements', 'slug', lang);
  }

  getStats(lang = 'ru') {
    return this.getLocalizedData('stats', 'stat_key', lang);
  }

  getTeamMembers(lang = 'ru', groupType = 'directors') {
    return this.getLocalizedData('team_members', 'member_key', lang)
      .then(({ data, error }) => ({
        data: (data || []).filter(item => item.group_type === groupType),
        error
      }));
  }

  async getLocalizedData(
    table: string,
    keyField: string,
    lang: string = 'ru'
  ) {
    const selectedLang = lang || 'ru';

    const { data, error } = await this.supabaseService.client
      .from(table)
      .select('*')
      .in('lang', selectedLang === 'ru' ? ['ru'] : [selectedLang, 'ru'])
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return { data: [], error };
    }

    const map = new Map<string, any>();

    for (const item of data || []) {
      const key = item[keyField];

      if (!key) {
        continue;
      }

      const existing = map.get(key);

      if (!existing) {
        map.set(key, item);
        continue;
      }

      if (item.lang === selectedLang) {
        map.set(key, item);
      }
    }

    const result = Array.from(map.values()).sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    return {
      data: result,
      error: null
    };
  }

  async getContentBlock(lang = 'ru', page: string, blockKey: string) {
    const selectedLang = lang || 'ru';

    const { data, error } = await this.supabaseService.client
      .from('content_blocks')
      .select('*')
      .eq('page', page)
      .eq('block_key', blockKey)
      .in('lang', selectedLang === 'ru' ? ['ru'] : [selectedLang, 'ru'])
      .eq('is_published', true)
      .order('lang', { ascending: true });

    if (error) {
      return { data: null, error };
    }

    const selected =
      (data || []).find(item => item.lang === selectedLang) ||
      (data || []).find(item => item.lang === 'ru') ||
      null;

    return {
      data: selected,
      error: null
    };
  }

}