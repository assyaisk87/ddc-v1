import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss'
})
export class SectionHeaderComponent {
  @Input() badge = '';
  @Input() title = '';
  @Input() description = '';
  @Input() titleTag: 'h1' | 'h2' = 'h2';
}
