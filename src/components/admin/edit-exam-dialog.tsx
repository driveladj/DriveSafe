'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Exam } from '@/app/admin/exams/page'; // Import the new interface

// Zod Schema for validation
const formSchema = z.object({
  name: z.string().min(3, { message: 'اسم الامتحان يجب أن يكون 3 أحرف على الأقل.' }),
  order: z.coerce.number().min(0, { message: 'الترتيب يجب أن يكون رقمًا موجبًا.' }),
});

// Component Props
interface EditExamDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  exam: Exam;
  onExamUpdated: () => void;
}

export default function EditExamDialog({ isOpen, setIsOpen, exam, onExamUpdated }: EditExamDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      order: 0,
    },
  });

  // When the dialog opens, reset the form with the current exam's data
  useEffect(() => {
    if (isOpen) {
      form.reset({ name: exam.name, order: exam.order });
    }
  }, [isOpen, exam, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const examRef = doc(db, 'exams', exam.id);

    try {
      await updateDoc(examRef, {
        name: values.name,
        order: values.order,
      });
      toast({ title: 'تم التحديث!', description: `تم تحديث الامتحان بنجاح.` });
      onExamUpdated();
    } catch (error) {
      console.error("Error updating exam: ", error);
      toast({
        title: 'خطأ',
        description: 'فشل تحديث الامتحان. الرجاء المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تعديل الامتحان</DialogTitle>
          <DialogDescription>
            أدخل الاسم والترتيب الجديدين للامتحان.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الامتحان</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الترتيب</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> حفظ التغييرات...</> : 'حفظ التغييرات'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
