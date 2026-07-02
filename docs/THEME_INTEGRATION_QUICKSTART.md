# Theme System Integration Guide

## Quick Start

Follow these steps to integrate the theme system into your Angular application.

### Step 1: Verify Files Are Created ✅

Ensure these files exist:
- `src/styles/themes.scss` - Contains all theme definitions
- `src/app/services/theme.service.ts` - Service for theme management
- `src/app/components/theme-switcher/theme-switcher.component.ts` - UI component
- `src/app/components/color-palette/color-palette.component.ts` - Debug/preview component
- `src/styles.scss` - Updated with themes.scss import

### Step 2: Update app.config.ts

Add ThemeService to your providers:

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ThemeService } from './app/services/theme.service';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    // Add ThemeService to providers
    ThemeService,
    // ... other providers
  ],
};
```

### Step 3: Add Theme Switcher to Your Layout

In your main app layout (e.g., `app.component.ts`):

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeSwitcherComponent],
  template: `
    <app-theme-switcher></app-theme-switcher>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
```

Or integrate into your navigation component:

```typescript
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [ThemeSwitcherComponent],
  template: `
    <nav>
      <!-- Your navigation -->
      <app-theme-switcher></app-theme-switcher>
    </nav>
  `,
})
export class NavigationComponent {}
```

### Step 4: Test Theme Switching

1. Start your development server: `npm start`
2. Look for the theme switcher in your UI
3. Click buttons to switch themes
4. Verify:
   - Colors change immediately
   - Theme preference is saved to browser storage
   - Switching between tabs/windows maintains theme
   - Refresh page preserves selected theme

### Step 5: Migrate Component Styles (Progressive)

Start with one component and migrate its styles to use CSS variables:

**Before:**
```scss
.my-component {
  background: #00d4ff;
  color: #ffffff;
}
```

**After:**
```scss
.my-component {
  background: var(--color-primary);
  color: var(--color-text-primary);
}
```

See `docs/CSS_VARIABLES_MIGRATION.md` for detailed examples.

## Validation

### In Browser Console

```javascript
// Check current theme
console.log(localStorage.getItem('app-theme'));

// Check CSS variables
const style = getComputedStyle(document.documentElement);
console.log(style.getPropertyValue('--color-primary')); // Should show current theme color

// Check all variables
const vars = {};
for (let i = 0; i < style.length; i++) {
  const prop = style[i];
  if (prop.startsWith('--')) {
    vars[prop] = style.getPropertyValue(prop);
  }
}
console.log(vars);
```

### Theme Switcher Should Show:
- 🌙 Dark (or ✨ Futuristic)
- ☀️ Light
- 🏛️ National Bank

### Test All Themes:
1. Click each theme button
2. Colors should change smoothly
3. Refresh page - theme should persist
4. Open in new tab - should show same theme (from localStorage)
5. Open in private/incognito - should use system preference

## Troubleshooting

### Themes Not Appearing?
Check:
1. ThemeService is in appConfig providers
2. themes.scss is imported in styles.scss
3. No console errors with `npm start`
4. themes.scss file exists at `src/styles/themes.scss`

### Colors Not Changing?
Check:
1. CSS variables are being used in components
2. Hard-coded colors haven't been replaced with variables
3. Browser console shows no errors
4. CSS variables are properly scoped to `:root` or `[data-theme="..."]`

### localStorage Not Working?
Check:
1. Browser allows localStorage (not in private/incognito by default)
2. Storage quota not exceeded
3. No browser extensions blocking storage

## Optional: Add to Environment Detection

You can detect theme changes and update other services:

```typescript
constructor(private themeService: ThemeService) {
  window.addEventListener('theme-changed', (event: any) => {
    console.log('Theme changed to:', event.detail.theme);
    // Update any other services
  });
}
```

## Optional: Add Keyboard Shortcut

Add theme switching via keyboard:

```typescript
@HostListener('window:keydown.t')
toggleTheme() {
  this.themeService.toggleDarkLight();
}
```

## Optional: Add to Settings Page

Create a settings component for theme selection:

```typescript
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-settings',
  template: `
    <div class="settings">
      <h2>Theme Settings</h2>
      <select [(ngModel)]="selectedTheme" (change)="changeTheme()">
        <option *ngFor="let theme of themes" [value]="theme.name">
          {{ theme.label }}
        </option>
      </select>
    </div>
  `,
})
export class SettingsComponent {
  themes = this.themeService.getAvailableThemes();
  selectedTheme = this.themeService.getTheme();

  constructor(private themeService: ThemeService) {}

  changeTheme() {
    this.themeService.setTheme(this.selectedTheme as any);
  }
}
```

## Optional: Auto-detect System Preference

The ThemeService already does this automatically if no saved theme exists. To force it:

```typescript
// On first visit
if (!localStorage.getItem('app-theme')) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  this.themeService.setTheme(prefersDark ? 'dark' : 'light');
}
```

## Migration Priority

1. **Today:** Basic integration & testing
2. **This Week:** Migrate main components (home, vacancies, team)
3. **Next Week:** Migrate remaining components
4. **Following Week:** Full QA and optimization

## Performance Notes

- CSS variables have negligible performance impact
- Theme switching is instant (no page reload needed)
- Storage persistence uses minimal localStorage quota (~50 bytes)
- No additional network requests

## Browser Compatibility

CSS Custom Properties are supported in:
- ✅ Chrome 49+
- ✅ Firefox 31+
- ✅ Safari 9.1+
- ✅ Edge 15+
- ✅ iOS Safari 9.3+
- ✅ Android Chrome 49+

**Coverage: ~95% of users worldwide**

## Support Resources

1. **Documentation:** `docs/THEME_SYSTEM_GUIDE.md`
2. **Migration Guide:** `docs/CSS_VARIABLES_MIGRATION.md`
3. **Status Report:** `docs/THEME_SYSTEM_STATUS.md`
4. **Service Code:** `src/app/services/theme.service.ts`
5. **Component Code:** `src/app/components/theme-switcher/`

## Next Steps

After integration:

1. ✅ Test basic theme switching
2. Start migrating component styles progressively
3. Monitor console for any issues
4. Gather team feedback
5. Plan full migration schedule

---

**Integration Time:** 15-30 minutes  
**Estimated Migration Time:** 3-5 days  
**Risk Level:** Low  
**Support:** Available via documentation
