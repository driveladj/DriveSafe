
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Exam } from '@/lib/data';
import { format } from 'date-fns';

type SetExamDateDialogProps = {
  traineeId: string;
  exam: Exam;
  onDateSet: () => void;
};

export default function SetExamDateDialog({ traineeId, exam, onDateSet }: SetExamDateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedDate) {
        toast({
            title: 'خطأ',
            description: 'الرجاء تحديد تاريخ للامتحان.',
            variant: 'destructive',
        });
        return;
    }

    setIsSubmitting(true);
    const examRecordRef = doc(db, 'users', traineeId, 'exams', exam.id);

    try {
        await setDoc(examRecordRef, {
            status: 'scheduled',
            scheduledDate: Timestamp.fromDate(selectedDate),
        }, { merge: true });

        toast({
            title: 'تم تحديد الموعد!',
            description: `تم تحديد موعد امتحان "${exam.name}" في ${format(selectedDate, 'dd/MM/yyyy')}`,
        });
      
        onDateSet();
        setOpen(false);
        setSelectedDate(undefined);

    } catch (error) {
        console.error('Error setting exam date: ', error);
        toast({
            title: 'خطأ',
            description: 'فشل تحديد موعد الامتحان.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
            <CalendarIcon className="mr-2 h-4 w-4" />
            تحديد موعد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تحديد موعد امتحان: {exam.name}</DialogTitle>
          <DialogDescription>
            اختر التاريخ الذي سيتم فيه إجراء هذا الامتحان للمتدرب.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
             <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                dir="rtl"
            />
        </div>

        <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !selectedDate}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> حفظ...</> : 'حفظ الموعد'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

