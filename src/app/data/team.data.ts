import { TranslateService } from '@ngx-translate/core';
import { Observable, map, forkJoin } from 'rxjs';

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
  messageTitle?: string;
  messageText?: string;
}

// Изображения для директоров (не переводятся)
const DIRECTOR_IMAGES: Record<string, string> = {
  'Zhalenov': '/images/directors-board/Zhalenov_Binur.jpg',
  'Uzbekov': '/images/directors-board/Uzbekov_Askhat.png',
  'Arinova': '/images/directors-board/Arinova_Aizhan.jpg',
  'Alpamysov': '/images/directors-board/Alpamysov_Abai.png',
  'Konirbayev': '/images/directors-board/Bayan_Kb.png',
  'Marat': '/images/directors-board/Marat_Askar.png',
  'Amardinov': '/images/directors-board/Amardinov.jpg',
};

// Изображения для CEO board (не переводятся)
const CEO_IMAGES: Record<string, string> = {
  'mainCeo': '/images/directors-board/Amardinov.jpg',
  'ceoBorder1': '/images/directors-board/Durmagambetov.jpg',
  'ceoBorder2': '/images/directors-board/Kentbekov.jpg',
  'ceoBorder3': '/images/directors-board/Imajanov.jpg',
};

// Биографии для директоров (переводятся через i18n)
const DIRECTOR_BIOGRAPHIES: Record<string, string> = {
  'Zhalenov': 'directorsBoard.biographies.Zhalenov',
  'Uzbekov': 'directorsBoard.biographies.Uzbekov',
  'Arinova': 'directorsBoard.biographies.Arinova',
  'Alpamysov': 'directorsBoard.biographies.Alpamysov',
  'Konirbayev': 'directorsBoard.biographies.Konirbayev',
  'Marat': 'directorsBoard.biographies.Marat',
  'Amardinov': 'ceo.biographies.mainCeo',
};

// Биографии для CEO board (переводятся через i18n)
const CEO_BIOGRAPHIES: Record<string, string> = {
  'mainCeo': 'ceo.biographies.mainCeo',
  'ceoBorder1': 'ceo.biographies.ceoBorder1',
  'ceoBorder2': 'ceo.biographies.ceoBorder2',
  'ceoBorder3': 'ceo.biographies.ceoBorder3',
};

// Ключи директоров из i18n
const DIRECTOR_KEYS = ['Zhalenov', 'Uzbekov', 'Arinova', 'Alpamysov', 'Konirbayev', 'Marat', 'Amardinov'];

// Ключи CEO board из i18n
const CEO_KEYS = ['mainCeo', 'ceoBorder1', 'ceoBorder2', 'ceoBorder3'];

/**
 * Загружает данные о совете директоров из i18n
 */
export function loadDirectorsBoard(translate: TranslateService): Observable<Director[]> {
  // Загружаем данные директоров и их биографии одновременно
  const biographyKeys = Object.values(DIRECTOR_BIOGRAPHIES);
  const allKeys = ['directorsBoard.directors', ...biographyKeys];
  return translate.get(allKeys).pipe(
    map((data: any) => {
      const directors = data['directorsBoard.directors'];
      return DIRECTOR_KEYS.map((key) => {
        const directorData = directors?.[key];
        const biographyKey = DIRECTOR_BIOGRAPHIES[key];
        const biography = data[biographyKey] || '';

        return {
          key: key,
          name: directorData?.name || '',
          position: directorData?.position || '',
          image: DIRECTOR_IMAGES[key] || '',
          biography: biography,
        };
      });
    })
  );
}

/**
 * Загружает данные о правлении (CEO board) из i18n
 */
export function loadCeoBoard(translate: TranslateService): Observable<CeoMember[]> {
  // Загружаем данные CEO и их биографии одновременно
  const biographyKeys = Object.values(CEO_BIOGRAPHIES);
  const allKeys = ['ceo.mainCeo', 'ceo.ceoBorders', ...biographyKeys];

  return translate.get(allKeys).pipe(
    map((data: any) => {
      const mainCeo = data['ceo.mainCeo'];
      const ceoBorders = data['ceo.ceoBorders'];
      const ceoMembers: CeoMember[] = [];

      // Главный CEO
      ceoMembers.push({
    key: 'mainCeo',
        name: mainCeo?.name || '',
        position: mainCeo?.position || '',
        image: CEO_IMAGES['mainCeo'],
        biography: data['ceo.biographies.mainCeo'] || '',
        greeting: mainCeo?.messageTitle + mainCeo?.messageText || '',
        messageTitle: mainCeo?.messageTitle || '',
        messageText: mainCeo?.messageText || '',
      });

      // Остальные члены правления
      CEO_KEYS.slice(1).forEach((key) => {
        const ceoData = ceoBorders?.[key];
        const biographyKey = CEO_BIOGRAPHIES[key];
        ceoMembers.push({
          key: key,
          name: ceoData?.name || '',
          position: ceoData?.position || '',
          image: CEO_IMAGES[key],
          biography: data[biographyKey] || '',
        });
      });

      return ceoMembers;
    })
  );
}

/**
 * Получает текущие переводы для совета директоров
 */
export function getDirectorsBoardFromTranslations(
  directorsTranslation: any,
  translate: TranslateService
): Director[] {
  return DIRECTOR_KEYS.map((key) => {
    const directorData = directorsTranslation[key];
    return {
      key: key,
      name: directorData?.name || '',
      position: directorData?.position || '',
      image: DIRECTOR_IMAGES[key] || '',
      biography: translate.instant(DIRECTOR_BIOGRAPHIES[key]) || '',
    };
  });
}

/**
 * Получает текущие переводы для CEO board
 */
export function getCeoBoardFromTranslations(
  mainCeoTranslation: any,
  ceoBordersTranslation: any,
  translate: TranslateService
): CeoMember[] {
  const ceoMembers: CeoMember[] = [];

  // Главный CEO
  ceoMembers.push({
    key: 'mainCeo',
    name: mainCeoTranslation?.name || '',
    position: mainCeoTranslation?.position || '',
    image: CEO_IMAGES['mainCeo'],
    biography: translate.instant(CEO_BIOGRAPHIES['mainCeo']) || '',
    greeting: mainCeoTranslation?.messageTitle || '',
    messageTitle: mainCeoTranslation?.messageTitle || '',
    messageText: mainCeoTranslation?.messageText || '',
  });

  // Остальные члены правления
  CEO_KEYS.slice(1).forEach((key) => {
    const ceoData = ceoBordersTranslation?.[key];
    ceoMembers.push({
      key: key,
      name: ceoData?.name || '',
      position: ceoData?.position || '',
      image: CEO_IMAGES[key],
      biography: translate.instant(CEO_BIOGRAPHIES[key]) || '',
    });
  });

  return ceoMembers;
}

