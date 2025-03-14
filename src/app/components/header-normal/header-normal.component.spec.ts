import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNormalComponent } from './header-normal.component';

describe('HeaderNormalComponent', () => {
  let component: HeaderNormalComponent;
  let fixture: ComponentFixture<HeaderNormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNormalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
