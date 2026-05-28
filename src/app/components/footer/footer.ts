import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FOOTER_LINKS, OFFICIAL_SITES, SOCIAL_LINKS } from '../../data/footer.data';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  currentYear = new Date().getFullYear();
  
  footerLinks = FOOTER_LINKS;

  officialSites = OFFICIAL_SITES;

  socialLinks = SOCIAL_LINKS;
}
