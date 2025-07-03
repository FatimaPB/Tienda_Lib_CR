import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OracionesComponent } from './oraciones.component';

describe('OracionesComponent', () => {
  let component: OracionesComponent;
  let fixture: ComponentFixture<OracionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OracionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
