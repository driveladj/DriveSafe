
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';

interface PrintHeaderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (header: string[][]) => void;
}

const defaultConfig = {
    rows: [
        ['', 'الجمهورية الجزائرية الديمقراطية الشعبية', ''],
        ['وزارة النقل', '', ''],
        ['مديرية النقل لولاية تيارت', '', ''],
    ]
};

export default function PrintHeaderDialog({ open, onOpenChange, onSave }: PrintHeaderDialogProps) {
  const [headerRows, setHeaderRows] = useState<string[][]>([[]]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const fetchHeaderConfig = async () => {
        setIsLoading(true);
        try {
          const docRef = doc(db, 'settings', 'printHeader');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().rowsJSON) {
            setHeaderRows(JSON.parse(docSnap.data().rowsJSON));
          } else {
            setHeaderRows(defaultConfig.rows);
          }
        } catch (error) {
          console.error("Error fetching print header:", error);
          toast({ title: 'خطأ في الاتصال', description: 'فشل جلب إعدادات الترويسة.', variant: 'destructive' });
          setHeaderRows(defaultConfig.rows); // Fallback
        } finally {
          setIsLoading(false);
        }
      };
      fetchHeaderConfig();
    }
  }, [open, toast]);

  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = JSON.parse(JSON.stringify(headerRows));
    newRows[rowIndex][colIndex] = value;
    setHeaderRows(newRows);
  };

  const addRow = () => {
    setHeaderRows([...headerRows, ['', '', '']]);
  };

  const removeRow = (rowIndex: number) => {
    const newRows = headerRows.filter((_, index) => index !== rowIndex);
    setHeaderRows(newRows);
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'settings', 'printHeader');
      await setDoc(docRef, { rowsJSON: JSON.stringify(headerRows) });
      onSave(headerRows);
    } catch (error) {
      console.error("Error saving print header:", error);
      toast({ title: 'خطأ', description: 'فشل حفظ الترويسة.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl no-print">
        <DialogHeader>
          <DialogTitle>إعداد ترويسة الطباعة</DialogTitle>
          <DialogDescription>
            صمم شكل الترويسة التي ستظهر أعلى القوائم المطبوعة. سيتم حفظ التغييرات للاستخدام المستقبلي.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              {headerRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    {row.map((cell, colIndex) => (
                      <Input
                        key={colIndex}
                        value={cell}
                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                        placeholder={`ع${colIndex + 1} ، س${rowIndex + 1}`}
                        dir="rtl"
                      />
                    ))}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeRow(rowIndex)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addRow}>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة سطر
            </Button>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحفظ...</> : 'حفظ و طباعة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
