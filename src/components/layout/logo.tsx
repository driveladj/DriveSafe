
'use client';

import { Car } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Icon, ICONS } from "@/lib/icons";

export default function Logo({ className }: { className?: string }) {
  const [siteName, setSiteName] = useState('أكاديمية القيادة...');
  const [logoIcon, setLogoIcon] = useState<keyof typeof ICONS>('Car');

  useEffect(() => {
    async function getSiteConfig() {
      const docRef = doc(db, "pages", "home");
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSiteName(data.siteName || 'أكاديمية القيادة الآمنة');
          setLogoIcon(data.logoIcon || 'Car');
        } else {
          setSiteName('أكاديمية القيادة الآمنة');
          setLogoIcon('Car');
        }
      } catch (error) {
        console.error("Failed to fetch site config:", error);
        setSiteName('أكاديمية القيادة الآمنة');
        setLogoIcon('Car');
      }
    }
    getSiteConfig();
  }, []);


  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Icon name={logoIcon} className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold font-headline text-primary hidden sm:inline-block">
        {siteName}
      </span>
    </Link>
  );
}
