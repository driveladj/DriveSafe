
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
import { addCourse } from '@/lib/actions';

const formSchema = z.object({
  id: z.string().min(1, 'Course ID is required').regex(/^[a-z0-9-]+$/, 'ID can only contain lowercase letters, numbers, and hyphens.'),
  name: z.string().min(3, 'Course name is required'),
  description: z.string().min(10, 'Description is required'),
  details: z.string().min(10, 'Details are required'),
});

export default function AddCourseDialog({ onCourseAdded }: { onCourseAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      details: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const result = await addCourse(values);

    if (result.success) {
      toast({
        title: 'Success!',
        description: 'The new course has been added successfully.',
      });
      form.reset();
      setOpen(false);
      onCourseAdded(); // Refresh the course list
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          دورة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة دورة تدريبية جديدة</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل الدورة الجديدة. سيتم حفظها في قاعدة البيانات مباشرة.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>معرف الدورة (ID)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., b-license or moto-license" {...field} />
                  </FormControl>
                  <FormDescription>
                    معرف فريد بالإنجليزية (حروف صغيرة، أرقام، وشرطات فقط).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الدورة</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., رخصة الفئة ب" {...field} />
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
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea placeholder="وصف قصير للدورة..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>التفاصيل</FormLabel>
                  <FormControl>
                    <Textarea placeholder="تفاصيل إضافية مثل عدد الساعات..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> حفظ...</> : 'حفظ الدورة'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
