"use client"

import { useState } from "react"
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
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Edit } from "lucide-react"
import { Feature } from "@/lib/data"
import { availableIcons } from "@/lib/icons"

interface EditFeatureDialogProps {
    feature: Feature;
    onFeatureUpdated: () => void;
}

export default function EditFeatureDialog({ feature, onFeatureUpdated }: EditFeatureDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState(feature.title)
    const [description, setDescription] = useState(feature.description)
    const [icon, setIcon] = useState(feature.icon)
    const [order, setOrder] = useState(feature.order)
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
            const featureRef = doc(db, "features", feature.id);
            await updateDoc(featureRef, {
                title,
                description,
                icon,
                order: Number(order) || 0,
            });
            toast({
                title: "تم التحديث!",
                description: "تم تحديث الميزة بنجاح.",
            })
            onFeatureUpdated();
            setOpen(false)
        } catch (error) {
            console.error("Error updating feature: ", error)
            toast({
                title: "خطأ",
                description: "فشل تحديث الميزة.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">تعديل</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>تعديل الميزة</DialogTitle>
                    <DialogDescription>
                        قم بتحديث تفاصيل الميزة. انقر على حفظ عند الانتهاء.
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
                        {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
