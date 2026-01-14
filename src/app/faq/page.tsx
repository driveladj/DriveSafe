
'use client';

import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Loader2 } from 'lucide-react';

type FAQ = {
  q: string;
  a: string;
};

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFaqs() {
      setLoading(true);
      const faqsCol = query(collection(db, 'faqs'), orderBy('order', 'asc'));
      const faqSnapshot = await getDocs(faqsCol);
      setFaqs(faqSnapshot.docs.map(doc => doc.data() as FAQ));
      setLoading(false);
    }
    getFaqs();
  }, []);

  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">الأسئلة الشائعة</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            اعثر على إجابات للأسئلة الشائعة حول دوراتنا وعملية التسجيل والمزيد.
          </p>
        </div>
      </section>
      
      <section className="py-16 sm:py-24">
        <div className="container max-w-4xl">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg border px-4">
                        <AccordionTrigger className="text-right font-semibold text-lg hover:no-underline">{faq.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base">
                            {faq.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
                {faqs.length === 0 && (
                  <div className="text-center py-12 bg-card rounded-lg">
                      <p className="text-muted-foreground">سيتم عرض الأسئلة الشائعة هنا قريباً.</p>
                  </div>
                )}
            </Accordion>
          )}
        </div>
      </section>
    </>
  );
}
