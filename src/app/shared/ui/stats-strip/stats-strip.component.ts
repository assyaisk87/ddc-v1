import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UiStatItem {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-stats-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-strip.component.html',
  styleUrl: './stats-strip.component.scss'
})
export class StatsStripComponent {
  @Input() items: UiStatItem[] = [];
}
