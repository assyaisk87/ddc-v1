import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  currentYear = new Date().getFullYear();
  
  footerLinks = [
    { key: 'home', path: '/' },
    { key: 'projects', path: '/projects' },
    { key: 'achievements', path: '/achievements' },
    { key: 'team', path: '/team' },
    { key: 'contacts', path: '/contacts' }
  ];
  
  socialLinks = [
    { icon: '📱', url: '#' },
    { icon: '💼', url: '#' },
    { icon: '🐦', url: '#' },
    { icon: '📺', url: '#' }
  ];
}