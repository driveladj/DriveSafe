
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RotateCcw, CheckCircle } from 'lucide-react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

const hslColorString = z.string().regex(/^\d{1,3}\s+\d{1,3}%\s+\d{1,3}%$/, {
  message: "يجب أن يكون اللون بتنسيق HSL، مثال: '210 40% 98%'",
});

const formSchema = z.object({
  fontHeadline: z.string().optional(),
  fontBody: z.string().optional(),
  background: hslColorString.optional().or(z.literal('')),
  foreground: hslColorString.optional().or(z.literal('')),
  primary: hslColorString.optional().or(z.literal('')),
  primaryForeground: hslColorString.optional().or(z.literal('')),
  secondary: hslColorString.optional().or(z.literal('')),
  secondaryForeground: hslColorString.optional().or(z.literal('')),
  accent: hslColorString.optional().or(z.literal('')),
  accentForeground: hslColorString.optional().or(z.literal('')),
  card: hslColorString.optional().or(z.literal('')),
  cardForeground: hslColorString.optional().or(z.literal('')),
  border: hslColorString.optional().or(z.literal('')),
  ring: hslColorString.optional().or(z.literal('')),
});

type ThemeSettings = z.infer<typeof formSchema>;
interface Theme {
  name: string;
  label: string;
  settings: ThemeSettings;
}

const themes: Theme[] = [
  {
    name: 'default',
    label: 'الافتراضي',
    settings: {
      fontHeadline: 'Cairo', fontBody: 'Tajawal',
      background: '210 17% 95%', foreground: '210 31% 20%',
      card: '210 20% 100%', cardForeground: '210 31% 20%',
      primary: '210 31% 28%', primaryForeground: '210 40% 98%',
      secondary: '210 17% 87%', secondaryForeground: '210 31% 28%',
      accent: '174 63% 37%', accentForeground: '210 40% 98%',
      border: '210 10% 85%', ring: '174 63% 37%',
    },
  },
  {
    name: 'dark',
    label: 'الداكن',
    settings: {
      fontHeadline: 'Cairo', fontBody: 'Tajawal',
      background: '222 47% 11%', foreground: '210 40% 98%',
      card: '222 47% 15%', cardForeground: '210 40% 98%',
      primary: '210 40% 98%', primaryForeground: '222 47% 11%',
      secondary: '222 47% 18%', secondaryForeground: '210 40% 98%',
      accent: '174 63% 45%', accentForeground: '222 47% 11%',
      border: '222 47% 22%', ring: '174 63% 45%',
    },
  },
  {
    name: 'ocean',
    label: 'المحيط الأزرق',
    settings: {
      fontHeadline: 'Readex Pro', fontBody: 'Almarai',
      background: '205 90% 96%', foreground: '215 39% 23%',
      card: '0 0% 100%', cardForeground: '215 39% 23%',
      primary: '214 89% 52%', primaryForeground: '0 0% 100%',
      secondary: '210 40% 90%', secondaryForeground: '215 39% 23%',
      accent: '35 92% 60%', accentForeground: '215 39% 23%',
      border: '210 40% 85%', ring: '214 89% 52%',
    },
  },
  {
    name: 'vibrant',
    label: 'حيوي وعصري',
    settings: {
        fontHeadline: 'Tajawal', fontBody: 'Cairo',
        background: '0 0% 98%', foreground: '0 0% 9%',
        card: '0 0% 100%', cardForeground: '0 0% 9%',
        primary: '250 89% 60%', primaryForeground: '0 0% 98%',
        secondary: '0 0% 94%', secondaryForeground: '0 0% 9%',
        accent: '348 91% 60%', accentForeground: '0 0% 98%',
        border: '0 0% 89%', ring: '250 89% 60%',
    }
  }
];


