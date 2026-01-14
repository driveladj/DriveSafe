import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { courses } from "@/lib/data";
import { ArrowLeft } from "lucide-react";

export default function CoursesSection() {
  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div className="mb-4 md:mb-0">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">دورات القيادة لدينا</h2>
                <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
                    من المبتدئين إلى المتقدمين، لدينا دورة تناسب احتياجاتك.
                </p>
            </div>
            <Button asChild variant="outline">
                <Link href="/courses">عرض كل الدورات <ArrowLeft className="mr-2"/></Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col group">
              {course.image && (
                <div className="relative h-48 w-full">
                    <Image
                        src={course.image.imageUrl}
                        alt={course.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={course.image.imageHint}
                    />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg">
                        <course.Icon className="w-6 h-6"/>
                    </div>
                    <CardTitle className="font-headline text-xl">{course.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <CardDescription className="flex-grow">{course.description}</CardDescription>
                <Button asChild variant="link" className="p-0 h-auto justify-start mt-4">
                  <Link href={`/courses#${course.id}`}>اعرف المزيد <ArrowLeft className="mr-2" size={16} /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
