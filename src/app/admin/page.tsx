
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, BookOpen, UserPlus, Loader2, Edit, HelpCircle, Package, Star, ArrowLeft, MessageSquare, CheckCircle, FileText, ListTree } from "lucide-react";
import { getCourses } from "@/lib/data-access";
import type { Course, FAQ, PricingTier, Testimonial, Feature, LicenseCategory } from "@/lib/data";
import { useAuth } from '@/hooks/use-auth.tsx';
import { useRouter } from 'next/navigation';
import { collection, getDocs, orderBy, query, limit, Timestamp, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AddFaqDialog from '@/components/admin/add-faq-dialog';
import EditFaqDialog from '@/components/admin/edit-faq-dialog';
import DeleteFaqAlert from '@/components/admin/delete-faq-alert';
import AnnoucementsCard from '@/components/admin/announcements-card';
import AddPriceDialog from '@/components/admin/add-price-dialog';
import EditPriceDialog from '@/components/admin/edit-price-dialog';
import DeletePriceAlert from '@/components/admin/delete-price-alert';
import { Button } from '@/components/ui/button';
import AddTestimonialDialog from '@/components/admin/add-testimonial-dialog';
import EditTestimonialDialog from '@/components/admin/edit-testimonial-dialog';
import DeleteTestimonialAlert from '@/components/admin/delete-testimonial-alert';
import PendingTestimonialsCard from '@/components/admin/pending-testimonials-card';
import { TraineeRegistrationsChart } from '@/components/admin/trainee-registrations-chart';
import AddFeatureDialog from '@/components/admin/add-feature-dialog';
import EditFeatureDialog from '@/components/admin/edit-feature-dialog';
import DeleteFeatureAlert from '@/components/admin/delete-feature-alert';
import { availableIcons } from '@/lib/icons';
import AddTraineeDialog from '@/components/admin/add-trainee-dialog';
import AddCategoryDialog from '@/components/admin/add-category-dialog';
import EditCategoryDialog from '@/components/admin/edit-category-dialog';
import DeleteCategoryAlert from '@/components/admin/delete-category-alert';

interface Trainee {
    uid: string;
    firstName: string;
    lastName: string;
    licenseType: string;
    createdAt: Timestamp;
    status?: 'مؤكد' | 'في الانتظار' | 'مكتمل' | 'ملغي';
}


export default function AdminPage() {
    const { user, loading: authLoading, userDetails } = useAuth();
    const router = useRouter();
    const [licenseCategories, setLicenseCategories] = useState<LicenseCategory[]>([]);
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);
    const [recentTrainees, setRecentTrainees] = useState<Trainee[]>([]);
    const [allTrainees, setAllTrainees] = useState<Trainee[]>([]);
    const [traineeCount, setTraineeCount] = useState<number | string>('...');
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingFaqs, setLoadingFaqs] = useState(true);
    const [loadingTrainees, setLoadingTrainees] = useState(true);
    const [loadingPrices, setLoadingPrices] = useState(true);
    const [loadingTestimonials, setLoadingTestimonials] = useState(true);
    const [loadingFeatures, setLoadingFeatures] = useState(true);

     const fetchLicenseCategories = async () => {
        setLoadingCategories(true);
        try {
            const categoriesCol = query(collection(db, 'licenseCategories'), orderBy('createdAt', 'desc'));
            const categorySnapshot = await getDocs(categoriesCol);
            const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LicenseCategory));
            setLicenseCategories(categoryList);
        } catch (error) {
            console.error("Error fetching license categories:", error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchFaqs = async () => {
      setLoadingFaqs(true);
      const faqsCol = query(collection(db, 'faqs'), orderBy('order', 'asc'));
      const faqSnapshot = await getDocs(faqsCol);
      setFaqs(faqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ)));
      setLoadingFaqs(false);
    };

     const fetchPrices = async () => {
        setLoadingPrices(true);
        const pricesCol = query(collection(db, 'pricingTiers'), orderBy('price', 'asc'));
        const priceSnapshot = await getDocs(pricesCol);
        setPricingTiers(priceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PricingTier)));
        setLoadingPrices(false);
    };
    
    const fetchTestimonials = async () => {
        setLoadingTestimonials(true);
        const testimonialsCol = query(collection(db, 'testimonials'), orderBy('name', 'asc'));
        const testimonialSnapshot = await getDocs(testimonialsCol);
        setTestimonials(testimonialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
        setLoadingTestimonials(false);
    };

    const fetchTrainees = async () => {
        setLoadingTrainees(true);
        try {
            const traineesQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
            const traineeSnapshot = await getDocs(traineesQuery);
            const allTraineesData = traineeSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Trainee));
            
            setAllTrainees(allTraineesData);
            setRecentTrainees(allTraineesData.slice(0, 5));
            setTraineeCount(allTraineesData.length);

        } catch (error) {
            console.error("Error fetching trainee data:", error);
            setTraineeCount(0);
        } finally {
            setLoadingTrainees(false);
        }
    };
    
    const fetchFeatures = async () => {
      setLoadingFeatures(true);
      const featuresCol = query(collection(db, 'features'), orderBy('order', 'asc'));
      const featureSnapshot = await getDocs(featuresCol);
      setFeatures(featureSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feature)));
      setLoadingFeatures(false);
    };


    useEffect(() => {
        if (!authLoading) {
            if (!user || userDetails?.role !== 'admin') {
                router.push('/login');
            } else {
                fetchLicenseCategories();
                fetchFaqs();
                fetchTrainees();
                fetchPrices();
                fetchTestimonials();
                fetchFeatures();
            }
        }
    }, [user, authLoading, userDetails, router]);

    const stats = [
        {
            title: "إجمالي الطلاب",
            value: traineeCount,
            icon: Users,
            change: "كل التسجيلات",
        },
        {
            title: "الميزات",
            value: features.length,
            icon: CheckCircle,
            change: "في الصفحة الرئيسية",
        },
        {
            title: "الأسئلة الشائعة",
            value: faqs.length,
            icon: HelpCircle,
            change: "في صفحة الأسئلة",
        },
        {
            title: "أصناف الرخص",
            value: licenseCategories.length,
            icon: ListTree,
            change: "",
        }
    ];
    
    if (authLoading || !user || userDetails?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    const formatDate = (timestamp: Timestamp | undefined) => {
        if (!timestamp) return 'غير معروف';
        return timestamp.toDate().toLocaleDateString('ar-DZ');
    }

    return (
        <div className="flex-1 space-y-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم الرئيسية</h1>
                 <AddTraineeDialog onTraineeAdded={fetchTrainees} />
            </div>

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

            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                <div className="lg:col-span-2">
                    <TraineeRegistrationsChart trainees={allTrainees} />
                </div>
            </div>

            <div className="space-y-8">
                 <Card className="lg:col-span-2">
                    <AnnoucementsCard />
                </Card>

                 <Card id="categories-section">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>إدارة أصناف الرخص</CardTitle>
                            <CardDescription>إضافة وتعديل وحذف أصناف رخص السياقة.</CardDescription>
                        </div>
                        <AddCategoryDialog onCategoryAdded={fetchLicenseCategories} />
                    </CardHeader>
                    <CardContent>
                       {loadingCategories ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>اسم الصنف</TableHead>
                                    <TableHead>الوصف</TableHead>
                                    <TableHead className="text-right">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {licenseCategories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell className="truncate max-w-[300px]">{category.description || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <EditCategoryDialog category={category} onCategoryUpdated={fetchLicenseCategories} />
                                                <DeleteCategoryAlert categoryId={category.id} categoryName={category.name} onCategoryDeleted={fetchLicenseCategories} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {licenseCategories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24">
                                            لم يتم العثور على أصناف. قم بإضافة صنف جديد.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>

                <Card id="features-section" className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>إدارة الميزات (لماذا تختارنا)</CardTitle>
                            <CardDescription>إدارة الميزات التي تظهر في الصفحة الرئيسية.</CardDescription>
                        </div>
                        <AddFeatureDialog onFeatureAdded={fetchFeatures} />
                    </CardHeader>
                    <CardContent>
                       {loadingFeatures ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الأيقونة</TableHead>
                                    <TableHead>العنوان</TableHead>
                                    <TableHead>الوصف</TableHead>
                                    <TableHead>الترتيب</TableHead>
                                    <TableHead className="text-left">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {features.map((feature) => {
                                    const IconComponent = availableIcons[feature.icon] || HelpCircle;
                                    return (
                                    <TableRow key={feature.id}>
                                        <TableCell><IconComponent className="h-6 w-6" /></TableCell>
                                        <TableCell className="font-medium">{feature.title}</TableCell>
                                        <TableCell className="truncate max-w-[200px]">{feature.description}</TableCell>
                                        <TableCell>{feature.order}</TableCell>
                                        <TableCell className="text-left space-x-2 flex items-center justify-end">
                                            <EditFeatureDialog feature={feature} onFeatureUpdated={fetchFeatures} />
                                            <DeleteFeatureAlert featureId={feature.id} onFeatureDeleted={fetchFeatures} />
                                        </TableCell>
                                    </TableRow>
                                )}) }
                                {features.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            لم يتم العثور على ميزات.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>

                 <Card id="faq-section">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>إدارة الأسئلة الشائعة</CardTitle>
                            <CardDescription>إضافة وتعديل وحذف الأسئلة والأجوبة.</CardDescription>
                        </div>
                        <AddFaqDialog onFaqAdded={fetchFaqs} />
                    </CardHeader>
                    <CardContent>
                       {loadingFaqs ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>السؤال</TableHead>
                                    <TableHead className="text-left">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {faqs.map((faq) => (
                                    <TableRow key={faq.id}>
                                        <TableCell className="font-medium truncate max-w-[200px]">{faq.q}</TableCell>
                                        <TableCell className="text-left space-x-2 flex items-center justify-end">
                                            <EditFaqDialog faq={faq} onFaqUpdated={fetchFaqs} />
                                            <DeleteFaqAlert faqId={faq.id} onFaqDeleted={fetchFaqs} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {faqs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center">
                                            لم يتم العثور على أسئلة شائعة.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>
                
                <Card id="pricing-section" className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>إدارة خطط الأسعار</CardTitle>
                            <CardDescription>إضافة وتعديل وحذف خطط الأسعار.</CardDescription>
                        </div>
                        <AddPriceDialog onPriceAdded={fetchPrices} />
                    </CardHeader>
                     <CardContent>
                       {loadingPrices ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead>اسم الخطة</TableHead>
                                    <TableHead>السعر</TableHead>
                                    <TableHead>النوع</TableHead>
                                    <TableHead className="text-left">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pricingTiers.map((tier) => (
                                    <TableRow key={tier.id}>
                                        <TableCell>
                                            {tier.bestDeal && <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />}
                                        </TableCell>
                                        <TableCell className="font-medium">{tier.name}</TableCell>
                                        <TableCell>{tier.price} د.ج</TableCell>
                                        <TableCell>{tier.licenseType}</TableCell>
                                        <TableCell className="text-left space-x-2 flex items-center justify-end">
                                            <EditPriceDialog tier={tier} onPriceUpdated={fetchPrices} />
                                            <DeletePriceAlert priceId={tier.id} onPriceDeleted={fetchPrices} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {pricingTiers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            لم يتم العثور على خطط أسعار.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>

                 <Card id="testimonials-section" className="lg:col-span-2">
                    <PendingTestimonialsCard onTestimonialApproved={fetchTestimonials} />
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>إدارة آراء الطلاب (المنشورة)</CardTitle>
                            <CardDescription>إضافة وتعديل وحذف آراء الطلاب المعروضة في الصفحة الرئيسية.</CardDescription>
                        </div>
                        <AddTestimonialDialog onTestimonialAdded={fetchTestimonials} />
                    </CardHeader>
                     <CardContent>
                       {loadingTestimonials ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الاسم</TableHead>
                                    <TableHead>الدور</TableHead>
                                    <TableHead>الرأي</TableHead>
                                    <TableHead className="text-left">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {testimonials.map((testimonial) => (
                                    <TableRow key={testimonial.id}>
                                        <TableCell className="font-medium">{testimonial.name}</TableCell>
                                        <TableCell>{testimonial.role}</TableCell>
                                        <TableCell className="truncate max-w-[200px]">{testimonial.comment}</TableCell>
                                        <TableCell className="text-left space-x-2 flex items-center justify-end">
                                            <EditTestimonialDialog testimonial={testimonial} onTestimonialUpdated={fetchTestimonials} />
                                            <DeleteTestimonialAlert testimonialId={testimonial.id} onTestimonialDeleted={fetchTestimonials} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {testimonials.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            لم يتم العثور على آراء منشورة.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>التسجيلات الأخيرة</CardTitle>
                            <CardDescription>نظرة سريعة على أحدث الطلاب الذين انضموا.</CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/admin/trainees">
                                عرض الكل
                                <ArrowLeft className="mr-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                       {loadingTrainees ? (
                           <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                       ) : (
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
                                {recentTrainees.map((trainee) => {
                                    const status = trainee.status || "في الانتظار";
                                    return (
                                    <TableRow key={trainee.uid}>
                                        <TableCell className="font-medium">{trainee.firstName} {trainee.lastName}</TableCell>
                                        <TableCell>{trainee.licenseType || 'لم يحدد'}</TableCell>
                                        <TableCell>{formatDate(trainee.createdAt)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    status === "مؤكد" ? "default" :
                                                    status === "مكتمل" ? "secondary" :
                                                    status === "في الانتظار" ? "outline" :
                                                    "destructive"
                                                }
                                                className={
                                                    status === "مؤكد" ? "bg-green-500/20 text-green-700 border-green-500/30" :
                                                    status === "مكتمل" ? "bg-blue-500/20 text-blue-700 border-blue-500/30" :
                                                    status === "في الانتظار" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" :
                                                    "bg-red-500/20 text-red-700 border-red-500/30"
                                                }
                                            >
                                                {status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                    )
                                })}
                                {recentTrainees.length === 0 && (
                                     <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            لا توجد تسجيلات حديثة.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    
