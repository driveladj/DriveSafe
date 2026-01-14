
'use server';

import { revalidatePath } from 'next/cache';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { z } from 'zod';

const CourseSchema = z.object({
  name: z.string().min(3, 'Course name is required'),
  description: z.string().min(10, 'Description is required'),
  details: z.string().min(10, 'Details are required'),
});

function generateRandomId() {
    return Math.random().toString(36).substring(2, 11);
}

export async function addCourse(data: unknown) {
  const result = CourseSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  const { name, description, details } = result.data;
  const newCourseId = generateRandomId();
  const newCourseRef = doc(db, 'courses', newCourseId);

  try {
    await setDoc(newCourseRef, {
      id: newCourseId,
      name,
      description,
      details
    });

    revalidatePath('/admin');
    revalidatePath('/courses');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error adding course: ', error);
    return { success: false, error: 'Failed to add course to the database.' };
  }
}

export async function deleteCourse(courseId: string) {
  if (!courseId) {
    return { success: false, error: 'Course ID is required.' };
  }
  
  const courseRef = doc(db, 'courses', courseId);

  try {
    await deleteDoc(courseRef);

    revalidatePath('/admin');
    revalidatePath('/courses');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting course: ', error);
    return { success: false, error: 'Failed to delete course from the database.' };
  }
}
