import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, DocumentData } from "firebase/firestore";

type FAQ = {
  q: string;
  a: string;
};

async function getFaqs(): Promise<FAQ[]> {
  const faqsCol = query(collection(db, 'faqs'), orderBy('order', 'asc'));
  const faqSnapshot = await getDocs(faqsCol);
  return faqSnapshot.docs.map(doc => doc.data() as FAQ);
}


export default async function FAQPage() {
  const faqs = await getFaqs();

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
            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg border px-4">
                        <AccordionTrigger className="text-right font-semibold text-lg hover:no-underline">{faq.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base">
                            {faq.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </section>
    </>
  );
}
