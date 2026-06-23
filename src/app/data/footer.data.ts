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
  { icon: '/icons/footer/bank.svg', url: 'https://www.nationalbank.kz/kz', title: 'Национальный банк РК', options: ''},
  { icon: '/icons/footer/zakup.svg', url: 'https://zakup.nationalbank.kz/', title: 'Портал закупок', options: '' },
  { icon: '/icons/footer/vacancy.svg', url: '/vacancies', title: 'Вакансии' , options: '_self'}
];

export const SOCIAL_LINKS: SocialLink[] = [
  { icon: 'icons/instagram.svg', url: 'https://www.instagram.com/bsbnb.kz/', title: 'Instagram' },
  { icon: 'icons/telegram.svg', url: '', title: 'Telegram' },
  { icon: 'icons/mail.png', url: 'mailto:info@bsbnb.kz', title: 'Mail' }
];
