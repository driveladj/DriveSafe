
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, User, Phone, Mail, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TraineeExamsTracker from '@/components/admin/TraineeExamsTracker';

interface Trainee {
    uid: string;
    firstNameAr: string;
    lastNameAr: string;
    firstNameEn: string;
    lastNameEn: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    licenseType?: string;
}

export default function TraineeDetailPage() {
    const { user, loading: authLoading, userDetails } = useAuth();
    const router = useRouter();
    const params = useParams();
    const traineeId = params.id as string;

    const [trainee, setTrainee] = useState<Trainee | null>(null);
    const [loadingTrainee, setLoadingTrainee] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user || userDetails?.role !== 'admin') {
            router.push('/login');
            return;
        }

        if (traineeId) {
            const fetchTrainee = async () => {
                setLoadingTrainee(true);
                const traineeRef = doc(db, 'users', traineeId);
                const traineeSnap = await getDoc(traineeRef);

                if (traineeSnap.exists()) {
                    setTrainee({ uid: traineeSnap.id, ...traineeSnap.data() } as Trainee);
                } else {
                    console.error("No such trainee!");
                    router.push('/admin/trainees');
                }
                setLoadingTrainee(false);
            };

            fetchTrainee();
        }
    }, [user, authLoading, userDetails, router, traineeId]);

    if (authLoading || loadingTrainee || !trainee) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    }

    return (
        <div className="flex-1 space-y-8 pt-6">
            <div className="flex items-center gap-4 mb-8">
                 <Button asChild variant="outline" size="icon">
                    <Link href="/admin/trainees">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">ملف المتدرب</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
                         <Avatar className="h-24 w-24 border-2 border-primary">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${trainee.firstNameAr} ${trainee.lastNameAr}`} />
                            <AvatarFallback className="text-3xl font-bold">{getInitials(trainee.firstNameAr, trainee.lastNameAr)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center mt-4">
                            <h2 className="text-2xl font-semibold">{trainee.firstNameAr} {trainee.lastNameAr}</h2>
                            <p className="text-muted-foreground">{trainee.firstNameEn} {trainee.lastNameEn}</p>
                            {trainee.licenseType && <p className="text-sm font-medium text-primary mt-1">الدورة: {trainee.licenseType}</p>}
                        </div>
                    </div>
                     <div className="p-6 bg-card rounded-lg border space-y-4">
                        <h3 className="font-semibold text-lg">المعلومات الشخصية</h3>
                        <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-muted-foreground" /> <span className="text-sm">تاريخ الميلاد: {trainee.dateOfBirth || 'لم يحدد'}</span></div>
                        <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-muted-foreground" /> <span className="text-sm">مكان الميلاد: {trainee.placeOfBirth || 'لم يحدد'}</span></div>
                        <h3 className="font-semibold text-lg pt-4 border-t">معلومات الاتصال</h3>
                        <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-muted-foreground" /> <span className="text-sm">{trainee.phone}</span></div>
                        <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-muted-foreground" /> <span className="text-sm">{trainee.email}</span></div>
                     </div>
                </div>

                <div className="lg:col-span-2">
                    <TraineeExamsTracker traineeId={traineeId} />
                </div>
            </div>

        </div>
    );
}
