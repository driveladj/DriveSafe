import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingTiers } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Check, Star } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Flexible Pricing Plans</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Choose the package that best suits your learning goals and budget. All plans are designed to provide maximum value.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.id} 
                className={cn(
                  "flex flex-col h-full", 
                  tier.bestDeal && "border-primary border-2 relative shadow-2xl"
                )}
              >
                {tier.bestDeal && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star size={16} className="fill-current"/> Best Value
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.licenseType}</CardDescription>
                  <div className="py-4">
                    <span className="font-headline text-5xl font-bold">${tier.price}</span>
                    <span className="text-muted-foreground">/ package</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-accent" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className={cn("w-full", !tier.bestDeal && "bg-accent hover:bg-accent/80")} size="lg">
                    <Link href="/register">Choose Plan</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
