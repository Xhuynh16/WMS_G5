import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDetailsComponent } from './export-details.component';

describe('ExportDetailsComponent', () => {
  let component: ExportDetailsComponent;
  let fixture: ComponentFixture<ExportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
