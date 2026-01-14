
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MoveLeft } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

type HeroContent = {
  heroTitle: string;
  heroSubtitle: string;
};

const defaultContent: HeroContent = {
  heroTitle: "قُد بثقة.",
  heroSubtitle: "انضم إلى أكاديمية القيادة الآمنة للحصول على تعليمات من الخبراء، ومركبات حديثة، ونهج شخصي لمساعدتك على أن تصبح سائقًا آمنًا وواثقًا مدى الحياة."
};


export default function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getHeroContent() {
      setLoading(true);
      const docRef = doc(db, "pages", "home");
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data() as HeroContent);
        }
      } catch (error) {
        console.error("Failed to fetch hero content:", error);
      } finally {
        setLoading(false);
      }
    }
    getHeroContent();
  }, []);

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
       {loading ? (
          <>
            <div className="bg-primary/20 h-14 w-3/4 rounded-md animate-pulse mb-4" />
            <div className="bg-primary/20 h-8 w-1/2 rounded-md animate-pulse" />
          </>
        ) : (
          <>
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold !leading-tight tracking-tighter">
              {content.heroTitle}
            </h1>
            <p className="max-w-2xl mt-4 text-lg md:text-xl text-primary-foreground/80">
              {content.heroSubtitle}
            </p>
          </>
        )}
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
