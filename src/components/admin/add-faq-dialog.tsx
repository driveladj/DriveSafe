
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

const formSchema = z.object({
  q: z.string().min(5, 'Question is required'),
  a: z.string().min(10, 'Answer is required'),
  order: z.coerce.number().min(0, 'Order must be a positive number'),
});

export default function AddFaqDialog({ onFaqAdded }: { onFaqAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: '',
      a: '',
      order: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const newFaqRef = doc(collection(db, 'faqs'));

    try {
      await setDoc(newFaqRef, {
        id: newFaqRef.id,
        ...values
      });

      toast({
        title: 'Success!',
        description: 'The new FAQ has been added successfully.',
      });
      
      form.reset();
      setOpen(false);
      onFaqAdded();

    } catch (error) {
      console.error('Error adding FAQ: ', error);
      toast({
        title: 'Error',
        description: 'Failed to add FAQ to the database.',
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
          سؤال جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة سؤال شائع جديد</DialogTitle>
          <DialogDescription>
            أدخل السؤال والجواب والترتيب.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="q"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السؤال</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ما هي متطلبات التسجيل؟" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="a"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الجواب</FormLabel>
                  <FormControl>
                    <Textarea placeholder="يجب أن يكون عمرك 18 عامًا أو أكثر..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الترتيب</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> حفظ...</> : 'حفظ السؤال'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
