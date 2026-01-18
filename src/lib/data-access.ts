
import { collection, getDocs, limit, query, DocumentData, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCourseVisuals, type Course, type Feature } from "@/lib/data";

export async function getCourses(count?: number): Promise<Course[]> {
  try {
    const coursesColRef = collection(db, 'courses');
    // Ensure there's a default query when no count is provided
    const q = count ? query(coursesColRef, orderBy("createdAt", "desc"), limit(count)) : query(coursesColRef, orderBy("createdAt", "desc"));
    
    const courseSnapshot = await getDocs(q);
    if (courseSnapshot.empty) {
        console.log("No courses found in Firestore.");
        return [];
    }
    // Correctly map doc.id along with doc.data()
    const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as DocumentData);
    
    return courseList.map(course => {
      // The course object now correctly has an 'id' property
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
