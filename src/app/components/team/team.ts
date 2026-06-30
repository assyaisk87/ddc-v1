import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
// import { Director, CeoMember, loadDirectorsBoard, loadCeoBoard } from '../../data/team.data';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../services/content.services';
import { Subscription } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { PageHeroComponent, SectionHeaderComponent, CtaBlockComponent } from '../../shared/ui';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink, PageHeroComponent, SectionHeaderComponent, CtaBlockComponent],
  templateUrl: './team.html',
  styleUrls: ['./team.scss']
})
export class Team implements OnInit {
  directorsBoard: any[] = [];
  ceoBoard: any[] = [];
  mainDirector: any;
  mainCeo: any = null;
  ceoMembers: any[] = [];

  loading = true;
  showGreeting = true;
  showAudioControl = true;
  audioPlaying = false;
  audioText = '';
  currentLang: string = 'ru';
  private langSub?: Subscription;

  constructor(
    private translate: TranslateService,
    private speechService: SpeechSynthesisService,
    private contentService: ContentService,
    private storage: StorageService
  ) {
    this.currentLang = this.translate.currentLang;
    // Подписываемся на смену языка
    this.translate.onLangChange.subscribe(() => {
      this.currentLang = this.translate.currentLang;
    });
  }

  async ngOnInit() {
    await this.loadTeam();

    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.loadTeam();
    });
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  getImageUrl(path: string | null | undefined): string {
    return this.storage.getPublicUrl(path);
  }

  async loadTeam() {
    this.loading = true;

    const lang =
      this.translate.currentLang ||
      localStorage.getItem('lang') ||
      'ru';

    const [directors, ceo] = await Promise.all([
      this.contentService.getTeamMembers(lang, 'directors'),
      this.contentService.getTeamMembers(lang, 'ceo')
    ]);


    const allDirectors = directors.data || [];

    this.mainDirector =
      allDirectors.find(item => item.is_main);

    this.directorsBoard =
      allDirectors.filter(item => !item.is_main);

    this.ceoBoard = ceo.data || [];

    const allCeo = ceo.data || [];

    this.mainCeo = allCeo.find(item => item.is_main);
    this.ceoMembers = allCeo.filter(item => !item.is_main);

    this.loading = false;

    console.log("ceoBoard", this.ceoBoard);
    console.log("directorsBoard", this.directorsBoard);
    console.log("mainCeo", this.mainCeo);
    console.log("ceoMembers", this.ceoMembers);
  }

  toggleGreeting(): void {
    this.showGreeting = !this.showGreeting;
  }

  toggleAudioControl(): void {
    this.showAudioControl = !this.showAudioControl;
  }

  toggleAudio(): void {
    if (this.audioPlaying) {
      this.speechService.cancel();
      this.audioPlaying = false;
      return;
    }

    if (this.mainCeo?.message_text) {
      this.audioText = (this.mainCeo?.message_title || '') + (this.mainCeo?.message_text || '');

      this.speechService.speak(this.audioText)
        .then(() => {
          this.audioPlaying = false;
        })
        .catch((error) => {
          console.error('Ошибка воспроизведения аудио:', error);
          this.audioPlaying = false;
        });

      this.audioPlaying = true;
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