import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilempresaComponent } from './perfilempresa.component';

describe('PerfilempresaComponent', () => {
  let component: PerfilempresaComponent;
  let fixture: ComponentFixture<PerfilempresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilempresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilempresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
