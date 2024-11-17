import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Report03Component } from './report-03.component';

describe('Report03Component', () => {
  let component: Report03Component;
  let fixture: ComponentFixture<Report03Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Report03Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Report03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
