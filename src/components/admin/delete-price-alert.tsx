
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DeletePriceAlert({
  priceId,
  onPriceDeleted,
}: {
  priceId: string;
  onPriceDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);

    if (!priceId) {
      toast({
        title: 'خطأ',
        description: 'Price ID is missing.',
        variant: 'destructive',
      });
      setIsDeleting(false);
      return;
    }

    const priceRef = doc(db, 'pricingTiers', priceId);
    
    try {
      await deleteDoc(priceRef);
      toast({
        title: 'تم الحذف!',
        description: 'تم حذف خطة الأسعار بنجاح.',
      });
      setOpen(false);
      onPriceDeleted();
    } catch (error) {
      console.error('Error deleting price tier:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حذف الخطة من قاعدة البيانات.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم حذف خطة الأسعار هذه بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحذف...</> : 'نعم، قم بالحذف'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

    