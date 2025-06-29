import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidodetalleComponent } from './pedidodetalle.component';

describe('PedidodetalleComponent', () => {
  let component: PedidodetalleComponent;
  let fixture: ComponentFixture<PedidodetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidodetalleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PedidodetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
