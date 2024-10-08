import { Component, OnInit } from '@angular/core';
import { VisibilityService } from 'app/services/visibility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-european-footer',
  templateUrl: './european-footer.component.html',
  styleUrls: ['./european-footer.component.css'],
})
export class EuropeanFooterComponent implements OnInit {
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