const colorFields: { name: keyof ThemeSettings, label: string, description: string }[] = [
    { name: 'background', label: 'الخلفية', description: 'اللون الأساسي لخلفية الموقع.' },
    { name: 'foreground', label: 'النص الأساسي', description: 'لون النص العام على الخلفية الأساسية.' },
    { name: 'primary', label: 'الأساسي', description: 'لون العناصر الرئيسية كالأزرار والروابط المهمة.' },
    { name: 'primaryForeground', label: 'نص الأساسي', description: 'لون النص فوق العناصر ذات اللون الأساسي.' },
    { name: 'secondary', label: 'الثانوي', description: 'لون الخلفيات البديلة مثل ترويسة الصفحة.' },
    { name: 'secondaryForeground', label: 'نص الثانوي', description: 'لون النص فوق العناصر ذات اللون الثانوي.' },
    { name: 'accent', label: 'المميز', description: 'لون العناصر التي تود إبرازها (مثل أزرار الحث على اتخاذ إجراء).' },
    { name: 'accentForeground', label: 'نص المميز', description: 'لون النص فوق العناصر ذات اللون المميز.' },
    { name: 'card', label: 'البطاقات', description: 'لون خلفية البطاقات والحاويات.' },
    { name: 'cardForeground', label: 'نص البطاقات', description: 'لون النص داخل البطاقات.' },
    { name: 'border', label: 'الحواف', description: 'لون الحواف والخطوط الفاصلة.' },
    { name: 'ring', label: 'حلقة التركيز', description: 'اللون الذي يظهر عند التركيز على حقل إدخال أو زر.' },
];

const availableFonts = [
    { value: 'Cairo', label: 'Cairo (العناوين الافتراضي)' },
    { value: 'Tajawal', label: 'Tajawal (النصوص الافتراضي)' },
    { value: 'Almarai', label: 'Almarai' },
    { value: 'Readex Pro', label: 'Readex Pro' },
    { value: 'Amiri', label: 'Amiri' },
];

function hexToHslString(hex: string): string {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `${h} ${s}% ${l}%`;
}

function hslStringToHex(hslStr: string): string {
    if (!hslStr?.trim()) return '#000000';
    const [h, s, l] = hslStr.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const s_norm = s / 100;
    const l_norm = l / 100;
    const c = (1 - Math.abs(2 * l_norm - 1)) * s_norm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l_norm - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { [r, g, b] = [c, x, 0]; }
    else if (h >= 60 && h < 120) { [r, g, b] = [x, c, 0]; }
    else if (h >= 120 && h < 180) { [r, g, b] = [0, c, x]; }
    else if (h >= 180 && h < 240) { [r, g, b] = [0, x, c]; }
    else if (h >= 240 && h < 300) { [r, g, b] = [x, 0, c]; }
    else if (h >= 300 && h < 360) { [r, g, b] = [c, 0, x]; }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}


