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

export const PROJECT_CATEGORIES = [
    'All',
    'Payments',
    'Mobile Banking',
    'Analytics',
    'Blockchain',
    'Investment',
    'E-commerce'
];