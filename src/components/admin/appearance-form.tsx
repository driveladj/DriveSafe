
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const hslColorString = z.string().regex(/^\d{1,3}\s+\d{1,3}%\s+\d{1,3}%$/, {
  message: "يجب أن يكون اللون بتنسيق HSL، مثال: '210 40% 98%'",
});

const formSchema = z.object({
  fontHeadline: z.string().optional(),
  fontBody: z.string().optional(),
  background: hslColorString.optional().or(z.literal('')),
  foreground: hslColorString.optional().or(z.literal('')),
  primary: hslColorString.optional().or(z.literal('')),
  primaryForeground: hslColorString.optional().or(z.literal('')),
  secondary: hslColorString.optional().or(z.literal('')),
  secondaryForeground: hslColorString.optional().or(z.literal('')),
  accent: hslColorString.optional().or(z.literal('')),
  accentForeground: hslColorString.optional().or(z.literal('')),
  card: hslColorString.optional().or(z.literal('')),
  cardForeground: hslColorString.optional().or(z.literal('')),
  border: hslColorString.optional().or(z.literal('')),
  ring: hslColorString.optional().or(z.literal('')),
});

const colorFields: { name: keyof z.infer<typeof formSchema>, label: string, description: string }[] = [
    { name: 'background', label: 'الخلفية', description: 'اللون الأساسي لخلفية الموقع.' },
    { name: 'foreground', label: 'النص الأساسي', description: 'لون النص العام على الخلفية الأساسية.' },
    { name: 'primary', label: 'الأساسي', description: 'لون العناصر الرئيسية كالأزرار والروابط المهمة.' },
    { name: 'primaryForeground', label: 'نص الأساسي', description: 'لون النص فوق العناصر ذات اللون الأساسي.' },
    { name: 'secondary', label: 'الثانوي', description: 'لون الخلفيات البديلة مثل ترويسة الصفحة.' },
    { name: 'secondaryForeground', label: 'نص الثانوي', description: 'لون النص فوق العناصر ذات اللون الثانوي.' },
    { name: 'accent', label: 'المميز', description: 'لون العناصر التي تود إبرازها (مثل أزرار الحث على اتخاذ إجراء).' },
    { name: 'accentForeground', label: 'نص المميز', description: 'لون النص فوق العناصر ذات اللون المميز.' },
    { name: 'card', label: 'البطاقات', description: 'لون خلفية البطاقات والحاويات.' },
    { name: 'cardForeground', label: 'نص البطاقات', description: 'لون النص داخل البطاقات.' },
    { name: 'border', label: 'الحواف', description: 'لون الحواف والخطوط الفاصلة.' },
    { name: 'ring', label: 'حلقة التركيز', description: 'اللون الذي يظهر عند التركيز على حقل إدخال أو زر.' },
];

const availableFonts = [
    { value: 'Cairo', label: 'Cairo (العناوين الافتراضي)' },
    { value: 'Tajawal', label: 'Tajawal (النصوص الافتراضي)' },
    { value: 'Almarai', label: 'Almarai' },
    { value: 'Readex Pro', label: 'Readex Pro' },
];

export default function AppearanceForm() {
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
      const docRef = doc(db, 'settings', 'appearance');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          form.reset(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching appearance settings:', error);
        toast({
          title: 'خطأ',
          description: 'فشل جلب إعدادات المظهر من قاعدة البيانات.',
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
    const docRef = doc(db, 'settings', 'appearance');
    try {
      // Filter out empty strings before saving
      const dataToSave = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== '' && v != null)
      );

      await setDoc(docRef, dataToSave, { merge: true });
      toast({
        title: 'تم الحفظ بنجاح!',
        description: 'تم تحديث مظهر الموقع. قد تحتاج إلى تحديث الصفحة لرؤية التغييرات.',
      });
      form.reset(values, { keepIsDirty: false });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحديث المظهر في قاعدة البيانات.',
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
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>الخطوط</CardTitle>
                <CardDescription>اختر الخطوط المستخدمة في العناوين والنصوص الأساسية للموقع.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="fontHeadline" render={({ field }) => (
                    <FormItem>
                        <FormLabel>خط العناوين</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="اختر خطًا للعناوين" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableFonts.map(font => <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="fontBody" render={({ field }) => (
                    <FormItem>
                        <FormLabel>خط النصوص</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="اختر خطًا للنصوص" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableFonts.map(font => <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>لوحة الألوان</CardTitle>
                <CardDescription>
                    أدخل قيم HSL لكل لون. اترك الحقل فارغًا لاستخدام القيمة الافتراضية.
                    <br />
                    التنسيق المطلوب: Hue Saturation% Lightness% (مثال: 210 40% 98%).
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                 {colorFields.map(({ name, label, description }) => (
                    <FormField key={name} control={form.control} name={name}>
                        {({ field }) => (
                        <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Input placeholder="مثال: 210 31% 28%" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <div className="w-8 h-8 flex-shrink-0 rounded-md border" style={{ backgroundColor: `hsl(${field.value})` }} />
                            </div>
                            <p className="text-xs text-muted-foreground">{description}</p>
                            <FormMessage />
                        </FormItem>
                        )}
                    </FormField>
                 ))}
            </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحفظ...</> : 'حفظ التغييرات'}
        </Button>
      </form>
    </Form>
  );
}
