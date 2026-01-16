
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

interface DeleteCategoryAlertProps {
    categoryId: string;
    categoryName: string;
    onCategoryDeleted: () => void;
}

export default function DeleteCategoryAlert({ categoryId, categoryName, onCategoryDeleted }: DeleteCategoryAlertProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const categoryRef = doc(db, 'licenseCategories', categoryId);
            await deleteDoc(categoryRef);
            
            toast({ title: "تم الحذف!", description: `تم حذف صنف \"${categoryName}\" بنجاح.` });
            onCategoryDeleted();
        } catch (error) {
            console.error("Error deleting category: ", error);
            toast({ title: "خطأ", description: "فشل حذف الصنف.", variant: "destructive" });
        } finally {
            // No need to set isDeleting to false if the component unmounts
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">حذف</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                    <AlertDialogDescription>
                        هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف صنف <span className="font-bold">{categoryName}</span> بشكل دائم.
                         قد يؤثر هذا على الدورات والطلاب المرتبطين بهذا الصنف.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} 
                        نعم، قم بالحذف
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
