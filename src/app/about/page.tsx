import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle, ShieldCheck, Target } from "lucide-react";

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-image');

    const stats = [
        { value: "10+", label: "سنوات من الخبرة" },
        { value: "5,000+", label: "طالب ناجح" },
        { value: "98%", label: "معدل النجاح من المحاولة الأولى" },
        { value: "15", label: "مدرب معتمد" },
    ];

    return (
        <>
            <section className="py-16 sm:py-24 bg-secondary">
                <div className="container text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">عن أكاديمية القيادة الآمنة</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        رواد التميز في تعليم القيادة مع الالتزام بالسلامة والثقة ومهارات القيادة مدى الحياة.
                    </p>
                </div>
            </section>

            <section className="py-16 sm:py-24">
                <div className="container grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="font-headline text-3xl font-bold text-primary">قصتنا</h2>
                        <p className="text-muted-foreground">
                            تأسست أكاديمية القيادة الآمنة منذ أكثر من عقد من الزمان، ونبعت من شغف لخلق طرق أكثر أمانًا، سائقًا تلو الآخر. لقد رأينا حاجة إلى مدرسة لتعليم القيادة تتجاوز مجرد تعليم الطلاب لاجتياز الاختبار. كان هدفنا، ولا يزال، هو تنمية فهم عميق لسلامة الطرق والتحكم في المركبات، وتمكين طلابنا بالثقة للتعامل مع أي موقف قيادة.
                        </p>
                        <p className="text-muted-foreground">
                            لقد نمونا من فريق صغير بسيارتين إلى مؤسسة رائدة في المنطقة، لكن قيمنا الأساسية المتمثلة في الصبر والاحترافية والتعليم المخصص لم تتزعزع أبدًا.
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
                        <h3 className="font-headline text-2xl font-bold">مهمتنا</h3>
                        <p className="text-muted-foreground">توفير أعلى مستويات الجودة في تعليم القيادة الذي يزود الطلاب بالمهارات والمعرفة والعقلية اللازمة لقيادة آمنة مدى الحياة.</p>
                    </div>
                    <div className="space-y-4">
                        <ShieldCheck className="mx-auto w-12 h-12 text-primary"/>
                        <h3 className="font-headline text-2xl font-bold">رؤيتنا</h3>
                        <p className="text-muted-foreground">أن نكون أكاديمية القيادة الأكثر ثقة وفعالية، وأن نضع معيارًا لسلامة الطرق وثقة السائق في مجتمعنا.</p>
                    </div>
                    <div className="space-y-4">
                        <CheckCircle className="mx-auto w-12 h-12 text-primary"/>
                        <h3 className="font-headline text-2xl font-bold">قيمنا</h3>
                        <p className="text-muted-foreground">السلامة أولاً، الاحترافية، الصبر، النزاهة، ونجاح الطالب هي الركائز التي توجه كل ما نقوم به.</p>
                    </div>
                </div>
            </section>
        </>
    );
}
