import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { Task, TaskFormValues, TaskUpdate } from '../types/task';
import { db } from './firebase/firestore';
import { TASKS_COLLECTION, toTask } from './firebase/taskMapper';

const tasksCollection = collection(db, TASKS_COLLECTION);

function sanitizeUpdate(changes: TaskUpdate): TaskUpdate {
  return {
    ...changes,
    ...(changes.title !== undefined && { title: changes.title.trim() }),
    ...(changes.description !== undefined && { description: changes.description.trim() }),
  };
}

export function subscribeToUserTasks(
  userId: string,
  onChange: (tasks: Task[]) => void,
  onError: (error: Error) => void,
): () => void {
  const userTasksQuery = query(
    tasksCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(userTasksQuery, (snapshot) => onChange(snapshot.docs.map(toTask)), onError);
}

export async function createTask(
  userId: string,
  { title, description }: TaskFormValues,
): Promise<void> {
  await addDoc(tasksCollection, {
    userId,
    title: title.trim(),
    description: description.trim(),
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTask(taskId: string, changes: TaskUpdate): Promise<void> {
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), {
    ...sanitizeUpdate(changes),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
}
