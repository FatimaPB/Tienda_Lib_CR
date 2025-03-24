import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarMfaComponent } from './verificar-mfa.component';

describe('VerificarMfaComponent', () => {
  let component: VerificarMfaComponent;
  let fixture: ComponentFixture<VerificarMfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarMfaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerificarMfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
