
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Switch } from '../ui/switch';

const formSchema = z.object({
  name: z.string().min(3, 'اسم الخطة مطلوب'),
  price: z.coerce.number().min(0, 'السعر مطلوب'),
  licenseType: z.string().min(2, 'نوع الرخصة مطلوب'),
  features: z.string().min(10, 'الميزات مطلوبة'),
  bestDeal: z.boolean().default(false),
});

export default function AddPriceDialog({ onPriceAdded }: { onPriceAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 0,
      licenseType: '',
      features: '',
      bestDeal: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const newPriceRef = doc(collection(db, 'pricingTiers'));

    try {
      const featuresArray = values.features.split('\n').map(f => f.trim()).filter(f => f);
      await setDoc(newPriceRef, {
        id: newPriceRef.id,
        ...values,
        features: featuresArray,
      });

      toast({
        title: 'نجاح!',
        description: 'تمت إضافة خطة الأسعار الجديدة بنجاح.',
      });
      
      form.reset();
      setOpen(false);
      onPriceAdded();

    } catch (error) {
      console.error('Error adding price tier: ', error);
      toast({
        title: 'خطأ',
        description: 'فشل إضافة الخطة إلى قاعدة البيانات.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          خطة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة خطة أسعار جديدة</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل الخطة الجديدة.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الخطة</FormLabel>
                  <FormControl>
                    <Input placeholder="الباقة الأساسية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="450" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="licenseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع الرخصة</FormLabel>
                  <FormControl>
                    <Input placeholder="الفئة ب" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الميزات</FormLabel>
                  <FormControl>
                    <Textarea placeholder="اكتب كل ميزة في سطر منفصل..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bestDeal"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>أفضل قيمة</FormLabel>
                    <FormDescription>
                      هل هذه هي الخطة التي توصي بها؟
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> حفظ...</> : 'حفظ الخطة'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    