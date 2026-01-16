
'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, ListTree, BookOpen, FilePenLine, DollarSign } from 'lucide-react';

const adminRoutes = [
  {
    href: `/admin`,
    label: "لوحة التحكم",
    icon: LayoutDashboard
  },
  {
    href: `/admin/trainees`,
    label: "المتدربون",
    icon: Users
  },
  {
    href: `/admin/financials`,
    label: "الأمور المالية",
    icon: DollarSign
  },
    {
    href: `/admin/courses`,
    label: "الدورات التدريبية",
    icon: BookOpen
  },
  {
    href: `/admin/exams`,
    label: "الامتحانات",
    icon: FilePenLine
  }
];

export function AdminNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {adminRoutes.map((route) => {
        const Icon = route.icon;
        const isActive = pathname === route.href;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}
