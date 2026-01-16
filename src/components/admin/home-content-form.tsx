
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  siteName: z.string().min(3, 'Site name is required'),
  heroTitle: z.string().min(5, 'Title is required'),
  heroSubtitle: z.string().min(10, 'Subtitle is required'),
  featuresTitle: z.string().min(5, 'Title is required'),
  featuresSubtitle: z.string().min(10, 'Subtitle is required'),
  ownerName: z.string().optional(),
  ownerBio: z.string().optional(),
  ownerImageUrl: z.string().url().optional().or(z.literal('')),
});

export default function HomeContentForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: '',
      heroTitle: '',
      heroSubtitle: '',
      featuresTitle: '',
      featuresSubtitle: '',
      ownerName: '',
      ownerBio: '',
      ownerImageUrl: '',
    },
  });

  useEffect(() => {
    async function fetchContent() {
      setIsLoading(true);
      const docRef = doc(db, 'pages', 'home');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          form.reset(docSnap.data() as z.infer<typeof formSchema>);
        } else {
          const defaultValues = {
            siteName: 'أكاديمية القيادة الآمنة',
            heroTitle: 'قُد بثقة.',
            heroSubtitle: 'انضم إلى أكاديمية القيادة الآمنة للحصول على تعليمات من الخبراء، ومركبات حديثة، ونهج شخصي لمساعدتك على أن تصبح سائقًا آمنًا وواثقًا مدى الحياة.',
            featuresTitle: 'لماذا تختار أكاديمية القيادة الآمنة؟',
            featuresSubtitle: 'نحن ملتزمون بتقديم أعلى مستويات الجودة في تعليم القيادة.',
            ownerName: '',
            ownerBio: '',
            ownerImageUrl: '',
          };
          form.reset(defaultValues);
        }
      } catch (error) {
        console.error('Error fetching home page content:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch content from the database.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
  }, [form, toast]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const storageRef = ref(storage, `owner/${Date.now()}_${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      form.setValue('ownerImageUrl', downloadURL, { shouldDirty: true });

      toast({ 
        title: "Image Uploaded Successfully!", 
        description: "Your new image is ready. Click 'Save Changes' to make it live.",
      });

    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({ 
        title: "Upload Failed", 
        description: `Error: ${error.message}`,
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const docRef = doc(db, 'pages', 'home');
    try {
      await setDoc(docRef, values, { merge: true });
      toast({
        title: 'Success!',
        description: 'Home page content has been updated successfully.',
      });
      form.reset(values); // Reset form to new values to clear dirty state
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content in the database.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div>
          <h3 className="text-lg font-medium">Hero Section</h3>
          <p className="text-sm text-muted-foreground">Customize the main section of your homepage.</p>
        </div>
        <FormField
          control={form.control}
          name="siteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الموقع</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heroTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العنوان الرئيسي (Hero Title)</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heroSubtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>النص الفرعي (Hero Subtitle)</FormLabel>
              <FormControl><Textarea rows={4} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='pt-4'>
          <h3 className="text-lg font-medium">Features Section</h3>
          <p className="text-sm text-muted-foreground">Manage the content of the features section.</p>
        </div>
        <FormField
          control={form.control}
          name="featuresTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان قسم المميزات</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="featuresSubtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>النص الفرعي لقسم المميزات</FormLabel>
              <FormControl><Textarea rows={3} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='pt-4'>
          <h3 className="text-lg font-medium">Owner Section</h3>
          <p className="text-sm text-muted-foreground">Manage the content of the owner section.</p>
        </div>
        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المالك</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ownerBio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نبذة عن المالك</FormLabel>
              <FormControl><Textarea rows={3} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ownerImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>صورة المالك</FormLabel>
              <div className='flex items-center gap-4'>
                <Avatar className='w-24 h-24 border'>
                    <AvatarImage src={field.value || undefined} />
                    <AvatarFallback>{form.getValues('ownerName')?.charAt(0) || 'O'}</AvatarFallback>
                </Avatar>
                <div className='space-y-3 flex-grow'>
                  <p className="text-sm text-muted-foreground">
                    ألصق رابطًا مباشرًا في الحقل أدناه أو ارفع ملفًا.
                  </p>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <div className='flex items-center gap-2'>
                    <Input id='ownerImage-upload' type='file' onChange={handleImageUpload} disabled={isUploading} className='hidden' />
                    <label htmlFor='ownerImage-upload' className='cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'>
                      {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'أو رفع ملف...'}
                    </label>
                  </div>
                </div>
              </div>
              <FormDescription>
                سيتم تفعيل رفع الملفات بعد ترقية خطة الفوترة.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || isUploading || !form.formState.isDirty}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحفظ...</>
          ) : (
            'حفظ التغييرات'
          )}
        </Button>
      </form>
    </Form>
  );
}
