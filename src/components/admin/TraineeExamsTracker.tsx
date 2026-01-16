
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FilePenLine } from "lucide-react";
import type { Exam, TraineeExam } from "@/lib/data";
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import SetExamDateDialog from './set-exam-date-dialog';
import RecordExamResultDialog from './record-exam-result-dialog';

interface TraineeExamsTrackerProps {
    traineeId: string;
}

// This merged type will be used for displaying the data
interface DisplayExam extends Exam {
    traineeExamData?: TraineeExam;
}

export default function TraineeExamsTracker({ traineeId }: TraineeExamsTrackerProps) {
    const [allExams, setAllExams] = useState<DisplayExam[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch all available exams, ordered by 'order'
            const examsQuery = query(collection(db, 'exams'), orderBy('order', 'asc'));
            const examsSnapshot = await getDocs(examsQuery);
            const examsList = examsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Exam));

            // 2. Fetch the trainee's specific exam records
            const traineeExamsRef = collection(db, 'users', traineeId, 'exams');
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

    useEffect(() => {
        fetchData();
    }, [traineeId]);


    const getStatusComponent = (exam: DisplayExam) => {
        const status = exam.traineeExamData?.status || 'not_started';

        switch (status) {
            case 'passed':
                return <Badge className="bg-green-100 text-green-800 border-green-200">ناجح</Badge>;
            case 'failed':
                return <Badge variant="destructive">راسب</Badge>;
            case 'scheduled':
                return <Badge className="bg-blue-100 text-blue-800 border-blue-200">مجدول</Badge>;
            default:
                return <Badge variant="outline">لم يبدأ بعد</Badge>;
        }
    };

    const getActionComponent = (exam: DisplayExam, isPreviousExamPassed: boolean) => {
        const status = exam.traineeExamData?.status || 'not_started';

        if (!isPreviousExamPassed) {
             return <Button variant="outline" size="sm" disabled>مغلق</Button>;
        }

        switch (status) {
            case 'not_started':
            case 'failed': // Allow rescheduling if failed
                 return <SetExamDateDialog traineeId={traineeId} exam={exam} onDateSet={fetchData} />;
            case 'scheduled':
                return <RecordExamResultDialog traineeId={traineeId} exam={exam} onResultRecorded={fetchData} />;
            case 'passed':
                return <span className="text-sm text-green-600 font-semibold">مكتمل</span>;
            default:
                return null;
        }
    };

    let isPreviousExamPassed = true; // The very first exam is always unlocked

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FilePenLine />
                    مسار تقدم الامتحانات
                </CardTitle>
                <CardDescription>تتبع وتحديث حالة امتحانات المتدرب.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">الترتيب</TableHead>
                            <TableHead>الامتحان</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead className="text-right">الإجراء</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {allExams.map((exam) => {
                            const currentExamStatus = exam.traineeExamData?.status;
                            const canProceed = isPreviousExamPassed;
                            // The next exam is only unlocked if the current one is passed.
                            isPreviousExamPassed = currentExamStatus === 'passed';

                             return (
                                <TableRow key={exam.id} className={!canProceed ? 'bg-gray-50 dark:bg-gray-800/20' : ''}>
                                    <TableCell className="font-bold text-lg">{exam.order}</TableCell>
                                    <TableCell className="font-medium">{exam.name}</TableCell>
                                    <TableCell>{getStatusComponent(exam)}</TableCell>
                                    <TableCell className="text-sm">
                                        {exam.traineeExamData?.scheduledDate ? 
                                            format(exam.traineeExamData.scheduledDate.toDate(), 'dd/MM/yyyy') : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {getActionComponent(exam, canProceed)}
                                    </TableCell>
                                </TableRow>
                            )
                         })}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    );
}
