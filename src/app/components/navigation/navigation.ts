import { Component, OnInit } from '@angular/core';
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
export class Navigation implements OnInit {
  currentLang: string = 'ru';
  isScrolled: boolean = false;
  isMobileMenuOpen: boolean = false;

  menuItems = [
    { key: 'home', path: '/' },
    { key: 'projects', path: '/projects' },
    { key: 'achievements', path: '/achievements' },
    { key: 'team', path: '/team' },
    { key: 'services', path: '/services' },
  ];

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('ru');
    translate.use('ru');
  }

  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 50;
    });
  }

  changeLanguage(lang: string) {
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

