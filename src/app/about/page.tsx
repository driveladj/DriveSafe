
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle, ShieldCheck, Target, Camera } from "lucide-react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@//lib/firebase';

// Define a type for the page content for type safety
interface AboutContent {
  title: string;
  subtitle: string;
  storyTitle: string;
  storyContent: string;
  // This will hold image URLs once the upload is functional
  imageUrls?: string[];
}

// Async function to fetch content from Firestore
async function getAboutContent(): Promise<AboutContent> {
  const docRef = doc(db, 'pages', 'about');
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Return data from Firestore if it exists
      return docSnap.data() as AboutContent;
    }
  } catch (error) {
    console.error("Failed to fetch about page content:", error);
    // Fallback to default content in case of an error
  }

  // Return default content if document doesn't exist or an error occurred
  return {
    title: 'حول أكاديمية القيادة الآمنة',
    subtitle: 'مهمتنا هي تمكين السائقين بالمعرفة والمهارات اللازمة للتنقل في طرق اليوم بثقة وسلامة.',
    storyTitle: 'قصتنا',
    storyContent: 'تأسست أكاديميتنا على يد فريق من المدربين ذوي الخبرة والشغف بالقيادة الدفاعية، ونحن ملتزمون بإنشاء جيل جديد من السائقين المسؤولين. نحن نؤمن بأن تعليم القيادة يتجاوز مجرد اجتياز الاختبار؛ إنه يتعلق بغرس عادات تدوم مدى الحياة وتحافظ على سلامة الجميع على الطريق.',
  };
}


export default async function AboutPage() {
    // Fetch the dynamic content when the page loads
    const content = await getAboutContent();

    const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-image');
    
    // Placeholder gallery images until the upload feature is fully implemented
    const galleryImages = PlaceHolderImages.filter(p => ['course-in-action', 'driving-test', 'happy-student', 'instructor-teaching'].includes(p.id));

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
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">{content.title}</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        {content.subtitle}
                    </p>
                </div>
            </section>

            <section className="py-16 sm:py-24">
                <div className="container grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="font-headline text-3xl font-bold text-primary">{content.storyTitle}</h2>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                           {content.storyContent}
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
            
            {/* New Image Gallery Section */}
            <section className="py-16 sm:py-24 bg-secondary">
                <div className="container">
                    <div className="text-center mb-12">
                         <div className="inline-flex items-center justify-center bg-primary-100 p-3 rounded-full mb-4">
                            <Camera className="w-8 h-8 text-primary"/>
                        </div>
                        <h2 className="font-headline text-3xl md:text-4xl font-bold">معرض الصور</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                            نظرة على بيئتنا التعليمية وسياراتنا الحديثة وطلابنا.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {galleryImages.map(image => (
                            <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
                                <Image 
                                    src={image.imageUrl}
                                    alt={image.description}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                                />
                                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                                <div className="absolute bottom-0 left-0 p-4">
                                    <p className="text-white text-sm font-semibold drop-shadow-md">{image.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-16 sm:py-24">
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

            <section className="py-16 sm:py-24 bg-secondary">
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
