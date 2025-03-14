import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeslindelegalComponent } from './deslindelegal.component';

describe('DeslindelegalComponent', () => {
  let component: DeslindelegalComponent;
  let fixture: ComponentFixture<DeslindelegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeslindelegalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeslindelegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
