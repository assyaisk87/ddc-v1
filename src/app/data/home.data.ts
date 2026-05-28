export interface Feature {
  icon: string;
  titleKey: string;
  descKey: string;
  color: string;
}

export interface Stat {
  value: string;
  labelKey: string;
  color: string;
}

export interface Partner {
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
}
export type CenterValue = {
  letter: string;
  nameKey: string;
  descKey: string;
  color: string;
};

export const centerValues: CenterValue[] = [
  {
    letter: 'C',
    nameKey: 'home.center.commitment.name',
    descKey: 'home.center.commitment.desc',
    color: '#00D4FF'
  },
  {
    letter: 'E',
    nameKey: 'home.center.excellence.name',
    descKey: 'home.center.excellence.desc',
    color: '#7B2CBF'
  },
  {
    letter: 'N',
    nameKey: 'home.center.noblame.name',
    descKey: 'home.center.noblame.desc',
    color: '#FF006E'
  },
  {
    letter: 'T',
    nameKey: 'home.center.team.name',
    descKey: 'home.center.team.desc',
    color: '#00FFA3'
  },
  {
    letter: 'E',
    nameKey: 'home.center.efficiency.name',
    descKey: 'home.center.efficiency.desc',
    color: '#FFA500'
  },
  {
    letter: 'R',
    nameKey: 'home.center.result.name',
    descKey: 'home.center.result.desc',
    color: '#FF6B00'
  }
];
export const features: Feature[] = [
  {
    icon: '💻',
    titleKey: 'home.features.title1',
    descKey: 'home.features.desc1',
    color: '#00A8FF'
  },
  {
    icon: '📊',
    titleKey: 'home.features.title2',
    descKey: 'home.features.desc2',
    color: '#7B2CBF'
  },
  {
    icon: '☁️',
    titleKey: 'home.features.title3',
    descKey: 'home.features.desc3',
    color: '#00C48C'
  },
  {
    icon: '🔐',
    titleKey: 'home.features.title4',
    descKey: 'home.features.desc4',
    color: '#FF6B6B'
  },
  {
    icon: '📈',
    titleKey: 'home.features.title5',
    descKey: 'home.features.desc5',
    color: '#FFB020'
  }
];

export const stats: Stat[] = [
    { value: '50+', labelKey: 'STATS.PARTNERS', color: '#00D4FF' },
    { value: '100M+', labelKey: 'STATS.TRANSACTIONS', color: '#7B2CBF' },
    { value: '99.9%', labelKey: 'STATS.UPTIME', color: '#FF006E' },
    { value: '15+', labelKey: 'STATS.AWARDS', color: '#00D4FF' }
  ];

export const technologies: string[] = [
  'Angular', 'TypeScript', 'SCSS', 'RxJS', 'NgRx',
  'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD'
];

