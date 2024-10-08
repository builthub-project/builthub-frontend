import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBereelComponent } from './dashboard-bereel.component';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as MatModule from '@angular/material';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatMenuModule } from '@angular/material/menu';

describe('DashboardBereelComponent', () => {
  let component: DashboardBereelComponent;
  let fixture: ComponentFixture<DashboardBereelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataTablesModule,
        HttpClientTestingModule,
        MatMenuModule,
        HighchartsChartModule,
      ],
      declarations: [DashboardBereelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardBereelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
