import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestablecercontraComponent } from './restablecercontra.component';

describe('RestablecercontraComponent', () => {
  let component: RestablecercontraComponent;
  let fixture: ComponentFixture<RestablecercontraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestablecercontraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestablecercontraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
