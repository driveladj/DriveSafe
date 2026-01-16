
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  facebookUrl: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
  workHoursWeek: z.string().min(1, 'ساعات عمل الأسبوع مطلوبة'),
  workHoursSat: z.string().min(1, 'ساعات عمل السبت مطلوبة'),
  workHoursSun: z.string().min(1, 'حالة يوم الأحد مطلوبة'),
});

export default function FooterContentForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    async function fetchContent() {
      setIsLoading(true);
      const docRef = doc(db, 'settings', 'footer');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          form.reset(docSnap.data() as z.infer<typeof formSchema>);
        } else {
          // Set default values if document doesn't exist
          form.reset({
            phone: '+1 (234) 567-890',
            email: 'contact@drivesafe.com',
            facebookUrl: '#',
            workHoursWeek: 'الاثنين - الجمعة: 9:00 صباحًا - 7:00 مساءً',
            workHoursSat: 'السبت: 10:00 صباحًا - 4:00 مساءً',
            workHoursSun: 'الأحد: مغلق',
          });
        }
      } catch (error) {
        console.error('Error fetching footer content:', error);
        toast({
          title: 'خطأ',
          description: 'فشل جلب محتوى التذييل من قاعدة البيانات.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const docRef = doc(db, 'settings', 'footer');
    try {
      await setDoc(docRef, values, { merge: true });
      toast({
        title: 'تم الحفظ بنجاح!',
        description: 'تم تحديث محتوى تذييل الصفحة بنجاح.',
      });
      form.reset(values, { keepIsDirty: false });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحديث المحتوى في قاعدة البيانات.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>معلومات الاتصال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="facebookUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>رابط صفحة فيسبوك</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>ساعات العمل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField control={form.control} name="workHoursWeek" render={({ field }) => (
                    <FormItem>
                        <FormLabel>أيام الأسبوع (الاثنين - الجمعة)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="workHoursSat" render={({ field }) => (
                    <FormItem>
                        <FormLabel>يوم السبت</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="workHoursSun" render={({ field }) => (
                    <FormItem>
                        <FormLabel>يوم الأحد</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحفظ...</>
          ) : (
            'حفظ التغييرات'
          )}
        </Button>
      </form>
    </Form>
  );
}
