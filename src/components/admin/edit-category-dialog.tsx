
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
import { Loader2, Edit } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LicenseCategory } from '@/lib/data';

const formSchema = z.object({
  name: z.string().min(1, 'اسم الصنف مطلوب'),
  description: z.string().max(100, 'الوصف يجب أن يكون قصيرًا.').optional(),
});

type EditCategoryDialogProps = {
  category: LicenseCategory;
  onCategoryUpdated: () => void;
};

export default function EditCategoryDialog({ category, onCategoryUpdated }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      name: category.name,
      description: category.description || ''
     },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const categoryRef = doc(db, 'licenseCategories', category.id);

    try {
      await updateDoc(categoryRef, { 
        name: values.name,
        description: values.description || ''
      });

      toast({
        title: 'تم التحديث!',
        description: 'تم تحديث اسم ووصف الصنف بنجاح.',
      });
      
      onCategoryUpdated();
      setOpen(false);

    } catch (error) {
      console.error('Error updating category: ', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحديث الصنف.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
            <span className="sr-only">تعديل</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>تعديل صنف الرخصة</DialogTitle>
          <DialogDescription>
            قم بتحديث اسم ووصف الصنف: <span className="font-bold">{category.name}</span>
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
                    <Input {...field} />
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
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> حفظ...</> : 'حفظ التغييرات'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

