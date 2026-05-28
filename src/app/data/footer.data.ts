export interface FooterLink {
  key: string;
  path: string;
}

export interface OfficialSite {
  icon: string;
  url: string;
  title: string;
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
  { icon: '🏛️', url: 'https://www.nationalbank.kz/kz', title: 'Национальный банк РК' },
  { icon: '🛒', url: 'https://zakup.nationalbank.kz/', title: 'Портал закупок' },
  { icon: '💼', url: 'https://astana.hh.kz/employer/28161?hhtmFrom=employers_list&tab=VACANCIES', title: 'Вакансии' }
];

export const SOCIAL_LINKS: SocialLink[] = [
  { icon: 'icons/instagram.svg', url: 'https://www.instagram.com/bsbnb.kz/', title: 'Instagram' },
  { icon: 'icons/telegram.svg', url: '', title: 'Telegram' },
  { icon: 'icons/mail.png', url: 'mailto:info@bsbnb.kz', title: 'Mail' }
];
