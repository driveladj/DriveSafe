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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DeleteTraineeAlertProps {
    traineeId: string;
    traineeName: string;
    onTraineeDeleted: () => void;
}

export default function DeleteTraineeAlert({ traineeId, traineeName, onTraineeDeleted }: DeleteTraineeAlertProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const traineeRef = doc(db, 'users', traineeId);
            await deleteDoc(traineeRef);
            
            toast({ title: "تم الحذف!", description: `تم حذف المتدرب \"${traineeName}\" بنجاح.` });
            onTraineeDeleted(); // Callback to refresh the list
        } catch (error) {
            console.error("Error deleting trainee: ", error);
            toast({ title: "خطأ", description: "فشل حذف المتدرب.", variant: "destructive" });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                    <AlertDialogDescription>
                        هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المتدرب
                        <span className="font-bold"> {traineeName}</span> بشكل دائم من قاعدة البيانات.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} 
                        متابعة
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
