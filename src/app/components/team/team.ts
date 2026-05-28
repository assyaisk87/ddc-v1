import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Director, CeoMember, loadDirectorsBoard, loadCeoBoard } from '../../data/team.data';
@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './team.html',
  styleUrls: ['./team.scss']
})
export class Team implements OnInit {
  directorsBoard: Director[] = [];
  ceoBoard: CeoMember[] = [];
  showGreeting = true;
  showAudioControl = true;
  audioPlaying = false;
  audioText = '';
  currentLang: string = 'ru';

  constructor(
    private translate: TranslateService,
  ) {
    this.currentLang = this.translate.currentLang;
    // Подписываемся на смену языка
    this.translate.onLangChange.subscribe(() => {
      this.currentLang = this.translate.currentLang;
      this.loadTeamData();
    });
  }

  ngOnInit(): void {
    this.loadTeamData();
  }

  loadTeamData(): void {
    // Загружаем данные о совете директоров
    loadDirectorsBoard(this.translate).subscribe({
      next: (directors) => {
        this.directorsBoard = directors;
      },
      error: (error) => {
        console.error('Ошибка загрузки данных о совете директоров:', error);
      }
    });

    // Загружаем данные о правлении
    loadCeoBoard(this.translate).subscribe({
      next: (ceos) => {
        this.ceoBoard = ceos;
      },
      error: (error) => {
        console.error('Ошибка загрузки данных о правлении:', error);
      }
    });
  }

  toggleGreeting(): void {
    this.showGreeting = !this.showGreeting;
  }

  toggleAudioControl(): void {
    this.showAudioControl = !this.showAudioControl;
  }

  toggleAudio(): void {
    if (this.audioPlaying) {
      window.speechSynthesis.cancel();
      this.audioPlaying = false;
      return;
    }

    const mainCeo = this.ceoBoard.find(ceo => ceo.key === 'mainCeo');
    if (mainCeo?.greeting) {
      this.audioText = mainCeo.greeting;
      const utterance = new SpeechSynthesisUtterance(this.audioText);
      utterance.lang = this.currentLang === 'ru' ? 'ru-RU' : 'kk-KZ';
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        this.audioPlaying = true;
      };

      utterance.onend = () => {
        this.audioPlaying = false;
      };

      utterance.onerror = () => {
        this.audioPlaying = false;
      };

      window.speechSynthesis.speak(utterance);
    }
  }

  getAudioButtonText(): string {
    if (this.audioPlaying) {
      return this.currentLang === 'ru' ? 'Остановить' : 'Тоқтату';
    }
    return this.currentLang === 'ru' ? 'Воспроизвести' : 'Ойнау';
  }

  getAudioIcon(): string {
    return this.audioPlaying ? '🔇' : '🔊';
  }
}