export interface quiz {
  quizId: string;
  rules: string;
  timer: number;
  positivePoints: number;
  negativePoints: number;
  numberOfQuestions: number;
  type: string;
  title: string;
  image: string;
  description: string;
  questions: any[];
}
