'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth.tsx';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const formSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة.'),
  newPassword: z.string().min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور الجديدة غير متطابقة.",
  path: ["confirmPassword"],
});

export default function ChangePasswordForm() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        if (!user || !user.email) {
            toast({ title: 'خطأ', description: 'لم يتم العثور على المستخدم.', variant: 'destructive' });
            setIsSubmitting(false);
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
            await reauthenticateWithCredential(user, credential);
            
            await updatePassword(user, values.newPassword);

            toast({ title: 'نجاح!', description: 'تم تغيير كلمة المرور بنجاح.' });
            form.reset();
        } catch (error: any) {
            console.error('Password change error:', error);
            let description = 'فشل تغيير كلمة المرور.';
            if (error.code === 'auth/wrong-password') {
                description = 'كلمة المرور الحالية غير صحيحة.';
            }
            toast({ title: 'خطأ', description, variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="currentPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>كلمة المرور الحالية</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="newPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>كلمة المرور الجديدة</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> تغيير...</> : 'تغيير كلمة المرور'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
