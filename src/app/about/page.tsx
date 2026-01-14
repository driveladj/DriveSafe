import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle, ShieldCheck, Target } from "lucide-react";

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-image');

    const stats = [
        { value: "10+", label: "Years of Experience" },
        { value: "5,000+", label: "Successful Students" },
        { value: "98%", label: "First-Time Pass Rate" },
        { value: "15", label: "Certified Instructors" },
    ];

    return (
        <>
            <section className="py-16 sm:py-24 bg-secondary">
                <div className="container text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">About DriveSafe Academy</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        Pioneering excellence in driver education with a commitment to safety, confidence, and lifelong driving skills.
                    </p>
                </div>
            </section>

            <section className="py-16 sm:py-24">
                <div className="container grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="font-headline text-3xl font-bold text-primary">Our Story</h2>
                        <p className="text-muted-foreground">
                            Founded over a decade ago, DriveSafe Academy was born from a passion for creating safer roads, one driver at a time. We saw a need for a driving school that went beyond just teaching students to pass a test. Our goal was, and remains, to cultivate a deep understanding of road safety and vehicle control, empowering our students with the confidence to handle any driving situation.
                        </p>
                        <p className="text-muted-foreground">
                            We have grown from a small team with two cars to a leading institution in the region, but our core values of patience, professionalism, and personalized instruction have never wavered.
                        </p>
                    </div>
                    <div>
                        {aboutImage && (
                            <Image
                                src={aboutImage.imageUrl}
                                alt={aboutImage.description}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-lg"
                                data-ai-hint={aboutImage.imageHint}
                            />
                        )}
                    </div>
                </div>
            </section>
            
            <section className="py-16 sm:py-24 bg-secondary">
                <div className="container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {stats.map(stat => (
                            <div key={stat.label} className="bg-card p-6 rounded-lg shadow">
                                <p className="font-headline text-4xl font-bold text-accent">{stat.value}</p>
                                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-24">
                <div className="container grid md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-4">
                        <Target className="mx-auto w-12 h-12 text-primary"/>
                        <h3 className="font-headline text-2xl font-bold">Our Mission</h3>
                        <p className="text-muted-foreground">To provide the highest quality driver education that equips students with the skills, knowledge, and mindset for a lifetime of safe driving.</p>
                    </div>
                    <div className="space-y-4">
                        <ShieldCheck className="mx-auto w-12 h-12 text-primary"/>
                        <h3 className="font-headline text-2xl font-bold">Our Vision</h3>
                        <p className="text-muted-foreground">To be the most trusted and effective driving academy, setting the standard for road safety and driver confidence in our community.</p>
                    </div>
                    <div className="space-y-4">
                        <CheckCircle className="mx-auto w-12 h-12 text-primary"/>
                        <h3 className="font-headline text-2xl font-bold">Our Values</h3>
                        <p className="text-muted-foreground">Safety First, Professionalism, Patience, Integrity, and Student Success are the pillars that guide everything we do.</p>
                    </div>
                </div>
            </section>
        </>
    );
}
