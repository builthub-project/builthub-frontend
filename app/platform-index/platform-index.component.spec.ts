import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformIndexComponent } from './platform-index.component';

describe('PlatformIndexComponent', () => {
  let component: PlatformIndexComponent;
  let fixture: ComponentFixture<PlatformIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatformIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
