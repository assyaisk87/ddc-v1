import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private baseOptions = {
    background: '#151922',
    color: '#fff',
    confirmButtonColor: '#00d4ff',
    cancelButtonColor: '#334155'
  };

  async success(title = 'Готово', text = '') {
    return Swal.fire({
      ...this.baseOptions,
      title,
      text,
      icon: 'success',
      timer: 1600,
      showConfirmButton: false
    });
  }

  async error(title = 'Ошибка', text = 'Что-то пошло не так') {
    return Swal.fire({
      ...this.baseOptions,
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Ок'
    });
  }

  async info(title: string, text = '') {
    return Swal.fire({
      ...this.baseOptions,
      title,
      text,
      icon: 'info',
      confirmButtonText: 'Ок'
    });
  }

  async confirm(options: {
    title: string;
    text?: string;
    html?: string;
    icon?: SweetAlertIcon;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) {
    const result = await Swal.fire({
      ...this.baseOptions,
      title: options.title,
      text: options.text,
      html: options.html,
      icon: options.icon || 'warning',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Да',
      cancelButtonText: options.cancelButtonText || 'Отмена',
      confirmButtonColor: '#ff4d4f'
    });

    return result.isConfirmed;
  }

  async confirmDelete(entityName: string, details?: string) {
    return this.confirm({
      title: `Удалить ${entityName}?`,
      html: details,
      icon: 'warning',
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена'
    });
  }
}