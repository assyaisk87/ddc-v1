import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-api-key-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="api-key-settings" [class.collapsed]="isCollapsed">
      <div class="header" (click)="toggle()">
        <h3>🔑 Groq API Ключ</h3>
        <span class="toggle-icon">{{ isCollapsed ? '▼' : '▲' }}</span>
      </div>
      
      <div class="content" *ngIf="!isCollapsed">
        <p class="description">
          Введите ваш Groq API ключ для работы AI ассистента в локальном режиме.
          Ключ будет сохранен только в вашем браузере.
        </p>
        
        <div class="input-group">
          <input 
            type="password" 
            [(ngModel)]="apiKey"
            placeholder="gsk_..."
            class="api-input"
          />
          <button (click)="saveKey()" class="save-btn" aria-label="Сохранить">
            Сохранить
          </button>
        </div>

        <div *ngIf="saved" class="success-message">
          ✅ Ключ успешно сохранен!
        </div>

        <div *ngIf="currentKey" class="current-key">
          <p>Текущий ключ: <code>{{ currentKeyDisplay }}</code></p>
          <button (click)="clearKey()" class="clear-btn" aria-label="Удалить ключ">
            Удалить ключ
          </button>
        </div>

        <div class="help-text">
          <p><strong>Где получить ключ:</strong></p>
          <ol>
            <li>Зайдите на <a href="https://console.groq.com/" target="_blank">console.groq.com</a></li>
            <li>Войдите или зарегистрируйтесь</li>
            <li>Перейдите в раздел API Keys</li>
            <li>Создайте новый ключ</li>
            <li>Скопируйте и вставьте его сюда</li>
          </ol>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-key-settings {
      max-width: 600px;
      padding: 0;
      background: #f5f5f5;
      border-radius: 8px;
      margin: 20px auto;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .api-key-settings.collapsed {
      padding: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: #007bff;
      color: white;
      cursor: pointer;
      user-select: none;
    }

    .header:hover {
      background: #0056b3;
    }

    .header h3 {
      margin: 0;
      font-size: 16px;
    }

    .toggle-icon {
      font-size: 12px;
      transition: transform 0.3s ease;
    }

    .content {
      padding: 20px;
    }

    .description {
      color: #666;
      margin-bottom: 20px;
    }

    .input-group {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .api-input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .save-btn {
      padding: 10px 20px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .save-btn:hover {
      background: #218838;
    }

    .success-message {
      padding: 10px;
      background: #d4edda;
      color: #155724;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .current-key {
      padding: 15px;
      background: #e9ecef;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .current-key code {
      background: #fff;
      padding: 5px 10px;
      border-radius: 4px;
      font-family: monospace;
    }

    .clear-btn {
      margin-top: 10px;
      padding: 8px 16px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .clear-btn:hover {
      background: #c82333;
    }

    .help-text {
      font-size: 14px;
      color: #666;
    }

    .help-text ol {
      padding-left: 20px;
    }

    .help-text a {
      color: #007bff;
    }
  `]
})
export class ApiKeySettingsComponent implements OnInit {
  apiKey = '';
  saved = false;
  currentKey: string | null = null;
  isCollapsed = false;
  isLocalEnvironment = false;

  ngOnInit() {
    // Проверяем локальную среду
    this.isLocalEnvironment = window.location.hostname === 'localhost' || 
                              window.location.hostname === '127.0.0.1';
    
    if (this.isLocalEnvironment) {
      this.currentKey = localStorage.getItem('GROQ_API_KEY');
    }
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  saveKey() {
    if (this.apiKey.trim()) {
      localStorage.setItem('GROQ_API_KEY', this.apiKey.trim());
      this.currentKey = this.apiKey.trim();
      this.saved = true;
      setTimeout(() => this.saved = false, 3000);
    }
  }

  clearKey() {
    localStorage.removeItem('GROQ_API_KEY');
    this.currentKey = null;
    this.apiKey = '';
  }

  get currentKeyDisplay() {
    if (!this.currentKey) return '';
    return `${this.currentKey.substring(0, 8)}...${this.currentKey.substring(this.currentKey.length - 4)}`;
  }
}
