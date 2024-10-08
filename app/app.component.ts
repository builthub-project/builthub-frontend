import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'BuiltHub';

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'emissions',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/emissions.svg')
    );
    iconRegistry.addSvgIcon(
      'energy',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/energy.svg')
    );
    iconRegistry.addSvgIcon(
      'floor-area',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/floor-area.svg')
    );
    iconRegistry.addSvgIcon(
      'building-stock',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/building-stock.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'advanced',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/advanced.svg')
    );
    iconRegistry.addSvgIcon(
      'renovation',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/renovation.svg')
    );
    iconRegistry.addSvgIcon(
      'new-buildings',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/new-buildings.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'renewables',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/renewables.svg')
    );
    iconRegistry.addSvgIcon(
      'life-cycle',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/life-cycle.svg')
    );
    iconRegistry.addSvgIcon(
      'data-catalog',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/data-catalog.svg'
      )
    );

    iconRegistry.addSvgIcon(
      'platform-life',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/platform-life.svg'
      )
    );

    iconRegistry.addSvgIcon(
      'data-library',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/data-library.svg'
      )
    );

    iconRegistry.addSvgIcon(
      'geo-information',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/geo-information.svg'
      )
    );

    iconRegistry.addSvgIcon(
      'comparison-dashboard',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/comparison-dashboard.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'feedback',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/feedback.svg')
    );
    iconRegistry.addSvgIcon(
      'builthub-logo',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/images/builthub-logo.svg'
      )
    );

    iconRegistry.addSvgIcon(
      'builthub-logo-white',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/builthub-logo-white.svg'
      )
    );

    iconRegistry.addSvgIcon(
      'builthub-logo-orange',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/builthub-logo-orange.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'energy-program',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/energy-program.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'upload',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/upload.svg')
    );
  }
}
