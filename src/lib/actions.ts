
'use server';

import { revalidatePath } from 'next/cache';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { z } from 'zod';

const CourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  details: z.string(),
});

export async function addCourse(data: unknown) {
  const result = CourseSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  const { id, name, description, details } = result.data;

  try {
    // Use the custom ID for the document
    await setDoc(doc(db, 'courses', id), {
      id,
      name,
      description,
      details
    });

    // Revalidate paths to reflect the changes immediately
    revalidatePath('/admin');
    revalidatePath('/courses');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error adding course: ', error);
    return { success: false, error: 'Failed to add course to the database.' };
  }
}
