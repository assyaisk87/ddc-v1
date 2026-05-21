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
    { key: 'team', path: '/team' }
    
  ];
  
  officialSites = [
    { icon: '🏛️', url: 'https://www.nationalbank.kz/kz', title: 'Национальный банк РК' },
    { icon: '🛒', url: 'https://zakup.nationalbank.kz/', title: 'Портал закупок' }
  ];

   socialLinks = [
    { icon: 'icons/instagram.svg', url: 'https://www.instagram.com/bsbnb.kz/', title: 'Instagram' },
    { icon: 'icons/telegram.svg', url: '', title: 'Telegram' },
    { icon: 'icons/mail.png', url: 'mailto:info@bsbnb.kz', title: 'Mail' },
  ];
}