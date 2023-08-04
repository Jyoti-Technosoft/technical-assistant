import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TearmsConditionComponent } from './tearms-condition.component';

describe('TearmsConditionComponent', () => {
  let component: TearmsConditionComponent;
  let fixture: ComponentFixture<TearmsConditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TearmsConditionComponent]
    });
    fixture = TestBed.createComponent(TearmsConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
