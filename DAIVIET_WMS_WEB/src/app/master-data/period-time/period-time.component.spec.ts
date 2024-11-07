import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodTimeComponent } from './period-time.component';

describe('PeriodTimeComponent', () => {
  let component: PeriodTimeComponent;
  let fixture: ComponentFixture<PeriodTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeriodTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
