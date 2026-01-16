
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Edit } from 'lucide-react';
import { collection, doc, updateDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course, LicenseCategory } from '@/lib/data';


const formSchema = z.object({
  name: z.string().min(3, 'اسم الدورة مطلوب'),
  description: z.string().optional(),
  details: z.string().optional(),
  categoryId: z.string({ required_error: 'يجب اختيار صنف الرخصة.' })
});

type EditCourseDialogProps = {
  course: Course;
  onCourseUpdated: () => void;
};

export default function EditCourseDialog({ course, onCourseUpdated }: EditCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<LicenseCategory[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: course.name,
      description: course.description || '',
      details: course.details || '',
      categoryId: course.categoryId,
    },
  });

 useEffect(() => {
    if (open) {
      const fetchCategories = async () => {
        try {
          const categoriesCollection = query(collection(db, 'licenseCategories'), orderBy('name', 'asc'));
          const categorySnapshot = await getDocs(categoriesCollection);
          const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LicenseCategory));
          setCategories(categoryList);
        } catch (error) {
          console.error("Error fetching categories: ", error);
          toast({ title: "خطأ", description: "فشل جلب قائمة الأصناف.", variant: "destructive" });
        }
      };
      fetchCategories();
      form.reset({
        name: course.name,
        description: course.description || '',
        details: course.details || '',
        categoryId: course.categoryId,
      });
    }
  }, [open, toast, form, course]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        const categoryRef = categories.find(c => c.id === values.categoryId);
        const courseRef = doc(db, 'courses', course.id);

        await updateDoc(courseRef, {
            name: values.name,
            description: values.description,
            details: values.details,
            categoryId: values.categoryId,
            categoryName: categoryRef?.name || 'غير محدد',
        });

      toast({
        title: 'تم التحديث!',
        description: `تم تحديث دورة "${values.name}" بنجاح.`,
      });
      
      onCourseUpdated();
      setOpen(false);

    } catch (error) {
      console.error('Error updating course: ', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحديث الدورة.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
            <Edit className="h-4 w-4" />
            <span className="sr-only">تعديل</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>تعديل دورة تدريبية</DialogTitle>
          <DialogDescription>
            قم بتحديث تفاصيل الدورة. سيتم حفظ التغييرات مباشرة.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>اسم الدورة</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField control={form.control} name="categoryId" render={({ field }) => (
                <FormItem><FormLabel>الفئة (صنف الرخصة)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="اختر الصنف الذي تتبعه هذه الدورة" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {categories.length === 0 && <p className='p-4 text-sm text-muted-foreground'>الرجاء إضافة أصناف الرخص أولاً.</p>}
                            {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                <FormMessage /></FormItem>
            )} />
            
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>الوصف</FormLabel>
                    <FormControl><Textarea placeholder="أدخل وصفًا موجزًا للدورة هنا..." {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>التفاصيل الإضافية</FormLabel>
                    <FormControl><Textarea placeholder="أدخل تفاصيل إضافية مثل عدد الساعات، متطلبات خاصة، إلخ..." {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <DialogFooter className='pt-4'>
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
