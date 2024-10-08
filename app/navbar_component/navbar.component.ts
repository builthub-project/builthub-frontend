import { Component, OnDestroy, OnInit } from '@angular/core';
import { DropDownAnimation } from './animations';
import { KeycloakService } from 'keycloak-angular';
import { Subscription } from 'rxjs';
import { VisibilityService } from 'app/services/visibility.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  /*
  styleUrls: ['../app.component.css'],
  animations: [DropDownAnimation]
   */
})
export class NavBarComponent implements OnInit, OnDestroy {
  isVisible!: boolean;
  private visibilitySubscription!: Subscription;
  constructor(
    private keycloakService: KeycloakService,
    private visibilityService: VisibilityService
  ) {}
  ngOnInit() {
    this.visibilitySubscription =
      this.visibilityService.visibilityChange.subscribe((visibility) => {
        this.isVisible = visibility;
      });
  }

  logout(): void {
    window.postMessage('logout');
    window.addEventListener(
      'message',
      (event) => {
        this.keycloakService.logout();
      },
      false
    );
  }
  ngOnDestroy() {
    this.visibilitySubscription.unsubscribe();
  }
}
