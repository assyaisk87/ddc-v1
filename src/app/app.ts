import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navigation } from './components/navigation/navigation';
import { Footer } from './components/footer/footer';
import { DigitalDnaComponent } from './components/digital-dna/digital-dna.component';
import { MagneticButtonService } from './services/magnetic-button.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation, Footer, DigitalDnaComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('ddc');

  constructor(
    private magneticService: MagneticButtonService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

