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
    const [studentProgress, setStudentProgress] = useState('Student shows good vehicle control but struggles with judging distances for parking and has anxiety in heavy traffic.');
    const [availableResources, setAvailableResources] = useState('Lesson plans: Parallel Parking, 3-Point Turns, Highway Driving, Defensive Driving Techniques. Exercises: Cone weaving, Emergency braking, Roundabout navigation.');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AICurriculumRecommendationOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentProgress || !availableResources) {
            setError("Please fill in both fields.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const output = await aiCurriculumRecommendation({ studentProgress, availableResources });
            setResult(output);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="py-16 sm:py-24 bg-secondary">
                <div className="container text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">AI Curriculum Generator</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        Leverage AI to create personalized learning plans. Input student progress and available resources to get a tailored curriculum recommendation.
                    </p>
                </div>
            </section>
            
            <section className="py-16 sm:py-24">
                <div className="container max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>Instructor Input</CardTitle>
                                <CardDescription>Provide the AI with context about the student.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="student-progress">Student Progress Summary</Label>
                                        <Textarea
                                            id="student-progress"
                                            placeholder="e.g., Confident with basics, struggles with parallel parking..."
                                            value={studentProgress}
                                            onChange={(e) => setStudentProgress(e.target.value)}
                                            rows={5}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="available-resources">Available Resources</Label>
                                        <Textarea
                                            id="available-resources"
                                            placeholder="e.g., Lesson plans for highway driving, parking drills..."
                                            value={availableResources}
                                            onChange={(e) => setAvailableResources(e.target.value)}
                                            rows={5}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                                        ) : (
                                            <><Sparkles className="mr-2 h-4 w-4" /> Generate Curriculum</>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <h2 className="font-headline text-3xl font-bold">AI Recommendation</h2>
                            {loading && (
                                <Card className="flex items-center justify-center p-12">
                                    <div className="text-center text-muted-foreground space-y-4">
                                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                                        <p>Our AI is crafting the perfect lesson plan...</p>
                                    </div>
                                </Card>
                            )}

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {result ? (
                                <Card className="bg-primary/5">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent"/> Recommended Curriculum</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <pre className="whitespace-pre-wrap font-body text-sm bg-background p-4 rounded-md">{result.recommendedCurriculum}</pre>
                                        <Separator/>
                                        <h3 className="font-bold font-headline">Explanation</h3>
                                        <p className="text-muted-foreground text-sm">{result.explanation}</p>
                                    </CardContent>
                                    <CardFooter className="flex gap-2">
                                        <Button>Activate Plan</Button>
                                        <Button variant="outline">Send to Student</Button>
                                    </CardFooter>
                                </Card>
                            ) : (
                                !loading && <Card className="flex items-center justify-center p-12 border-dashed">
                                    <div className="text-center text-muted-foreground">
                                        <p>Your generated curriculum will appear here.</p>
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
