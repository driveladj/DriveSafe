
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertTriangle } from 'lucide-react';
import AddTrafficSignDialog from './add-traffic-sign-dialog';
import EditTrafficSignDialog from './edit-traffic-sign-dialog';
import DeleteTrafficSignAlert from './delete-traffic-sign-alert';
import Image from 'next/image';
import AddTrafficSignCategoryDialog from './add-traffic-sign-category-dialog';
import EditTrafficSignCategoryDialog from './edit-traffic-sign-category-dialog';
import DeleteTrafficSignCategoryAlert from './delete-traffic-sign-category-alert';

// Interfaces for this component
export interface TrafficSignCategory {
    id: string;
    name: string;
    description?: string;
}

export interface TrafficSign {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    categoryId: string;
    categoryName?: string;
}

export default function TrafficSignsManagement() {
    // State for Signs
    const [signs, setSigns] = useState<TrafficSign[]>([]);
    const [loadingSigns, setLoadingSigns] = useState(true);
    
    // State for Categories
    const [categories, setCategories] = useState<TrafficSignCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [error, setError] = useState<string | null>(null);

    // Effect for fetching categories
    useEffect(() => {
        const q = query(collection(db, 'trafficSignCategories'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, 
            (querySnapshot) => {
                const categoriesData: TrafficSignCategory[] = [];
                querySnapshot.forEach((doc) => {
                    categoriesData.push({ id: doc.id, ...doc.data() } as TrafficSignCategory);
                });
                setCategories(categoriesData);
                setLoadingCategories(false);
            }, 
            (err) => {
                console.error("Error fetching categories: ", err);
                setError('فشل تحميل فئات إشارات المرور.');
                setLoadingCategories(false);
            }
        );
        return () => unsubscribe();
    }, []);

    // Effect for fetching signs
    useEffect(() => {
        const q = query(collection(db, 'trafficSigns'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, 
            (querySnapshot) => {
                const signsData: TrafficSign[] = [];
                querySnapshot.forEach((doc) => {
                    signsData.push({ id: doc.id, ...doc.data() } as TrafficSign);
                });
                setSigns(signsData);
                setLoadingSigns(false);
            }, 
            (err) => {
                console.error("Error fetching traffic signs: ", err);
                setError('فشل تحميل إشارات المرور.');
                setLoadingSigns(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleUpdate = () => { /* onSnapshot handles UI updates automatically */ };

    if (loadingSigns || loadingCategories) {
        return <div className="flex items-center justify-center p-12"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    if (error) {
        return (
            <Card className="border-destructive bg-destructive/10">
                <CardHeader className="flex flex-row items-center gap-4">
                     <AlertTriangle className="h-8 w-8 text-destructive" />
                    <div><CardTitle className="text-destructive">حدث خطأ</CardTitle><CardDescription className="text-destructive/80">{error}</CardDescription></div>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            {/* Categories Management Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>فئات إشارات المرور</CardTitle>
                        <CardDescription>إدارة الفئات التي تنتمي إليها الإشارات (مثال: إشارات الخطر).</CardDescription>
                    </div>
                    <AddTrafficSignCategoryDialog onCategoryAdded={handleUpdate} />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>اسم الفئة</TableHead>
                                <TableHead>الوصف</TableHead>
                                <TableHead className="text-right">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell className="font-medium">{cat.name}</TableCell>
                                        <TableCell>{cat.description}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <EditTrafficSignCategoryDialog category={cat} onCategoryUpdated={handleUpdate} />
                                                <DeleteTrafficSignCategoryAlert categoryId={cat.id} categoryName={cat.name} onCategoryDeleted={handleUpdate} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={3} className="h-24 text-center">لا توجد فئات. ابدأ بإضافة واحدة جديدة.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Signs Management Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>كل إشارات المرور</CardTitle>
                        <CardDescription>قائمة بجميع إشارات المرور في قاعدة البيانات.</CardDescription>
                    </div>
                    <AddTrafficSignDialog onSignAdded={handleUpdate} categories={categories} />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">صورة</TableHead>
                                <TableHead>الاسم</TableHead>
                                <TableHead>الفئة</TableHead>
                                <TableHead className="hidden md:table-cell">الوصف</TableHead>
                                <TableHead className="text-right">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {signs.length > 0 ? (
                                signs.map((sign) => (
                                    <TableRow key={sign.id}>
                                        <TableCell>
                                            <Image src={sign.imageUrl} alt={sign.name} width={60} height={60} className="rounded-md object-contain aspect-square"/>
                                        </TableCell>
                                        <TableCell className="font-medium">{sign.name}</TableCell>
                                        <TableCell>{categories.find(c => c.id === sign.categoryId)?.name || 'غير مصنف'}</TableCell>
                                        <TableCell className="hidden md:table-cell truncate max-w-xs">{sign.description}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <EditTrafficSignDialog sign={sign} categories={categories} />
                                                <DeleteTrafficSignAlert signId={sign.id} signName={sign.name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={5} className="h-24 text-center">لا توجد إشارات مرور. ابدأ بإضافة واحدة جديدة.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
