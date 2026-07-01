export interface FooterLink {
  key: string;
  path: string;
}

export interface OfficialSite {
  icon: string;
  url: string;
  title: string;
  options: string;
}

export interface SocialLink {
  icon: string;
  url: string;
  title: string;
}

export const FOOTER_LINKS: FooterLink[] = [
  { key: 'home', path: '/' },
  { key: 'projects', path: '/projects' },
  { key: 'achievements', path: '/achievements' },
  { key: 'team', path: '/team' }
];

export const OFFICIAL_SITES: OfficialSite[] = [
  { icon: '/icons/footer/bank.svg', url: 'https://www.nationalbank.kz/kz', title: 'footer.nb', options: ''},
  { icon: '/icons/footer/zakup.svg', url: 'https://zakup.nationalbank.kz/', title: 'footer.zakup', options: '' },
  { icon: '/icons/footer/vacancy.svg', url: '/vacancies', title: 'footer.vacancy' , options: '_self'}
];

export const SOCIAL_LINKS: SocialLink[] = [
  { icon: 'icons/instagram.svg', url: 'https://www.instagram.com/bsbnb.kz/', title: 'Instagram' },
  { icon: 'icons/telegram.svg', url: '', title: 'Telegram' },
  { icon: 'icons/mail.svg', url: 'mailto:info@bsbnb.kz', title: 'Mail' }
];
