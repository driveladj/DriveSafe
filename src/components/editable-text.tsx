
"use client";

import { useState } from 'react';
import { useEditMode } from '@/hooks/use-edit-mode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2, Pencil, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type EditableTextProps = {
  initialValue: string;
  collection: string;
  docId: string;
  field: string;
  as?: 'input' | 'textarea';
};

export function EditableText({ initialValue, collection, docId, field, as = 'input' }: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, collection, docId);
      await updateDoc(docRef, { [field]: value });
      toast({
        title: "تم الحفظ",
        description: "تم تحديث المحتوى بنجاح.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        title: "حدث خطأ",
        description: "فشل تحديث المحتوى. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  if (!isEditMode) {
    return <>{initialValue}</>;
  }

  if (isEditing) {
    const InputComponent = as === 'textarea' ? Textarea : Input;
    return (
      <div className="space-y-2">
        <InputComponent 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          className="bg-background text-foreground text-base"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Check />}
            حفظ
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel} disabled={isLoading}>
            <X />
            إلغاء
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group inline-block p-1 border-2 border-transparent hover:border-edit-mode-border rounded-md transition-all">
      {value}
      <Button
        variant="outline"
        size="icon"
        className="absolute -top-3 -right-3 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-edit-mode text-edit-mode-foreground hover:bg-edit-mode/90"
        onClick={() => setIsEditing(true)}
      >
        <Pencil size={14} />
      </Button>
    </div>
  );
}
