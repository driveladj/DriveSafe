
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MoveLeft } from "lucide-react";
import { staticHomePageContent } from "@/lib/data";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type HeroContent = {
  heroTitle: string;
  heroSubtitle: string;
};

const defaultContent: HeroContent = {
  heroTitle: staticHomePageContent.heroTitle,
  heroSubtitle: staticHomePageContent.heroSubtitle
};


export default function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [loading, setLoading] = useState(false); // No loading in offline mode

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
            <Skeleton className="h-14 w-3/4 max-w-2xl rounded-md mb-4" />
            <Skeleton className="h-16 w-full max-w-xl rounded-md" />
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
