import Image from "next/image";
import { Button } from "@/components/ui/button";
import { courses } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">دورات القيادة لدينا</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            نحن نقدم مجموعة من الدورات المصممة لتلبية احتياجاتك الخاصة، سواء كنت سائقًا جديدًا أو تتطلع إلى تحسين مهاراتك.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="space-y-12">
            {courses.map((course, index) => (
              <div key={course.id} id={course.id} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className={`relative h-80 rounded-lg overflow-hidden ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                  {course.image && (
                    <Image
                      src={course.image.imageUrl}
                      alt={course.name}
                      fill
                      className="object-cover"
                      data-ai-hint={course.image.imageHint}
                    />
                  )}
                   <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg">
                      <course.Icon className="w-8 h-8" />
                    </div>
                    <h2 className="font-headline text-3xl font-bold">{course.name}</h2>
                  </div>
                  <p className="text-muted-foreground text-lg">{course.description}</p>
                  <p className="font-semibold text-primary">{course.details}</p>
                  <Button asChild className="mt-4 bg-accent hover:bg-accent/90">
                    <Link href="/register">التسجيل في هذه الدورة <ArrowLeft className="mr-2"/></Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