export const poweredByPartners: Partner[] = [
  // Frontend Technologies
  {
    name: 'Angular',
    description: 'Modern web framework',
    icon: 'icons/poweredby/Angular.svg',
    color: '#DD0031',
    category: 'Frontend'
  },
  {
    name: 'React',
    description: 'UI library',
    icon: 'icons/poweredby/React.svg',
    color: '#61DAFB',
    category: 'Frontend'
  },
  {
    name: 'Vue.js',
    description: 'Progressive framework',
    icon: 'icons/poweredby/Vue.js.svg',
    color: '#42B883',
    category: 'Frontend'
  },
  {
    name: 'HTML5',
    description: 'Web markup language',
    icon: 'icons/poweredby/HTML5.svg',
    color: '#E34F26',
    category: 'Frontend'
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS',
    icon: 'icons/poweredby/Tailwind CSS.svg',
    color: '#38B2AC',
    category: 'Frontend'
  },
  {
    name: 'Dart',
    description: 'Client-optimized language',
    icon: 'icons/poweredby/Dart.svg',
    color: '#00B4AB',
    category: 'Frontend'
  },

  // Backend Technologies
  {
    name: 'Node.js',
    description: 'JavaScript runtime',
    icon: 'icons/poweredby/Node.js.svg',
    color: '#339933',
    category: 'Backend'
  },
  {
    name: 'Java',
    description: 'Enterprise platform',
    icon: 'icons/poweredby/icons8-логотип-java-coffee-cup.svg',
    color: '#007396',
    category: 'Backend'
  },
  {
    name: 'C#',
    description: 'Microsoft language',
    icon: 'icons/poweredby/Csharp.svg',
    color: '#1786C0',
    category: 'Backend'
  },
  {
    name: 'PHP',
    description: 'Server-side language',
    icon: 'icons/poweredby/PHP.svg',
    color: '#777BB4',
    category: 'Backend'
  },
  {
    name: 'Ruby',
    description: 'Dynamic language',
    icon: 'icons/poweredby/Ruby.svg',
    color: '#CC342D',
    category: 'Backend'
  },
  {
    name: 'Spring',
    description: 'Java framework',
    icon: 'icons/poweredby/Spring.svg',
    color: '#6DB33F',
    category: 'Backend'
  },

  // Databases
  {
    name: 'PostgreSQL',
    description: 'Relational database',
    icon: 'icons/poweredby/PostgresSQL.svg',
    color: '#336791',
    category: 'Databases'
  },
  {
    name: 'MongoDB',
    description: 'NoSQL database',
    icon: 'icons/poweredby/MongoDB.svg',
    color: '#47A248',
    category: 'Databases'
  },
  {
    name: 'Redis',
    description: 'In-memory store',
    icon: 'icons/poweredby/Redis.svg',
    color: '#DC382D',
    category: 'Databases'
  },
  {
    name: 'MySQL',
    description: 'Open-source RDBMS',
    icon: 'icons/poweredby/MySQL.svg',
    color: '#4479A1',
    category: 'Databases'
  },
  {
    name: 'Oracle',
    description: 'Enterprise database',
    icon: 'icons/poweredby/Oracle.svg',
    color: '#C3392B',
    category: 'Databases'
  },

  // DevOps & Infrastructure
  {
    name: 'Docker',
    description: 'Container platform',
    icon: 'icons/poweredby/Docker.svg',
    color: '#2496ED',
    category: 'DevOps'
  },
  {
    name: 'Kubernetes',
    description: 'Container orchestration',
    icon: 'icons/poweredby/Kubernetes.svg',
    color: '#326CE5',
    category: 'DevOps'
  },
  {
    name: 'AWS',
    description: 'Cloud platform',
    icon: 'icons/poweredby/AWS.svg',
    color: '#FF9900',
    category: 'Infrastructure'
  },
  {
    name: 'Azure',
    description: 'Microsoft cloud',
    icon: 'icons/poweredby/Azure.svg',
    color: '#0089D6',
    category: 'Infrastructure'
  },
  {
    name: 'Jenkins',
    description: 'CI/CD automation',
    icon: 'icons/poweredby/Jenkins.svg',
    color: '#D33833',
    category: 'DevOps'
  },
  {
    name: 'Git',
    description: 'Version control',
    icon: 'icons/poweredby/Git.svg',
    color: '#F05032',
    category: 'DevOps'
  },
  // Data & Analytics
  {
    name: 'Apache Kafka',
    description: 'Event streaming',
    icon: 'icons/poweredby/Apache Kafka.svg',
    color: '#231F20',
    category: 'Data & Analytics'
  },
  {
    name: 'Elastic Search',
    description: 'Search engine',
    icon: 'icons/poweredby/Elastic Search.svg',
    color: '#005571',
    category: 'Data & Analytics'
  },

  // Additional Languages & Tools
  {
    name: 'Kotlin',
    description: 'Modern JVM language',
    icon: 'icons/poweredby/Kotlin.svg',
    color: '#A97BFF',
    category: 'Backend'
  },
  {
    name: 'Scala',
    description: 'Functional language',
    icon: 'icons/poweredby/Scala.svg',
    color: '#DC322F',
    category: 'Backend'
  },
  {
    name: 'Rust',
    description: 'Systems programming',
    icon: 'icons/poweredby/Rust.svg',
    color: '#DEA584',
    category: 'Backend'
  },
  {
    name: 'Swift',
    description: 'Apple language',
    icon: 'icons/poweredby/Swift.svg',
    color: '#F05138',
    category: 'Frontend'
  },
  {
    name: 'Socket.io',
    description: 'Real-time communication',
    icon: 'icons/poweredby/Socket.io.svg',
    color: '#010101',
    category: 'Frontend'
  }
];

