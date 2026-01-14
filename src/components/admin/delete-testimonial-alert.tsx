
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

export default function DeleteTestimonialAlert({
  testimonialId,
  onTestimonialDeleted,
}: {
  testimonialId: string;
  onTestimonialDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);

    const testimonialRef = doc(db, 'testimonials', testimonialId);
    
    try {
      await deleteDoc(testimonialRef);
      toast({
        title: 'تم الحذف!',
        description: 'تم حذف الرأي بنجاح.',
      });
      setOpen(false);
      onTestimonialDeleted();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الرأي من قاعدة البيانات.',
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
            سيتم حذف هذا الرأي بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
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

    