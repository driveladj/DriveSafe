import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/lib/data";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">ماذا يقول طلابنا</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            قصص حقيقية من سائقين بدأوا رحلتهم معنا.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <CardContent className="p-6">
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <blockquote className="italic text-muted-foreground">&quot;{testimonial.comment}&quot;</blockquote>
              </CardContent>
              <div className="bg-muted p-6 mt-auto">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center ml-4">
                    <testimonial.avatar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
