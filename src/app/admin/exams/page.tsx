'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import AddExamDialog from '@/components/admin/add-exam-dialog';
import DeleteExamAlert from '@/components/admin/delete-exam-alert';
import EditExamDialog from '@/components/admin/edit-exam-dialog';

// Interface for Exam Type - NOW INCLUDES ORDER
export interface Exam {
    id: string;
    name: string;
    order: number;
    [key: string]: any; // To allow for other properties if any
}

export default function ExamsPage() {
    // Hooks
    const { toast } = useToast();

    // State
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [examToEdit, setExamToEdit] = useState<Exam | null>(null);


    // Data Fetching
    const fetchExams = async () => {
        setLoading(true);
        try {
            // UPDATED: query 'exams' collection and order by 'order'
            const examsQuery = query(collection(db, 'exams'), orderBy('order', 'asc'));
            const querySnapshot = await getDocs(examsQuery);
            const examsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
            setExams(examsList);
        } catch (error) {
            console.error("Error fetching exams:", error);
            toast({ title: "خطأ", description: "فشل تحميل بيانات الامتحانات.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    // Handlers
    const handleDeleteClick = (exam: Exam) => {
        setExamToDelete(exam);
        setIsDeleteDialogOpen(true);
    };
    
    const handleEditClick = (exam: Exam) => {
        setExamToEdit(exam);
        setIsEditDialogOpen(true);
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <Card className="m-4">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>إدارة مسار الامتحانات</CardTitle>
                        <CardDescription>إضافة وتعديل وحذف الامتحانات التسلسلية للمتدربين.</CardDescription>
                    </div>
                    <AddExamDialog onExamAdded={fetchExams} />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {/* ADDED: Order column */}
                                <TableHead className="w-[100px]">الترتيب</TableHead>
                                <TableHead>اسم الامتحان</TableHead>
                                <TableHead className="text-right">إجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* UPDATED: map over 'exams' */}
                            {exams.map((exam) => (
                                <TableRow key={exam.id}>
                                    {/* ADDED: Order cell */}
                                    <TableCell className="font-bold">{exam.order}</TableCell>
                                    <TableCell className="font-medium">{exam.name}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEditClick(exam)}>تعديل</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteClick(exam)} className="text-red-600">حذف</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {exams.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">لم يتم إضافة أي امتحانات بعد.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Delete Alert */}
            {examToDelete && (
                <DeleteExamAlert
                    isOpen={isDeleteDialogOpen}
                    setIsOpen={setIsDeleteDialogOpen}
                    examId={examToDelete.id}
                    examName={examToDelete.name}
                    onExamDeleted={() => {
                        fetchExams();
                        setExamToDelete(null);
                    }}
                />
            )}

            {/* Edit Dialog */}
            {examToEdit && (
                <EditExamDialog
                    isOpen={isEditDialogOpen}
                    setIsOpen={setIsEditDialogOpen}
                    exam={examToEdit}
                    onExamUpdated={() => {
                        fetchExams();
                        setExamToEdit(null);
                    }}
                />
            )}
        </>
    );
}
