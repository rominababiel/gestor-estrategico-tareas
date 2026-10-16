import type { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import type { Task } from '../../types/task';

export const TASKS_COLLECTION = 'tasks';

interface TaskDocument {
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

function toDate(timestamp: Timestamp | null): Date {
  return timestamp ? timestamp.toDate() : new Date();
}

export function toTask(snapshot: QueryDocumentSnapshot<DocumentData>): Task {
  const data = snapshot.data({ serverTimestamps: 'estimate' }) as TaskDocument;

  return {
    id: snapshot.id,
    userId: data.userId,
    title: data.title,
    description: data.description,
    completed: data.completed,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}
