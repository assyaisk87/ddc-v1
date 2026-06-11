export type Category = 'all' | 'development' | 'analytics' | 'devops' | 'qa';


export interface Vacancy {
    title: string;
    city: string;
    experience: string;
    salary: string;
    category: Category;

    company: string;
    aboutCompany: string[];
    aboutVacancy: string[];
    stack: string[];
    tasks: string[];
    requirements: string[];
    advantages: string[];
};

export const officePhotos = [
    '/images/office/news-1.jpeg',
    '/images/office/news-2.jpeg',
    '/images/office/office-3.jpg',
    '/images/office/office-4.jpg'
];

export const teamBuildingPhotos = [
    '/images/teamBuilding/team-1.jpg',
    '/images/teamBuilding/team-2.jpg',
    '/images/teamBuilding/team-3.jpg',
    '/images/teamBuilding/team-4.jpeg'
];


export const categories = [
    { key: 'all' as Category, label: 'Все' },
    { key: 'development' as Category, label: 'Разработка' },
    { key: 'analytics' as Category, label: 'Data & AI' },
    { key: 'devops' as Category, label: 'DevOps' },
    { key: 'qa' as Category, label: 'QA' }
];

export const vacancies: Vacancy[] = [
    {
        title: 'Middle PHP Backend-разработчик',
        city: 'Астана / Алматы',
        experience: 'Опыт 3–6 лет',
        salary: 'По результатам интервью',
        category: 'development',

        company: 'Центр цифрового развития НБК',

        aboutCompany: [
            'Центр цифрового развития НБК — IT-компания, которая создает и сопровождает цифровые решения для Национального Банка Республики Казахстан и его дочерних организаций.',
            'Мы развиваем технологическую инфраструктуру финансовой системы Казахстана: внутренние сервисы, интеграционные платформы, аналитические решения, банковские и межведомственные системы.',
            'Наша команда объединяет разработчиков, аналитиков, инженеров, специалистов по данным и проектных менеджеров, которые работают над устойчивыми и безопасными цифровыми продуктами государственного масштаба.'
        ],

        aboutVacancy: [
            'Мы ищем PHP Backend-разработчика в команду разработки и сопровождения корпоративных информационных систем.',
            'Вам предстоит участвовать в развитии сервисов, интеграций и внутренних платформ, которые используются в финансовом секторе и поддерживают ключевые бизнес-процессы.',
            'Мы ценим инженерный подход, ответственность, готовность разбираться в сложных системах и желание создавать надежные решения.'
        ],

        stack: [
            'PHP', 'Laravel / Symfony', 'PostgreSQL', 'MySQL', 'Redis',
            'REST API', 'Git', 'Docker', 'Linux', 'Nginx', 'CI/CD'
        ],

        tasks: [
            'Разработка и сопровождение backend-сервисов.',
            'Проектирование и развитие REST API и интеграционных решений.',
            'Оптимизация существующего функционала и повышение производительности систем.',
            'Участие в анализе требований и техническом проектировании.',
            'Поддержка качества, надежности и безопасности разрабатываемых решений.'
        ],

        requirements: [
            'Уверенное знание PHP и принципов объектно-ориентированного программирования.',
            'Опыт работы с Laravel, Symfony или другими PHP-фреймворками.',
            'Опыт работы с реляционными базами данных.',
            'Понимание REST API и интеграционного взаимодействия систем.',
            'Опыт работы с Git, Linux, Docker или аналогичными инструментами.',
            'Умение оценивать задачи, соблюдать сроки и вовремя сообщать о рисках.',
            'Ответственность, внимательность к деталям и желание развиваться профессионально.'
        ],

        advantages: [
            'Опыт работы с высоконагруженными или критически важными системами.',
            'Понимание микросервисной архитектуры.',
            'Опыт работы с Kubernetes.',
            'Знание принципов информационной безопасности.',
            'Опыт в банковской, финтех или государственной IT-сфере.'
        ]
    }
];
