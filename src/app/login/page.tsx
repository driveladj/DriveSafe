
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صالح." }),
  password: z.string().min(1, { message: "كلمة المرور مطلوبة." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // ملاحظة: Firebase Auth تستخدم البريد الإلكتروني بشكل أساسي. سنستخدم رقم الهاتف كمعرف فريد لنا ولكن مع Firebase سنستخدم البريد الإلكتروني.
            // للتوافق، سنقوم بتوليد بريد إلكتروني وهمي من رقم الهاتف.
            const emailForAuth = `${values.email.replace(/[^0-9]/g, '')}@drivesafe.local`;

            await signInWithEmailAndPassword(auth, emailForAuth, values.password);
            toast({
                title: "تم تسجيل الدخول بنجاح!",
                description: "أهلاً بعودتك.",
            });
            router.push("/admin"); // مؤقتًا، سنوجهه إلى لوحة تحكم المدير
        } catch (error: any) {
            console.error("Firebase Auth Error:", error);
            toast({
                title: "حدث خطأ",
                description: "رقم الهاتف أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">تسجيل الدخول</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            أهلاً بعودتك! أدخل بياناتك للوصول إلى لوحة تحكمك.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>مرحباً بعودتك</CardTitle>
              <CardDescription>
                استخدم رقم هاتفك الذي سجلت به.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل رقم هاتفك" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    تسجيل الدخول
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <p className="text-center text-sm text-muted-foreground mt-8">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              أنشئ حسابًا جديدًا
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
