// data/projects.data.ts

export interface Project {
    id: number;
    name: string;
    description: string;
    image: string;
    technologies: string[];
    link: string;
    category: string;

    // для будущей модалки
    fullDescription?: string;
    challenges?: string[];
    results?: string[];

    status?: string;
    year?: string;
    users?: string;
}

export const PROJECTS_DATA: Project[] = [
    {
        id: 1,
        name: 'Kaspi Pay Integration',
        description: 'Seamless payment gateway solution with real-time transaction processing',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
        technologies: ['Angular', 'Node.js', 'PostgreSQL', 'Redis'],
        link: 'https://digital.nationalbank.kz/pub/landing',
        category: 'Payments',
        fullDescription: 'Платёжная интеграция для обработки транзакций в реальном времени.',
        challenges: [
            'Высокая нагрузка',
            'Интеграция с платёжными шлюзами'
        ],
        results: [
            '99.9% uptime',
            'Снижение времени обработки на 40%'
        ],
        status: 'Production',
        year: '2026',
        users: '1M+'
    },
    {
        id: 2,
        name: 'Halyk Digital Bank',
        description: 'Complete mobile banking platform with AI-powered insights',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        technologies: ['React Native', 'Kubernetes', 'MongoDB', 'AI/ML'],
        link: '#',
        category: 'Mobile Banking',
        fullDescription: 'Мобильная банковская платформа с AI-инсайтами и персонализированным пользовательским опытом.',
        challenges: [
            'Масштабируемость мобильного приложения',
            'Безопасность пользовательских данных'
        ],
        results: [
            'Улучшение пользовательского опыта',
            'Быстрая обработка клиентских операций'
        ],
        status: 'Production',
        year: '2026',
        users: '1M+'
    },
    {
        id: 3,
        name: 'Jusan AI Analytics',
        description: 'Intelligent customer insights and risk assessment system',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        technologies: ['Python', 'TensorFlow', 'Apache Spark', 'AWS'],
        link: '#',
        category: 'Analytics',
        fullDescription: 'Система аналитики клиентских данных и оценки рисков на базе машинного обучения.',
        challenges: [
            'Обработка больших объёмов данных',
            'Построение точных ML-моделей'
        ],
        results: [
            'Повышение точности аналитики',
            'Ускорение принятия решений'
        ],
        status: 'Production',
        year: '2026',
        users: '1M+'
    },
    {
        id: 4,
        name: 'Freedom Finance Blockchain',
        description: 'Secure asset management with blockchain integration',
        image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800',
        technologies: ['Solidity', 'Ethereum', 'React', 'Node.js'],
        link: '#',
        category: 'Blockchain',
        fullDescription: 'Решение для безопасного управления цифровыми активами с использованием blockchain-инфраструктуры.',
        challenges: [
            'Прозрачность операций',
            'Безопасность smart contracts'
        ],
        results: [
            'Повышение доверия к операциям',
            'Прозрачная история транзакций'
        ],
        status: 'Production',
        year: '2026',
        users: '1M+'
    },
    {
        id: 5,
        name: 'Baiterek Investment Platform',
        description: 'Digital investment management and portfolio tracking',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        technologies: ['Angular', '.NET Core', 'SQL Server', 'Azure'],
        link: '#',
        category: 'Investment',
        fullDescription: 'Цифровая платформа для управления инвестициями, портфелями и финансовой аналитикой.',
        challenges: [
            'Интеграция финансовых данных',
            'Удобная визуализация портфеля'
        ],
        results: [
            'Повышение прозрачности инвестиций',
            'Быстрый доступ к аналитике'
        ],
        status: 'Production',
        year: '2026',
        users: '1M+'
    },
    {
        id: 6,
        name: 'Kaspi.kz E-commerce',
        description: 'High-performance e-commerce platform with millions of users',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
        technologies: ['Java', 'Spring Boot', 'Kafka', 'Elasticsearch'],
        link: '#',
        category: 'E-commerce',
        fullDescription: 'Высоконагруженная e-commerce платформа с быстрым поиском, обработкой заказов и масштабируемой архитектурой.',
        challenges: [
            'Миллионы пользователей',
            'Высокая скорость поиска и обработки заказов'
        ],
        results: [
            'Стабильная работа под нагрузкой',
            'Улучшение скорости поиска'
        ],
        status: 'Production',
        year: '2026',
        users: '1M+'
    }
];

export const PROJECT_CATEGORIES = [
    'All',
    'Payments',
    'Mobile Banking',
    'Analytics',
    'Blockchain',
    'Investment',
    'E-commerce'
];