
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { aiCurriculumRecommendation, type AICurriculumRecommendationOutput } from '@/ai/flows/ai-curriculum-recommendation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';

export default function AiCurriculumPage() {
    const [studentProgress, setStudentProgress] = useState('الطالب يظهر تحكمًا جيدًا في السيارة ولكنه يواجه صعوبة في تقدير المسافات لركن السيارة ولديه قلق في حركة المرور الكثيفة.');
    const [availableResources, setAvailableResources] = useState('خطط الدروس: الركن الموازي، الدوران ثلاثي النقاط، القيادة على الطرق السريعة، تقنيات القيادة الدفاعية. التمارين: التعرج بين الأقماع، الكبح في حالات الطوارئ، الملاحة في الدوارات.');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AICurriculumRecommendationOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentProgress || !availableResources) {
            setError("يرجى ملء كلا الحقلين.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const output = await aiCurriculumRecommendation({ studentProgress, availableResources });
            setResult(output);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ غير معروف.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="py-16 sm:py-24 bg-secondary">
                <div className="container text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">مولد المناهج بالذكاء الاصطناعي</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        استفد من الذكاء الاصطناعي لإنشاء خطط تعلم مخصصة. أدخل تقدم الطالب والموارد المتاحة للحصول على توصية منهجية مخصصة.
                    </p>
                </div>
            </section>
            
            <section className="py-16 sm:py-24">
                <div className="container max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>مدخلات المدرب</CardTitle>
                                <CardDescription>زود الذكاء الاصطناعي بسياق حول الطالب.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="student-progress">ملخص تقدم الطالب</Label>
                                        <Textarea
                                            id="student-progress"
                                            placeholder="مثال: واثق من الأساسيات، يواجه صعوبة في الركن الموازي..."
                                            value={studentProgress}
                                            onChange={(e) => setStudentProgress(e.target.value)}
                                            rows={5}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="available-resources">الموارد المتاحة</Label>
                                        <Textarea
                                            id="available-resources"
                                            placeholder="مثال: خطط دروس للقيادة على الطرق السريعة، تدريبات الركن..."
                                            value={availableResources}
                                            onChange={(e) => setAvailableResources(e.target.value)}
                                            rows={5}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جارٍ التوليد...</>
                                        ) : (
                                            <><Sparkles className="mr-2 h-4 w-4" /> توليد المنهج</>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <h2 className="font-headline text-3xl font-bold">توصية الذكاء الاصطناعي</h2>
                            {loading && (
                                <Card className="flex items-center justify-center p-12">
                                    <div className="text-center text-muted-foreground space-y-4">
                                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                                        <p>يقوم الذكاء الاصطناعي بصياغة خطة الدرس المثالية...</p>
                                    </div>
                                </Card>
                            )}

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>خطأ</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {result ? (
                                <Card className="bg-primary/5">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent"/> المنهج الموصى به</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <pre className="whitespace-pre-wrap font-body text-sm bg-background p-4 rounded-md">{result.recommendedCurriculum}</pre>
                                        <Separator/>
                                        <h3 className="font-bold font-headline">الشرح</h3>
                                        <p className="text-muted-foreground text-sm">{result.explanation}</p>
                                    </CardContent>
                                    <CardFooter className="flex gap-2">
                                        <Button>تفعيل الخطة</Button>
                                        <Button variant="outline">إرسال إلى الطالب</Button>
                                    </CardFooter>
                                </Card>
                            ) : (
                                !loading && <Card className="flex items-center justify-center p-12 border-dashed">
                                    <div className="text-center text-muted-foreground">
                                        <p>سيظهر المنهج الذي تم إنشاؤه هنا.</p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
