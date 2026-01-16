
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search, MoreHorizontal, Printer, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/hooks/use-auth.tsx';
import { useRouter } from 'next/navigation';
import { collection, getDocs, orderBy, query, Timestamp, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import AddTraineeDialog from '@/components/admin/add-trainee-dialog';
import EditTraineeForm from '@/components/admin/edit-trainee-form';
import PrintHeaderDialog from '@/components/admin/print-header-dialog';
import { Input } from '@/components/ui/input';

// Interfaces & Types
interface LicenseCategory { id: string; name: string; }
interface Exam { id: string; name: string; order: number; }
interface Trainee {
    uid: string; firstNameAr: string; lastNameAr: string; firstNameEn: string;
    lastNameEn: string; phone: string; email?: string; licenseType: string;
    examType?: string; createdAt: Timestamp; status?: 'مؤكد' | 'في الانتظار' | 'مكتمل' | 'ملغي';
    totalAmount?: number;
    paidAmount?: number;
}
type PrintHeaderData = string[][];

export default function TraineesPage() {
    const { user, loading: authLoading, userDetails } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [allTrainees, setAllTrainees] = useState<Trainee[]>([]);
    const [licenseCategories, setLicenseCategories] = useState<LicenseCategory[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [licenseFilter, setLicenseFilter] = useState('all');
    const [examFilter, setExamFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [traineeToDelete, setTraineeToDelete] = useState<Trainee | null>(null);
    const [isPrintHeaderDialogOpen, setIsPrintHeaderDialogOpen] = useState(false);
    const [printHeader, setPrintHeader] = useState<PrintHeaderData | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        if (isPrinting) {
            setTimeout(() => {
                window.print();
                setIsPrinting(false);
            }, 0);
        }
    }, [isPrinting]);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const [traineesSnap, categoriesSnap, examsSnap] = await Promise.all([
                getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'))),
                getDocs(query(collection(db, 'licenseCategories'), orderBy('name', 'asc'))),
                getDocs(query(collection(db, 'exams'), orderBy('order', 'asc')))
            ]);
            setAllTrainees(traineesSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Trainee)));
            setLicenseCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as LicenseCategory)));
            setExams(examsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam)));
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({ title: "خطأ", description: "فشل تحميل البيانات.", variant: "destructive" });
        } finally { setLoadingData(false); }
    };

    useEffect(() => {
        if (!authLoading && user && userDetails?.role === 'admin') { fetchData(); }
        else if (!authLoading && (!user || userDetails?.role !== 'admin')) { router.push('/login'); }
    }, [user, authLoading, userDetails, router]);

    const clearFilters = () => {
        setSearchTerm(''); setLicenseFilter('all'); setExamFilter('all');
        setStatusFilter('all'); setStartDate(''); setEndDate('');
    };
    
    const handleSaveHeaderAndPrint = (headerData: PrintHeaderData) => {
        setPrintHeader(headerData);
        setIsPrintHeaderDialogOpen(false); 
        toast({ title: 'تم الحفظ', description: 'سيتم تجهيز القائمة للطباعة...' });
        setIsPrinting(true); 
    }

    const handleEditClick = (trainee: Trainee) => { setSelectedTrainee(trainee); setIsEditDialogOpen(true); };
    const handleDeleteClick = (trainee: Trainee) => { setTraineeToDelete(trainee); setIsDeleteDialogOpen(true); }
    const handleDeleteConfirm = async () => {
        if (!traineeToDelete) return;
        try {
            await deleteDoc(doc(db, 'users', traineeToDelete.uid));
            toast({ title: "تم الحذف", description: `تم حذف سجل المتدرب بنجاح.` });
            fetchData();
        } catch (error) { toast({ title: "خطأ", description: "فشل حذف السجل.", variant: "destructive" }); }
        setIsDeleteDialogOpen(false);
    };
    const handleFormSubmit = () => { setIsEditDialogOpen(false); fetchData(); }
    const formatDate = (timestamp?: Timestamp) => timestamp ? timestamp.toDate().toLocaleDateString('ar-DZ') : 'غير معروف';

    const generatePrintTitle = () => {
        let filters = [];
        if (licenseFilter !== 'all') filters.push(`الرخصة: ${licenseFilter}`);
        if (examFilter !== 'all') {
            const examName = examFilter === '__NONE__' ? 'لم يحدد' : exams.find(e => e.name === examFilter)?.name || examFilter;
            filters.push(`الامتحان: ${examName}`);
        }
        if (statusFilter !== 'all') filters.push(`الحالة: ${statusFilter}`);
        if (startDate && endDate) filters.push(`للفترة من ${startDate} إلى ${endDate}`);
        else if (startDate) filters.push(`بعد تاريخ ${startDate}`);
        else if (endDate) filters.push(`قبل تاريخ ${endDate}`);
        if (filters.length > 0) return `قائمة المتدربين (${filters.join(', ')})`;
        return "القائمة الإجمالية للمتدربين";
    };

    const filteredTrainees = allTrainees.filter(trainee => {
        const search = searchTerm.toLowerCase();
        const traineeDate = trainee.createdAt.toDate();
        const nameMatch = `${trainee.firstNameAr} ${trainee.lastNameAr}`.toLowerCase().includes(search);
        const phoneMatch = trainee.phone?.toLowerCase().includes(search);
        if ((search && !nameMatch && !phoneMatch) ||
            (licenseFilter !== 'all' && trainee.licenseType !== licenseFilter) ||
            (statusFilter !== 'all' && trainee.status !== statusFilter) ||
            (startDate && traineeDate < new Date(startDate)) ||
            (endDate && traineeDate > new Date(new Date(endDate).setHours(23, 59, 59, 999)))) { return false; }
        if (examFilter !== 'all') {
            const traineeHasExam = trainee.examType && trainee.examType.length > 0;
            if (examFilter === '__NONE__' && traineeHasExam) return false;
            if (examFilter !== '__NONE__' && (!traineeHasExam || trainee.examType !== examFilter)) return false;
        }
        return true;
    });

    if (authLoading || loadingData) {
        return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <style>{`
                @media screen {
                  .print-container {
                      display: none;
                  }
                }
                @media print {
                    body {
                        visibility: hidden;
                    }
                    .print-container, .print-container * {
                        visibility: visible;
                    }
                    .print-container {
                        display: block;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                     @page {
                        size: A4 portrait;
                        margin: 15mm;
                    }
                    .print-header table {
                        width: 100%;
                        border-collapse: collapse;
                        text-align: center;
                        margin-bottom: 1.5rem;
                        direction: rtl;
                    }
                    .print-header td { padding: 4px 8px; font-size: 0.9rem; }
                    .print-header-title {
                        font-size: 1.1rem;
                        font-weight: bold;
                        text-align: center;
                        text-decoration: underline;
                        margin-bottom: 1rem;
                    }
                    .print-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 0.85rem;
                    }
                    .print-table th, .print-table td {
                        border: 1px solid #666;
                        padding: 6px;
                        text-align: right;
                    }
                    .print-table th { background-color: #f2f2f2; }
                    .print-signature {
                        margin-top: 40px;      
                        text-align: left;    
                        font-size: 1rem;
                        font-weight: bold;
                    }
                }
            `}</style>

            <div className="print-container">
                    {printHeader && (
                        <div className="print-header">
                            <table><tbody>
                                {printHeader.map((row, r_idx) => (
                                    <tr key={r_idx}>{row.map((cell, c_idx) => <td key={c_idx}>{cell}</td>)}</tr>
                                ))}
                            </tbody></table>
                        </div>
                    )}
                    <h2 className="print-header-title">{generatePrintTitle()}</h2>
                    <table className="print-table">
                        <thead><tr>
                            <th>الاسم الكامل</th><th>رقم الهاتف</th><th>نوع الرخصة</th><th>الامتحان</th><th>تاريخ التسجيل</th><th>الحالة</th>
                        </tr></thead>
                        <tbody>
                            {filteredTrainees.map((trainee) => (
                                <tr key={trainee.uid}>
                                    <td>{trainee.firstNameAr} {trainee.lastNameAr}</td>
                                    <td>{trainee.phone}</td>
                                    <td>{trainee.licenseType || 'لم يحدد'}</td>
                                    <td>{trainee.examType || 'لم يحدد'}</td>
                                    <td>{formatDate(trainee.createdAt)}</td>
                                    <td>{trainee.status}</td>
                                </tr>
                            ))}
                            {filteredTrainees.length === 0 && (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>لا توجد نتائج.</td></tr>
                            )}
                        </tbody>
                    </table>
                <div className="print-signature">
                    إمضاء المسؤول
                </div>
            </div>

            <div className="screen-only-content">
              <Card className="m-4">
                  <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                          <CardTitle>إدارة المتدربين</CardTitle>
                          <CardDescription>عرض، فلترة، وطباعة قوائم المتدربين.</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                          <AddTraineeDialog onTraineeAdded={fetchData} />
                          <Button variant="outline" onClick={() => setIsPrintHeaderDialogOpen(true)}>
                              <Printer className="ml-2 h-4 w-4" />
                              طباعة القائمة
                          </Button>
                      </div>
                  </CardHeader>
                  <CardContent>
                      <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Select value={licenseFilter} onValueChange={setLicenseFilter}><SelectTrigger><SelectValue placeholder="فلترة حسب الرخصة" /></SelectTrigger><SelectContent><SelectItem value="all">كل الرخص</SelectItem>{licenseCategories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}</SelectContent></Select>
                              <Select value={examFilter} onValueChange={setExamFilter}><SelectTrigger><SelectValue placeholder="فلترة حسب الامتحان" /></SelectTrigger><SelectContent><SelectItem value="all">كل الامتحانات</SelectItem>{exams.map(exam => <SelectItem key={exam.id} value={exam.name}>{exam.name}</SelectItem>)}<SelectItem value="__NONE__">لم يحدد</SelectItem></SelectContent></Select>
                              <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue placeholder="فلترة حسب الحالة" /></SelectTrigger><SelectContent><SelectItem value="all">كل الحالات</SelectItem><SelectItem value="في الانتظار">في الانتظار</SelectItem><SelectItem value="مؤكد">مؤكد</SelectItem><SelectItem value="مكتمل">مكتمل</SelectItem><SelectItem value="ملغي">ملغي</SelectItem></SelectContent></Select>
                              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="ابحث بالاسم أو الهاتف..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-4">
                              <div className='flex items-center gap-2'><label className='text-sm'>من:</label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-auto" /></div>
                              <div className='flex items-center gap-2'><label className='text-sm'>إلى:</label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-auto" /></div>
                              <Button variant="ghost" onClick={clearFilters}>مسح التصفية</Button>
                          </div>
                      </div>
                      <Table>
                          <TableHeader><TableRow><TableHead>الاسم الكامل</TableHead><TableHead>رقم الهاتف</TableHead><TableHead>نوع الرخصة</TableHead><TableHead>الامتحان</TableHead><TableHead>تاريخ التسجيل</TableHead><TableHead>الحالة</TableHead><TableHead><span className="sr-only">إجراءات</span></TableHead></TableRow></TableHeader>
                          <TableBody>
                              {filteredTrainees.map((trainee) => (
                                  <TableRow key={trainee.uid}>
                                      <TableCell className="font-medium">{trainee.firstNameAr} {trainee.lastNameAr}</TableCell>
                                      <TableCell>{trainee.phone}</TableCell>
                                      <TableCell>{trainee.licenseType || 'لم يحدد'}</TableCell>
                                      <TableCell>{trainee.examType || 'لم يحدد'}</TableCell>
                                      <TableCell>{formatDate(trainee.createdAt)}</TableCell>
                                      <TableCell><Badge variant={trainee.status === 'مؤكد' ? 'default' : 'outline'}>{trainee.status}</Badge></TableCell>
                                      <TableCell className="text-right">
                                          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                  <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                                                  <DropdownMenuItem onClick={() => router.push(`/admin/trainees/${trainee.uid}`)}><FileText className="ml-2 h-4 w-4"/>عرض التفاصيل</DropdownMenuItem>
                                                  <DropdownMenuItem onClick={() => handleEditClick(trainee)}>تعديل</DropdownMenuItem>
                                                  <DropdownMenuItem onClick={() => handleDeleteClick(trainee)} className="text-red-600">حذف</DropdownMenuItem>
                                              </DropdownMenuContent>
                                          </DropdownMenu>
                                      </TableCell>
                                  </TableRow>
                              ))}
                              {filteredTrainees.length === 0 && (<TableRow><TableCell colSpan={7} className="h-24 text-center">لا توجد نتائج تطابق معايير البحث.</TableCell></TableRow>)}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>

              <PrintHeaderDialog 
                  open={isPrintHeaderDialogOpen} 
                  onOpenChange={setIsPrintHeaderDialogOpen} 
                  onSave={handleSaveHeaderAndPrint}
              />
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}><DialogContent><DialogHeader><DialogTitle>تعديل بيانات المتدرب</DialogTitle><DialogDescription>أجرِ التغييرات اللازمة واحفظها.</DialogDescription></DialogHeader>{selectedTrainee && <EditTraineeForm trainee={selectedTrainee} licenseCategories={licenseCategories} exams={exams} onFormSubmit={handleFormSubmit} onCancel={() => setIsEditDialogOpen(false)} />}</DialogContent></Dialog>
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle><AlertDialogDescription>هذا الإجراء سيحذف سجل بيانات المتدرب بشكل دائم.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
            </div>
        </>
    );
