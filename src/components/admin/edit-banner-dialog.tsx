
'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, Edit, Upload } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '@/lib/firebase';
import { TrafficSign } from './banners-management';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "A valid image URL is required." }),
});

interface EditBannerDialogProps {
    sign: TrafficSign;
}

export default function EditBannerDialog({ sign }: EditBannerDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string>(sign.imageUrl);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: sign.name,
            description: sign.description,
            imageUrl: sign.imageUrl,
        },
    });
    
    useEffect(() => {
        form.reset(sign);
        setPreviewImageUrl(sign.imageUrl);
    }, [sign, form, open]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsUploading(true);

            const storageRef = ref(storage, `trafficSigns/${Date.now()}_${file.name}`);
            try {
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                setPreviewImageUrl(downloadURL);
                form.setValue('imageUrl', downloadURL, { shouldValidate: true, shouldDirty: true });
                toast({ title: "Image Uploaded", description: "New image is ready. Save changes to apply." });
            } catch (error) {
                console.error("Image upload failed: ", error);
                toast({ title: "Upload Failed", description: "Could not upload the new image.", variant: "destructive" });
            } finally {
                setIsUploading(false);
            }
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const signRef = doc(db, 'trafficSigns', sign.id);
            await updateDoc(signRef, values);
            toast({ title: "Success!", description: "Traffic sign has been updated." });
            setOpen(false);
        } catch (error) {
            console.error("Error updating document: ", error);
            toast({ title: "Error", description: "Failed to update traffic sign.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Edit Traffic Sign</DialogTitle>
                    <DialogDescription>
                        Update the details for `{sign.name}`.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sign Name</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <div className="flex items-center gap-4">
                                <Image src={previewImageUrl} alt="Image preview" width={80} height={80} className="rounded-md object-contain aspect-square border" />
                                <div className="flex-grow">
                                    <Input id="image-update-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={isUploading}/>
                                    <label htmlFor="image-update-upload" className='w-full cursor-pointer'>
                                        <div className='flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors'>
                                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4"/> }
                                            <span>{isUploading ? 'Uploading...' : 'Change Image'}</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </FormItem>
                        
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting || isUploading || !form.formState.isDirty}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
