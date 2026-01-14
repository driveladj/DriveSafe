
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
import { Loader2, Edit, Smile, Users, HeartHandshake } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Testimonial } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  role: z.string().min(2, 'الدور مطلوب'),
  comment: z.string().min(10, 'الرأي مطلوب'),
  avatar: z.enum(['Smile', 'Users', 'HeartHandshake']),
});

type EditTestimonialDialogProps = {
  testimonial: Testimonial;
  onTestimonialUpdated: () => void;
};

export default function EditTestimonialDialog({ testimonial, onTestimonialUpdated }: EditTestimonialDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: testimonial.name,
      role: testimonial.role,
      comment: testimonial.comment,
      avatar: testimonial.avatar,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const testimonialRef = doc(db, 'testimonials', testimonial.id);

    try {
      await updateDoc(testimonialRef, values);

      toast({
        title: 'نجاح!',
        description: 'تم تحديث الرأي بنجاح.',
      });
      
      onTestimonialUpdated();
      setOpen(false);

    } catch (error) {
      console.error('Error updating testimonial: ', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث الرأي في قاعدة البيانات.',
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
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل رأي الطالب</DialogTitle>
          <DialogDescription>
            قم بتحديث تفاصيل الرأي.
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Textarea {...field} rows={4} />
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
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> حفظ...</> : 'حفظ التغييرات'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    