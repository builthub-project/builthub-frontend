import { Component, OnDestroy, OnInit } from '@angular/core';
import { VisibilityService } from 'app/services/visibility.service';

@Component({
  selector: 'app-platform-index',
  templateUrl: './platform-index.component.html',
  styleUrls: ['../app.component.css'],
})
export class PlatformIndexComponent implements OnInit, OnDestroy {
  constructor(private visibilityService: VisibilityService) {}
  ngOnInit(): void {
    this.visibilityService.changeVisibility(true);
  }
  ngOnDestroy(): void {
    this.visibilityService.changeVisibility(false);
  }
}
