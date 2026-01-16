"use client";

import { useAuth } from "@/hooks/use-auth.tsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Loader2, Edit, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { collection, getDocs, orderBy, query, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import Link from 'next/link';
import TraineeExamProgress from "@/components/trainee/trainee-exam-progress";

interface Announcement {
    id: string;
    content: string;
    createdAt: Timestamp;
}

export default function DashboardPage() {
    const { user, loading, userDetails } = useAuth();
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoadingAnnouncements(true);
            try {
                const announcementsCol = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(5));
                const snapshot = await getDocs(announcementsCol);
                setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
            } catch (error) {
                console.error("Error fetching announcements:", error);
            } finally {
                setLoadingAnnouncements(false);
            }
        };

        if (user) {
            fetchAnnouncements();
        }
    }, [user]);

    if (loading || !user || !userDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    const formatRelativeTime = (timestamp: Timestamp) => {
        return formatDistanceToNow(timestamp.toDate(), { addSuffix: true, locale: ar });
    };

    const totalAmount = userDetails.totalAmount || 0;
    const paidAmount = userDetails.paidAmount || 0;
    const remainingAmount = totalAmount - paidAmount;

    return (
        <div className="container py-12">
            <div className="space-y-4 mb-8">
                <h1 className="font-headline text-4xl font-bold">مرحباً بك، {userDetails.firstNameAr}</h1>
                <p className="text-lg text-muted-foreground">هذه هي لوحة تحكم المتدرب الخاصة بك.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                 <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>الوضع المالي</CardTitle>
                        <CardDescription>نظرة سريعة على الرسوم الدراسية الخاصة بك.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <Card>
                           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">المبلغ الإجمالي</CardTitle>
                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalAmount.toFixed(2)} د.ج</div>
                            </CardContent>
                        </Card>
                         <Card>
                           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">المبلغ المدفوع</CardTitle>
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{paidAmount.toFixed(2)} د.ج</div>
                            </CardContent>
                        </Card>
                         <Card>
                           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">المبلغ المتبقي</CardTitle>
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{remainingAmount.toFixed(2)} د.ج</div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>ملفي الشخصي</CardTitle>
                        <CardDescription>عرض وتحديث معلوماتك الشخصية.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p><strong>الاسم:</strong> {userDetails.firstNameAr} {userDetails.lastNameAr}</p>
                        <p><strong>رقم الهاتف:</strong> {userDetails.phone}</p>
                        <p><strong>الدورة المسجلة:</strong> {userDetails.licenseType}</p>
                        <Button asChild variant="outline" className="mt-4">
                            <Link href="/dashboard/profile">
                                تعديل الملف الشخصي
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <TraineeExamProgress />
                
                <Card>
                    <CardHeader>
                        <CardTitle>الإشعارات</CardTitle>
                        <CardDescription>آخر التحديثات من الأكاديمية.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {loadingAnnouncements ? (
                            <div className="flex justify-center items-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                         ) : announcements.length > 0 ? (
                            <ul className="space-y-4">
                                {announcements.map(ann => (
                                    <li key={ann.id} className="flex gap-3">
                                        <div className="bg-primary/10 text-primary p-2 rounded-full h-fit">
                                            <Bell className="w-4 h-4"/>
                                        </div>
                                        <div>
                                            <p className="text-sm">{ann.content}</p>
                                            <p className="text-xs text-muted-foreground">{formatRelativeTime(ann.createdAt)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                         ) : (
                            <p className="text-muted-foreground text-sm">لا توجد إشعارات جديدة.</p>
                         )}
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>شاركنا تجربتك</CardTitle>
                        <CardDescription>
                            رأيك يهمنا ويساعد الطلاب الآخرين. هل ترغب في ترك رأي حول تجربتك في الأكاديمية؟
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/submit-testimonial">
                                <Edit className="w-4 h-4 mr-2"/> كتابة رأي
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
