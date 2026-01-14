import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft } from "lucide-react";

export default function GallerySection() {
    const galleryImages = [
        PlaceHolderImages.find(p => p.id === 'car-1'),
        PlaceHolderImages.find(p => p.id === 'classroom-1'),
        PlaceHolderImages.find(p => p.id === 'student-1'),
        PlaceHolderImages.find(p => p.id === 'car-2'),
    ].filter(Boolean);

    return (
        <section className="py-16 sm:py-24 bg-background">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">لمحة عن أكاديميتنا</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        شاهد منشآتنا الحديثة ومركباتنا وطلابنا السعداء أثناء العمل.
                    </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {galleryImages.map((img, index) => (
                        img && <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                            <Image 
                                src={img.imageUrl} 
                                alt={img.description} 
                                fill 
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={img.imageHint} 
                            />
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <Button asChild size="lg">
                        <Link href="/gallery">عرض المعرض بالكامل <ArrowLeft className="mr-2"/></Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
