import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface Director {
  key: string;
  name: string;
  position: string;
  image: string;
}

export interface CeoMember {
  key: string;
  name: string;
  position: string;
  image: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './team.html',
  styleUrl: './team.scss'
})
export class Team {
  directorsBoard: Director[] = [
    {
      key: 'Zhalenov',
      name: 'Жаленов Бинур Муратович',
      position: 'Председатель Совета директоров',
      image: '/images/directors-board/Zhalenov_Binur.jpg'
    },
    {
      key: 'Uzbekov',
      name: 'Узбеков Асхат Архатович',
      position: 'Член Совета директоров',
      image: '/images/directors-board/Uzbekov_Askhat.png'
    },
    {
      key: 'Arinova',
      name: 'Аринова Айжан Бейбытовна',
      position: 'Член Совета директоров',
      image: '/images/directors-board/Arinova_Aizhan.jpg'
    },{
      key: 'mainCeo',
      name: 'Амардинов Малик Алимжанович',
      position: 'Председатель Правления',
      image: '/images/directors-board/Amardinov.jpg'
    },
    {
      key: 'Alpamysov',
      name: 'Алпамысов Абай Абдисаметович',
      position: 'Член Совета директоров (независимый)',
      image: '/images/directors-board/Alpamysov_Abai.png'
    },
    {
      key: 'Konirbayev',
      name: 'Конирбаев Баян Кайратович',
      position: 'Член Совета директоров (независимый)',
      image: '/images/directors-board/Bayan_Kb.png'
    },
    {
      key: 'Marat',
      name: 'Марат Аскар',
      position: 'Член Совета директоров (независимый)',
      image: '/images/directors-board/Marat_Askar.png'
    }
  ];

  ceoBoard: CeoMember[] = [
    {
      key: 'mainCeo',
      name: 'Амардинов Малик Алимжанович',
      position: 'Председатель Правления',
      image: '/images/directors-board/Amardinov.jpg'
    },
    {
      key: 'ceoBorder1',
      name: 'Дурмагамбетов Ерлан Дмитриевич',
      position: 'Первый заместитель Председателя Правления',
      image: '/images/directors-board/Durmagambetov.jpg'
    },
    {
      key: 'ceoBorder2',
      name: 'Кентбеков Аргын Салаватович',
      position: 'Заместитель Председателя Правления',
      image: '/images/directors-board/Kentbekov.jpg'
    },
    {
      key: 'ceoBorder3',
      name: 'Имажанов Бахытжан Гылымбекович',
      position: 'Заместитель Председателя Правления',
      image: '/images/directors-board/Imajanov.jpg'
    }
  ];
}

