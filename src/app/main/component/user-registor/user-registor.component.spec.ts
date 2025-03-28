import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistorComponent } from './user-registor.component';

describe('UserRegistorComponent', () => {
  let component: UserRegistorComponent;
  let fixture: ComponentFixture<UserRegistorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRegistorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRegistorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
