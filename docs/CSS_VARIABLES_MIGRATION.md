# CSS Variables Migration Guide

## Overview

This guide explains how to migrate the Angular application from hard-coded color values to CSS custom properties (variables).

## Color Analysis Summary

### All Found Colors by Category

#### Primary Colors (Cyan)
- `#00d4ff` - Main primary color
- `#bdf8ff` - Light variant
- `#00f5ff` - Slight variation
- `#8de3ff` - Lighter variant
- Various opacity levels: 0.05 to 0.92

#### Secondary Colors (Purple)
- `#7b2cbf` - Main secondary color
- `#a855f7` - Light variant
- Various opacity levels

#### Accent/Tertiary Colors (Pink/Magenta)
- `#ff006e` - Main accent color
- Used in gradients

#### Success (Green)
- `#00ffa3` - Main success color
- Various opacity levels

#### Warning (Yellow)
- `#ffb800` - Main warning color

#### Error (Red)
- `#ff4444` - Main error color

#### Background Colors
- `#0a0a0f` - Main background
- `#030712`, `#06111f`, `#090617` - Gradient stops
- `#12121a` - Surface
- `#1a1a25` - Elevated surface
- `#050c20`, `#020617` - Dark variants
- Various semi-transparent versions

#### Text Colors
- `#ffffff` - Primary text
- `#b0b0b0` - Secondary text
- `#6b7280` - Muted text
- `#aeefff` - Light variant
- Various opacity levels: 0.42 to 0.92

#### Glass Morphism
- `rgba(255, 255, 255, 0.02-0.15)` - Glass backgrounds
- `rgba(0, 212, 255, 0.3)` - Primary borders

## Migration Steps

### Phase 1: Import Theme System

**File:** `src/styles.scss`

```scss
// At the very beginning
@import 'styles/themes.scss';
```

### Phase 2: Replace SCSS Variables in Mixins

**Before:**
```scss
@mixin glass-morphism {
  background: $glass-bg;
  border: 1px solid $glass-border;
  backdrop-filter: blur(10px);
}
```

**After:**
```scss
@mixin glass-morphism {
  background: var(--color-glass-bg);
  border: 1px solid var(--color-glass-border);
  backdrop-filter: blur(var(--glass-blur));
}
```

### Phase 3: Component Migration Examples

#### Example 1: home.component.scss

**Before:**
```scss
.hero-section {
  background: linear-gradient(135deg, #030712 0%, #06111f 52%, #090617 100%);
  color: #fff;
}

.hero-button {
  background: #00ffa3;
  box-shadow: 0 0 18px #00ffa3;
  
  &:hover {
    background: rgba(0, 255, 163, 0.8);
  }
}

.gradient-text {
  background: linear-gradient(90deg, #9b5cff 0%, #22b7ff 45%, #00ffe0 100%);
  -webkit-background-clip: text;
}

.card {
  background: rgba(7, 19, 45, .88);
  border: 1px solid rgba(0, 212, 255, .58);
  box-shadow: 0 0 30px rgba(0, 212, 255, .28);
}

.card-icon {
  filter: drop-shadow(0 0 10px var(--card-accent, #00d4ff));
}
```

**After:**
```scss
.hero-section {
  background: var(--gradient-dark);
  color: var(--color-text-primary);
}

.hero-button {
  background: var(--color-success);
  box-shadow: var(--shadow-glow-success, 0 0 18px var(--color-success));
  
  &:hover {
    background: rgba(var(--color-success-rgb), 0.8);
  }
}

.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
}

.card {
  background: var(--color-surface-card-light);
  border: 1px solid var(--color-primary-alpha-58);
  box-shadow: 0 0 30px var(--color-primary-alpha-28);
}

.card-icon {
  filter: drop-shadow(0 0 10px var(--color-primary));
}
```

#### Example 2: Button Component

**Before:**
```typescript
@Component({
  selector: 'app-button',
  template: `<button class="btn" [style.background]="bgColor">
    <ng-content></ng-content>
  </button>`,
  styles: [`
    .btn {
      background: #00d4ff;
      color: #ffffff;
      border: 1px solid rgba(0, 212, 255, .22);
      box-shadow: 0 0 30px rgba(0, 212, 255, .48);
      border-radius: 0.5rem;
    }
    
    .btn:hover {
      background: rgba(0, 212, 255, 0.9);
      border-color: rgba(0, 212, 255, 0.75);
    }
  `]
})
export class ButtonComponent {
  @Input() bgColor: string = '#00d4ff';
}
```

