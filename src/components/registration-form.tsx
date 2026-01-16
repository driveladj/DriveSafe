"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDocs, collection, Timestamp, query, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { FormDescription } from "./ui/form"
import type { LicenseCategory } from "@/lib/data";

const formSchema = z.object({
  firstNameAr: z.string().min(2, { message: "الاسم الأول (بالعربية) مطلوب." }),
  lastNameAr: z.string().min(2, { message: "اسم العائلة (بالعربية) مطلوب." }),
  firstNameEn: z.string().min(2, { message: "الاسم الأول (باللاتينية) مطلوب." }),
  lastNameEn: z.string().min(2, { message: "اسم العائلة (باللاتينية) مطلوب." }),
  dateOfBirth: z.string({ required_error: "تاريخ الميلاد مطلوب." }).min(1, "تاريخ الميلاد مطلوب."),
  placeOfBirth: z.string({ required_error: "مكان الميلاد مطلوب." }).min(2, "مكان الميلاد مطلوب."),
  licenseType: z.string({ required_error: "نوع الرخصة إجباري." }),
  phone: z.string().min(9, { message: "يرجى إدخال رقم هاتف صالح." }),
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
    const [licenseCategories, setLicenseCategories] = useState<LicenseCategory[]>([]);

    useEffect(() => {
      const fetchCategories = async () => {
        const categoriesCollection = query(collection(db, 'licenseCategories'), orderBy('name', 'asc'));
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LicenseCategory));
        setLicenseCategories(categoryList);
      };

      fetchCategories();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstNameAr: "",
            lastNameAr: "",
            firstNameEn: "",
            lastNameEn: "",
            dateOfBirth: "",
            placeOfBirth: "",
            phone: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        
        const emailForAuth = `${values.phone.replace(/[^0-9]/g, '')}@drivesafe.local`;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, emailForAuth, values.password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: `${values.firstNameAr} ${values.lastNameAr}`
            });

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                firstNameAr: values.firstNameAr,
                lastNameAr: values.lastNameAr,
                firstNameEn: values.firstNameEn,
                lastNameEn: values.lastNameEn,
                dateOfBirth: values.dateOfBirth,
                placeOfBirth: values.placeOfBirth,
                phone: values.phone,
                email: emailForAuth,
                licenseType: values.licenseType,
                role: "user",
                status: 'مؤكد',
                createdAt: Timestamp.now(),
                totalAmount: 0,
                paidAmount: 0,
            });

            toast({
                title: "تم التسجيل بنجاح!",
                description: "مرحبًا بك. يتم الآن توجيهك إلى لوحة التحكم الخاصة بك.",
            })
            
            router.push("/dashboard");

        } catch (error: any) {
            console.error("Registration Error:", error)
            let errorMessage = "حدث خطأ غير متوقع أثناء التسجيل.";
            if (error.code === "auth/email-already-in-use") {
                errorMessage = "رقم الهاتف هذا مسجل بالفعل. يرجى محاولة تسجيل الدخول.";
            } else if (error.code) {
                errorMessage = `فشل التسجيل: ${error.message}`;
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
                     <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                        <FormItem><FormLabel>تاريخ الميلاد</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="placeOfBirth" render={({ field }) => (
                        <FormItem><FormLabel>مكان الميلاد</FormLabel><FormControl><Input placeholder="مثال: الجزائر العاصمة" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>رقم الهاتف (لتسجيل الدخول)</FormLabel><FormControl><Input placeholder="05xxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="licenseType" render={({ field }) => (
                    <FormItem><FormLabel>نوع الرخصة</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="اختر نوع الرخصة" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {licenseCategories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    <FormMessage /></FormItem>
                )} />
                
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
