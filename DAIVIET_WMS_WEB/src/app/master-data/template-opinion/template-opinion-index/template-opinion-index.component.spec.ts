import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateOpinionIndexComponent } from './template-opinion-index.component';

describe('TemplateOpinionIndexComponent', () => {
  let component: TemplateOpinionIndexComponent;
  let fixture: ComponentFixture<TemplateOpinionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateOpinionIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateOpinionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
