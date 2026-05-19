import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-avatar.component.html',
  styleUrl: './ai-avatar.component.scss'
})
export class AiAvatarComponent {
  @Input() isPlaying: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  toggleAudio() {
    this.toggle.emit();
  }
}

