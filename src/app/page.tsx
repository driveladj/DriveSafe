import HeroSection from '@/components/home/hero-section';
import FeaturesSection from '@/components/home/features-section';
import CoursesSection from '@/components/home/courses-section';
import TestimonialsSection from '@/components/home/testimonials-section';
import CtaSection from '@/components/home/cta-section';
import GallerySection from '@/app/home/gallery-section';
import AnnouncementBar from '@/components/layout/announcement-bar';

export default function Home() {
  return (
    <div className="flex flex-col">
      <AnnouncementBar />
      <HeroSection />
      <FeaturesSection />
      <CoursesSection />
      <GallerySection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}
