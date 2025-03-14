import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarcontraComponent } from './recuperarcontra.component';

describe('RecuperarcontraComponent', () => {
  let component: RecuperarcontraComponent;
  let fixture: ComponentFixture<RecuperarcontraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarcontraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecuperarcontraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
