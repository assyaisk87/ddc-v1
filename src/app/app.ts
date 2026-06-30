import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navigation } from './components/navigation/navigation';
import { Footer } from './components/footer/footer';
import { DigitalDnaComponent } from './components/digital-dna/digital-dna.component';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';
import { ApiKeySettingsComponent } from './components/api-key-settings/api-key-settings.component';
import { MagneticButtonService } from './services/magnetic-button.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Navigation, Footer, DigitalDnaComponent, AiAssistantComponent, ApiKeySettingsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('ddc');
  isLocalEnvironment = false;

  constructor(
    private magneticService: MagneticButtonService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'ru';
    this.translate.setDefaultLang('ru');
    this.translate.use(savedLang);

    this.isLocalEnvironment = window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    this.magneticService.initMagneticButtons();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        window.scrollTo(0, 0);
        this.updateRouteSeo(event as NavigationEnd);
      });
  }

  private updateRouteSeo(event: NavigationEnd): void {
    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const data = route.snapshot.data;

    if (!data?.['title'] || !data?.['description']) {
      return;
    }

    this.seo.updateSeo({
      title: data['title'],
      description: data['description'],
      url: event.urlAfterRedirects,
      image: '/icons/ddc_logo.svg'
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}
