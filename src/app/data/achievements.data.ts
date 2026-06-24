
export interface Achievement {
  id: number;
  title: string;
  description: string;
  year: string;
  icon: string;
  color: string;
}

export interface Stat {
  id: number;
  value: number;
  target: number;
  label: string;
  icon: string;
  suffix?: string;
}

// $primary-color: #00D4FF;
// $secondary-color: #7B2CBF;
// $tertiary-color: #FF006E;
// $accent-color: hsl(334, 100%, 50%);
// $success-color: #00FFA3;
// $warning-color: #FFB800;
// $error-color: #FF4444;

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 1,
    title: 'Создание Банковского сервисного бюро',
    description: 'Организация начиналась как технический и сервисный центр для банковской инфраструктуры Казахстана',
    year: '1995',
    icon: '/icons/achievements/bsb.svg',
    color: '#00D4FF'
  },
  {
    id: 2,
    title: 'Сертификация ISO 9001:2000',
    description: 'Внедрение и сертификация системы менеджмента качества органом TÜV NORD (Германия)',
    year: '2003',
    icon: '/icons/achievements/iso.svg',
    color: '#7B2CBF'
  },
  {
    id: 3,
    title: 'Переход к цифровизации',
    description: 'Развитие API, электронных сервисов, цифровой идентификации и финтех-инфраструктуры',
    year: '2010',
    icon: '/icons/achievements/digital.svg',
    color: '#FF006E'
  },
  {
    id: 4,
    title: 'Проект Digital Tenge',
    description: 'Один из ключевых центров проекта цифровой национальной валюты Казахстана',
    year: '2021',
    icon: '/icons/achievements/tenge.svg',
    color: '#00FFA3'
  },
  {
    id: 5,
    title: 'Первые транзакции CBDC',
    description: 'Успешное проведение первых реальных транзакций цифровой валюты',
    year: '2023',
    icon: '/icons/achievements/cbdc.svg',
    color: '#FF4444'
  },
  {
    id: 6,
    title: 'Центр цифрового развития НБ РК',
    description: 'Преобразование в акционерное общество (18 июля 2025)',
    year: '2025',
    icon: '/icons/achievements/transform.svg',
    color: '#FF006E'
  },
  {
    id: 7,
    title: 'The Best IT Project 2026',
    description: 'Проект NBK AI Platform победил на Kazakhstan Growth Forum',
    year: '2026',
    icon: '/icons/achievements/kubok.svg',
    color: '#FFB800'
  }
];

export const STATS_DATA: Stat[] = [
  { id: 1, value: 0, target: 30, label: 'Лет развития', icon: '📅', suffix: '+' },
  { id: 5, value: 0, target: 250, label: 'Специалистов', icon: '👥', suffix: '+' },
  { id: 6, value: 0, target: 19, label: 'Ключевых проектов', icon: '🏆', suffix: '+' },
  { id: 2, value: 0, target: 50, label: 'Банковских партнеров', icon: '🏦', suffix: '+' },
  { id: 3, value: 0, target: 99, label: 'Uptime %', icon: '⚡', suffix: '.9%' },
  { id: 4, value: 0, target: 10, label: 'Международных стандартов', icon: '📜', suffix: '+' }
];