import Link from "next/link";
import { Facebook, Phone, Mail } from "lucide-react";
import Logo from "./logo";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

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
              <Phone size={16} /> <span>+1 (234) 567-890</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Mail size={16} /> <span>contact@drivesafe.com</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
               <a href="#" className="flex items-center gap-2 hover:text-primary"><Facebook size={16} /> فيسبوك</a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-headline font-semibold mb-4">ساعات العمل</h4>
          <p className="text-sm text-muted-foreground">
            الاثنين - الجمعة: 9:00 صباحًا - 7:00 مساءً
          </p>
          <p className="text-sm text-muted-foreground">
            السبت: 10:00 صباحًا - 4:00 مساءً
          </p>
          <p className="text-sm text-muted-foreground">
            الأحد: مغلق
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
