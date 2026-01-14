
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { type Testimonial } from "@/lib/data";
import { Smile, Star, Users, HeartHandshake, Loader2, LucideProps, ForwardRefExoticComponent } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const avatarIcons: { [key: string]: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> } = {
    'Smile': Smile,
    'Users': Users,
    'HeartHandshake': HeartHandshake,
};

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const testimonialsCol = query(collection(db, 'testimonials'), orderBy('name'));
    
    const unsubscribe = onSnapshot(testimonialsCol, (snapshot) => {
        const fetchedTestimonials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
        setTestimonials(fetchedTestimonials);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching testimonials:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">ماذا يقول طلابنا</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            قصص حقيقية من سائقين بدأوا رحلتهم معنا.
          </p>
        </div>
        {loading ? (
             <div className="flex justify-center items-center h-48">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => {
                const AvatarIcon = avatarIcons[testimonial.avatar] || Smile;
                return (
                <Card key={testimonial.id} className="flex flex-col justify-between">
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
                        <AvatarIcon className="w-6 h-6" />
                        </div>
                        <div>
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                    </div>
                    </div>
                </Card>
                )
            })}
            </div>
        ) : (
            <div className="text-center py-12 bg-card rounded-lg">
                <p className="text-muted-foreground">سيتم عرض آراء الطلاب هنا قريبًا.</p>
            </div>
        )}
      </div>
    </section>
  );
}
