import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
  visibilityChange: EventEmitter<boolean> = new EventEmitter();

  changeVisibility(visibility: boolean) {
    this.visibilityChange.emit(visibility);
  }
}
