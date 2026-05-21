import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

export interface Director {
  key: string;
  name: string;
  position: string;
  image: string;
  biography?: string;
}

export interface CeoMember {
  key: string;
  name: string;
  position: string;
  image: string;
  biography?: string;
  greeting?: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './team.html',
  styleUrl: './team.scss'
})
export class Team {
  directorsBoard: Director[] = [
    {
      key: 'Zhalenov',
      name: 'Жаленов Бинур Муратович',
      position: 'Председатель Совета директоров',
      image: '/images/directors-board/Zhalenov_Binur.jpg',
      biography: 'Опытный руководитель с более чем 20-летним стажем в управлении крупными предприятиями. Имеет степень MBA и является экспертом в области стратегического планирования и корпоративного управления.',
    },
    {
      key: 'Uzbekov',
      name: 'Узбеков Асхат Архатович',
      position: 'Член Совета директоров',
      image: '/images/directors-board/Uzbekov_Askhat.png',
      biography: 'Квалифицированный специалист в области финансового менеджмента и инвестиционного анализа. Имеет богатый опыт работы в банковской сфере и управлении инвестиционными портфелями.'
    },
    {
      key: 'Arinova',
      name: 'Аринова Айжан Бейбытовна',
      position: 'Член Совета директоров',
      image: '/images/directors-board/Arinova_Aizhan.jpg',
      biography: 'Эксперт в области корпоративного права и compliance. Обладает глубокими знаниями в сфере регулирования и нормативно-правового обеспечения деятельности компании.'
    },{
      key: 'mainCeo',
      name: 'Амардинов Малик Алимжанович',
      position: 'Председатель Правления',
      image: '/images/directors-board/Amardinov.jpg',
      biography: 'Профессиональный менеджер с многолетним опытом руководства крупными организациями. Специализируется на разработке и реализации стратегий развития бизнеса.'
    },
    {
      key: 'Alpamysov',
      name: 'Алпамысов Абай Абдисаметович',
      position: 'Член Совета директоров (независимый)',
      image: '/images/directors-board/Alpamysov_Abai.png',
      biography: 'Независимый директор с опытом работы в различных отраслях экономики. Принимает активное участие в разработке стратегических решений компании.'
    },
    {
      key: 'Konirbayev',
      name: 'Конирбаев Баян Кайратович',
      position: 'Член Совета директоров (независимый)',
      image: '/images/directors-board/Bayan_Kb.png',
      biography: 'Квалифицированный эксперт в области аудита и финансового контроля. Обладает глубокими знаниями в сфере корпоративного управления и риск-менеджмента.'
    },
    {
      key: 'Marat',
      name: 'Марат Аскар',
      position: 'Член Совета директоров (независимый)',
      image: '/images/directors-board/Marat_Askar.png',
      biography: 'Опытный консультант по вопросам корпоративного управления и стратегического развития. Активно участвует в принятии ключевых решений компании.'
    }
  ];

  ceoBoard: CeoMember[] = [
    {
      key: 'mainCeo',
      name: 'Амардинов Малик Алимжанович',
      position: 'Председатель Правления',
      image: '/images/directors-board/Amardinov.jpg',
      biography: '',
      greeting: 'Уважаемые партнеры и коллеги! Добро пожаловать в нашу компанию. Я рад приветствовать вас на нашей странице. Наша команда работает над тем, чтобы обеспечить стабильное развитие и процветание компании.'

    },
    {
      key: 'ceoBorder1',
      name: 'Дурмагамбетов Ерлан Дмитриевич',
      position: 'Первый заместитель Председателя Правления',
      image: '/images/directors-board/Durmagambetov.jpg',
      biography: ''
    },
    {
      key: 'ceoBorder2',
      name: 'Кентбеков Аргын Салаватович',
      position: 'Заместитель Председателя Правления',
      image: '/images/directors-board/Kentbekov.jpg',
      biography: ''
    },
    {
      key: 'ceoBorder3',
      name: 'Имажанов Бахытжан Гылымбекович',
      position: 'Заместитель Председателя Правления',
      image: '/images/directors-board/Imajanov.jpg',
      biography: ''
    }
  ];

  isAudioPlaying: boolean = false;
  private audio: HTMLAudioElement | null = null;

  toggleAudio(): void {
    if (this.isAudioPlaying) {
      this.stopAudio();
    } else {
      this.playAudio();
    }
  } 

  private playAudio(): void {
    const messageText = this.ceoBoard[0].greeting;

    if ('speechSynthesis' in window) {
      this.stopAudio();

      const utterance = new SpeechSynthesisUtterance(messageText);
      utterance.lang = 'ru-RU';
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = () => {
      this.isAudioPlaying = false;
      };

      utterance.onerror = () => {
        this.isAudioPlaying = false;
      };

      window.speechSynthesis.speak(utterance);
      this.isAudioPlaying = true;
    } else {
      alert('Ваш браузер не поддерживает синтез речи');
  }
}

  private stopAudio(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isAudioPlaying = false;
    }
  }

}

