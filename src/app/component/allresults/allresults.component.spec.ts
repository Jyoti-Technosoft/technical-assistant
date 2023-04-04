import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllresultsComponent } from './allresults.component';

describe('AllresultsComponent', () => {
  let component: AllresultsComponent;
  let fixture: ComponentFixture<AllresultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllresultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
