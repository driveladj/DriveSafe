import HeroSection from '@/components/home/hero-section';
import FeaturesSection from '@/components/home/features-section';
import OwnerSection from '@/components/home/owner-section';
import CoursesSection from '@/components/home/courses-section';
import TestimonialsSection from '@/components/home/testimonials-section';
import CtaSection from '@/components/home/cta-section';
import GallerySection from '@/components/home/gallery-section';
import AnnouncementBar from '@/components/layout/announcement-bar';

export default function Home() {
  return (
    <div className="flex flex-col">
      <AnnouncementBar />
      <HeroSection />
      <FeaturesSection />
      <OwnerSection />
      <CoursesSection />
      <GallerySection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}
