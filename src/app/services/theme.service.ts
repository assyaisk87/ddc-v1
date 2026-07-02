import { Injectable, signal, effect } from '@angular/core';

export type ThemeName = 'digital' | 'futuristic' | 'light' | 'nbk' | 'national-bank' | 'corporate';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'app-theme';
  private readonly DEFAULT_THEME: ThemeName = 'digital';

  // Signal to track current theme
  currentTheme = signal<ThemeName>(this.DEFAULT_THEME);

  // Available themes
  themes: { name: ThemeName; label: string; description: string }[] = [
    {
      name: 'digital',
      label: 'Digital (Dark)',
      description: 'Default dark theme with cyan and purple accents',
    },
    {
      name: 'futuristic',
      label: 'Futuristic',
      description: 'Alias for digital theme',
    },
    {
      name: 'light',
      label: 'Light Professional',
      description: 'Light theme for professional settings',
    },
    {
      name: 'nbk',
      label: 'NBK (Light)',
      description: 'National Bank premium theme with green & gold',
    },
    {
      name: 'national-bank',
      label: 'National Bank',
      description: 'Corporate green & gold theme (legacy)',
    },
    {
      name: 'corporate',
      label: 'Corporate',
      description: 'Alias for national bank theme',
    },
  ];

  constructor() {
    // Load saved theme from localStorage
    this.loadSavedTheme();

    // Apply initial theme immediately
    this.applyTheme(this.currentTheme());

    // Apply theme whenever it changes
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  /**
   * Change the current theme
   */
  setTheme(theme: ThemeName): void {
    this.currentTheme.set(theme);
    this.saveTheme(theme);
  }

  /**
   * Get current theme name
   */
  getTheme(): ThemeName {
    return this.currentTheme();
  }

  /**
   * Get all available themes
   */
  getAvailableThemes() {
    return this.themes;
  }

  /**
   * Toggle between dark and light themes
   */
  toggleDarkLight(): void {
    const current = this.currentTheme();
    const newTheme: ThemeName = current === 'light' ? 'digital' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Get CSS variable value for current theme
   */
  getCSSVariableValue(varName: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  /**
   * Get all CSS variables as an object (for debugging/export)
   */
  getAllCSSVariables(): Record<string, string> {
    const styles = getComputedStyle(document.documentElement);
    const variables: Record<string, string> = {};

    for (let i = 0; i < styles.length; i++) {
      const propName = styles[i];
      if (propName.startsWith('--')) {
        variables[propName] = styles.getPropertyValue(propName).trim();
      }
    }

    return variables;
  }

  /**
   * Apply theme by setting data-theme attribute
   */
  private applyTheme(theme: ThemeName): void {
    document.documentElement.setAttribute('data-theme', theme);

    // Dispatch custom event for components to listen to
    window.dispatchEvent(
      new CustomEvent('theme-changed', {
        detail: { theme },
      })
    );
  }

  /**
   * Load theme from localStorage
   */
  private loadSavedTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY) as ThemeName | null;

    if (savedTheme && this.isValidTheme(savedTheme)) {
      this.currentTheme.set(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme.set(prefersDark ? 'digital' : 'light');
    }
  }

  /**
   * Save theme to localStorage
   */
  private saveTheme(theme: ThemeName): void {
    localStorage.setItem(this.THEME_STORAGE_KEY, theme);
  }

  /**
   * Validate if theme name is valid
   */
  private isValidTheme(theme: string): theme is ThemeName {
    return ['digital', 'futuristic', 'light', 'nbk', 'national-bank', 'corporate'].includes(theme);
  }

  /**
   * Get theme metadata
   */
  getThemeMetadata(theme: ThemeName) {
    return this.themes.find((t) => t.name === theme);
  }
}
