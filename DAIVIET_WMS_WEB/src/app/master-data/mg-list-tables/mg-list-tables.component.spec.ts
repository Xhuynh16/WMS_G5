import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MgListTablesComponent } from './mg-list-tables.component';

describe('MgListTablesComponent', () => {
  let component: MgListTablesComponent;
  let fixture: ComponentFixture<MgListTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MgListTablesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MgListTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
