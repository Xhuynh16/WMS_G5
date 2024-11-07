import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPeriodComponent } from './audit-period.component';

describe('AuditPeriodComponent', () => {
  let component: AuditPeriodComponent;
  let fixture: ComponentFixture<AuditPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPeriodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
