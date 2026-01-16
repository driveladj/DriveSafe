
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import SiteHeader from '@/components/layout/header';
import SiteFooter from '@/components/layout/footer';
import { AuthProvider } from '@/hooks/use-auth.tsx';
import DynamicStyles from '@/components/layout/dynamic-styles';

export const metadata: Metadata = {
  title: 'أكاديمية القيادة الآمنة',
  description: 'شريكك الموثوق لتعلم القيادة بأمان وثقة.',
  keywords: ['مدرسة لتعليم قيادة السيارات', 'تعلم القيادة', 'دروس القيادة', 'تعليم السياقة'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&family=Cairo:wght@400;700;900&family=Almarai:wght@400;700&family=Readex+Pro:wght@400;600&display=swap" rel="stylesheet" />
        <DynamicStyles />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
            <div className="relative flex min-h-screen flex-col bg-background">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
            </div>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
