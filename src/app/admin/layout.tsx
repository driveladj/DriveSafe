
import Link from 'next/link';
import { Bell, Home, LineChart, Package, Package2, Settings, ShoppingCart, Users, FileText, ChevronRight, ChevronLeft, TrafficCone, ListTree, BookOpen, DollarSign } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


const AdminSidebar = () => (
    <div className="hidden border-l bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                    <Package2 className="h-6 w-6" />
                    <span className="">لوحة التحكم</span>
                </Link>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <Home className="h-4 w-4" />
                        الرئيسية
                    </Link>
                    <div className="px-3 py-2">
                        <h4 className="mb-1 rounded-lg text-sm font-semibold text-primary">إدارة المحتوى</h4>
                        <Link
                            href="/admin/content/home"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                           <ChevronLeft className="h-4 w-4" />
                            الصفحة الرئيسية
                        </Link>
                         <Link
                            href="/admin/content/about"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                           <ChevronLeft className="h-4 w-4" />
                            صفحة من نحن
                        </Link>
                        <Link
                            href="/admin/content/footer"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                           <ChevronLeft className="h-4 w-4" />
                            تذييل الصفحة
                        </Link>
                    </div>
                     <div className="px-3 py-2">
                        <h4 className="mb-1 rounded-lg text-sm font-semibold text-primary">إدارة الموقع</h4>
                         <Link
                            href="/admin/trainees"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Users className="h-4 w-4" />
                            الطلاب المسجلون
                        </Link>
                        <Link
                            href="/admin/financials"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <DollarSign className="h-4 w-4" />
                            الأمور المالية
                        </Link>
                        <Link
                            href="/admin/courses"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <BookOpen className="h-4 w-4" />
                            الدورات التدريبية
                        </Link>
                        <Link
                            href="/admin/exams"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <FileText className="h-4 w-4" />
                            إدارة الامتحانات
                        </Link>
                        <Link
                            href="/admin#categories-section"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <ListTree className="h-4 w-4" />
                            أصناف الرخص
                        </Link>
                        <Link
                            href="/admin/banners"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                           <TrafficCone className="h-4 w-4" />
                            إشارات المرور
                        </Link>
                        <Link
                            href="/admin#faq-section"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            الأسئلة الشائعة
                        </Link>
                         <Link
                            href="/admin#pricing-section"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            الأسعار
                        </Link>
                        <Link
                            href="/admin#testimonials-section"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            آراء الطلاب
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    </div>
);

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <AdminSidebar />
            <div className="flex flex-col">
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

    
