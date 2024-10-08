import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { DashboardEmissionsComponent } from './dashboard-emissions.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';
import { NgxPaginationModule } from 'ngx-pagination';

import { HighchartsChartModule } from 'highcharts-angular';

describe('DashboardEmissionsComponent', () => {
  let component: DashboardEmissionsComponent;
  let fixture: ComponentFixture<DashboardEmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatMenuModule,
        NgxPaginationModule,
        HighchartsChartModule,
      ],
      declarations: [DashboardEmissionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardEmissionsComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
