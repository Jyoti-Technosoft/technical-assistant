export interface Result {
  correctAnswer: number;
  date: string;
  id?:string
  quizId?:string;
  inCorrectAnswer: number;
  points: number;
  type: string;
  user: number;
  quizTypeImage:string; 
}
