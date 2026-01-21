
'use client';

import { Car } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { staticHomePageContent } from "@/lib/data";

export default function Logo({ className }: { className?: string }) {
  // In the offline version, we use a static site name.
  const siteName = staticHomePageContent.siteName;

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Car className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold font-headline text-primary hidden sm:inline-block">
        {siteName}
      </span>
    </Link>
  );
}