**After:**
```typescript
@Component({
  selector: 'app-button',
  template: `<button class="btn">
    <ng-content></ng-content>
  </button>`,
  styles: [`
    .btn {
      background: var(--color-primary);
      color: var(--color-text-primary);
      border: 1px solid var(--color-primary-alpha-22);
      box-shadow: var(--shadow-glow-primary);
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
    }
    
    .btn:hover {
      background: rgba(var(--color-primary-rgb), 0.9);
      border-color: var(--color-primary-alpha-75);
    }
  `]
})
export class ButtonComponent {}
```

#### Example 3: vacancies.component.scss

**Before:**
```scss
.vacancies-container {
  background: #040816;
  border: 1px solid rgba(0, 212, 255, 0.35);
  box-shadow:
    0 0 90px rgba(0, 212, 255, 0.18),
    inset 0 0 55px rgba(123, 44, 191, 0.2);
}

.vacancy-card {
  color: #fff;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.12), rgba(123, 44, 191, 0.12)),
              rgba(0, 212, 255, 0.18);
  border: 1px solid rgba(0, 212, 255, 0.16);
}

.vacancy-title {
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.12);
  border: 1px solid rgba(0, 212, 255, 0.22);
}
```

**After:**
```scss
.vacancies-container {
  background: var(--color-surface-darker);
  border: 1px solid var(--color-primary-alpha-35);
  box-shadow:
    0 0 90px var(--color-primary-alpha-18),
    inset 0 0 55px var(--color-secondary-alpha-2);
}

.vacancy-card {
  color: var(--color-text-primary);
  background: linear-gradient(135deg, var(--color-primary-alpha-12), var(--color-secondary-alpha-12)),
              var(--color-primary-alpha-18);
  border: 1px solid var(--color-primary-alpha-16);
}

.vacancy-title {
  color: var(--color-primary);
  background: var(--color-primary-alpha-12);
  border: 1px solid var(--color-primary-alpha-22);
}
```

#### Example 4: team.component.scss

**Before:**
```scss
.team-card {
  background: linear-gradient(
    145deg,
    rgba(15, 23, 42, 0.98) 0%,
    rgba(30, 41, 59, 0.98) 100%
  );
  border: 1px solid rgba(0, 212, 255, 0.5);
  box-shadow: inset 0 0 55px rgba(255, 255, 255, 0.045);
}

.team-member-avatar {
  background: linear-gradient(
    to bottom,
    rgba(0, 212, 255, 0.2),
    rgba(123, 44, 191, 0.2)
  );
}

.team-member-name {
  color: rgba(255, 255, 255, 0.93);
}
```

**After:**
```scss
.team-card {
  background: linear-gradient(
    145deg,
    rgba(var(--color-surface-dark-rgb), 0.98) 0%,
    rgba(var(--color-surface-elevated-rgb), 0.98) 100%
  );
  border: 1px solid var(--color-primary-alpha-5);
  box-shadow: inset 0 0 55px rgba(255, 255, 255, 0.045);
}

.team-member-avatar {
  background: linear-gradient(
    to bottom,
    var(--color-primary-alpha-2),
    var(--color-secondary-alpha-2)
  );
}

.team-member-name {
  color: rgba(255, 255, 255, 0.93);
}
```

### Phase 4: Systematic Color Replacement

#### Search & Replace Patterns

Use these find-and-replace operations in your IDE:

**Pattern 1: Primary Color Cyan**
```
Find:    #00d4ff
Replace: var(--color-primary)
```

**Pattern 2: Primary Color Opaque**
```
Find:    rgba\(0,\s*212,\s*255,\s*([0-9.]+)\)
Replace: rgba(var(--color-primary-rgb), $1)
```

**Pattern 3: Specific Primary Opacity Levels**
```
Find:    rgba(0, 212, 255, 0.08)
Replace: var(--color-primary-alpha-08)

Find:    rgba(0, 212, 255, 0.22)
Replace: var(--color-primary-alpha-22)

// ... repeat for other opacity levels
```

**Pattern 4: Secondary Color Purple**
```
Find:    #7b2cbf
Replace: var(--color-secondary)

Find:    rgba\(123,\s*44,\s*191,\s*([0-9.]+)\)
Replace: rgba(var(--color-secondary-rgb), $1)
```

**Pattern 5: Text Colors**
```
Find:    #ffffff
Replace: var(--color-text-primary)

Find:    #b0b0b0
Replace: var(--color-text-secondary)

Find:    #6b7280
Replace: var(--color-text-muted)
```

**Pattern 6: Background**
```
Find:    #0a0a0f
Replace: var(--color-bg)

Find:    #12121a
Replace: var(--color-surface)
```

