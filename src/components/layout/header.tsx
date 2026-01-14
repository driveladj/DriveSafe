
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from './logo';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userDetails, signOutUser, loading } = useAuth();

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/');
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setIsMobileMenuOpen(false)}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );

  const getInitials = (firstName = '', lastName = '') => {
      const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
      const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
      return `${firstInitial}${lastInitial}`;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Navigation */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                   <Logo />
                </div>
                <nav className="flex-grow grid gap-4 p-4 text-lg">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                  ))}
                </nav>
                <div className="p-4 border-t">
                  {user ? (
                      <Button onClick={handleSignOut} className="w-full" size="lg" variant="secondary">
                        <LogOut className="ml-2 h-4 w-4" />
                        تسجيل الخروج
                      </Button>
                  ) : (
                    <Button asChild className="w-full" size="lg">
                      <Link href="/register">سجل الآن</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!loading && (
            user && userDetails ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                       <AvatarFallback>{getInitials(userDetails.firstName, userDetails.lastName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userDetails.firstName} {userDetails.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userDetails.role === 'admin' ? 'مدير' : 'متدرب'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={userDetails.role === 'admin' ? '/admin' : '/dashboard'}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>لوحة التحكم</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild className="hidden md:flex">
                  <Link href="/register">التسجيل</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">تسجيل الدخول</Link>
                </Button>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
