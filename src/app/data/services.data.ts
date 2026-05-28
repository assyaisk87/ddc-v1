export interface ServiceData {
  id: string;
  icon: string;
  color: string;
}

export const SERVICES_DATA: ServiceData[] = [
  {
    id: 'contact-center',
    icon: 'call',
    color: '#00D4FF'
  },
  {
    id: 'procurement-operator',
    icon: 'zakup',
    color: '#00D4FF'
  },
  {
    id: 'it-center',
    icon: 'it',
    color: '#00D4FF'
  },
  {
    id: 'engineering-center',
    icon: 'settings',
    color: '#00D4FF'
  }
];