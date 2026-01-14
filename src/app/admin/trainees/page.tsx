
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

interface Trainee {
    uid: string;
    firstName: string;
    lastName: string;
    phone: string;
    licenseType: string;
    createdAt: Timestamp;
    status?: 'مؤكد' | 'في الانتظار' | 'مكتمل' | 'ملغي';
}

export default function TraineesPage() {
    const { user, loading: authLoading, userDetails } = useAuth();
    const router = useRouter();
    const [trainees, setTrainees] = useState<Trainee[]>([]);
    const [loadingTrainees, setLoadingTrainees] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user || userDetails?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchTrainees();
            }
        }
    }, [user, authLoading, userDetails, router]);

    const fetchTrainees = async () => {
        setLoadingTrainees(true);
        try {
            const traineesQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
            const traineeSnapshot = await getDocs(traineesQuery);
            setTrainees(traineeSnapshot.docs.map(doc => doc.data() as Trainee));
        } catch (error) {
            console.error("Error fetching trainees:", error);
        } finally {
            setLoadingTrainees(false);
        }
    };

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
                 <div>
                    <h1 className="text-3xl font-bold tracking-tight">إدارة المتدربين</h1>
                    <p className="text-muted-foreground">عرض وإدارة جميع المتدربين المسجلين.</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/admin">
                         <ArrowRight className="ml-2 h-4 w-4" />
                        العودة إلى لوحة التحكم
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="mt-6">
                    {loadingTrainees ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الاسم الكامل</TableHead>
                                    <TableHead>رقم الهاتف</TableHead>
                                    <TableHead>الدورة</TableHead>
                                    <TableHead>تاريخ التسجيل</TableHead>
                                    <TableHead>الحالة</TableHead>
                                    <TableHead>الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trainees.map((trainee) => {
                                    const status = trainee.status || "في الانتظار";
                                    return (
                                        <TableRow key={trainee.uid}>
                                            <TableCell className="font-medium">{trainee.firstName} {trainee.lastName}</TableCell>
                                            <TableCell>{trainee.phone}</TableCell>
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
                                            <TableCell>
                                                <Button variant="outline" size="sm">تعديل</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {trainees.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            لم يتم العثور على أي متدربين.
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
