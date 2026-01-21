
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
import { DocumentData } from 'firebase/firestore';

const formSchema = z.object({
  firstNameAr: z.string().min(2, 'الاسم الأول (بالعربية) مطلوب'),
  lastNameAr: z.string().min(2, 'اسم العائلة (بالعربية) مطلوب'),
  firstNameEn: z.string().min(2, 'الاسم الأول (باللاتينية) مطلوب'),
  lastNameEn: z.string().min(2, 'اسم العائلة (باللاتينية) مطلوب'),
  dateOfBirth: z.string().min(1, "تاريخ الميلاد مطلوب."),
  placeOfBirth: z.string().min(2, "مكان الميلاد مطلوب."),
});

interface EditProfileFormProps {
    userDetails: DocumentData;
}

export default function EditProfileForm({ userDetails }: EditProfileFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstNameAr: userDetails.firstNameAr || '',
            lastNameAr: userDetails.lastNameAr || '',
            firstNameEn: userDetails.firstNameEn || '',
            lastNameEn: userDetails.lastNameEn || '',
            dateOfBirth: userDetails.dateOfBirth || '',
            placeOfBirth: userDetails.placeOfBirth || '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        // In the offline version, this is disabled
        toast({ title: 'وضع العرض فقط', description: 'تحديث الملف الشخصي معطل في هذه النسخة.', variant: 'default' });
        setIsSubmitting(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstNameAr" render={({ field }) => (<FormItem><FormLabel>الاسم الأول (عربي)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="lastNameAr" render={({ field }) => (<FormItem><FormLabel>اسم العائلة (عربي)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstNameEn" render={({ field }) => (<FormItem><FormLabel>الاسم الأول (لاتيني)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="lastNameEn" render={({ field }) => (<FormItem><FormLabel>اسم العائلة (لاتيني)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (<FormItem><FormLabel>تاريخ الميلاد</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="placeOfBirth" render={({ field }) => (<FormItem><FormLabel>مكان الميلاد</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormItem>
                    <FormLabel>رقم الهاتف (لتسجيل الدخول)</FormLabel>
                    <FormControl><Input value={userDetails.phone} readOnly disabled /></FormControl>
                </FormItem>
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> حفظ...</> : 'حفظ التغييرات'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
