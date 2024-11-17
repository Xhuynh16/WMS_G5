import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Report01Component } from './report-01.component';

describe('Report01Component', () => {
  let component: Report01Component;
  let fixture: ComponentFixture<Report01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Report01Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Report01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
