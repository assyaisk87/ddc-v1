import { Injectable, signal, effect } from '@angular/core';

type LegacyThemeName = 'dark' | 'futuristic' | 'light' | 'national-bank' | 'corporate';
export type ThemeName = 'digital' | 'nbk';

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
      name: 'nbk',
      label: 'NBK (Light)',
      description: 'National Bank premium theme with green & gold',
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
   * Toggle between the two supported themes
   */
  toggleDarkLight(): void {
    const current = this.currentTheme();
    const newTheme: ThemeName = current === 'nbk' ? 'digital' : 'nbk';
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
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
    const normalizedTheme = this.normalizeTheme(savedTheme);

    if (normalizedTheme) {
      this.currentTheme.set(normalizedTheme);
      this.saveTheme(normalizedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme.set(prefersDark ? 'digital' : 'nbk');
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
    return ['digital', 'nbk'].includes(theme);
  }

  /**
   * Normalize legacy theme values to the two supported themes
   */
  private normalizeTheme(theme: string | null): ThemeName | null {
    if (!theme) {
      return null;
    }

    if (this.isValidTheme(theme)) {
      return theme;
    }

    const legacyMap: Record<LegacyThemeName, ThemeName> = {
      dark: 'digital',
      futuristic: 'digital',
      light: 'nbk',
      'national-bank': 'nbk',
      corporate: 'nbk',
    };

    return legacyMap[theme as LegacyThemeName] ?? null;
  }

  /**
   * Get theme metadata
   */
  getThemeMetadata(theme: ThemeName) {
    return this.themes.find((t) => t.name === theme);
  }
}
