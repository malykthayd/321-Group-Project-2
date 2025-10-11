export type LessonCategory = 'Science' | 'Technology' | 'English' | 'Mathematics';

export interface Lesson {
  id: number;
  title: string;
  description?: string;
  content: string;
  grade_level: number;
  subject: string;
  difficulty_level: number;
  estimated_duration: number;
  language: string;
  is_active: boolean;
  created_at: string;
}

export interface LessonWithProgress extends Lesson {
  completed?: boolean;
  progress?: number;
}

