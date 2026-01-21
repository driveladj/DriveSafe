
import { getCourseVisuals, type Course, type Feature, staticFeatures, staticCourses } from "@/lib/data";

// NOTE: This file is modified for the frontend-only offline version.
// It returns static data instead of fetching from Firebase.

export async function getCourses(count?: number): Promise<Course[]> {
  const coursesWithVisuals = staticCourses.map(course => {
    const visuals = getCourseVisuals(course.id);
    return {
      ...course,
      ...visuals,
    } as Course;
  });

  if (count) {
    return coursesWithVisuals.slice(0, count);
  }
  return coursesWithVisuals;
}

export async function getFeatures(): Promise<Feature[]> {
  return staticFeatures;
}
