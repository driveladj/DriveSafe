
"use client";

import { useAuth } from "@/hooks/use-auth.tsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { user, loading, userDetails } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user || !userDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-12">
            <div className="space-y-4 mb-8">
                <h1 className="font-headline text-4xl font-bold">مرحباً بك، {userDetails.firstName}</h1>
                <p className="text-lg text-muted-foreground">هذه هي لوحة تحكم المتدرب الخاصة بك.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>ملفي الشخصي</CardTitle>
                        <CardDescription>عرض وتحديث معلوماتك الشخصية.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p><strong>الاسم:</strong> {userDetails.firstName} {userDetails.lastName}</p>
                        <p><strong>رقم الهاتف:</strong> {userDetails.phone}</p>
                        <p><strong>الدورة المسجلة:</strong> {userDetails.licenseType}</p>
                        <Button variant="outline" className="mt-4">تعديل الملف الشخصي</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>تقدمي في الدورة</CardTitle>
                        <CardDescription>تابع دروسك وجدولك الزمني.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>لم يتم تسجيل أي تقدم بعد.</p>
                        <Button className="mt-4">عرض الجدول الزمني</Button>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>الإشعارات</CardTitle>
                        <CardDescription>آخر التحديثات من الأكاديمية.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <p className="text-muted-foreground">لا توجد إشعارات جديدة.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
