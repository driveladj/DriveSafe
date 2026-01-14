import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MoveLeft } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EditableText } from "../editable-text";

type HeroContent = {
  heroTitle: string;
  heroSubtitle: string;
};

async function getHeroContent(): Promise<HeroContent> {
  const docRef = doc(db, "pages", "home");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as HeroContent;
  } else {
    // Return default content if document doesn't exist
    return {
      heroTitle: "قُد بثقة.",
      heroSubtitle: "انضم إلى أكاديمية القيادة الآمنة للحصول على تعليمات من الخبراء، ومركبات حديثة، ونهج شخصي لمساعدتك على أن تصبح سائقًا آمنًا وواثقًا مدى الحياة."
    };
  }
}

export default async function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const content = await getHeroContent();

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] bg-secondary group/hero">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-primary/60" />
      <div className="relative container h-full flex flex-col items-center justify-center text-center text-primary-foreground">
        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold !leading-tight tracking-tighter">
          <EditableText
            collection="pages"
            docId="home"
            field="heroTitle"
            initialValue={content.heroTitle}
          />
        </h1>
        <p className="max-w-2xl mt-4 text-lg md:text-xl text-primary-foreground/80">
           <EditableText
            collection="pages"
            docId="home"
            field="heroSubtitle"
            initialValue={content.heroSubtitle}
            as="textarea"
          />
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/register">
              سجل الآن <MoveLeft className="mr-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <Link href="/courses">
              دوراتنا
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
