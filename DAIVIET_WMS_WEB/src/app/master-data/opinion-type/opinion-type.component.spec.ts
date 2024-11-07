import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionTypeComponent } from './opinion-type.component';

describe('OpinionTypeComponent', () => {
  let component: OpinionTypeComponent;
  let fixture: ComponentFixture<OpinionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpinionTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpinionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
