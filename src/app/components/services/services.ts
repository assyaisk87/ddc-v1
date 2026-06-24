import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SERVICES_DATA } from '../../data/services.data';
import { ContentService } from '../../services/content.services';
import { Subscription } from 'rxjs';

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
  // services = SERVICES_DATA;
  services: any[] = [];
  private langSub?: Subscription;
  loading = false;


  constructor(private translate: TranslateService,
    private contentService: ContentService) { }

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
      return;
    }

    this.services = data || [];

    const index = selectedKey
      ? this.services.findIndex(service => service.service_key === selectedKey)
      : 0;

    this.selectService(index >= 0 ? index : 0);
    this.loading = false;
  }

  selectService(index: number) {
    this.selectedIndex = index;
    const service = this.services[index];

    this.selectedService = {
      ...service,
      features: Array.isArray(service.features) ? service.features : []
    };

    console.log('selectedService', this.selectedService);
  }
}