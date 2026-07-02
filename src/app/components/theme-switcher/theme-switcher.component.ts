import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, type ThemeName } from '../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-switcher" [attr.data-theme]="currentTheme()">
      <div class="switcher-label">Theme:</div>
      
      <button 
        *ngFor="let theme of availableThemes"
        class="theme-button"
        [class.active]="currentTheme() === theme.name"
        (click)="setTheme(theme.name)"
        [title]="theme.description"
      >
        <span class="theme-icon">{{ getThemeIcon(theme.name) }}</span>
        <span class="theme-name">{{ theme.label }}</span>
      </button>
    </div>
  `,
  styles: [`
    .theme-switcher {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--color-glass-bg);
      border: 1px solid var(--color-glass-border);
      border-radius: var(--radius-lg);
      backdrop-filter: blur(var(--glass-blur));
    }

    .switcher-label {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .theme-button {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--color-surface);
      color: var(--color-text-primary);
      border: 1px solid var(--color-glass-border-soft);
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all var(--transition-base);

      &:hover {
        background: var(--color-glass-bg);
        border-color: var(--color-primary);
        transform: translateY(-2px);
      }

      &.active {
        background: var(--color-primary);
        color: var(--color-bg);
        border-color: var(--color-primary);
        box-shadow: var(--shadow-glow-primary);
      }

      .theme-icon {
        font-size: 1.125rem;
        line-height: 1;
      }

      .theme-name {
        @media (max-width: 768px) {
          display: none;
        }
      }
    }

    @media (max-width: 768px) {
      .theme-switcher {
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
      }

      .theme-button {
        padding: var(--spacing-sm);
      }

      .switcher-label {
        font-size: 0.75rem;
      }
    }
  `],
})
export class ThemeSwitcherComponent implements OnInit {
  availableThemes = this.themeService.getAvailableThemes().slice(0, 3); // Show main themes only
  currentTheme = this.themeService.currentTheme;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Theme is auto-initialized by ThemeService
  }

  setTheme(theme: ThemeName) {
    this.themeService.setTheme(theme);
  }

  getThemeIcon(theme: ThemeName): string {
    const iconMap: Record<ThemeName, string> = {
      dark: '🌙',
      futuristic: '✨',
      light: '☀️',
      'national-bank': '🏛️',
      corporate: '💼',
    };
    return iconMap[theme] || '⚙️';
  }
}
