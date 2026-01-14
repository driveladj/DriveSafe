
'use client';

import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit } from 'lucide-react';
import { doc, updateDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Trainee {
    uid: string;
    firstName: string;
    lastName: string;
    phone: string;
    licenseType: string;
    createdAt: Timestamp;
    status?: 'مؤكد' | 'في الانتظار' | 'مكتمل' | 'ملغي';
}

const formSchema = z.object({
  firstName: z.string().min(2, 'الاسم الأول مطلوب'),
  lastName: z.string().min(2, 'اسم العائلة مطلوب'),
  licenseType: z.string().optional(),
  status: z.enum(['في الانتظار', 'مؤكد', 'مكتمل', 'ملغي']),
});

type EditTraineeDialogProps = {
  trainee: Trainee;
  onTraineeUpdated: () => void;
};

export default function EditTraineeDialog({ trainee, onTraineeUpdated }: EditTraineeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: trainee.firstName,
      lastName: trainee.lastName,
      licenseType: trainee.licenseType || 'لم يحدد',
      status: trainee.status || 'في الانتظار',
    },
  });
  
  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const courseSnapshot = await getDocs(coursesCollection);
      const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      setCourses(courseList);
    };

    fetchCourses();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const traineeRef = doc(db, 'users', trainee.uid);

    try {
      await updateDoc(traineeRef, values);

      toast({
        title: 'تم التحديث!',
        description: 'تم تحديث بيانات المتدرب بنجاح.',
      });
      
      onTraineeUpdated();
      setOpen(false);

    } catch (error) {
      console.error('Error updating trainee: ', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحديث بيانات المتدرب.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-1" />
          تعديل
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المتدرب</DialogTitle>
          <DialogDescription>
            قم بتحديث معلومات المتدرب {trainee.firstName} {trainee.lastName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الأول</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم العائلة</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="licenseType" render={({ field }) => (
                <FormItem><FormLabel>الدورة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="اختر دورة" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="لم يحدد">لم يحدد بعد</SelectItem>
                            {courses.map(course => <SelectItem key={course.id} value={course.name}>{course.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                <FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>الحالة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
