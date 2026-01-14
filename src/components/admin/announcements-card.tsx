
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Megaphone, Bell, Trash2 } from 'lucide-react';
import { collection, addDoc, Timestamp, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Announcement {
    id: string;
    content: string;
    createdAt: Timestamp;
}

export default function AnnoucementsCard() {
    const [newAnnouncement, setNewAnnouncement] = useState('');
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const announcementsData: Announcement[] = [];
            querySnapshot.forEach((doc) => {
                announcementsData.push({ id: doc.id, ...doc.data() } as Announcement);
            });
            setAnnouncements(announcementsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handlePublish = async () => {
        if (!newAnnouncement.trim()) {
            toast({ title: 'خطأ', description: 'لا يمكن نشر إعلان فارغ.', variant: 'destructive' });
            return;
        }
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'announcements'), {
                content: newAnnouncement,
                createdAt: Timestamp.now(),
            });
            setNewAnnouncement('');
            toast({ title: 'تم النشر!', description: 'تم نشر الإعلان بنجاح.' });
        } catch (error) {
            console.error("Error publishing announcement: ", error);
            toast({ title: 'خطأ', description: 'فشل نشر الإعلان.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'announcements', id));
            toast({ title: 'تم الحذف', description: 'تم حذف الإعلان بنجاح.' });
        } catch (error) {
            console.error("Error deleting announcement: ", error);
            toast({ title: 'خطأ', description: 'فشل حذف الإعلان.', variant: 'destructive' });
        }
    };


    const formatRelativeTime = (timestamp: Timestamp) => {
        return formatDistanceToNow(timestamp.toDate(), { addSuffix: true, locale: ar });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>نشر إعلانات للطلاب</CardTitle>
                <CardDescription>سيظهر هذا الإعلان في لوحة تحكم جميع المتدربين.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold mb-2">إنشاء إعلان جديد</h3>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="مثال: خصم 10% على التسجيلات الجديدة هذا الأسبوع!"
                                value={newAnnouncement}
                                onChange={(e) => setNewAnnouncement(e.target.value)}
                                rows={4}
                            />
                            <Button onClick={handlePublish} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري النشر...</>
                                ) : (
                                    <><Megaphone className="mr-2 h-4 w-4" /> نشر الإعلان</>
                                )}
                            </Button>
                        </div>
                    </div>
                    <div>
                         <h3 className="font-semibold mb-2">أحدث الإعلانات</h3>
                         <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
                             {loading ? (
                                <div className="flex justify-center items-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                             ) : announcements.length > 0 ? (
                                announcements.map(ann => (
                                    <div key={ann.id} className="flex gap-3 justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="bg-primary/10 text-primary p-2 rounded-full h-fit">
                                                <Bell className="w-4 h-4"/>
                                            </div>
                                            <div>
                                                <p className="text-sm">{ann.content}</p>
                                                <p className="text-xs text-muted-foreground">{formatRelativeTime(ann.createdAt)}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(ann.id)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))
                             ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">لا توجد إعلانات حالية.</p>
                             )}
                         </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
