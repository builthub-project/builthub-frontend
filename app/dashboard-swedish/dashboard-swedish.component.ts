import { Component, OnDestroy, OnInit } from '@angular/core';
import { VisibilityService } from 'app/services/visibility.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard-swedish',
  templateUrl: './dashboard-swedish.component.html',
  styleUrls: ['./dashboard-swedish.component.css'],
})
export class DashboardSwedishComponent implements OnInit, OnDestroy {
  header: any;
  footer: any;

  // Map
  map1: any;

  constructor(private visibilityService: VisibilityService) {}
  ngOnInit(): void {
    this.visibilityService.changeVisibility(false);
  }

  ngAfterViewInit() {
    this.map1 = L.map('map1', { attributionControl: false }).setView(
      [65, 18.0649],
      4
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map1);
    L.marker([59.33258, 18.0649]).addTo(this.map1).bindTooltip('Stockholm');
    L.marker([57.70716, 11.96679]).addTo(this.map1).bindTooltip('Gothenburg');
    L.marker([56.67446, 12.85676]).addTo(this.map1).bindTooltip('Halmstad');
    L.marker([57.10557, 12.25078]).addTo(this.map1).bindTooltip('Varberg');
  }

  ngOnDestroy() {
    this.visibilityService.changeVisibility(true);
  }
}
