import { Component, signal, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { ActivatedRoute, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navigation } from './components/navigation/navigation';
import { Footer } from './components/footer/footer';
import { MagneticButtonService } from './services/magnetic-button.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Navigation, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  protected readonly title = signal('ddc');
  isLocalEnvironment = false;
  aiAssistantLoaded = false;
  digitalDnaLoaded = false;

  @ViewChild('digitalDnaHost', { read: ViewContainerRef })
  private digitalDnaHost?: ViewContainerRef;

  @ViewChild('aiAssistantHost', { read: ViewContainerRef })
  private aiAssistantHost?: ViewContainerRef;

  private digitalDnaLoadStarted = false;
  private digitalDnaRef?: ComponentRef<any>;
  private digitalDnaTimer: ReturnType<typeof setTimeout> | null = null;

  private aiAssistantLoadStarted = false;
  private aiAssistantRef?: ComponentRef<any>;
  private aiAssistantTimer: ReturnType<typeof setTimeout> | null = null;

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

    if (
      window.matchMedia('(hover: hover)').matches &&
      window.innerWidth > 992
    ) {
      this.magneticService.initMagneticButtons();
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        window.scrollTo(0, 0);
        this.updateRouteSeo(event as NavigationEnd);
      });
  }

  ngAfterViewInit(): void {
    if (!this.router.url.startsWith('/admin')) {
      const scheduleLazyComponents = () => {
        this.digitalDnaTimer = setTimeout(() => {
          void this.loadDigitalDna();
        }, 3000);

        this.aiAssistantTimer = setTimeout(() => {
          void this.loadAiAssistant(false);
        }, 6000);
      };

      if (document.readyState === 'complete') {
        scheduleLazyComponents();
      } else {
        window.addEventListener('load', scheduleLazyComponents, { once: true });
      }
    }
  }

  async loadDigitalDna(): Promise<void> {
    if (this.digitalDnaLoadStarted || this.digitalDnaLoaded || !this.digitalDnaHost) {
      return;
    }

    if (this.digitalDnaTimer) {
      clearTimeout(this.digitalDnaTimer);
      this.digitalDnaTimer = null;
    }

    this.digitalDnaLoadStarted = true;

    const { DigitalDnaComponent } = await import('./components/digital-dna/digital-dna.component');

    this.digitalDnaHost.clear();
    this.digitalDnaRef = this.digitalDnaHost.createComponent(DigitalDnaComponent);
    this.digitalDnaLoaded = true;
  }

  async loadAiAssistant(openAfterLoad = true): Promise<void> {
    if (this.aiAssistantLoadStarted || this.aiAssistantLoaded || !this.aiAssistantHost) {
      return;
    }

    if (this.aiAssistantTimer) {
      clearTimeout(this.aiAssistantTimer);
      this.aiAssistantTimer = null;
    }

    this.aiAssistantLoadStarted = true;

    const { AiAssistantComponent } = await import('./components/ai-assistant/ai-assistant.component');

    this.aiAssistantHost.clear();
    this.aiAssistantRef = this.aiAssistantHost.createComponent(AiAssistantComponent);
    this.aiAssistantLoaded = true;

    if (openAfterLoad && this.aiAssistantRef.instance?.toggleAssistant) {
      this.aiAssistantRef.instance.toggleAssistant();
    }
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
    if (this.digitalDnaTimer) {
      clearTimeout(this.digitalDnaTimer);
      this.digitalDnaTimer = null;
    }

    if (this.aiAssistantTimer) {
      clearTimeout(this.aiAssistantTimer);
      this.aiAssistantTimer = null;
    }

    this.digitalDnaRef?.destroy();
    this.aiAssistantRef?.destroy();
  }
}
