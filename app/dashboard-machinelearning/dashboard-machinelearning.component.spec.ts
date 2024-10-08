import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMachinelearningComponent } from './dashboard-machinelearning.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardMachinelearningComponent', () => {
  let component: DashboardMachinelearningComponent;
  let fixture: ComponentFixture<DashboardMachinelearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DashboardMachinelearningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardMachinelearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
