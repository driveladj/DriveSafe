
'use client';

import { Car } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Logo({ className }: { className?: string }) {
  const [siteName, setSiteName] = useState('أكاديمية القيادة...');

  useEffect(() => {
    async function getSiteName() {
      const docRef = doc(db, "pages", "home");
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().siteName) {
          setSiteName(docSnap.data().siteName);
        } else {
          setSiteName('أكاديمية القيادة الآمنة');
        }
      } catch (error) {
        console.error("Failed to fetch site name:", error);
        setSiteName('أكاديمية القيادة الآمنة');
      }
    }
    getSiteName();
  }, []);


  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Car className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold font-headline text-primary hidden sm:inline-block">
        {siteName}
      </span>
    </Link>
  );
}
