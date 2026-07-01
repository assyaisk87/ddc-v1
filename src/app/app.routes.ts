import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Центр цифрового развития | DDC', description: 'Центр цифрового развития Национального Банка Республики Казахстан: AI, цифровые сервисы, аналитика данных и технологические решения.' },
    loadComponent: () =>
      import('./components/home/home').then(m => m.Home)
  },
  {
    path: 'home',
    data: { title: 'Центр цифрового развития | DDC', description: 'Центр цифрового развития Национального Банка Республики Казахстан: AI, цифровые сервисы, аналитика данных и технологические решения.' },
    loadComponent: () =>
      import('./components/home/home').then(m => m.Home)
  },
  {
    path: 'projects',
    data: { title: 'Проекты | DDC', description: 'Цифровые проекты, платформы, интеграции и технологические решения Центра цифрового развития.' },
    loadComponent: () =>
      import('./components/projects/projects').then(m => m.Projects)
  },
  {
    path: 'team',
    data: { title: 'Команда | DDC', description: 'Команда Центра цифрового развития: экспертиза, управление и развитие цифровых продуктов.' },
    loadComponent: () =>
      import('./components/team/team').then(m => m.Team)
  },
  {
    path: 'achievements',
    data: { title: 'Достижения | DDC', description: 'Достижения, награды и результаты цифровых инициатив Центра цифрового развития.' },
    loadComponent: () =>
      import('./components/achievements/achievements').then(m => m.Achievements)
  },
  {
    path: 'contacts',
    data: { title: 'Контакты | DDC', description: 'Контактная информация Центра цифрового развития, адрес, официальные ресурсы и каналы связи.' },
    loadComponent: () =>
      import('./components/contacts/contacts').then(m => m.Contacts)
  },
  {
    path: 'services',
    data: { title: 'Услуги | DDC', description: 'IT-услуги, разработка, аналитика, интеграции и цифровые решения Центра цифрового развития.' },
    loadComponent: () =>
      import('./components/services/services').then(m => m.Services)
  },
  {
    path: 'vacancies',
    data: { title: 'Вакансии | DDC', description: 'Вакансии, возможности карьерного роста и работа в команде Центра цифрового развития.' },
    loadComponent: () =>
      import('./components/vacancies/vacancies').then(m => m.Vacancies)
  },
  //admin
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/admin-login/admin-login').then(m => m.AdminLogin)
  },
 {
  path: 'admin',
  loadComponent: () =>
    import('./admin/admin-layout/admin-layout').then(m => m.AdminLayout),
  canActivate: [AdminGuard],
  children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/admin-dashboard/admin-dashboard')
            .then(m => m.AdminDashboard)
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./admin/admin-projects/admin-projects')
            .then(m => m.AdminProjects)
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./admin/admin-services/admin-services').then(m => m.AdminServices)
      },
      {
        path: 'vacancies',
        loadComponent: () =>
          import('./admin/admin-vacancies/admin-vacancies').then(m => m.AdminVacancies)
      },
      {
        path: 'achievements',
        loadComponent: () =>
          import('./admin/admin-achievements/admin-achievements').then(m => m.AdminAchievements)
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./admin/admin-team/admin-team').then(m => m.AdminTeam)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];