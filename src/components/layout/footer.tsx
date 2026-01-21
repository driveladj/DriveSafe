
'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Facebook, Phone, Mail } from "lucide-react";
import Logo from "./logo";
import { staticFooterContent } from '@/lib/data';

interface FooterContent {
  phone: string;
  email: string;
  facebookUrl: string;
  workHoursWeek: string;
  workHoursSat: string;
  workHoursSun: string;
}

const defaultContent: FooterContent = staticFooterContent;

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const [content, setContent] = useState<FooterContent>(defaultContent);

  useEffect(() => {
    // In the offline version, we just use the static content.
    setContent(defaultContent);
  }, []);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            رحلتك نحو قيادة آمنة وواثقة تبدأ هنا.
          </p>
        </div>

        <div>
          <h4 className="font-headline font-semibold mb-4">روابط سريعة</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-muted-foreground hover:text-primary">من نحن</Link></li>
            <li><Link href="/courses" className="text-muted-foreground hover:text-primary">الدورات</Link></li>
            <li><Link href="/pricing" className="text-muted-foreground hover:text-primary">الأسعار</Link></li>
            <li><Link href="/faq" className="text-muted-foreground hover:text-primary">الأسئلة الشائعة</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-semibold mb-4">اتصل بنا</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Phone size={16} /> <span>{content.phone}</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Mail size={16} /> <span>{content.email}</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
               <a href={content.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary"><Facebook size={16} /> فيسبوك</a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-headline font-semibold mb-4">ساعات العمل</h4>
          <p className="text-sm text-muted-foreground">
            {content.workHoursWeek}
          </p>
          <p className="text-sm text-muted-foreground">
            {content.workHoursSat}
          </p>
          <p className="text-sm text-muted-foreground">
            {content.workHoursSun}
          </p>
        </div>
      </div>
      <div className="bg-background">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          © {currentYear} أكاديمية القيادة الآمنة. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
