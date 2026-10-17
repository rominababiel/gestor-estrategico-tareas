import type { Timestamp } from 'firebase-admin/firestore';
import { getAdminFirestore } from './firebaseAdmin.js';

export interface SummaryTask {
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskDocument {
  title: string;
  description: string;
  completed: boolean;
  createdAt: Timestamp | null;
}

export async function getUserTasks(userId: string): Promise<SummaryTask[]> {
  const snapshot = await getAdminFirestore()
    .collection('tasks')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data() as TaskDocument;
    return {
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
    };
  });
}
