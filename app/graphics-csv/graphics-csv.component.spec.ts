import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsCsvComponent } from './graphics-csv.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HighchartsChartModule } from 'highcharts-angular';

describe('GraphicsCsvComponent', () => {
  let component: GraphicsCsvComponent;
  let fixture: ComponentFixture<GraphicsCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphicsCsvComponent],
    }).compileComponents();
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HighchartsChartModule],
      declarations: [GraphicsCsvComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicsCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
