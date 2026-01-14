import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trafficSigns } from "@/lib/data";

export default function BannersPage() {
  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Important Traffic Signs</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            A quick reference guide for some of the most common and important road signs you&apos;ll encounter.
          </p>
        </div>
      </section>
      
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trafficSigns.map((sign, index) => (
                sign.image && <Card key={index} className="text-center">
                <CardHeader>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={sign.image.imageUrl}
                      alt={sign.title}
                      fill
                      className="object-contain"
                      data-ai-hint={sign.image.imageHint}
                    />
                  </div>
                  <CardTitle className="font-headline text-xl">{sign.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{sign.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
