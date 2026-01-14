
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, BookOpen, UserPlus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCourses } from "@/lib/data-access";
import type { Course } from "@/lib/data";

export default async function AdminPage() {

    const courses = await getCourses(10); // Fetch up to 10 courses

    const stats = [
        {
            title: "إجمالي الطلاب",
            value: "1,250",
            icon: Users,
            change: "+15.2% عن الشهر الماضي",
        },
        {
            title: "الإيرادات",
            value: "$75,345",
            icon: DollarSign,
            change: "+20.1% عن الشهر الماضي",
        },
        {
            title: "التسجيلات الجديدة (هذا الشهر)",
            value: "+82",
            icon: UserPlus,
            change: "+30% عن الشهر الماضي",
        },
        {
            title: "الدورات النشطة",
            value: "3",
            icon: BookOpen,
            change: "",
        }
    ];

    const recentRegistrations = [
        { name: "أحمد محمود", course: "رخصة الفئة ب", date: "2023-10-26", status: "مؤكد" },
        { name: "سارة علي", course: "رخصة دراجة نارية", date: "2023-10-25", status: "في الانتظار" },
        { name: "خالد حسن", course: "رخصة الفئة ب", date: "2023-10-24", status: "مؤكد" },
        { name: "نور ياسين", course: "دورة نظرية فقط", date: "2023-10-24", status: "مكتمل" },
        { name: "علي إبراهيم", course: "رخصة الفئة ب", date: "2023-10-22", status: "ملغي" },
    ];

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-background">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">لوحة تحكم المدير</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Recent Registrations Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>التسجيلات الأخيرة</CardTitle>
                        <CardDescription>نظرة سريعة على أحدث الطلاب الذين انضموا.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الاسم</TableHead>
                                    <TableHead>الدورة</TableHead>
                                    <TableHead>تاريخ التسجيل</TableHead>
                                    <TableHead>الحالة</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentRegistrations.map((reg, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{reg.name}</TableCell>
                                        <TableCell>{reg.course}</TableCell>
                                        <TableCell>{reg.date}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    reg.status === "مؤكد" ? "default" :
                                                    reg.status === "مكتمل" ? "secondary" :
                                                    reg.status === "في الانتظار" ? "outline" :
                                                    "destructive"
                                                }
                                                className={
                                                    reg.status === "مؤكد" ? "bg-green-500/20 text-green-700 border-green-500/30" :
                                                    reg.status === "مكتمل" ? "bg-blue-500/20 text-blue-700 border-blue-500/30" :
                                                    reg.status === "في الانتظار" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" :
                                                    "bg-red-500/20 text-red-700 border-red-500/30"
                                                }
                                            >
                                                {reg.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Courses Management Table */}
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>إدارة الدورات</CardTitle>
                            <CardDescription>إضافة وتعديل وحذف الدورات التدريبية.</CardDescription>
                        </div>
                        <Button size="sm" className="gap-1">
                            <PlusCircle className="h-4 w-4" />
                            دورة جديدة
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>اسم الدورة</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead className="text-left">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell className="font-medium">{course.name}</TableCell>
                                        <TableCell>{course.id}</TableCell>
                                        <TableCell className="text-left">
                                            <Button variant="outline" size="sm" className="ml-2">تعديل</Button>
                                            <Button variant="destructive" size="sm">حذف</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {courses.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">
                                            لم يتم العثور على دورات. قم بإضافة دورة جديدة.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
