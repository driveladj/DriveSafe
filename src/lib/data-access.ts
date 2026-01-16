
import { collection, getDocs, limit, query, DocumentData, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCourseVisuals, type Course, type Feature } from "@/lib/data";

export async function getCourses(count?: number): Promise<Course[]> {
  try {
    const coursesColRef = collection(db, 'courses');
    const q = count ? query(coursesColRef, limit(count)) : coursesColRef;
    
    const courseSnapshot = await getDocs(q);
    if (courseSnapshot.empty) {
        console.log("No courses found in Firestore.");
        return [];
    }
    const courseList = courseSnapshot.docs.map(doc => doc.data() as DocumentData);
    
    return courseList.map(course => {
      const visuals = getCourseVisuals(course.id);
      return {
        ...course,
        ...visuals,
      } as Course;
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function getFeatures(): Promise<Feature[]> {
  try {
    const featuresCol = query(collection(db, 'features'), orderBy('order', 'asc'));
    const featureSnapshot = await getDocs(featuresCol);
    if (featureSnapshot.empty) {
        return [];
    }
    return featureSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feature));
  } catch (error) {
    console.error("Error fetching features:", error);
    return [];
  }
}
