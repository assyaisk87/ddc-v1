import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss'
})
export class ImageUploadComponent {
  @Input() folder = 'common';
  @Input() imageUrl: string | null = null;
  @Output() imageUrlChange = new EventEmitter<string>();

  loading = false;

  constructor(
    public storage: StorageService,
    private alert: AlertService
  ) { }

  get previewUrl(): string {
    return this.storage.getPublicUrl(this.imageUrl);
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      await this.alert.error('Ошибка', 'Можно загружать только изображения.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      await this.alert.error('Ошибка', 'Максимальный размер файла 5 МБ.');
      return;
    }

    try {
      this.loading = true;

      const path = await this.storage.uploadImage(file, this.folder);

      this.imageUrl = path;
      this.imageUrlChange.emit(path);

      input.value = '';
    } catch (e) {
      console.error(e);
      await this.alert.error('Ошибка', 'Не удалось загрузить изображение.');
    } finally {
      this.loading = false;
    }
  }

  removeImage() {
    this.imageUrl = '';
    this.imageUrlChange.emit('');
  }
}