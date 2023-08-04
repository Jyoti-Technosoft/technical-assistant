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

export interface quizResult {
  points: number,
  correctAnswer: number,
  inCorrectAnswer: number,
  type: string,
  user: number,
  date: string,
  skipQuiz: number
}
