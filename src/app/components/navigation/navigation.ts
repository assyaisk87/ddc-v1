import { Component, OnInit, OnDestroy, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService, type ThemeName } from '../../services/theme.service';

@Component({
  selector: 'app-navigation',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss']
})
export class Navigation implements OnInit, OnDestroy {
  currentLang: string = 'ru';
  isScrolled: boolean = false;
  isMobileMenuOpen: boolean = false;
  currentTheme!: Signal<ThemeName>;

  private scrollHandler = (): void => {
      this.isScrolled = window.scrollY > 50;
    };

  menuItems = [
    { key: 'home', path: '/' },
    { key: 'projects', path: '/projects' },
    { key: 'achievements', path: '/achievements' },
    { key: 'team', path: '/team' },
    { key: 'services', path: '/services' },
  ];

  constructor(
    private translate: TranslateService,
    private themeService: ThemeService
  ) {
    this.currentLang = localStorage.getItem('lang') || 'ru';
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  changeLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    this.currentLang = lang;
  }

  setTheme(theme: ThemeName) {
    this.themeService.setTheme(theme);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}


