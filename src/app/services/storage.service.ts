import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private bucket = 'site-images';

  constructor(private supabase: SupabaseService) { }

  async uploadImage(file: File, folder: string): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await this.supabase.client.storage
      .from(this.bucket)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (error) throw error;

    return filePath; // в БД сохраняем только это
  }

  getPublicUrl(path: string | null | undefined): string {
    if (!path) return '';

    if (
      path.startsWith('http') ||
      path.startsWith('/') ||
      path.startsWith('assets/')
    ) {
      return path;
    }

    return this.supabase.client.storage
      .from(this.bucket)
      .getPublicUrl(path)
      .data.publicUrl;
  }
}