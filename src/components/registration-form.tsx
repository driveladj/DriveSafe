
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import React, { useEffect, useState } from "react";

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

const formSchema = z.object({
  firstNameAr: z.string().min(2, { message: "الاسم الأول (بالعربية) مطلوب." }),
  lastNameAr: z.string().min(2, { message: "اسم العائلة (بالعربية) مطلوب." }),
  firstNameEn: z.string().min(2, { message: "الاسم الأول (باللاتينية) مطلوب." }),
  lastNameEn: z.string().min(2, { message: "اسم العائلة (باللاتينية) مطلوب." }),
  dob: z.string().min(1, { message: "تاريخ الميلاد مطلوب." }),
  birthPlace: z.string().min(2, { message: "مكان الميلاد مطلوب." }),
  gender: z.enum(["male", "female"], { required_error: "يرجى تحديد الجنس." }),
  licenseType: z.string().optional(),
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
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
      const fetchCourses = async () => {
        const coursesCollection = collection(db, 'courses');
        const courseSnapshot = await getDocs(coursesCollection);
        const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setCourses(courseList);
      };

      fetchCourses();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstNameAr: "",
            lastNameAr: "",
            firstNameEn: "",
            lastNameEn: "",
            dob: "",
            birthPlace: "",
            phone: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
            licenseType: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        
        const emailForAuth = `${values.phone.replace(/[^0-9]/g, '')}@drivesafe.local`;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, emailForAuth, values.password);
            const user = userCredential.user;

            const { password, confirmPassword, acceptTerms, ...userData } = values;
            await setDoc(doc(db, "users", user.uid), {
                ...userData,
                uid: user.uid,
                email: emailForAuth,
                role: "trainee",
                status: 'في الانتظار',
                createdAt: Timestamp.now(),
            });

            toast({
                title: "تم التسجيل بنجاح!",
                description: "مرحبًا بك في أكاديمية القيادة الآمنة. يتم توجيهك الآن...",
            })
            
            router.push("/dashboard");

        } catch (error: any) {
            console.error("Registration Error:", error)
            let errorMessage = "حدث خطأ غير متوقع أثناء التسجيل.";
            if (error.code === "auth/email-already-in-use") {
                errorMessage = "هذا الرقم مسجل بالفعل. حاول تسجيل الدخول.";
            } else if (error.code) {
                errorMessage = `فشل التسجيل: ${error.code}`;
            }
            toast({
                title: "فشل التسجيل",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8 border rounded-lg bg-card">
                 <div className="space-y-4">
                    <p className="text-sm font-medium">الاسم الكامل (كما في الوثائق الرسمية)</p>
                    <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-md">
                        <FormField control={form.control} name="firstNameAr" render={({ field }) => (
                            <FormItem><FormLabel>الاسم الأول (بالعربية)</FormLabel><FormControl><Input placeholder="عبد الله" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="lastNameAr" render={({ field }) => (
                            <FormItem><FormLabel>اسم العائلة (بالعربية)</FormLabel><FormControl><Input placeholder="منصوري" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-md">
                        <FormField control={form.control} name="firstNameEn" render={({ field }) => (
                            <FormItem><FormLabel>الاسم الأول (باللاتينية)</FormLabel><FormControl><Input placeholder="Abdullah" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="lastNameEn" render={({ field }) => (
                            <FormItem><FormLabel>اسم العائلة (باللاتينية)</FormLabel><FormControl><Input placeholder="Mansouri" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                     <FormField control={form.control} name="dob" render={({ field }) => (
                        <FormItem>
                            <FormLabel>تاريخ الميلاد</FormLabel>
                            <FormControl>
                                <Input placeholder="YYYY-MM-DD" {...field} type="date" />
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
                            </RadioGroup>
                        </FormControl>
                    <FormMessage /></FormItem>
                )} />
                <div className="grid md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="licenseType" render={({ field }) => (
                        <FormItem><FormLabel>نوع الرخصة/الدورة (اختياري)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="اختر دورة" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="no-course">لم أحدد بعد</SelectItem>
                                    {courses.map(course => <SelectItem key={course.id} value={course.name}>{course.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        <FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>رقم الهاتف (لتسجيل الدخول)</FormLabel><FormControl><Input placeholder="+966501234567" {...field} /></FormControl><FormMessage /></FormItem>
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
