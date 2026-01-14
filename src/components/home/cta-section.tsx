import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold max-w-3xl mx-auto">هل أنت مستعد للجلوس خلف عجلة القيادة؟</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          رحلتك لتصبح سائقًا آمنًا وواثقًا تبدأ الآن. انضم إلى مئات الطلاب الناجحين الذين اختاروا أكاديمية القيادة الآمنة.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/register">
              سجل اليوم <MoveLeft className="mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
