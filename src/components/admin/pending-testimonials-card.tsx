
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, ThumbsUp, ThumbsDown, MessageSquare, User, Calendar, Smile, Users, HeartHandshake } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { Testimonial } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface PendingTestimonial {
    id: string;
    name: string;
    role: string;
    comment: string;
    createdAt: any;
    status: 'pending';
}

export default function PendingTestimonialsCard({ onTestimonialApproved }: { onTestimonialApproved: () => void }) {
    const [pendingTestimonials, setPendingTestimonials] = useState<PendingTestimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, 'pendingTestimonials'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data: PendingTestimonial[] = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as PendingTestimonial);
            });
            setPendingTestimonials(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleReject = async (id: string) => {
        if (!confirm('هل أنت متأكد من رفض هذا الرأي؟ سيتم حذفه نهائيًا.')) return;

        try {
            await deleteDoc(doc(db, 'pendingTestimonials', id));
            toast({ title: 'تم الرفض', description: 'تم حذف الرأي بنجاح.' });
        } catch (error) {
            console.error("Error rejecting testimonial: ", error);
            toast({ title: 'خطأ', description: 'فشل رفض الرأي.', variant: 'destructive' });
        }
    };

    const handleApprove = async (testimonial: PendingTestimonial, avatar: Testimonial['avatar']) => {
        try {
            // Add to the public testimonials collection
            const newPublicTestimonialRef = doc(collection(db, 'testimonials'));
            await setDoc(newPublicTestimonialRef, {
                id: newPublicTestimonialRef.id,
                name: testimonial.name,
                role: testimonial.role,
                comment: testimonial.comment,
                avatar: avatar,
            });

            // Delete from the pending collection
            await deleteDoc(doc(db, 'pendingTestimonials', testimonial.id));

            toast({ title: 'تمت الموافقة!', description: 'تم نشر الرأي بنجاح.' });
            onTestimonialApproved();
        } catch (error) {
            console.error("Error approving testimonial: ", error);
            toast({ title: 'خطأ', description: 'فشلت عملية الموافقة.', variant: 'destructive' });
        }
    };
    
    const formatRelativeTime = (timestamp: any) => {
        if (!timestamp) return 'غير معروف';
        return formatDistanceToNow(timestamp.toDate(), { addSuffix: true, locale: ar });
    };

    const avatarOptions = [
        { value: 'Smile', label: 'طالب سعيد', icon: <Smile className="w-4 h-4" /> },
        { value: 'Users', label: 'مستخدم عام', icon: <Users className="w-4 h-4" /> },
        { value: 'HeartHandshake', label: 'شراكة', icon: <HeartHandshake className="w-4 h-4" /> },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>آراء الطلاب قيد المراجعة</CardTitle>
                <CardDescription>مراجعة والموافقة على الآراء التي سيتم عرضها في الصفحة الرئيسية.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : pendingTestimonials.length > 0 ? (
                        pendingTestimonials.map(t => (
                            <div key={t.id} className="border-b pb-4 last:border-b-0">
                                <div className="flex items-start gap-4">
                                     <div className="bg-primary/10 text-primary p-3 rounded-full">
                                        <MessageSquare className="w-5 h-5"/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">{t.comment}</p>
                                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-4">
                                            <span className="flex items-center gap-1"><User className="w-3 h-3"/> {t.name}, {t.role}</span>
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {formatRelativeTime(t.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-3">
                                    <Button variant="destructive" size="sm" onClick={() => handleReject(t.id)}>
                                        <ThumbsDown className="w-4 h-4 mr-1"/> رفض
                                    </Button>
                                    <ApproveDropdown testimonial={t} onApprove={handleApprove} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-10">
                            لا توجد آراء جديدة للمراجعة في الوقت الحالي.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}


function ApproveDropdown({ testimonial, onApprove }: { testimonial: PendingTestimonial, onApprove: (t: PendingTestimonial, a: Testimonial['avatar']) => void }) {
    const [avatar, setAvatar] = useState<Testimonial['avatar']>('Smile');
    
    const avatarOptions = [
        { value: 'Smile', label: 'طالب سعيد' },
        { value: 'Users', label: 'مستخدم عام' },
        { value: 'HeartHandshake', label: 'شراكة' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-1"/> موافقة
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>اختر أيقونة للرأي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 space-y-2">
                    <Select onValueChange={(v) => setAvatar(v as Testimonial['avatar'])} defaultValue={avatar}>
                        <SelectTrigger>
                            <SelectValue placeholder="اختر أيقونة" />
                        </SelectTrigger>
                        <SelectContent>
                            {avatarOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button className="w-full" size="sm" onClick={() => onApprove(testimonial, avatar)}>
                        تأكيد الموافقة
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
