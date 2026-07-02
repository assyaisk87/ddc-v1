import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

interface ColorToken {
  name: string;
  variable: string;
  description: string;
  category: string;
}

@Component({
  selector: 'app-color-palette',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="color-palette-container">
      <h1>Color Palette - {{ currentTheme() }}</h1>
      
      <div class="palette-controls">
        <button 
          *ngFor="let theme of availableThemes"
          (click)="setTheme(theme.name)"
          [class.active]="currentTheme() === theme.name"
        >
          {{ theme.label }}
        </button>
      </div>

      <div class="palette-grid">
        <div 
          *ngFor="let color of colorTokens"
          class="color-card"
          [attr.data-category]="color.category"
        >
          <div class="color-sample" [style]="'background-color: var(' + color.variable + ')'"></div>
          <div class="color-info">
            <div class="color-name">{{ color.name }}</div>
            <div class="color-variable">{{ color.variable }}</div>
            <div class="color-description">{{ color.description }}</div>
            <div class="color-value" #colorValue>
              {{ getComputedColor(color.variable) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .color-palette-container {
      padding: var(--spacing-2xl);
      background: var(--color-bg);
      color: var(--color-text-primary);
      min-height: 100vh;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: var(--spacing-2xl);
      color: var(--color-primary);
    }

    .palette-controls {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-2xl);
      flex-wrap: wrap;

      button {
        padding: var(--spacing-sm) var(--spacing-lg);
        background: var(--color-surface);
        color: var(--color-text-primary);
        border: 1px solid var(--color-glass-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: var(--transition-base);

        &:hover {
          background: var(--color-glass-bg);
          border-color: var(--color-primary);
        }

        &.active {
          background: var(--color-primary);
          color: var(--color-bg);
          border-color: var(--color-primary);
        }
      }
    }

    .palette-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--spacing-lg);
    }

    .color-card {
      background: var(--color-surface);
      border: 1px solid var(--color-glass-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: var(--transition-base);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        border-color: var(--color-primary);
      }
    }

    .color-sample {
      height: 120px;
      width: 100%;
      border-bottom: 1px solid var(--color-glass-border-soft);
    }

    .color-info {
      padding: var(--spacing-md);
    }

    .color-name {
      font-weight: 600;
      font-size: 1rem;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-sm);
    }

    .color-variable {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--color-primary);
      margin-bottom: var(--spacing-sm);
      word-break: break-all;
    }

    .color-description {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-sm);
    }

    .color-value {
      font-family: var(--font-mono);
      font-size: 0.875rem;
      color: var(--color-text-muted);
      padding: var(--spacing-sm);
      background: var(--color-glass-bg);
      border-radius: var(--radius-sm);
    }

    @media (max-width: 768px) {
      .color-palette-container {
        padding: var(--spacing-lg);
      }

      h1 {
        font-size: 1.5rem;
      }

      .palette-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ColorPaletteComponent {
  availableThemes = this.themeService.getAvailableThemes();
  currentTheme = this.themeService.currentTheme;

  colorTokens: ColorToken[] = [
    // Primary Colors
    { name: 'Primary', variable: '--color-primary', description: 'Main brand color', category: 'Primary' },
    { name: 'Primary Light', variable: '--color-primary-light', description: 'Lighter variant', category: 'Primary' },
    { name: 'Primary Dark', variable: '--color-primary-dark', description: 'Darker variant', category: 'Primary' },
    { name: 'Primary 0.1', variable: '--color-primary-alpha-1', description: 'With 10% opacity', category: 'Primary' },
    { name: 'Primary 0.2', variable: '--color-primary-alpha-2', description: 'With 20% opacity', category: 'Primary' },
    { name: 'Primary 0.5', variable: '--color-primary-alpha-5', description: 'With 50% opacity', category: 'Primary' },

    // Secondary Colors
    { name: 'Secondary', variable: '--color-secondary', description: 'Secondary accent', category: 'Secondary' },
    { name: 'Secondary Light', variable: '--color-secondary-light', description: 'Lighter variant', category: 'Secondary' },
    { name: 'Secondary Dark', variable: '--color-secondary-dark', description: 'Darker variant', category: 'Secondary' },
    { name: 'Secondary 0.1', variable: '--color-secondary-alpha-1', description: 'With 10% opacity', category: 'Secondary' },

    // Tertiary/Accent
    { name: 'Tertiary', variable: '--color-tertiary', description: 'Accent color', category: 'Tertiary' },
    { name: 'Tertiary Light', variable: '--color-tertiary-light', description: 'Lighter variant', category: 'Tertiary' },

    // Status Colors
    { name: 'Success', variable: '--color-success', description: 'Success state', category: 'Status' },
    { name: 'Warning', variable: '--color-warning', description: 'Warning state', category: 'Status' },
    { name: 'Error', variable: '--color-error', description: 'Error state', category: 'Status' },

    // Background
    { name: 'Background', variable: '--color-bg', description: 'Main background', category: 'Background' },
    { name: 'Surface', variable: '--color-surface', description: 'Card/section surface', category: 'Background' },
    { name: 'Surface Elevated', variable: '--color-surface-elevated', description: 'Raised surface', category: 'Background' },

    // Text
    { name: 'Text Primary', variable: '--color-text-primary', description: 'Main text color', category: 'Text' },
    { name: 'Text Secondary', variable: '--color-text-secondary', description: 'Secondary text', category: 'Text' },
    { name: 'Text Muted', variable: '--color-text-muted', description: 'Muted text', category: 'Text' },

    // Glass Morphism
    { name: 'Glass BG', variable: '--color-glass-bg', description: 'Glass background', category: 'Glass' },
    { name: 'Glass Border', variable: '--color-glass-border', description: 'Glass border', category: 'Glass' },
  ];

  constructor(private themeService: ThemeService) {}

  setTheme(theme: any) {
    this.themeService.setTheme(theme);
  }

  getComputedColor(variable: string): string {
    const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    return value || 'N/A';
  }
}
