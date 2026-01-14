
'use client';

import { Car } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Icon, ICONS } from "@/lib/icons.tsx";

export default function Logo({ className }: { className?: string }) {
  const [siteName, setSiteName] = useState('أكاديمية القيادة...');
  const [logoIcon, setLogoIcon] = useState<keyof typeof ICONS>('Car');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "pages", "home");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSiteName(data.siteName || 'أكاديمية القيادة الآمنة');
          setLogoIcon(data.logoIcon || 'Car');
        } else {
          // Set default values if document doesn't exist
          setSiteName('أكاديمية القيادة الآمنة');
          setLogoIcon('Car');
        }
        setLoading(false);
    }, (error) => {
        console.error("Failed to fetch site config:", error);
        setSiteName('أكاديمية القيادة الآمنة');
        setLogoIcon('Car');
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Icon name={logoIcon} className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold font-headline text-primary hidden sm:inline-block">
        {loading ? '...' : siteName}
      </span>
    </Link>
  );
}
