import {
  Component,
  OnInit,
  HostListener,
  Host,
  OnDestroy,
} from '@angular/core';
import {
  SidebarOpenAnimation,
  SidebarCloseAnimation,
} from '../dashboard/animation';
import { style, transition, trigger, useAnimation } from '@angular/animations';
import { Router } from '@angular/router';
import { VisibilityService } from 'app/services/visibility.service';

const animationParams = {
  menuWidth: '250px',
  animationStyle: '500ms ease',
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('sideMenu', [
      transition(':enter', [
        useAnimation(SidebarOpenAnimation, {
          params: {
            ...animationParams,
          },
        }),
      ]),
      transition(':leave', [
        useAnimation(SidebarCloseAnimation, {
          params: {
            ...animationParams,
          },
        }),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public getScreenWidth: any;
  public getScreenHeight: any;

  public getKnowageWidth: any;
  public getKnowageHeight: any;

  dashboard: any[] = [];
  storylines: any[] = [];
  data: any[] = [];
  benchmark: any[] = [];

  isOpen: boolean;

  scrolliFrame: any;
  standardHeight: any;

  constructor(
    private router: Router,
    private visibilityService: VisibilityService
  ) {
    this.dashboard = [
      {
        title: 'Emissions',
        subtitle: 'by use, sector',
        icon: 'emissions',
        link: '/dashboard-emissions',
      },
      {
        title: 'Energy',
        subtitle: 'by fuel, type, use',
        icon: 'energy',
        link: 'localhost/knowage/public/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&OBJECT_LABEL=EUCEnergyConsumptionDMart&TOOLBAR_VISIBLE=false&ORGANIZATION=DEFAULT_TENANT&NEW_SESSION=true',
      },
      {
        title: 'Advanced',
        subtitle: 'for expert analysis',
        icon: 'advanced',
        link: 'localhost/knowage/public/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&OBJECT_LABEL=EUBuildingAreasDMart&TOOLBAR_VISIBLE=false&ORGANIZATION=DEFAULT_TENANT&NEW_SESSION=true',
      },
      {
        title: 'Comparison Dashboard',
        subtitle: 'by space heating consumption',
        icon: 'comparison-dashboard',
        link: 'localhost/knowage/public/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&OBJECT_LABEL=Comparison&TOOLBAR_VISIBLE=false&ORGANIZATION=DEFAULT_TENANT&NEW_SESSION=true',
      },
      {
        title: 'Geo Information',
        subtitle: 'By GIS',
        icon: 'geo-information',
        link: 'localhost/knowage/public/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&OBJECT_LABEL=EUCGeoInfoDMart&TOOLBAR_VISIBLE=false&ORGANIZATION=DEFAULT_TENANT&NEW_SESSION=true',
      },
    ];

    this.storylines = [
      {
        title: 'Renovation',
        subtitle: 'activity, performance',
        icon: 'renovation',
        link: '/graphics-csv',
      },
      {
        title: 'Be Reel',
        subtitle: 'construction, quality',
        icon: 'new-buildings',
        link: '/dashboard-bereel',
      },
      {
        title: 'Territorial Unit Consumption',
        subtitle: 'use, installations',
        icon: 'renewables',
        link: '/dashboard-energy-tuc',
      },
      {
        title: 'Swedish Case',
        subtitle: 'ML analysis',
        icon: 'life-cycle',
        link: '/dashboard-swedish',
      },
    ];
    this.benchmark = [
      {
        title: 'Benchmark',
        subtitle: 'benchmark',
        icon: 'energy-program',
        link: '/benchmark',
      },
    ];

    this.data = [
      {
        title: 'Data Catalog',
        subtitle: 'sources',
        icon: 'data-catalog',
        link: './assets/catalog/datacatalog.html',
      },
      {
        title: 'ML Method',
        subtitle: 'most suitable algorithm',
        icon: 'platform-life',
        link: '/dashboard-machinelearning',
      },
      {
        title: 'Feedback',
        subtitle: 'feedback',
        icon: 'feedback',
        link: '/dashboard-feedback',
      },
    ];

    this.isOpen = false;
  }

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    this.getKnowageWidth = this.getScreenWidth - 74;
    this.getKnowageHeight = this.getScreenHeight - 258;
    this.standardHeight = this.getKnowageHeight;

    if (this.getKnowageHeight < 825) {
      this.getKnowageHeight = 825;
    }
    this.visibilityService.changeVisibility(true);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    //console.log("this.getKnowageHeight --> "+this.getKnowageHeight);

    this.getKnowageWidth = this.getScreenWidth - 74;
    this.getKnowageHeight = this.getScreenHeight - 258;

    if (this.getKnowageHeight < 825) {
      this.getKnowageHeight = 825;
    }
  }

  uploadDone() {
    this.getKnowageHeight = this.standardHeight;

    window.postMessage({ name: 'resize' }, '*');
  }

  resizeIFrameToFitContent() {
    const iframe: HTMLIFrameElement = <HTMLIFrameElement>(
      document.getElementById('KnowageFrame')
    );

    if (iframe) {
      if (iframe.contentDocument?.body.scrollHeight) {
        if (iframe.contentDocument?.body.scrollHeight >= iframe.clientHeight) {
          this.scrolliFrame = iframe.contentDocument?.body.scrollHeight;

          if (this.scrolliFrame < this.standardHeight) {
            this.scrolliFrame = this.standardHeight;
          }

          this.getKnowageHeight = this.scrolliFrame + 50;
        }
      }
    }
  }

  @HostListener('window:message', ['$event']) onPostMessage(event: any) {
    if (event.data.name == 'resize') {
      this.resizeIFrameToFitContent();
    }
  }

  ngOnDestroy() {
    this.visibilityService.changeVisibility(false);
  }
}
