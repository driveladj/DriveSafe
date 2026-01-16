
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TraineeExamsTracker from '@/components/admin/TraineeExamsTracker';

// Dummy type, will be expanded later
interface Trainee {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    licenseType?: string;
    // add other fields as necessary
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
                    // Optionally, redirect to a not-found page or back to the list
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

            <div className="flex items-center gap-6 p-6 bg-card rounded-lg border mb-8">
                 <Avatar className="h-20 w-20 border-2 border-primary">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${trainee.firstName} ${trainee.lastName}`} />
                    <AvatarFallback className="text-2xl font-bold">{getInitials(trainee.firstName, trainee.lastName)}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-semibold">{trainee.firstName} {trainee.lastName}</h2>
                    <p className="text-muted-foreground">{trainee.email}</p>
                    {trainee.licenseType && <p className="text-sm text-muted-foreground">الدورة: {trainee.licenseType}</p>}
                </div>
            </div>

            {/* Exam progress section will be added here in the next steps */}
            <TraineeExamsTracker traineeId={traineeId} />

        </div>
    );
}
