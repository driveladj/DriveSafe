
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  phone: z.string().min(1, { message: "رقم الهاتف مطلوب." }),
  password: z.string().min(1, { message: "كلمة المرور مطلوبة." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // In the offline version, login is disabled.
        toast({
            title: "وضع العرض فقط",
            description: "تسجيل الدخول معطل في هذه النسخة الاحتياطية.",
            variant: "default",
        });
        setIsLoading(false);
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
                    name="phone"
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
