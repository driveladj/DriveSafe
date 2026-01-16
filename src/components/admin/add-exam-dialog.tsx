'use client';

import { useState } from 'react';
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
  DialogTrigger,
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
import { Loader2, PlusCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Zod Schema for validation
const formSchema = z.object({
  name: z.string().min(3, { message: 'اسم الامتحان يجب أن يكون 3 أحرف على الأقل.' }),
  order: z.coerce.number().min(0, { message: 'الترتيب يجب أن يكون رقمًا موجبًا.' }),
});

// Component Props
interface AddExamDialogProps {
  onExamAdded: () => void;
}

export default function AddExamDialog({ onExamAdded }: AddExamDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      order: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'exams'), {
        name: values.name,
        order: values.order,
      });
      toast({ title: 'تمت الإضافة!', description: `تمت إضافة امتحان "${values.name}" بنجاح.` });
      form.reset();
      setOpen(false);
      onExamAdded(); // Callback to refresh the parent component's data
    } catch (error) {
      console.error("Error adding exam: ", error);
      toast({
        title: 'خطأ',
        description: 'فشل إضافة الامتحان. الرجاء المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة امتحان جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة امتحان جديد للمسار التعليمي</DialogTitle>
          <DialogDescription>
            أدخل اسمًا وترتيبًا للامتحان. سيظهر هذا في مسار تقدم الطالب.
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
                    <Input placeholder="مثال: امتحان الكود النظري" {...field} />
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
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحفظ...</> : 'حفظ الامتحان'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
