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
    '/images/office/news-2.png',
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
