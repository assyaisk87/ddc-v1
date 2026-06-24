import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navigation } from './components/navigation/navigation';
import { Footer } from './components/footer/footer';
import { DigitalDnaComponent } from './components/digital-dna/digital-dna.component';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';
import { ApiKeySettingsComponent } from './components/api-key-settings/api-key-settings.component';
import { MagneticButtonService } from './services/magnetic-button.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

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
    private router: Router,
    private translate: TranslateService      
    
  ) { }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'ru';
    this.translate.setDefaultLang('ru');
    this.translate.use(savedLang);
    // Check if running in local environment
    this.isLocalEnvironment = window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    this.magneticService.initMagneticButtons();

    // Scroll to top on route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}

