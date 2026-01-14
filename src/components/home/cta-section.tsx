import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold max-w-3xl mx-auto">Ready to Get Behind the Wheel?</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your journey to becoming a safe, confident driver begins now. Join the hundreds of successful students who chose DriveSafe Academy.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/register">
              Enroll Today <MoveRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