export default function AppearanceForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTheme, setActiveTheme] = useState('custom');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const checkActiveTheme = (values: ThemeSettings) => {
    const matchedTheme = themes.find(theme => 
      Object.keys(theme.settings).every(key => {
        const themeValue = theme.settings[key as keyof ThemeSettings] || '';
        const formValue = values[key as keyof ThemeSettings] || '';
        return themeValue === formValue;
      })
    );
    if (matchedTheme) {
        setActiveTheme(matchedTheme.name);
    } else {
        setActiveTheme('custom');
    }
  };

  useEffect(() => {
    async function fetchContent() {
      setIsLoading(true);
      const docRef = doc(db, 'settings', 'appearance');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ThemeSettings;
          form.reset(data);
          checkActiveTheme(data);
        } else {
            form.reset(themes.find(t => t.name === 'default')?.settings);
            setActiveTheme('default');
        }
      } catch (error) {
        console.error('Error fetching appearance settings:', error);
        toast({
          title: 'خطأ',
          description: 'فشل جلب إعدادات المظهر من قاعدة البيانات.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
  }, [form, toast]);
  
  useEffect(() => {
    const subscription = form.watch((values) => {
        checkActiveTheme(values as ThemeSettings);
    });
    return () => subscription.unsubscribe();
  }, [form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const docRef = doc(db, 'settings', 'appearance');
    try {
      const dataToSave = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== '' && v != null)
      );
      await setDoc(docRef, dataToSave, { merge: true });
      toast({
        title: 'تم الحفظ بنجاح!',
        description: 'تم تحديث مظهر الموقع. قد تحتاج إلى تحديث الصفحة لرؤية التغييرات.',
      });
      form.reset(values, { keepIsDirty: false });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحديث المظهر في قاعدة البيانات.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleResetToDefaults = async () => {
    setIsSubmitting(true);
    const docRef = doc(db, 'settings', 'appearance');
    try {
        await deleteDoc(docRef);
        toast({
            title: "تمت إعادة التعيين!",
            description: "تمت استعادة إعدادات المظهر الافتراضية. سيتم تحديث الصفحة.",
        });
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    } catch (error) {
        console.error("Error resetting defaults:", error);
        toast({
            title: 'خطأ',
            description: 'فشل إعادة التعيين إلى الإعدادات الافتراضية.',
            variant: 'destructive',
        });
        setIsSubmitting(false);
    }
  };
  
  const applyTheme = (theme: Theme) => {
    form.reset(theme.settings);
    setActiveTheme(theme.name);
    toast({
        title: `تم تطبيق تصميم "${theme.label}"`,
        description: "اضغط على 'حفظ التغييرات' لجعله دائماً.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <Card>
            <CardHeader>
                <CardTitle>تصاميم جاهزة</CardTitle>
                <CardDescription>اختر تصميمًا جاهزًا لتغيير مظهر الموقع بالكامل بنقرة واحدة.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {themes.map((theme) => (
                    <div key={theme.name} onClick={() => applyTheme(theme)} className="cursor-pointer group">
                        <div className={cn(
                            "rounded-lg border-2 p-4 transition-all h-full",
                            activeTheme === theme.name ? "border-primary ring-2 ring-primary ring-offset-2" : "border-muted group-hover:border-primary/50"
                        )}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold">{theme.label}</span>
                                {activeTheme === theme.name && <CheckCircle className="h-5 w-5 text-primary" />}
                            </div>
                            <div className="flex space-x-1 rtl:space-x-reverse h-6">
                                <div className="w-1/4 rounded" style={{ backgroundColor: theme.settings.background ? hslStringToHex(theme.settings.background) : '#ffffff' }}></div>
                                <div className="w-1/4 rounded" style={{ backgroundColor: theme.settings.primary ? hslStringToHex(theme.settings.primary) : '#000000' }}></div>
                                <div className="w-1/4 rounded" style={{ backgroundColor: theme.settings.secondary ? hslStringToHex(theme.settings.secondary) : '#f1f5f9' }}></div>
                                <div className="w-1/4 rounded" style={{ backgroundColor: theme.settings.accent ? hslStringToHex(theme.settings.accent) : '#2dd4bf' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
                 <div onClick={() => { /* Does nothing on click, just for visual state */ }} className="cursor-pointer group">
                    <div className={cn(
                        "rounded-lg border-2 p-4 transition-all flex flex-col items-center justify-center h-full text-center",
                        activeTheme === 'custom' ? "border-primary ring-2 ring-primary ring-offset-2" : "border-dashed border-muted group-hover:border-primary/50"
                    )}>
                        <span className="text-sm font-semibold mb-2">تخصيص يدوي</span>
                         {activeTheme === 'custom' ?
                            <CheckCircle className="h-5 w-5 text-primary" /> :
                            <p className="text-xs text-muted-foreground">تعديل الألوان أدناه</p>
                         }
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>الخطوط</CardTitle>
                <CardDescription>اختر الخطوط المستخدمة في العناوين والنصوص الأساسية للموقع.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="fontHeadline" render={({ field }) => (
                    <FormItem>
                        <FormLabel>خط العناوين</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                          <FormControl><SelectTrigger><SelectValue placeholder="اختر خطًا للعناوين" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableFonts.map(font => <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="fontBody" render={({ field }) => (
                    <FormItem>
                        <FormLabel>خط النصوص</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                          <FormControl><SelectTrigger><SelectValue placeholder="اختر خطًا للنصوص" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableFonts.map(font => <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>لوحة الألوان</CardTitle>
                <CardDescription>
                    انقر على مربع اللون لاختيار لون جديد.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                 {colorFields.map(({ name, label, description }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <div className="flex items-center gap-3">
                                <FormControl>
                                    <Input 
                                      type="color" 
                                      className="w-12 h-10 p-1 cursor-pointer"
                                      value={hslStringToHex(field.value || '')}
                                      onChange={(e) => field.onChange(hexToHslString(e.target.value))}
                                    />
                                </FormControl>
                                <span className="font-mono text-sm text-muted-foreground">
                                    {hslStringToHex(field.value || '')}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{description}</p>
                            <FormMessage />
                        </FormItem>
                      )}
                    />
                 ))}
            </CardContent>
        </Card>

        <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحفظ...</> : 'حفظ التغييرات'}
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" disabled={isSubmitting}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        العودة إلى القيم الافتراضية
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription>
                            سيؤدي هذا الإجراء إلى حذف جميع تخصيصات المظهر والعودة إلى الألوان والخطوط الافتراضية. لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetToDefaults}>نعم، قم بإعادة التعيين</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </form>
    </Form>
  );
}
