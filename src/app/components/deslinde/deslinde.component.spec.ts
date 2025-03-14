import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeslindeComponent } from './deslinde.component';

describe('DeslindeComponent', () => {
  let component: DeslindeComponent;
  let fixture: ComponentFixture<DeslindeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeslindeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeslindeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
