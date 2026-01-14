import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";

export default function GalleryPage() {
  const galleryImages = [
    'car-1', 'classroom-1', 'student-1', 'cones-1', 
    'car-interior-1', 'motorcycle-1', 'about-us-image',
    'car-2', 'student-2', 'hero-1'
  ].map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);

  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">معرض الصور</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            استكشف أكاديميتنا، ومركبات التدريب الحديثة، واللحظات التي تجعلنا فخورين.
          </p>
        </div>
      </section>
      
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((img, index) => (
              img && (
                <div key={index} className="group relative aspect-video w-full h-full overflow-hidden rounded-lg">
                  <Image
                    src={img.imageUrl}
                    alt={img.description}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    data-ai-hint={img.imageHint}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">{img.description}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
