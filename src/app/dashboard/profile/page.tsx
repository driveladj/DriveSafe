"use client";

import { useAuth } from "@/hooks/use-auth.tsx";
import { Loader2 } from "lucide-react";
import EditProfileForm from "@/components/trainee/edit-profile-form";
import ChangePasswordForm from "@/components/trainee/change-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
    const { user, userDetails, loading } = useAuth();

    if (loading || !user || !userDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-12 space-y-8">
            <div>
                <h1 className="font-headline text-4xl font-bold">ملفي الشخصي</h1>
                <p className="text-lg text-muted-foreground">عرض وتحديث معلوماتك الشخصية وتغيير كلمة المرور.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>تعديل المعلومات الشخصية</CardTitle>
                        <CardDescription>
                            تأكد من أن معلوماتك محدثة.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EditProfileForm userDetails={userDetails} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>تغيير كلمة المرور</CardTitle>
                         <CardDescription>
                            لأمان حسابك، اختر كلمة مرور قوية.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChangePasswordForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
