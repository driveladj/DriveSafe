
import { collection, getDocs, limit, query, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCourseVisuals, type Course } from "@/lib/data";

export async function getCourses(count?: number): Promise<Course[]> {
  const coursesColRef = collection(db, 'courses');
  const q = count ? query(coursesColRef, limit(count)) : coursesColRef;
  
  const courseSnapshot = await getDocs(q);
  const courseList = courseSnapshot.docs.map(doc => doc.data() as DocumentData);
  
  return courseList.map(course => {
    const visuals = getCourseVisuals(course.id);
    return {
      ...course,
      ...visuals,
    } as Course;
  });
}
