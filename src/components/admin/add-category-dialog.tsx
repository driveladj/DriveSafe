
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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const formSchema = z.object({
  name: z.string().min(1, 'اسم الصنف مطلوب'),
  description: z.string().max(100, 'الوصف يجب أن يكون قصيرًا.').optional(),
});

type AddCategoryDialogProps = {
  onCategoryAdded: () => void;
};

export default function AddCategoryDialog({ onCategoryAdded }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', description: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'licenseCategories'), {
        name: values.name,
        description: values.description || '',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'تمت الإضافة!',
        description: `تمت إضافة صنف "${values.name}" بنجاح.`,
      });
      
      onCategoryAdded();
      form.reset();
      setOpen(false);

    } catch (error) {
      console.error('Error adding category: ', error);
      toast({
        title: 'خطأ',
        description: 'فشل إضافة الصنف الجديد.',
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
            إضافة صنف جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>إضافة صنف رخصة جديد</DialogTitle>
          <DialogDescription>
            أدخل اسم ووصف الصنف الجديد (مثال: الصنف ب، رخصة سياقة للسيارات).
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الصنف</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: الصنف ب" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف قصير (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="وصف موجز من 5 أو 6 كلمات..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحفظ...</> : 'حفظ الصنف'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

