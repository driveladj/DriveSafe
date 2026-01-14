
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type PricingTier } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Check, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function PricingPage() {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPricingTiers() {
      setLoading(true);
      try {
        const pricesCol = query(collection(db, 'pricingTiers'), orderBy('price', 'asc'));
        const priceSnapshot = await getDocs(pricesCol);
        setPricingTiers(priceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PricingTier)));
      } catch (error) {
        console.error("Error fetching pricing tiers:", error);
      } finally {
        setLoading(false);
      }
    }
    getPricingTiers();
  }, []);

  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">خطط أسعار مرنة</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            اختر الباقة التي تناسب أهدافك التعليمية وميزانيتك. جميع الخطط مصممة لتوفير أقصى قيمة.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : pricingTiers.length > 0 ? (
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
                      <Star size={16} className="fill-current"/> أفضل قيمة
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.licenseType}</CardDescription>
                    <div className="py-4">
                      <span className="font-headline text-5xl font-bold">${tier.price}</span>
                      <span className="text-muted-foreground">/ للباقة</span>
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
                      <Link href="/register">اختر الخطة</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-lg">
              <p className="text-muted-foreground">سيتم عرض خطط الأسعار هنا قريبًا.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

    