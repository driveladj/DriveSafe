
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { doc, updateDoc, increment, collection, addDoc, Timestamp, query, orderBy, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Interfaces
interface TraineeFinancial {
    uid: string;
    firstNameAr: string;
    lastNameAr: string;
    totalAmount?: number;
    paidAmount?: number;
}

interface Payment {
    id: string;
    amount: number;
    date: Timestamp;
}

// Zod Schema
const formSchema = z.object({
  totalAmount: z.preprocess(
    (val) => val === '' ? undefined : Number(val),
    z.number({ invalid_type_error: 'يجب أن يكون رقماً' }).min(0, 'المبلغ لا يمكن أن يكون سالباً').optional()
  ),
  newPayment: z.preprocess(
    (val) => val === '' ? 0 : Number(val),
    z.number({ invalid_type_error: 'يجب أن يكون رقماً' }).min(0, 'المبلغ لا يمكن أن يكون سالباً').optional()
  ),
  paymentDate: z.string().optional(),
}).refine(data => {
    if (data.newPayment && data.newPayment > 0) {
        return !!data.paymentDate; // If there is a new payment, a date is required
    }
    return true;
}, { message: 'تاريخ الدفعة مطلوب عند إضافة دفعة جديدة', path: ['paymentDate'] });


// Component Props
type ManagePaymentDialogProps = {
  trainee: TraineeFinancial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentUpdate: () => void;
};

export default function ManagePaymentDialog({ trainee, open, onOpenChange, onPaymentUpdate }: ManagePaymentDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        totalAmount: 0,
        newPayment: 0,
        paymentDate: new Date().toISOString().split('T')[0], // Default to today
    },
  });

  useEffect(() => {
    if (open && trainee) {
      // Reset form with trainee data
      form.reset({
        totalAmount: trainee.totalAmount || 0,
        newPayment: 0,
        paymentDate: new Date().toISOString().split('T')[0],
      });

      // Listen for payments
      const paymentsQuery = query(collection(db, 'users', trainee.uid, 'payments'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(paymentsQuery, (snapshot) => {
        const paymentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
        setPayments(paymentsData);
      }, (error) => {
        console.error("Error fetching payments: ", error);
        toast({ title: 'خطأ', description: 'فشل في تحميل سجل الدفعات.', variant: 'destructive' });
      });

      return () => unsubscribe(); // Cleanup listener
    }
  }, [open, trainee, form.reset, toast]);

  if (!trainee) return null;

  const totalAmount = Number(form.watch('totalAmount')) || 0;
  const paidAmount = trainee.paidAmount || 0;
  const remainingAmount = totalAmount - paidAmount;

  const validatePayment = (value: number) => {
    if (value > remainingAmount) {
      form.setError("newPayment", {
        type: "manual",
        message: `الدفعة الجديدة أكبر من المبلغ المتبقي (${remainingAmount.toFixed(2)} د.ج)`,
      });
      return false;
    }
    return true;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.newPayment && !validatePayment(values.newPayment)) return;

    setIsSubmitting(true);
    const batch = writeBatch(db);
    const traineeRef = doc(db, 'users', trainee!.uid);

    // 1. Update total amount
    batch.update(traineeRef, { totalAmount: values.totalAmount || 0 });

    // 2. Add new payment if provided
    if (values.newPayment && values.newPayment > 0 && values.paymentDate) {
      const paymentRef = doc(collection(db, 'users', trainee!.uid, 'payments'));
      batch.set(paymentRef, {
        amount: values.newPayment,
        date: Timestamp.fromDate(new Date(values.paymentDate))
      });
      // also increment the total paid amount on the main user doc
      batch.update(traineeRef, { paidAmount: increment(values.newPayment) });
    }

    try {
      await batch.commit();
      toast({ title: 'تمت العملية بنجاح!', description: 'تم تحديث البيانات المالية للمتدرب.' });
      onPaymentUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating financials: ', error);
      toast({ title: 'خطأ', description: 'فشل تحديث البيانات.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>الإدارة المالية لـ: {trainee.firstNameAr} {trainee.lastNameAr}</DialogTitle>
          <DialogDescription>
            أدر المبلغ الإجمالي المطلوب، وأضف الدفعات الجديدة للمتدرب.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 grid grid-cols-3 gap-2 text-center border-b pb-4">
            <div><p className="text-sm text-muted-foreground">المبلغ الإجمالي</p><p className="font-bold">{totalAmount.toFixed(2)} د.ج</p></div>
            <div><p className="text-sm text-muted-foreground">المبلغ المدفوع</p><p className="font-bold text-green-600">{paidAmount.toFixed(2)} د.ج</p></div>
            <div><p className="text-sm text-muted-foreground">المبلغ المتبقي</p><p className="font-bold text-red-600">{remainingAmount.toFixed(2)} د.ج</p></div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <FormField control={form.control} name="totalAmount" render={({ field }) => (
                    <FormItem><FormLabel>المبلغ الإجمالي (د.ج)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="newPayment" render={({ field }) => (
                    <FormItem><FormLabel>مبلغ الدفعة الجديدة (د.ج)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="paymentDate" render={({ field }) => (
                    <FormItem><FormLabel>تاريخ الدفعة</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            {/* Payment History */}
            <div className="space-y-2 pt-4">
                <h4 className="font-medium">سجل الدفعات</h4>
                <div className="border rounded-md max-h-48 overflow-y-auto">
                    <Table>
                        <TableHeader> 
                            <TableRow><TableHead>التاريخ</TableHead><TableHead className="text-right">المبلغ</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.length > 0 ? (
                                payments.map(payment => (
                                <TableRow key={payment.id}>
                                    <TableCell>{payment.date.toDate().toLocaleDateString('ar-DZ')}</TableCell>
                                    <TableCell className="text-right font-mono">{payment.amount.toFixed(2)} د.ج</TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={2} className="text-center h-20">لا توجد دفعات مسجلة.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            
            <DialogFooter className="pt-6">
              <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحفظ... </> : 'حفظ التغييرات'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    