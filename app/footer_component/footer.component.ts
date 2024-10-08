import { Component } from '@angular/core';
import { VisibilityService } from 'app/services/visibility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['../app.component.css'],
})
export class FooterComponent {
  isVisible!: boolean;
  private visibilitySubscription!: Subscription;
  constructor(private visibilityService: VisibilityService) {}
  ngOnInit() {
    this.visibilitySubscription =
      this.visibilityService.visibilityChange.subscribe((visibility) => {
        this.isVisible = visibility;
      });
  }
  ngOnDestroy() {
    this.visibilitySubscription.unsubscribe();
  }
}
