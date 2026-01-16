
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FilePenLine, CheckCircle, AlertCircle, Clock, XCircle, Lock } from "lucide-react";
import type { Exam, TraineeExam } from "@/lib/data";
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth.tsx';

// This merged type will be used for displaying the data
interface DisplayExam extends Exam {
    traineeExamData?: TraineeExam;
}

export default function TraineeExamProgress() {
    const { user } = useAuth();
    const [allExams, setAllExams] = useState<DisplayExam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch all available exams, ordered by 'order'
                const examsQuery = query(collection(db, 'exams'), orderBy('order', 'asc'));
                const examsSnapshot = await getDocs(examsQuery);
                const examsList = examsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Exam));

                // 2. Fetch the trainee's specific exam records
                const traineeExamsRef = collection(db, 'users', user.uid, 'exams');
                const traineeExamsSnapshot = await getDocs(traineeExamsRef);
                const traineeExamsMap = new Map<string, TraineeExam>();
                traineeExamsSnapshot.forEach(doc => {
                     traineeExamsMap.set(doc.id, { ...doc.data(), id: doc.id } as TraineeExam);
                });

                // 3. Merge the two datasets
                const displayExams: DisplayExam[] = examsList.map(exam => ({
                    ...exam,
                    traineeExamData: traineeExamsMap.get(exam.id),
                }));

                setAllExams(displayExams);

            } catch (error) {
                console.error("Error fetching exam data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const getStatusInfo = (status: TraineeExam['status'] | 'locked' | 'not_started') => {
        switch (status) {
            case 'passed':
                return {
                    text: 'ناجح',
                    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                    className: "bg-green-100 text-green-800",
                };
            case 'failed':
                return {
                    text: 'راسب',
                    icon: <XCircle className="h-5 w-5 text-red-500" />,
                    className: "bg-red-100 text-red-800",
                };
            case 'scheduled':
                return {
                    text: 'مجدول',
                    icon: <Clock className="h-5 w-5 text-blue-500" />,
                    className: "bg-blue-100 text-blue-800",
                };
            case 'locked':
                 return {
                    text: 'مغلق',
                    icon: <Lock className="h-5 w-5 text-gray-400" />,
                    className: "bg-gray-100 text-gray-500",
                };
            default: // not_started
                return {
                    text: 'لم يبدأ بعد',
                    icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
                    className: "bg-yellow-100 text-yellow-800",
                };
        }
    };
    
    let isPreviousExamPassed = true; // The very first exam is always unlocked

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FilePenLine />
                    تقدمي في الامتحانات
                </CardTitle>
                <CardDescription>تابع مسارك التعليمي وحالة كل امتحان.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                <div className="space-y-6">
                    {allExams.map((exam) => {
                        const canTakeExam = isPreviousExamPassed;
                        const status = canTakeExam ? (exam.traineeExamData?.status || 'not_started') : 'locked';
                        const statusInfo = getStatusInfo(status);
                        const scheduledDate = exam.traineeExamData?.scheduledDate;
                        const resultDate = exam.traineeExamData?.resultDate;
                        isPreviousExamPassed = status === 'passed';

                        return (
                            <div key={exam.id} className={`flex items-start gap-4 p-4 rounded-lg border ${!canTakeExam ? 'bg-muted/50' : 'bg-background'}`}>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${statusInfo.className}`}>
                                    {statusInfo.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold">{exam.name}</h4>
                                    <p className={`text-sm font-medium ${statusInfo.className.split(' ')[1]}`}>{statusInfo.text}</p>
                                    {status === 'scheduled' && scheduledDate && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            تاريخ الامتحان: {format(scheduledDate.toDate(), 'dd/MM/yyyy')}
                                        </p>
                                    )}
                                    { (status === 'passed' || status === 'failed') && resultDate && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            تاريخ النتيجة: {format(resultDate.toDate(), 'dd/MM/yyyy')}
                                        </p>
                                    )}
                                     {status === 'locked' && (
                                         <p className="text-xs text-muted-foreground mt-1">
                                            يجب عليك اجتياز الامتحان السابق أولاً.
                                        </p>
                                     )}
                                </div>
                                <div className="text-lg font-bold text-muted-foreground">
                                    #{exam.order}
                                </div>
                            </div>
                        )
                    })}
                     {allExams.length === 0 && (
                         <div className="text-center py-10 text-muted-foreground">
                            لم يتم إضافة مسار الامتحانات بعد.
                         </div>
                     )}
                </div>
                )}
            </CardContent>
        </Card>
    );
}
