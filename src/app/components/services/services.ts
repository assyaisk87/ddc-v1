import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContentService } from '../../services/content.services';
import { Subscription } from 'rxjs';
import { PageHeroComponent, StatsStripComponent, UiStatItem } from '../../shared/ui';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageHeroComponent, StatsStripComponent],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services implements OnInit {
  selectedIndex: number = 0;
  selectedService: any = null;
  services: any[] = [];
  private langSub?: Subscription;
  loading = false;

  get statsItems(): UiStatItem[] {
    return [
      { value: '4', label: this.translate.instant('services.hero.stats.directions') },
      { value: '24/7', label: this.translate.instant('services.hero.stats.support') },
      { value: '40+', label: 'Систем в эксплуатации' },
      { value: '8', label: 'AI-сервисов' }
    ];
  }


  constructor(
    private translate: TranslateService,
    private contentService: ContentService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  async ngOnInit() {
    await this.loadServices();

    this.langSub = this.translate.onLangChange.subscribe(async () => {
      await this.loadServices();
    });
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  async loadServices() {
    this.loading = true;
    const selectedKey = this.selectedService?.service_key;
    const lang = this.translate.currentLang || localStorage.getItem('lang') || 'ru';
    const { data, error } = await this.contentService.getServices(lang);

    if (error) {
      console.error(error);
      this.loading = false;
      this.markViewReady();
      return;
    }

    this.services = data || [];

    const index = selectedKey
      ? this.services.findIndex(service => service.service_key === selectedKey)
      : 0;

    this.selectService(index >= 0 ? index : 0);
    this.loading = false;
    this.markViewReady();
  }

  private markViewReady(): void {
    this.zone.run(() => setTimeout(() => this.cdr.markForCheck()));
  }

  selectService(index: number) {
    this.selectedIndex = index;
    const service = this.services[index];

    this.selectedService = {
      ...service,
      features: Array.isArray(service.features) ? service.features : []
    };

    // console.log('selectedService', this.selectedService);
  }
}