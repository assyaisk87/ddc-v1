import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation implements OnInit, OnDestroy {
  currentLang: string = 'ru';
  isScrolled: boolean = false;
  isMobileMenuOpen: boolean = false;

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

  constructor(private translate: TranslateService) {
    this.currentLang = localStorage.getItem('lang') || 'ru';
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

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}


