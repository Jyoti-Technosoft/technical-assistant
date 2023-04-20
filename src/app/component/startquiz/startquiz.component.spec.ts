import { ComponentFixture, TestBed } from '@angular/core/testing';

import { rulesComponent } from './startquiz.component';

describe('rulesComponent', () => {
  let component: rulesComponent;
  let fixture: ComponentFixture<rulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ rulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(rulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
