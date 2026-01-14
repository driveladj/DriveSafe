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
            Your journey to safe and confident driving starts here.
          </p>
        </div>

        <div>
          <h4 className="font-headline font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
            <li><Link href="/courses" className="text-muted-foreground hover:text-primary">Courses</Link></li>
            <li><Link href="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
            <li><Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Phone size={16} /> <span>+1 (234) 567-890</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Mail size={16} /> <span>contact@drivesafe.com</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
               <a href="#" className="flex items-center gap-2 hover:text-primary"><Facebook size={16} /> Facebook</a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-headline font-semibold mb-4">Working Hours</h4>
          <p className="text-sm text-muted-foreground">
            Monday - Friday: 9:00 AM - 7:00 PM
          </p>
          <p className="text-sm text-muted-foreground">
            Saturday: 10:00 AM - 4:00 PM
          </p>
          <p className="text-sm text-muted-foreground">
            Sunday: Closed
          </p>
        </div>
      </div>
      <div className="bg-background">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          © {currentYear} DriveSafe Academy. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
