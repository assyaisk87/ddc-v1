import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cta-block',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cta-block.component.html',
  styleUrl: './cta-block.component.scss'
})
export class CtaBlockComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() buttonLabel = '';
  @Input() routerLink = '/contacts';
}
