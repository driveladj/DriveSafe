import { SteeringWheel } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <SteeringWheel className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold font-headline text-primary hidden sm:inline-block">
        DriveSafe Academy
      </span>
    </Link>
  );
}
