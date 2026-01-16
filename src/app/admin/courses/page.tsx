
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth.tsx';
import { useRouter } from 'next/navigation';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Course } from '@/lib/data';
import AddCourseDialog from '@/components/admin/add-course-dialog';
import EditCourseDialog from '@/components/admin/edit-course-dialog';
import DeleteCourseAlert from '@/components/admin/delete-course-alert';


export default function AdminCoursesPage() {
    const { user, loading: authLoading, userDetails } = useAuth();
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const coursesCollection = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
            const courseSnapshot = await getDocs(coursesCollection);
            const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
            setCourses(courseList);
        } catch (error) {
            console.error("Error fetching courses: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!user || userDetails?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchCourses();
            }
        }
    }, [user, authLoading, userDetails, router]);


    if (authLoading || !user || userDetails?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>إدارة الدورات التدريبية</CardTitle>
                        <CardDescription>إضافة وتعديل وحذف الدورات التي تقدمونها.</CardDescription>
                    </div>
                    <AddCourseDialog onCourseAdded={fetchCourses} />
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>اسم الدورة</TableHead>
                                <TableHead>صنف الرخصة</TableHead>
                                <TableHead>الوصف</TableHead>
                                <TableHead className="text-right">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium">{course.name}</TableCell>
                                    <TableCell>{course.categoryName}</TableCell>
                                    <TableCell className="truncate max-w-[250px]">{course.description || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <EditCourseDialog course={course} onCourseUpdated={fetchCourses} />
                                            <DeleteCourseAlert courseId={course.id} courseName={course.name} onCourseDeleted={fetchCourses} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {courses.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        لم يتم العثور على دورات. قم بإضافة دورة جديدة.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