### Phase 5: Test Theme Switching

1. Inject ThemeService in your app
2. Verify theme switching works
3. Check visual consistency across all themes
4. Test responsive behavior

```typescript
import { ThemeService } from './services/theme.service';

// In any component
constructor(private themeService: ThemeService) {
  // Test theme switching
  this.themeService.setTheme('dark');
  this.themeService.setTheme('light');
  this.themeService.setTheme('national-bank');
}
```

## Opacity Levels Reference

The theme system includes predefined opacity levels for common use cases:

```
--color-primary-alpha-05   => rgba(..., 0.05)
--color-primary-alpha-08   => rgba(..., 0.08)
--color-primary-alpha-1    => rgba(..., 0.1)
--color-primary-alpha-12   => rgba(..., 0.12)
--color-primary-alpha-14   => rgba(..., 0.14)
--color-primary-alpha-16   => rgba(..., 0.16)
--color-primary-alpha-18   => rgba(..., 0.18)
--color-primary-alpha-2    => rgba(..., 0.2)
--color-primary-alpha-22   => rgba(..., 0.22)
--color-primary-alpha-24   => rgba(..., 0.24)
--color-primary-alpha-26   => rgba(..., 0.26)
--color-primary-alpha-28   => rgba(..., 0.28)
--color-primary-alpha-3    => rgba(..., 0.3)
--color-primary-alpha-32   => rgba(..., 0.32)
--color-primary-alpha-34   => rgba(..., 0.34)
--color-primary-alpha-4    => rgba(..., 0.4)
--color-primary-alpha-42   => rgba(..., 0.42)
--color-primary-alpha-48   => rgba(..., 0.48)
--color-primary-alpha-5    => rgba(..., 0.5)
--color-primary-alpha-55   => rgba(..., 0.55)
--color-primary-alpha-58   => rgba(..., 0.58)
--color-primary-alpha-62   => rgba(..., 0.62)
--color-primary-alpha-68   => rgba(..., 0.68)
--color-primary-alpha-7    => rgba(..., 0.7)
--color-primary-alpha-75   => rgba(..., 0.75)
--color-primary-alpha-78   => rgba(..., 0.78)
--color-primary-alpha-82   => rgba(..., 0.82)
--color-primary-alpha-9    => rgba(..., 0.9)
--color-primary-alpha-92   => rgba(..., 0.92)
```

## Component Migration Priority

1. **Global Styles** (src/styles.scss) - Foundation
2. **Shared UI** (src/app/shared/ui/) - Foundation for all
3. **Main Components** - home, vacancies, team, projects, services, contacts
4. **Admin Components** - admin-dashboard, admin-projects, etc.
5. **Utility Styles** - Animations, utilities

## Files Requiring Migration

### High Priority
- [x] src/styles/themes.scss (Created)
- [x] src/styles.scss (Updated with import)
- [ ] src/app/components/home/home.scss
- [ ] src/app/components/vacancies/vacancies.scss
- [ ] src/app/components/team/team.scss
- [ ] src/app/components/projects/projects.scss

### Medium Priority
- [ ] src/app/components/services/services.scss
- [ ] src/app/components/contacts/contacts.scss
- [ ] src/app/components/navigation/navigation.scss

### Lower Priority
- [ ] src/app/admin/* components
- [ ] src/app/components/about/about.scss
- [ ] src/app/components/achievements/achievements.scss

## Validation Checklist

- [ ] ThemeService is provided in appConfig
- [ ] themes.scss is imported in styles.scss
- [ ] All hard-coded colors are replaced with CSS variables
- [ ] Theme switcher component is available
- [ ] All themes render correctly
- [ ] Text contrast meets WCAG AA standards
- [ ] Responsive design works across all themes
- [ ] localStorage persistence works
- [ ] System preference (prefers-color-scheme) is respected
- [ ] Console shows no errors during theme switching

## Performance Tips

1. Use CSS variables for frequently changing properties
2. Batch CSS variable updates
3. Use CSS transitions for smooth theme changes
4. Minimize JavaScript during theme switch (CSS-based switching is faster)
5. Leverage browser native support for CSS variables (caching)

## Browser Support

Modern browsers with CSS custom properties support (>95% of users):
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+
- iOS Safari 9.3+

For older browsers, use PostCSS or CSS variable polyfills.

## Next Steps

1. Execute migration phases in order
2. Test each phase with theme switching
3. Update documentation as you progress
4. Deploy with new theme system
5. Monitor user feedback on new themes
