import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EuropeanFooterComponent } from './european-footer.component';

describe('EuropeanFooterComponent', () => {
  let component: EuropeanFooterComponent;
  let fixture: ComponentFixture<EuropeanFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EuropeanFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EuropeanFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
