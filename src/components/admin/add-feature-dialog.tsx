"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { availableIcons } from "@/lib/icons"

interface AddFeatureDialogProps {
  onFeatureAdded: () => void;
}

export default function AddFeatureDialog({ onFeatureAdded }: AddFeatureDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [order, setOrder] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !icon) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await addDoc(collection(db, "features"), {
        title,
        description,
        icon,
        order: Number(order) || 0,
      })
      toast({
        title: "تمت الإضافة!",
        description: "تمت إضافة الميزة بنجاح.",
      })
      onFeatureAdded();
      setOpen(false)
      setTitle("")
      setDescription("")
      setIcon("")
      setOrder(0)
    } catch (error) {
      console.error("Error adding feature: ", error)
      toast({
        title: "خطأ",
        description: "فشل إضافة الميزة.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            إضافة ميزة
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة ميزة جديدة</DialogTitle>
          <DialogDescription>
            أضف ميزة جديدة لقسم 'لماذا تختارنا' في الصفحة الرئيسية.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              العنوان
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              الوصف
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              الأيقونة
            </Label>
             <Select onValueChange={setIcon} value={icon}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر أيقونة" />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(availableIcons).map(iconName => (
                        <SelectItem key={iconName} value={iconName}>
                            {iconName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="order" className="text-right">
              الترتيب
            </Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
