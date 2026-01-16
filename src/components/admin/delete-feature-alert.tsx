"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Trash2 } from "lucide-react"

interface DeleteFeatureAlertProps {
  featureId: string;
  onFeatureDeleted: () => void;
}

export default function DeleteFeatureAlert({ featureId, onFeatureDeleted }: DeleteFeatureAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteDoc(doc(db, "features", featureId))
      toast({
        title: "تم الحذف!",
        description: "تم حذف الميزة بنجاح.",
      })
      onFeatureDeleted()
    } catch (error) {
      console.error("Error deleting feature: ", error)
      toast({
        title: "خطأ",
        description: "فشل حذف الميزة.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-destructive" />
          <span className="sr-only">حذف</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيؤدي هذا الإجراء إلى حذف الميزة نهائيًا. لا يمكن التراجع عن هذا.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
            {isDeleting ? "جاري الحذف..." : "نعم، قم بالحذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
