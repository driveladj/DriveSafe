'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interfaces
interface LicenseCategory { id: string; name: string; }
interface Exam { id: string; name: string; order: number; }
interface Trainee {
    uid: string;
    firstNameAr: string;
    lastNameAr: string;
    firstNameEn: string;
    lastNameEn: string;
    phone: string;
    email?: string;
    licenseType: string;
    examType?: string;
    status?: 'مؤكد' | 'في الانتظار' | 'مكتمل' | 'ملغي';
    totalAmount?: number;
    paidAmount?: number;
}

// Zod Schema for validation
const formSchema = z.object({
  firstNameAr: z.string().min(2, 'الاسم الأول (بالعربية) مطلوب'),
  lastNameAr: z.string().min(2, 'اسم العائلة (بالعربية) مطلوب'),
  firstNameEn: z.string().min(2, 'الاسم الأول (باللاتينية) مطلوب'),
  lastNameEn: z.string().min(2, 'اسم العائلة (باللاتينية) مطلوب'),
  licenseType: z.string().min(1, "نوع الرخصة مطلوب"),
  status: z.enum(['في الانتظار', 'مؤكد', 'مكتمل', 'ملغي']).default('في الانتظار'),
  examType: z.string().optional(),
  totalAmount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: 'يجب أن يكون رقماً' }).positive('يجب أن يكون المبلغ أكبر من صفر').optional()
  ),
  paidAmount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: 'يجب أن يكون رقماً' }).min(0, 'لا يمكن أن يكون المبلغ المدفوع سالبًا').optional()
  ),
}).refine(data => (data.paidAmount ?? 0) <= (data.totalAmount ?? 0), {
    message: "المبلغ المدفوع لا يمكن أن يكون أكبر من المبلغ الإجمالي",
    path: ["paidAmount"],
});


// Component Props
type EditTraineeFormProps = {
  trainee: Trainee;
  licenseCategories: LicenseCategory[];
  exams: Exam[];
  onFormSubmit: () => void;
  onCancel: () => void;
};

export default function EditTraineeForm({ trainee, licenseCategories, exams, onFormSubmit, onCancel }: EditTraineeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        firstNameAr: '',
        lastNameAr: '',
        firstNameEn: '',
        lastNameEn: '',
        licenseType: '',
        status: 'في الانتظار',
        examType: 'NONE',
        totalAmount: 0,
        paidAmount: 0,
    },
  });

  useEffect(() => {
    if (trainee) {
      form.reset({
        firstNameAr: trainee.firstNameAr || '',
        lastNameAr: trainee.lastNameAr || '',
        firstNameEn: trainee.firstNameEn || '',
        lastNameEn: trainee.lastNameEn || '',
        licenseType: trainee.licenseType || '',
        status: trainee.status || 'في الانتظار',
        examType: trainee.examType || 'NONE',
        totalAmount: trainee.totalAmount || 0,
        paidAmount: trainee.paidAmount || 0,
      });
    }
  }, [trainee, form.reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const traineeRef = doc(db, 'users', trainee.uid);
    
    const submissionData: { [key: string]: any } = { 
        ...values,
        totalAmount: values.totalAmount || 0,
        paidAmount: values.paidAmount || 0,
     };

    if (submissionData.examType === 'NONE') {
      submissionData.examType = '';
    }

    try {
        await updateDoc(traineeRef, submissionData);
        toast({ title: 'تم التحديث!', description: 'تم تحديث بيانات المتدرب بنجاح.' });
        onFormSubmit();
    } catch (error) {
        console.error('Error updating trainee: ', error);
        toast({ title: 'خطأ', description: 'فشل تحديث بيانات المتدرب.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  }

  const totalAmount = form.watch("totalAmount") || 0;
  const paidAmount = form.watch("paidAmount") || 0;
  const remainingAmount = totalAmount - paidAmount;

  return (
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
        
        <FormItem>
            <FormLabel>رقم الهاتف (لتسجيل الدخول)</FormLabel>
            <FormControl><Input value={trainee.phone} readOnly disabled /></FormControl>
        </FormItem>
        <FormItem>
            <FormLabel>البريد الإلكتروني</FormLabel>
            <FormControl><Input value={trainee.email || 'لم يحدد'} readOnly disabled /></FormControl>
        </FormItem>

        <FormField control={form.control} name="licenseType" render={({ field }) => (
            <FormItem><FormLabel>نوع الرخصة</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="اختر نوع الرخصة..." /></SelectTrigger></FormControl>
                    <SelectContent>{licenseCategories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}</SelectContent>
                </Select>
            <FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="examType" render={({ field }) => (
            <FormItem><FormLabel>نوع الامتحان</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="اختر نوع الامتحان..." /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="NONE"><em>لا يوجد</em></SelectItem>
                        {exams.map(exam => <SelectItem key={exam.id} value={exam.name}>{exam.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            <FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem><FormLabel>الحالة</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="اختر حالة" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="في الانتظار">في الانتظار</SelectItem>
                        <SelectItem value="مؤكد">مؤكد</SelectItem>
                        <SelectItem value="مكتمل">مكتمل</SelectItem>
                        <SelectItem value="ملغي">ملغي</SelectItem>
                    </SelectContent>
                </Select>
            <FormMessage /></FormItem>
        )} />

        <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
            <FormField control={form.control} name="totalAmount" render={({ field }) => (
                <FormItem><FormLabel>المبلغ الإجمالي (د.ج)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="paidAmount" render={({ field }) => (
                <FormItem><FormLabel>المبلغ المدفوع (د.ج)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
         <div className="p-3 bg-muted/50 rounded-md text-center">
            <p className="text-sm font-medium">المبلغ المتبقي: <span className="font-bold text-lg">{remainingAmount.toFixed(2)}</span> د.ج</p>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> حفظ... </> : 'حفظ التغييرات'}</Button>
        </div>
      </form>
    </Form>
  );
}
