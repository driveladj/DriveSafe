
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
import { Loader2, PlusCircle, Smile, Users, HeartHandshake } from 'lucide-react';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  role: z.string().min(2, 'الدور مطلوب'),
  comment: z.string().min(10, 'الرأي مطلوب'),
  avatar: z.enum(['Smile', 'Users', 'HeartHandshake']),
});

export default function AddTestimonialDialog({ onTestimonialAdded }: { onTestimonialAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
      comment: '',
      avatar: 'Smile',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const newTestimonialRef = doc(collection(db, 'testimonials'));

    try {
      await setDoc(newTestimonialRef, {
        id: newTestimonialRef.id,
        ...values
      });

      toast({
        title: 'نجاح!',
        description: 'تمت إضافة الرأي الجديد بنجاح.',
      });
      
      form.reset();
      setOpen(false);
      onTestimonialAdded();

    } catch (error) {
      console.error('Error adding testimonial: ', error);
      toast({
        title: 'خطأ',
        description: 'فشل في إضافة الرأي إلى قاعدة البيانات.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  const avatarOptions = [
    { value: 'Smile', label: 'طالب سعيد', icon: <Smile className="w-4 h-4" /> },
    { value: 'Users', label: 'مستخدم عام', icon: <Users className="w-4 h-4" /> },
    { value: 'HeartHandshake', label: 'شراكة', icon: <HeartHandshake className="w-4 h-4" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          رأي جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة رأي طالب جديد</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل الرأي الجديد.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الطالب</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: أحمد علي" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>دور الطالب</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: سائق جديد" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الرأي</FormLabel>
                  <FormControl>
                    <Textarea placeholder="أدخل رأي الطالب هنا..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>أيقونة</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="اختر أيقونة" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {avatarOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                            {option.icon}
                                            <span>{option.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> حفظ...</> : 'حفظ الرأي'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    