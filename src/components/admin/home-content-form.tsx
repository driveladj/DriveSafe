
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { Car, Loader2, Truck } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ICONS, Icon } from '@/lib/icons.tsx';

const formSchema = z.object({
  siteName: z.string().min(3, 'Site name is required'),
  logoIcon: z.string().optional(),
  heroTitle: z.string().min(5, 'Title is required'),
  heroSubtitle: z.string().min(10, 'Subtitle is required'),
});

export default function HomeContentForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: '',
      logoIcon: 'Car',
      heroTitle: '',
      heroSubtitle: '',
    },
  });

  useEffect(() => {
    async function fetchContent() {
      setIsLoading(true);
      const docRef = doc(db, 'pages', 'home');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          form.reset(docSnap.data() as z.infer<typeof formSchema>);
        } else {
           form.reset({
              siteName: 'أكاديمية القيادة الآمنة',
              logoIcon: 'Car',
              heroTitle: 'قُد بثقة.',
              heroSubtitle: 'انضم إلى أكاديمية القيادة الآمنة للحصول على تعليمات من الخبراء، ومركبات حديثة، ونهج شخصي لمساعدتك على أن تصبح سائقًا آمنًا وواثقًا مدى الحياة.'
           });
        }
      } catch (error) {
        console.error('Error fetching home page content:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch content from the database.',
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
    const docRef = doc(db, 'pages', 'home');
    try {
      await setDoc(docRef, values, { merge: true });
      toast({
        title: 'Success!',
        description: 'Home page content has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content in the database.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="siteName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>اسم الموقع</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="logoIcon"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>أيقونة الشعار</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="اختر أيقونة" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.entries(ICONS).map(([name, iconData]) => (
                                    <SelectItem key={name} value={name}>
                                        <div className="flex items-center gap-2">
                                            <Icon name={name as keyof typeof ICONS} className="h-5 w-5" />
                                            <span>{iconData.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="heroTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العنوان الرئيسي (Hero Title)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heroSubtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>النص الفرعي (Hero Subtitle)</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
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
