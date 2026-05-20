import { Injectable } from '@angular/core';
import { fromEvent, Subject, shareReplay } from 'rxjs';
import { throttleTime, map } from 'rxjs/operators';

interface MousePosition {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class KineticTextService {
  private mousePosition = new Subject<MousePosition>();
  private elements: HTMLElement[] = [];

  constructor() {
    this.initMouseTracking();
  }

  private initMouseTracking(): void {
    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        throttleTime(16), // ~60fps
        map((e: MouseEvent) => ({ x: e.clientX, y: e.clientY })),
        shareReplay(1)
      )
      .subscribe(pos => this.mousePosition.next(pos));
  }

  public registerElement(element: HTMLElement): void {
    if (!this.elements.includes(element)) {
      this.elements.push(element);
      this.applyKineticEffect(element);
    }
  }

  public unregisterElement(element: HTMLElement): void {
    const index = this.elements.indexOf(element);
    if (index > -1) {
      this.elements.splice(index, 1);
    }
  }

  private applyKineticEffect(element: HTMLElement): void {
    this.mousePosition.subscribe(pos => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (pos.x - centerX) / (window.innerWidth / 20);
      const deltaY = (pos.y - centerY) / (window.innerHeight / 20);

      element.style.transform = `
        perspective(1000px)
        rotateY(${deltaX * 0.5}deg)
        rotateX(${deltaY * -0.5}deg)
        translateX(${deltaX * 2}px)
        translateY(${deltaY * 2}px)
      `;
    });
  }

  public destroy(): void {
    this.elements = [];
  }
}
