import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnoticiasComponent } from './gestionnoticias.component';

describe('GestionnoticiasComponent', () => {
  let component: GestionnoticiasComponent;
  let fixture: ComponentFixture<GestionnoticiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionnoticiasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionnoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
