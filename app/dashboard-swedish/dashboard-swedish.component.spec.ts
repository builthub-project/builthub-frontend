import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSwedishComponent } from './dashboard-swedish.component';

describe('DashboardSwedishComponent', () => {
  let component: DashboardSwedishComponent;
  let fixture: ComponentFixture<DashboardSwedishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSwedishComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSwedishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
