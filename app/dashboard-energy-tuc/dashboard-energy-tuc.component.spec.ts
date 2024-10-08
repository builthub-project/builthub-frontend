import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { DashboardEnergyTucComponent } from './dashboard-energy-tuc.component';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as MatModule from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';
import { By } from '@angular/platform-browser';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatMenuModule } from '@angular/material/menu';

describe('DashboardEnergyTucComponent', () => {
  let component: DashboardEnergyTucComponent;
  let fixture: ComponentFixture<DashboardEnergyTucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataTablesModule,
        HttpClientTestingModule,
        MatMenuModule,
        NgxPaginationModule,
        HighchartsChartModule,
      ],
      declarations: [DashboardEnergyTucComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardEnergyTucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
