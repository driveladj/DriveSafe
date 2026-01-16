
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LicenseCategory } from '@/lib/data';

const formSchema = z.object({
  firstNameAr: z.string().min(2, 'الاسم الأول (بالعربية) مطلوب'),
  lastNameAr: z.string().min(2, 'اسم العائلة (بالعربية) مطلوب'),
  firstNameEn: z.string().min(2, 'الاسم الأول (باللاتينية) مطلوب'),
  lastNameEn: z.string().min(2, 'اسم العائلة (باللاتينية) مطلوب'),
  dateOfBirth: z.string({ required_error: "تاريخ الميلاد مطلوب." }).min(1, "تاريخ الميلاد مطلوب."),
  placeOfBirth: z.string({ required_error: "مكان الميلاد مطلوب." }).min(2, "مكان الميلاد مطلوب."),
  phone: z.string().min(10, 'رقم الهاتف إجباري ويستخدم لتسجيل الدخول'),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  licenseType: z.string({ required_error: 'نوع الرخصة إجباري' }),
});

type AddTraineeDialogProps = {
  onTraineeAdded: () => void;
};

export default function AddTraineeDialog({ onTraineeAdded }: AddTraineeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [licenseCategories, setLicenseCategories] = useState<LicenseCategory[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const categoriesCollection = query(collection(db, 'licenseCategories'), orderBy('name', 'asc'));
            const categorySnapshot = await getDocs(categoriesCollection);
            const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LicenseCategory));
            setLicenseCategories(categoryList);
        } catch (error) {
            console.error("Error fetching license categories:", error);
        }
    };

    if (open) {
        fetchCategories();
        form.reset({ firstNameAr: '', lastNameAr: '', firstNameEn: '', lastNameEn: '', dateOfBirth: '', placeOfBirth: '', phone: '', email: '', password: '', licenseType: undefined });
    }
  }, [open, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        const functions = getFunctions();
        const createTrainee = httpsCallable(functions, 'createTrainee');
        await createTrainee(values);
        toast({
            title: 'تم إنشاء الحساب',
            description: `يمكن للمتدرب الآن تسجيل الدخول باستخدام رقم هاتفه.`,
        });
        onTraineeAdded();
        setOpen(false);
    } catch (error: any) {
        console.error('Error adding new trainee: ', error);
        toast({ title: 'خطأ في الإنشاء', description: error.message || 'فشل إضافة المتدرب الجديد.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><PlusCircle className="w-4 h-4 mr-2" />إضافة متدرب جديد</Button></DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>إنشاء حساب متدرب جديد</DialogTitle>
          <DialogDescription>يتم استخدام رقم الهاتف وكلمة المرور لتسجيل الدخول.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="firstNameAr" render={({ field }) => (<FormItem><FormLabel>الاسم الأول (عربي)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="lastNameAr" render={({ field }) => (<FormItem><FormLabel>اسم العائلة (عربي)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="firstNameEn" render={({ field }) => (<FormItem><FormLabel>الاسم الأول (لاتيني)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="lastNameEn" render={({ field }) => (<FormItem><FormLabel>اسم العائلة (لاتيني)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
             <div className="grid grid-cols-2 gap-4">
               <FormField control={form.control} name="dateOfBirth" render={({ field }) => (<FormItem><FormLabel>تاريخ الميلاد</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
               <FormField control={form.control} name="placeOfBirth" render={({ field }) => (<FormItem><FormLabel>مكان الميلاد</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>رقم الهاتف (لتسجيل الدخول)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>كلمة المرور</FormLabel><FormControl><Input {...field} type="password" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>البريد الإلكتروني (اختياري)</FormLabel><FormControl><Input {...field} placeholder="اختياري" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="licenseType" render={({ field }) => (
              <FormItem><FormLabel>نوع الرخصة</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="اختر نوع الرخصة..." /></SelectTrigger></FormControl>
                  <SelectContent>
                    {licenseCategories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              <FormMessage />
              </FormItem>)}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> إنشاء... </> : 'إنشاء الحساب'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
