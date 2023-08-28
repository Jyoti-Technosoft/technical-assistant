import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizRuleComponent } from './quiz-rule.component';

describe('QuizRuleComponent', () => {
  let component: QuizRuleComponent;
  let fixture: ComponentFixture<QuizRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizRuleComponent]
    });
    fixture = TestBed.createComponent(QuizRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
