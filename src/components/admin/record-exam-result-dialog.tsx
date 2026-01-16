
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { DisplayExam } from './TraineeExamsTracker'; // Adjust this import if needed
import { format } from 'date-fns';

type RecordExamResultDialogProps = {
  traineeId: string;
  exam: DisplayExam;
  onResultRecorded: () => void;
};

export default function RecordExamResultDialog({ traineeId, exam, onResultRecorded }: RecordExamResultDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'passed' | 'failed' | '' >('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!result) {
        toast({
            title: 'خطأ',
            description: 'الرجاء اختيار نتيجة الامتحان.',
            variant: 'destructive',
        });
        return;
    }

    setIsSubmitting(true);
    const examRecordRef = doc(db, 'users', traineeId, 'exams', exam.id);

    try {
        await updateDoc(examRecordRef, {
            status: result,
            resultDate: serverTimestamp(),
        });

        toast({
            title: 'تم تسجيل النتيجة!',
            description: `تم تسجيل نتيجة امتحان "${exam.name}" كـ ${result === 'passed' ? 'ناجح' : 'راسب'}`,
        });
      
        onResultRecorded();
        setOpen(false);
        setResult('');

    } catch (error) {
        console.error('Error recording result: ', error);
        toast({
            title: 'خطأ',
            description: 'فشل تسجيل نتيجة الامتحان.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const scheduledDate = exam.traineeExamData?.scheduledDate;
  const formattedDate = scheduledDate ? format(scheduledDate.toDate(), 'dd/MM/yyyy') : 'غير محدد';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
            تسجيل النتيجة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تسجيل نتيجة: {exam.name}</DialogTitle>
          <DialogDescription>
            تاريخ الامتحان المجدول: {formattedDate}. اختر النتيجة أدناه.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
            <label className="font-medium">النتيجة</label>
             <Select dir="rtl" value={result} onValueChange={(value: 'passed' | 'failed' | '') => setResult(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="اختر النتيجة..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="passed">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>ناجح</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="failed">
                        <div className="flex items-center gap-2">
                             <XCircle className="h-4 w-4 text-red-500" />
                            <span>راسب</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>

        <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !result}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> حفظ...</> : 'حفظ النتيجة'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
