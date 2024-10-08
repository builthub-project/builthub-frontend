import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsComponent } from './graphics.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HighchartsChartModule } from 'highcharts-angular';

describe('GraphicsComponent', () => {
  let component: GraphicsComponent;
  let fixture: ComponentFixture<GraphicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HighchartsChartModule],
      declarations: [GraphicsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
