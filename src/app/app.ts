import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './components/navigation/navigation';
import { Footer } from './components/footer/footer';
import { DigitalDnaComponent } from './components/digital-dna/digital-dna.component';
import { MagneticButtonService } from './services/magnetic-button.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation, Footer, DigitalDnaComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('ddc');

  constructor(private magneticService: MagneticButtonService) {}

  ngOnInit(): void {
    this.magneticService.initMagneticButtons();
  }
}

