import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Quizcomponent } from './quiz.component';

describe('QuestionsComponent', () => {
  let component: Quizcomponent;
  let fixture: ComponentFixture<Quizcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Quizcomponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Quizcomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
