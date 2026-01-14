import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MoveRight } from "lucide-react";

export default function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] bg-secondary">
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
          Drive with Confidence.
        </h1>
        <p className="max-w-2xl mt-4 text-lg md:text-xl text-primary-foreground/80">
          Join DriveSafe Academy for expert instruction, modern vehicles, and a personalized approach to help you become a safe and confident driver for life.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/register">
              Register Now <MoveRight className="ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <Link href="/courses">
              Our Courses
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
