import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SERVICES_DATA } from '../../data/services.data';

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
  services = SERVICES_DATA;

  constructor(private translate: TranslateService) {}

  getServiceData(serviceId: string) {
    const serviceKey = `services.services.${serviceId}`;
    return {
      title: this.translate.instant(`${serviceKey}.title`),
      description: this.translate.instant(`${serviceKey}.description`),
      features: this.translate.instant(`${serviceKey}.features`)
    };
  }

  ngOnInit() {
    this.selectService(0);
  }

  selectService(index: number) {
    this.selectedIndex = index;
    const service = this.services[index];
    this.selectedService = {
      ...service,
      ...this.getServiceData(service.id)
    };
  }
}