'use client';

import { useState } from 'react';
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
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface DeleteExamAlertProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    examId: string;
    examName: string;
    onExamDeleted: () => void;
}

export default function DeleteExamAlert({ isOpen, setIsOpen, examId, examName, onExamDeleted }: DeleteExamAlertProps) {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, 'examTypes', examId));
            toast({ title: "تم الحذف", description: `تم حذف امتحان "${examName}" بنجاح.` });
            onExamDeleted();
        } catch (error) {
            console.error("Error deleting exam type: ", error);
            toast({ title: "خطأ", description: "فشل حذف الامتحان.", variant: "destructive" });
        } finally {
            setIsDeleting(false);
            setIsOpen(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                    <AlertDialogDescription>
                        هذا الإجراء سيحذف نوع الامتحان <span className="font-bold">{examName}</span> بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                         {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحذف...</> : 'نعم، احذف الامتحان'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
