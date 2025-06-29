import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenelrepartidorComponent } from './penelrepartidor.component';

describe('PenelrepartidorComponent', () => {
  let component: PenelrepartidorComponent;
  let fixture: ComponentFixture<PenelrepartidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenelrepartidorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PenelrepartidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
