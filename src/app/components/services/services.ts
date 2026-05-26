import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services implements OnInit {
  selectedIndex: number = 0;
  selectedService: any = null;
  
  services = [
    {
      id: 'contact-center',
      title: 'Контакт-центр',
      icon: 'call',
      color: '#00D4FF',
      description: 'Круглосуточная поддержка клиентов и оперативное решение вопросов. Профессиональная команда специалистов готова помочь с любыми запросами.',
      features: [
        'Круглосуточная поддержка 24/7',
        'Мультиязычная поддержка (KZ, RU, EN)',
        'Оперативное решение проблем',
        'Интеграция с CRM-системами',
        'Аналитика и отчетность'
      ]
    },
    {
      id: 'procurement-operator',
      title: 'Оператор портала закупок',
      icon: 'zakup',
      color: '#00D4FF',
      description: 'Техническая поддержка и сопровождение портала государственных закупок. Обеспечение бесперебойной работы системы и помощь участникам закупок.',
      features: [
        'Техническая поддержка портала',
        'Обучение участников закупок',
        'Мониторинг и аналитика',
        'Интеграция с внешними системами',
        'Обеспечение безопасности данных'
      ]
    },
    {
      id: 'it-center',
      title: 'Единый центр IT-услуг',
      icon: 'it',
      color: '#00D4FF',
      description: 'Комплексные IT-решения для цифровизации бизнес-процессов. От разработки до внедрения и поддержки современных технологических решений.',
      features: [
        'Разработка ПО под ключ',
        'Облачные решения',
        'Кибербезопасность',
        'IT-консалтинг',
        'Техническая поддержка 24/7'
      ]
    },
    {
      id: 'engineering-center',
      title: 'Центр инженерных компетенций',
      icon: 'settings',
      color: '#00D4FF',
      description: 'Инженерная экспертиза и инновационные решения для сложных проектов. Команда высококвалифицированных инженеров и технических специалистов.',
      features: [
        'Инженерный консалтинг',
        'Проектирование систем',
        'Техническая экспертиза',
        'Внедрение инноваций',
        'Обучение и сертификация'
      ]
    }
  ];
  
  ngOnInit() {
    this.selectService(0);
  }
  
  selectService(index: number) {
    this.selectedIndex = index;
    this.selectedService = this.services[index];
  }
}