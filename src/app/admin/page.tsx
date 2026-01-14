
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, BookOpen, UserPlus, Loader2, Edit, HelpCircle } from "lucide-react";
import { getCourses } from "@/lib/data-access";
import type { Course, FAQ } from "@/lib/data";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import AddCourseDialog from '@/components/admin/add-course-dialog';
import DeleteCourseAlert from '@/components/admin/delete-course-alert';
import EditCourseDialog from '@/components/admin/edit-course-dialog';
import { collection, getDocs, orderBy, query, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AddFaqDialog from '@/components/admin/add-faq-dialog';
import EditFaqDialog from '@/components/admin/edit-faq-dialog';
import DeleteFaqAlert from '@/components/admin/delete-faq-alert';
import HomeContentForm from '@/components/admin/home-content-form';
import AnnoucementsCard from '@/components/admin/announcements-card';

interface Trainee {
    uid: string;
    firstName: string;
    lastName: string;
    licenseType: string;
    createdAt: Timestamp;
    status?: 'مؤكد' | 'في الانتظار' | 'مكتمل' | 'ملغي';
}


export default function AdminPage() {
    const { user, loading: authLoading, userDetails } = useAuth();
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [recentTrainees, setRecentTrainees] = useState<Trainee[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingFaqs, setLoadingFaqs] = useState(true);
    const [loadingTrainees, setLoadingTrainees] = useState(true);


    const fetchCourses = async () => {
        setLoadingCourses(true);
        const fetchedCourses = await getCourses(10);
        setCourses(fetchedCourses);
        setLoadingCourses(false);
    };

    const fetchFaqs = async () => {
      setLoadingFaqs(true);
      const faqsCol = query(collection(db, 'faqs'), orderBy('order', 'asc'));
      const faqSnapshot = await getDocs(faqsCol);
      setFaqs(faqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ)));
      setLoadingFaqs(false);
    };

    const fetchRecentTrainees = async () => {
        setLoadingTrainees(true);
        const traineesCol = query(
            collection(db, 'users'), 
            orderBy('createdAt', 'desc'), 
            limit(5)
        );
        const traineeSnapshot = await getDocs(traineesCol);
        setRecentTrainees(traineeSnapshot.docs.map(doc => doc.data() as Trainee));
        setLoadingTrainees(false);
    };


    useEffect(() => {
        if (!authLoading) {
            if (!user || userDetails?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchCourses();
                fetchFaqs();
                fetchRecentTrainees();
            }
        }
    }, [user, authLoading, userDetails, router]);

    const stats = [
        {
            title: "إجمالي الطلاب",
            value: "1,250",
            icon: Users,
            change: "+15.2% عن الشهر الماضي",
        },
        {
            title: "الإيرادات",
            value: "$75,345",
            icon: DollarSign,
            change: "+20.1% عن الشهر الماضي",
        },
        {
            title: "التسجيلات الجديدة (هذا الشهر)",
            value: "+82",
            icon: UserPlus,
            change: "+30% عن الشهر الماضي",
        },
        {
            title: "الدورات النشطة",
            value: courses.length,
            icon: BookOpen,
            change: "",
        }
    ];
    
    if (authLoading || !user || userDetails?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    const formatDate = (timestamp: Timestamp | undefined) => {
        if (!timestamp) return 'غير معروف';
        return timestamp.toDate().toLocaleDateString('ar-EG');
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-background">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">لوحة تحكم المدير</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>محتوى الصفحة الرئيسية</CardTitle>
                        <CardDescription>تعديل النصوص الرئيسية وأيقونة الموقع في صفحة الهبوط.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HomeContentForm />
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-2">
                    <AnnoucementsCard />
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>إدارة الدورات</CardTitle>
                            <CardDescription>إضافة وتعديل وحذف الدورات التدريبية.</CardDescription>
                        </div>
                        <AddCourseDialog onCourseAdded={fetchCourses} />
                    </CardHeader>
                    <CardContent>
                       {loadingCourses ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>اسم الدورة</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead className="text-left">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell className="font-medium">{course.name}</TableCell>
                                        <TableCell>{course.id}</TableCell>
                                        <TableCell className="text-left space-x-2 flex items-center justify-end">
                                            <EditCourseDialog course={course} onCourseUpdated={fetchCourses} />
                                            <DeleteCourseAlert courseId={course.id} onCourseDeleted={fetchCourses} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {courses.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">
                                            لم يتم العثور على دورات. قم بإضافة دورة جديدة.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>إدارة الأسئلة الشائعة</CardTitle>
                            <CardDescription>إضافة وتعديل وحذف الأسئلة والأجوبة.</CardDescription>
                        </div>
                        <AddFaqDialog onFaqAdded={fetchFaqs} />
                    </CardHeader>
                    <CardContent>
                       {loadingFaqs ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>السؤال</TableHead>
                                    <TableHead className="text-left">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {faqs.map((faq) => (
                                    <TableRow key={faq.id}>
                                        <TableCell className="font-medium truncate max-w-[200px]">{faq.q}</TableCell>
                                        <TableCell className="text-left space-x-2 flex items-center justify-end">
                                            <EditFaqDialog faq={faq} onFaqUpdated={fetchFaqs} />
                                            <DeleteFaqAlert faqId={faq.id} onFaqDeleted={fetchFaqs} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {faqs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center">
                                            لم يتم العثور على أسئلة شائعة.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>التسجيلات الأخيرة</CardTitle>
                        <CardDescription>نظرة سريعة على أحدث الطلاب الذين انضموا.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {loadingTrainees ? (
                           <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                       ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الاسم</TableHead>
                                    <TableHead>الدورة</TableHead>
                                    <TableHead>تاريخ التسجيل</TableHead>
                                    <TableHead>الحالة</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentTrainees.map((trainee) => {
                                    const status = trainee.status || "في الانتظار";
                                    return (
                                    <TableRow key={trainee.uid}>
                                        <TableCell className="font-medium">{trainee.firstName} {trainee.lastName}</TableCell>
                                        <TableCell>{trainee.licenseType || 'لم يحدد'}</TableCell>
                                        <TableCell>{formatDate(trainee.createdAt)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    status === "مؤكد" ? "default" :
                                                    status === "مكتمل" ? "secondary" :
                                                    status === "في الانتظار" ? "outline" :
                                                    "destructive"
                                                }
                                                className={
                                                    status === "مؤكد" ? "bg-green-500/20 text-green-700 border-green-500/30" :
                                                    status === "مكتمل" ? "bg-blue-500/20 text-blue-700 border-blue-500/30" :
                                                    status === "في الانتظار" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" :
                                                    "bg-red-500/20 text-red-700 border-red-500/30"
                                                }
                                            >
                                                {status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                    )
                                })}
                                {recentTrainees.length === 0 && (
                                     <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            لا توجد تسجيلات حديثة.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    