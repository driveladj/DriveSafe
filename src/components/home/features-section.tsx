import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { features } from "@/lib/data";

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose DriveSafe Academy?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We are committed to providing the highest quality driving education.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-accent/20 text-accent p-4 rounded-full w-fit mb-4">
                  <feature.Icon className="w-8 h-8" />
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
