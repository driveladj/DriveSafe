'use client'

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getFeatures } from '@/lib/data-access';
import { Feature } from '@/lib/data';
import { availableIcons } from '@/lib/icons';
import { HelpCircle, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FeaturesContent {
  title: string;
  subtitle: string;
}

export default function FeaturesSection() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [content, setContent] = useState<FeaturesContent>({ title: '', subtitle: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturesAndContent = async () => {
      try {
        // Fetch dynamic features
        const fetchedFeatures = await getFeatures();
        setFeatures(fetchedFeatures);

        // Fetch content from pages/home
        const docRef = doc(db, 'pages', 'home');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent({
            title: data.featuresTitle || `لماذا تختار ${data.siteName || 'أكاديمية القيادة الآمنة'}؟`,
            subtitle: data.featuresSubtitle || 'نحن ملتزمون بتقديم أعلى مستويات الجودة في تعليم القيادة.',
          });
        } else {
          // Fallback content
          setContent({
            title: 'لماذا تختار أكاديمية القيادة الآمنة؟',
            subtitle: 'نحن ملتزمون بتقديم أعلى مستويات الجودة في تعليم القيادة.',
          });
        }

      } catch (error) {
        console.error("Error fetching data: ", error);
        // Set fallback content on error
        setContent({
            title: 'لماذا تختار أكاديمية القيادة الآمنة؟',
            subtitle: 'نحن ملتزمون بتقديم أعلى مستويات الجودة في تعليم القيادة.',
          });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturesAndContent();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">{content.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {content.subtitle}
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const IconComponent = availableIcons[feature.icon] || HelpCircle;
              return (
                <Card key={feature.id} className="text-center bg-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto bg-accent/20 text-accent p-4 rounded-full w-fit mb-4">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                    <CardDescription className="pt-2">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  );
}
