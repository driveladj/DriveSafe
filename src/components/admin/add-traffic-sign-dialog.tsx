
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '@/lib/firebase';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل." }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "مطلوب رابط صورة صالح." }),
});

interface AddTrafficSignDialogProps {
    onSignAdded: () => void;
}

export default function AddTrafficSignDialog({ onSignAdded }: AddTrafficSignDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            imageUrl: '',
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsUploading(true);
            setFileName(file.name);

            const storageRef = ref(storage, `trafficSigns/${Date.now()}_${file.name}`);
            try {
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                setUploadedImageUrl(downloadURL);
                form.setValue('imageUrl', downloadURL, { shouldValidate: true });
            } catch (error) {
                console.error("Image upload failed: ", error);
                toast({ title: "فشل الرفع", description: "تعذر رفع الصورة.", variant: "destructive" });
                setFileName(null);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'trafficSigns'), values);
            toast({ title: "نجاح!", description: "تمت إضافة إشارة مرور جديدة." });
            onSignAdded();
            form.reset();
            setUploadedImageUrl(null);
            setFileName(null);
            setOpen(false);
        } catch (error) {
            console.error("Error adding document: ", error);
            toast({ title: "خطأ", description: "فشل إضافة إشارة المرور.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> إضافة إشارة جديدة
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>إضافة إشارة مرور جديدة</DialogTitle>
                    <DialogDescription>
                        املأ التفاصيل أدناه لإضافة إشارة جديدة إلى قاعدة البيانات.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>اسم الإشارة</FormLabel>
                                    <FormControl><Input placeholder="مثال: علامة قف" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الوصف (اختياري)</FormLabel>
                                    <FormControl><Input placeholder="مثال: تشير إلى التوقف الكامل" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الصورة</FormLabel>
                                    <FormControl>
                                        <> 
                                            <Input id="image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={isUploading}/>
                                            <label htmlFor="image-upload" className={`w-full cursor-pointer ${(isUploading || uploadedImageUrl) ? 'hidden' : 'block'}`}>
                                                <div className='flex items-center justify-center w-full p-6 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors'>
                                                    <div className="text-center">
                                                        <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                                                        <p className="mt-2 text-sm text-muted-foreground">انقر لرفع صورة</p>
                                                    </div>
                                                </div>
                                            </label>
                                        </>
                                    </FormControl>
                                    {isUploading && (
                                        <div className="flex items-center gap-2 p-4 border rounded-md">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>جاري الرفع {fileName}...</span>
                                        </div>
                                    )}
                                    {uploadedImageUrl && (
                                        <div className="border rounded-lg p-2 flex items-center justify-center gap-2 text-center relative">
                                            <Image src={uploadedImageUrl} alt="Uploaded preview" width={100} height={100} className="rounded-md object-contain aspect-square"/>
                                            <p className="text-sm font-medium truncate w-full px-1" title={fileName || ''}>{fileName}</p>
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                            <Button type="submit" disabled={isSubmitting || isUploading || !form.formState.isValid}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                                إضافة إشارة
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
