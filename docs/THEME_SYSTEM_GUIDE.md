# Theme System Documentation

## Overview

The theme system provides a complete CSS custom properties (variables) implementation supporting multiple visual themes:

- **Dark Futuristic** (default) - Cyan & Purple accents
- **Light Professional** - Blue & Purple accents
- **National Bank/Corporate** - Green & Gold accents

## Architecture

### File Structure

```
src/
├── styles/
│   ├── themes.scss          # Main theme definitions with CSS variables
│   └── ... (other SCSS files)
├── app/
│   └── services/
│       └── theme.service.ts # Angular service for theme management
└── styles.scss             # Global styles (updated to use CSS variables)
```

### CSS Variable Categories

All variables follow a consistent naming convention:

```
--color-{category}-{shade/opacity}
```

#### 1. Primary Colors
```scss
--color-primary: #00d4ff;           // Main color
--color-primary-light: #8de3ff;     // Lighter variant
--color-primary-dark: #0099cc;      // Darker variant
--color-primary-alpha-{opacity}: rgba(...);  // With opacity (05-92)
```

#### 2. Secondary Colors
Similar structure for secondary, tertiary, success, warning, error colors.

#### 3. Background Colors
```scss
--color-bg:              // Main background
--color-surface:         // Card/section background
--color-surface-elevated: // Raised surfaces
```

#### 4. Text Colors
```scss
--color-text-primary:    // Main text
--color-text-secondary:  // Secondary text
--color-text-muted:      // Muted text
```

#### 5. Glass Morphism
```scss
--color-glass-bg:        // Glass background
--color-glass-border:    // Glass border
--color-glass-blur:      // Blur effect value
```

#### 6. Gradients
```scss
--gradient-primary:      // Primary gradient
--gradient-dark:         // Background gradient
```

#### 7. Shadows
```scss
--shadow-sm:            // Small shadow
--shadow-glow-primary:  // Glow shadow
```

#### 8. Shared Tokens (All themes)
```scss
--spacing-*:    // Spacing scale
--radius-*:     // Border radius
--transition-*: // Transition timing
--z-*:          // Z-index layers
--font-*:       // Font families
```

## Usage

### 1. In Angular Services

```typescript
import { ThemeService } from './app/services/theme.service';

constructor(private themeService: ThemeService) {
  // Set theme
  this.themeService.setTheme('dark');
  
  // Get current theme
  const current = this.themeService.getTheme();
  
  // Get CSS variable value
  const primaryColor = this.themeService.getCSSVariableValue('--color-primary');
  
  // Listen to theme changes
  window.addEventListener('theme-changed', (event: any) => {
    console.log('Theme changed to:', event.detail.theme);
  });
}
```

### 2. In SCSS Files (Replace hard-coded colors)

**Before:**
```scss
.button {
  background: #00d4ff;
  color: #ffffff;
  border: 1px solid rgba(0, 212, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
}
```

**After:**
```scss
.button {
  background: var(--color-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-glass-primary-border);
  box-shadow: var(--shadow-glow-primary);
}
```

### 3. In CSS/HTML

```html
<div style="background: var(--color-surface); color: var(--color-text-primary);">
  Content
</div>
```

### 4. In Angular Components (Inline Styles)

```typescript
@Component({
  selector: 'app-button',
  template: `<button [style]="buttonStyle">Click me</button>`,
})
export class ButtonComponent {
  buttonStyle = {
    'background-color': 'var(--color-primary)',
    'color': 'var(--color-text-primary)',
    'border-color': 'var(--color-glass-primary-border)',
  };
}
```

## Migration Guide

### Step 1: Import Theme Variables
Add to `src/styles.scss`:
```scss
@import 'styles/themes.scss';
```

### Step 2: Replace SCSS Variables with CSS Variables

Search and replace patterns:

| SCSS Variable | CSS Variable |
|---|---|
| `$primary-color` | `var(--color-primary)` |
| `$secondary-color` | `var(--color-secondary)` |
| `$text-primary` | `var(--color-text-primary)` |
| `$dark-bg` | `var(--color-bg)` |
| `$gradient-primary` | `var(--gradient-primary)` |
| `$shadow-glow-primary` | `var(--shadow-glow-primary)` |

### Step 3: Update Component Styles

Example: [home.scss](../../app/components/home/home.scss)

```scss
// Old (hard-coded)
background: rgba(0, 212, 255, 0.08);
border: 1px solid rgba(0, 212, 255, 0.22);

// New (using CSS variables)
background: var(--color-primary-alpha-08);
border: 1px solid var(--color-primary-alpha-22);
```

### Step 4: Provide ThemeService in App

Ensure `ThemeService` is provided in `app.config.ts`:

```typescript
import { ThemeService } from './services/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    ThemeService,
  ],
};
```

