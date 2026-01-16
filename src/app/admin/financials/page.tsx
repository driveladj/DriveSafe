
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Search, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from '@/hooks/use-auth.tsx';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import ManagePaymentDialog from '@/components/admin/manage-payment-dialog';


// Interface for Trainee financial data
interface TraineeFinancial {
    uid: string;
    firstNameAr: string;
    lastNameAr: string;
    phone: string;
    licenseType: string;
    totalAmount?: number;
    paidAmount?: number;
}

export default function FinancialsPage() {
    const { user, loading: authLoading, userDetails } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [trainees, setTrainees] = useState<TraineeFinancial[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [selectedTrainee, setSelectedTrainee] = useState<TraineeFinancial | null>(null);

    const fetchData = async () => {
        try {
            const q = query(collection(db, 'users'), where('status', 'in', ['مؤكد', 'في الانتظار']));
            const traineesSnap = await getDocs(q);
            const traineesData = traineesSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as TraineeFinancial));
            setTrainees(traineesData);
        } catch (error) {
            console.error("Error fetching financial data:", error);
            toast({ title: "خطأ", description: "فشل تحميل البيانات المالية.", variant: "destructive" });
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user && userDetails?.role === 'admin') {
            setLoadingData(true);
            fetchData();
        }
        else if (!authLoading && (!user || userDetails?.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, authLoading, userDetails, router]);

    const handleManagePaymentClick = (trainee: TraineeFinancial) => {
        setSelectedTrainee(trainee);
        setIsPaymentDialogOpen(true);
    };

    const filteredTrainees = trainees.filter(trainee => {
        const search = searchTerm.toLowerCase();
        const nameMatch = `${trainee.firstNameAr} ${trainee.lastNameAr}`.toLowerCase().includes(search);
        const phoneMatch = trainee.phone?.toLowerCase().includes(search);
        return nameMatch || phoneMatch;
    });

    const summary = filteredTrainees.reduce(
        (acc, trainee) => {
            const totalAmount = trainee.totalAmount || 0;
            const paidAmount = trainee.paidAmount || 0;
            acc.total += totalAmount;
            acc.paid += paidAmount;
            acc.remaining += totalAmount - paidAmount;
            return acc;
        },
        { total: 0, paid: 0, remaining: 0 }
    );

    if (loadingData && trainees.length === 0) {
        return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <Card className="m-4">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>الإدارة المالية</CardTitle>
                        <CardDescription>عرض وإدارة الأقساط والمبالغ المستحقة للمتدربين النشطين.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Summary Section */}
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">إجمالي المبالغ المطلوبة</CardTitle>
                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.total.toFixed(2)} د.ج</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">إجمالي المبالغ المدفوعة</CardTitle>
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{summary.paid.toFixed(2)} د.ج</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">إجمالي المبالغ المتبقية</CardTitle>
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{summary.remaining.toFixed(2)} د.ج</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mb-6 max-w-lg">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="ابحث بالاسم أو رقم الهاتف..." 
                                className="pl-10"
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>الاسم الكامل</TableHead>
                                <TableHead>نوع الرخصة</TableHead>
                                <TableHead>المبلغ الإجمالي</TableHead>
                                <TableHead>المبلغ المدفوع</TableHead>
                                <TableHead className="text-red-600 font-bold">المبلغ المتبقي</TableHead>
                                <TableHead><span className="sr-only">إجراءات</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTrainees.map((trainee) => {
                                const totalAmount = trainee.totalAmount || 0;
                                const paidAmount = trainee.paidAmount || 0;
                                const remainingAmount = totalAmount - paidAmount;

                                return (
                                    <TableRow key={trainee.uid}>
                                        <TableCell className="font-medium">{trainee.firstNameAr} {trainee.lastNameAr}</TableCell>
                                        <TableCell>{trainee.licenseType || 'لم يحدد'}</TableCell>
                                        <TableCell>{totalAmount.toFixed(2)} د.ج</TableCell>
                                        <TableCell className="font-bold text-green-600">{paidAmount.toFixed(2)} د.ج</TableCell>
                                        <TableCell className="font-bold text-red-600">{remainingAmount.toFixed(2)} د.ج</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleManagePaymentClick(trainee)}>إدارة الدفعات</Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredTrainees.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        لا توجد نتائج.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <ManagePaymentDialog
                open={isPaymentDialogOpen}
                onOpenChange={setIsPaymentDialogOpen}
                trainee={selectedTrainee}
                onPaymentUpdate={fetchData} // Pass the fetchData function to re-render data on update
            />
        </>
    );
}

    