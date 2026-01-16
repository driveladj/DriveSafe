
'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';

interface AboutContent {
    title: string;
    subtitle: string;
    storyTitle: string;
    storyContent: string;
    imageUrls?: string[]; // Optional: To be used later for real images
}

// Mock file type for UI state
interface MockFile {
    name: string;
    size: number; 
}

export default function AboutContentForm() {
    const [content, setContent] = useState<AboutContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedImages, setSelectedImages] = useState<MockFile[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const docRef = doc(db, 'pages', 'about');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setContent(docSnap.data() as AboutContent);
            } else {
                // Set default/empty state if no content exists
                setContent({
                    title: '',
                    subtitle: '',
                    storyTitle: '',
                    storyContent: '',
                    imageUrls: []
                });
            }
            setLoading(false);
        };

        fetchContent();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (content) {
            const { name, value } = e.target;
            setContent({ ...content, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({ name: file.name, size: file.size }));
            // Avoid duplicates
            const uniqueNewFiles = newFiles.filter(nf => !selectedImages.some(sf => sf.name === nf.name));
            setSelectedImages(prev => [...prev, ...uniqueNewFiles]);
        }
    };

    const handleRemoveImage = (fileName: string) => {
        setSelectedImages(prev => prev.filter(file => file.name !== fileName));
    };

    const handleSaveChanges = async () => {
        if (!content) return;

        setIsSaving(true);
        try {
            const docRef = doc(db, 'pages', 'about');
            // Note: We are only saving text content for now.
            // The image upload logic will be added later.
            await setDoc(docRef, {
                title: content.title,
                subtitle: content.subtitle,
                storyTitle: content.storyTitle,
                storyContent: content.storyContent
            }, { merge: true });

            toast({
                title: "تم الحفظ بنجاح!",
                description: "تم تحديث محتوى صفحة 'من نحن'. لم يتم رفع الصور بعد.",
                className: "bg-green-100 border-green-400 text-green-700"
            });

        } catch (error) {
            console.error("Error saving content: ", error);
            toast({
                title: "حدث خطأ",
                description: "فشل حفظ التغييرات. يرجى المحاولة مرة أخرى.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>النصوص الأساسية</CardTitle>
                    <CardDescription>تعديل العنوان الرئيسي والنص التقديمي لصفحة "من نحن".</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">العنوان الرئيسي</Label>
                        <Input id="title" name="title" value={content?.title || ''} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subtitle">النص التقديمي (تحت العنوان)</Label>
                        <Textarea id="subtitle" name="subtitle" value={content?.subtitle || ''} onChange={handleInputChange} />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>القصة</CardTitle>
                    <CardDescription>تعديل عنوان ومحتوى قصة الأكاديمية.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="storyTitle">عنوان القصة</Label>
                        <Input id="storyTitle" name="storyTitle" value={content?.storyTitle || ''} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="storyContent">محتوى القصة</Label>
                        <Textarea id="storyContent" name="storyContent" value={content?.storyContent || ''} onChange={handleInputChange} rows={6} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>معرض الصور</CardTitle>
                    <CardDescription>إضافة أو إزالة الصور من المعرض في صفحة "من نحن". (ملاحظة: الرفع الفعلي غير مفعل بعد).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="image-upload" className="w-full cursor-pointer">
                            <div className='flex items-center justify-center w-full p-6 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors'>
                                <div className="text-center">
                                    <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">انقر هنا أو قم بسحب الصور لرفعها</p>
                                    <p className="text-xs text-muted-foreground">يمكنك اختيار صور متعددة</p>
                                </div>
                            </div>
                        </Label>
                        <Input id="image-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*" />
                    </div>
                    {selectedImages.length > 0 && (
                        <div className="space-y-3 pt-4">
                             <h4 className='text-sm font-medium'>الصور المحددة:</h4>
                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {selectedImages.map((file, index) => (
                                    <div key={index} className="relative group border rounded-lg p-2 flex flex-col items-center justify-center gap-2 text-center">
                                        <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                        <p className="text-xs font-medium truncate w-full px-1" title={file.name}>{file.name}</p>
                                        <Button 
                                            variant="destructive" 
                                            size="icon" 
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleRemoveImage(file.name)}
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">إزالة الصورة</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    حفظ التغييرات
                </Button>
            </div>
        </div>
    );
}
