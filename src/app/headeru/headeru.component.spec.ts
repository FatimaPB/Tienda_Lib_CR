import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderuComponent } from './headeru.component';

describe('HeaderuComponent', () => {
  let component: HeaderuComponent;
  let fixture: ComponentFixture<HeaderuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
