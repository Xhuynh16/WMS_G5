import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateOpinionEditComponent } from './template-opinion-edit.component';

describe('TemplateOpinionEditComponent', () => {
  let component: TemplateOpinionEditComponent;
  let fixture: ComponentFixture<TemplateOpinionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateOpinionEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateOpinionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
