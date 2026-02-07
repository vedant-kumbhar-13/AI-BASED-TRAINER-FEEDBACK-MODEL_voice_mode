// Learning Module Types

export interface Topic {
	id: number;
	name: string;
	definition: string;
	description: string;
	videoUrl: string;
	level: "Beginner" | "Intermediate" | "Hard";
	icon: string;
}

export interface Question {
	id: number;
	topicId: number;
	text: string;
	options: string[];
	correctAnswer: string;
}

export interface QuizAttempt {
	topicId: number;
	responses: QuestionResponse[];
	score: number;
	totalQuestions: number;
	timeSpent: number;
	completedAt: string;
}

export interface QuestionResponse {
	questionId: number;
	selectedAnswer: string;
	isCorrect: boolean;
	timeSpent: number;
}

export interface UserProgress {
	topicId: number;
	completed: boolean;
	bestScore: number;
	attempts: number;
	lastAttemptAt: string | null;
}
