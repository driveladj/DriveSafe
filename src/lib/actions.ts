
'use server';

import { revalidatePath } from 'next/cache';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { z } from 'zod';

const CourseSchema = z.object({
  name: z.string(),
  description: z.string(),
  details: z.string(),
});

function generateRandomId() {
    return Math.random().toString(36).substring(2, 9);
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
