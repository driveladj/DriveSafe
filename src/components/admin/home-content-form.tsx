
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
import { Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
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
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
