
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  role: z.string().min(2, 'صفتك مطلوبة (مثال: طالب جديد)'),
  comment: z.string().min(10, 'يجب أن يكون الرأي 10 أحرف على الأقل.'),
});

export default function SubmitTestimonialPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
      comment: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // In the offline version, submission is disabled.
    toast({
        title: "وضع العرض فقط",
        description: "إرسال الآراء معطل في هذه النسخة الاحتياطية.",
        variant: "default",
    });
    setSubmitted(true); // Pretend it was submitted to show the thank you message
    setIsSubmitting(false);
  }

  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">شاركنا رأيك</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            نحن نقدر تجربتك معنا! رأيك يساعدنا على التحسن ويساعد الطلاب الجدد على اتخاذ قراراتهم.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container max-w-2xl">
          {submitted ? (
            <Card className="text-center p-8">
              <CardHeader>
                <CardTitle className="text-2xl">شكرًا جزيلًا لك!</CardTitle>
                <CardDescription>
                  لقد تم استلام رأيك بنجاح. نحن ممتنون لمساهمتك.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/">العودة إلى الصفحة الرئيسية</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>كتابة رأي</CardTitle>
                <CardDescription>املأ النموذج أدناه لمشاركة تجربتك.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسمك</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: عبد الله" {...field} />
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
                          <FormLabel>صفتك</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: طالب جديد، سائق متمرس" {...field} />
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
                          <FormLabel>رأيك</FormLabel>
                          <FormControl>
                            <Textarea placeholder="اكتب عن تجربتك مع الأكاديمية..." {...field} rows={5} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الإرسال...</>
                      ) : (
                        <><Send className="mr-2 h-4 w-4" /> إرسال الرأي</>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
