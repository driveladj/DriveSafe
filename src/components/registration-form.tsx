
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { courses } from "@/lib/data"

const formSchema = z.object({
  firstName: z.string().min(2, { message: "يجب أن يتكون الاسم الأول من حرفين على الأقل." }),
  lastName: z.string().min(2, { message: "يجب أن يتكون اسم العائلة من حرفين على الأقل." }),
  dob: z.string().min(1, { message: "تاريخ الميلاد مطلوب." }),
  birthPlace: z.string().min(2, { message: "مكان الميلاد مطلوب." }),
  gender: z.enum(["male", "female", "other"], { required_error: "يرجى تحديد الجنس." }),
  licenseType: z.string({ required_error: "يرجى تحديد نوع الرخصة." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "يرجى إدخال رقم هاتف صالح." }),
  password: z.string().min(8, { message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل." }),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, { message: "يجب عليك قبول الشروط والأحكام." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});


export default function RegistrationForm() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            dob: "",
            birthPlace: "",
            phone: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        console.log(values)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "تم التسجيل بنجاح!",
                description: "مرحبًا بك في أكاديمية القيادة الآمنة. سنتواصل معك قريبًا.",
            })
            form.reset()
        }, 2000)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8 border rounded-lg bg-card">
                <div className="grid md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem><FormLabel>الاسم الأول</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem><FormLabel>اسم العائلة</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                     <FormField control={form.control} name="dob" render={({ field }) => (
                        <FormItem>
                            <FormLabel>تاريخ الميلاد</FormLabel>
                            <FormControl>
                                <Input placeholder="YYYY-MM-DD" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="birthPlace" render={({ field }) => (
                        <FormItem><FormLabel>مكان الميلاد</FormLabel><FormControl><Input placeholder="المدينة، البلد" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>الجنس</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">ذكر</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">أنثى</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal">آخر</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                    <FormMessage /></FormItem>
                )} />
                <div className="grid md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="licenseType" render={({ field }) => (
                        <FormItem><FormLabel>نوع الرخصة/الدورة</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="اختر دورة" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {courses.map(course => <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        <FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>رقم الهاتف (لتسجيل الدخول)</FormLabel><FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid md:grid-cols-2 gap-8">
                     <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>كلمة المرور</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                        <FormItem><FormLabel>تأكيد كلمة المرور</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="acceptTerms" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>أوافق على الشروط والأحكام</FormLabel>
                            <FormDescription>أنت توافق على <a href="/terms" className="underline">شروط الخدمة</a> و <a href="/privacy" className="underline">سياسة الخصوصية</a>.</FormDescription>
                        </div>
                    </FormItem>
                )} />

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    إنشاء حساب
                </Button>
            </form>
        </Form>
    );
}

    