### Step 5: Initialize Theme in App Component

In `app.component.ts`:

```typescript
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {
    // Theme is auto-loaded from localStorage or system preference
  }
  
  ngOnInit() {
    // Optionally set a specific theme
    this.themeService.setTheme('dark');
  }
}
```

## Supported Themes

### 1. Dark Futuristic (Default)
- **Name:** `dark` or `futuristic`
- **Primary:** #00d4ff (Cyan)
- **Secondary:** #7b2cbf (Purple)
- **Background:** #0a0a0f (Very Dark)
- **Use Case:** Modern, tech-forward applications

### 2. Light Professional
- **Name:** `light`
- **Primary:** #0088cc (Blue)
- **Secondary:** #9333ea (Purple)
- **Background:** #f8f9fa (Light Gray)
- **Use Case:** Corporate, accessible applications

### 3. National Bank / Corporate
- **Name:** `national-bank` or `corporate`
- **Primary:** #1a5c3b (Dark Green)
- **Secondary:** #d4a13a (Gold)
- **Background:** #0f172a (Dark Blue)
- **Use Case:** Financial institutions, corporate branding

## Theme Switcher Component (Example)

```typescript
import { Component } from '@angular/core';
import { ThemeService, type ThemeName } from '../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  template: `
    <div class="theme-switcher">
      <button 
        *ngFor="let theme of availableThemes"
        (click)="themeService.setTheme(theme.name)"
        [class.active]="themeService.getTheme() === theme.name"
      >
        {{ theme.label }}
      </button>
    </div>
  `,
  styles: [`
    .theme-switcher {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
    }
    
    button {
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--color-surface);
      color: var(--color-text-primary);
      border: 1px solid var(--color-glass-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: var(--transition-base);
    }
    
    button:hover {
      background: var(--color-glass-bg);
      border-color: var(--color-primary);
    }
    
    button.active {
      background: var(--color-primary);
      color: var(--color-bg);
      border-color: var(--color-primary);
    }
  `],
})
export class ThemeSwitcherComponent {
  availableThemes = this.themeService.getAvailableThemes();

  constructor(public themeService: ThemeService) {}
}
```

## CSS Variable Reference

### All Available Variables by Category

See `src/styles/themes.scss` for the complete list. Key categories:

- **Color Primary:** `--color-primary*`
- **Color Secondary:** `--color-secondary*`
- **Color Tertiary:** `--color-tertiary*`
- **Color Success:** `--color-success*`
- **Color Warning:** `--color-warning*`
- **Color Error:** `--color-error*`
- **Background:** `--color-bg*`, `--color-surface*`
- **Text:** `--color-text-*`
- **Glass/Transparency:** `--color-glass-*`, `--color-overlay-*`
- **Gradients:** `--gradient-*`
- **Shadows:** `--shadow-*`
- **Layout:** `--spacing-*`, `--radius-*`, `--z-*`
- **Effects:** `--transition-*`, `--glass-blur`
- **Typography:** `--font-*`

## Browser Support

CSS Custom Properties are supported in all modern browsers:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+
- iOS Safari 9.3+

## Performance Considerations

1. **CSS Variables Recalculation:** Changes to theme only recalculate affected properties
2. **No JavaScript Required:** Theme can be switched via CSS only if needed
3. **Media Query Support:** Can detect `prefers-color-scheme` automatically
4. **Transitions:** Use CSS transitions for smooth theme changes

```scss
* {
  transition: background-color var(--transition-base), 
              color var(--transition-base),
              border-color var(--transition-base);
}
```

## Accessibility

- High contrast ratios maintained across themes
- Text colors always meet WCAG AA standards
- Sufficient color differentiation for colorblind users
- Respects `prefers-color-scheme` system preference

## Customization

### Adding a New Theme

1. Add new `[data-theme="custom"]` rule to `themes.scss`
2. Define all required CSS variables
3. Update `ThemeService.themes` array
4. Update `ThemeService.isValidTheme()` method

```scss
[data-theme="custom"] {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  // ... define all variables
}
```

## Debugging

### Check Current Theme
```typescript
console.log(this.themeService.getTheme());
```

### View All CSS Variables
```typescript
console.log(this.themeService.getAllCSSVariables());
```

### Get Specific Variable Value
```typescript
const primaryColor = this.themeService.getCSSVariableValue('--color-primary');
console.log(primaryColor); // #00d4ff
```

### Browser DevTools
- Open DevTools Styles panel
- Find `:root` selector
- View all `--color-*` properties

## Next Steps

1. Import `themes.scss` into `styles.scss`
2. Update home component and other major components to use CSS variables
3. Create theme switcher UI component
4. Test all themes for visual consistency
5. Update documentation as needed
