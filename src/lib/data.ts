import type { LucideIcon } from "lucide-react";
import { Award, Car, Check, HeartHandshake, Bike, Presentation, Smile, Star, Users } from "lucide-react";
import { PlaceHolderImages } from "./placeholder-images";

export const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/courses', label: 'Courses' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/banners', label: 'Banners' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
];

export const features = [
    {
        Icon: Award,
        title: "Certified Instructors",
        description: "Our instructors are government-certified, experienced, and dedicated to your success.",
    },
    {
        Icon: Star,
        title: "High Success Rate",
        description: "We pride ourselves on a high pass rate, thanks to our effective teaching methods.",
    },
    {
        Icon: Car,
        title: "Modern Vehicles",
        description: "Learn to drive in a fleet of new, safe, and dual-controlled vehicles.",
    },
    {
        Icon: Users,
        title: "Personalized Training",
        description: "We tailor our lessons to your individual learning pace and needs for better results.",
    },
];

export const courses = [
  { 
    id: 'b-license', 
    name: 'Class B License', 
    description: 'Comprehensive training for passenger cars, from basic maneuvers to complex traffic situations.', 
    details: '40 hours of training, including 20 hours of theory and 20 hours of practical lessons.', 
    Icon: Car,
    image: PlaceHolderImages.find(img => img.id === 'car-interior-1'),
  },
  { 
    id: 'moto-license', 
    name: 'Motorcycle License', 
    description: 'Learn to ride and handle motorcycles safely on the road with our expert guidance.', 
    details: '25 hours of specialized training for all types of motorcycles (A1, A2, A).', 
    Icon: Bike,
    image: PlaceHolderImages.find(img => img.id === 'motorcycle-1'),
  },
  {
    id: 'theory-course',
    name: 'Theory-Only Course',
    description: 'Prepare for your theoretical exam with our intensive classroom and online resources.',
    details: '20 hours of in-depth classroom sessions covering all traffic laws and signs.',
    Icon: Presentation,
    image: PlaceHolderImages.find(img => img.id === 'classroom-1'),
  }
];

export const pricingTiers = [
  { 
    id: 'basic', 
    name: 'Basic Package', 
    price: '450', 
    licenseType: 'Class B', 
    features: ['20 Theory Lessons', '20 Practical Lessons', 'Internal Exam'], 
    bestDeal: false 
  },
  { 
    id: 'premium', 
    name: 'Premium Package', 
    price: '650', 
    licenseType: 'Class B', 
    features: ['Unlimited Theory Lessons', '30 Practical Lessons', 'Official Exam Fee Included', 'Personalized Progress Tracking'], 
    bestDeal: true 
  },
  { 
    id: 'motorcycle', 
    name: 'Motorcycle Course', 
    price: '350', 
    licenseType: 'Motorcycle (A)', 
    features: ['15 Theory Lessons', '20 Practical Lessons', 'Gear Provided'], 
    bestDeal: false 
  },
];


export const faqs = [
  { q: 'What are the requirements to enroll?', a: 'You must be at least 18 years old and possess a valid national ID card. For some license categories, a medical certificate may be required.' },
  { q: 'How long does the training take?', a: 'The duration depends on the package you choose and your personal learning speed. On average, students complete the Class B license training in 2 to 3 months.' },
  { q: 'Can I schedule lessons on weekends?', a: 'Yes, we offer flexible scheduling, including evenings and weekends, to accommodate your busy lifestyle. Please contact us to check for availability.' },
  { q: 'What is included in the package price?', a: 'Each package price includes the specified number of theory and practical lessons. Official exam fees may be separate unless specified, as in our Premium Package.' },
  { q: 'Do I need my own vehicle?', a: 'No, all training is conducted in our modern, dual-controlled vehicles for your safety and convenience. For motorcycle courses, we also provide the vehicle and safety gear.' },
];

export const testimonials = [
  {
    name: "Aisha K.",
    role: "New Driver",
    avatar: Smile,
    comment: "DriveSafe Academy made learning to drive so easy and stress-free! My instructor was incredibly patient and supportive. I passed my test on the first try!",
  },
  {
    name: "Mohammed R.",
    role: "Motorcycle Enthusiast",
    avatar: Users,
    comment: "The motorcycle course was fantastic. The instructors are true experts and focus heavily on safety. I feel much more confident on the road now. Highly recommended!",
  },
  {
    name: "Fatima Z.",
    role: "Student",
    avatar: HeartHandshake,
    comment: "I was very nervous about driving, but the team at DriveSafe was so welcoming. They helped me build my confidence step by step. A wonderful experience!",
  },
];

export const trafficSigns = [
    {
      title: "Stop Sign",
      description: "A mandatory sign requiring drivers to come to a complete stop and ensure the intersection is clear before proceeding.",
      image: PlaceHolderImages.find(img => img.id === 'stop-sign'),
    },
    {
      title: "Yield Sign",
      description: "Indicates that drivers must slow down and be prepared to stop to let other traffic (including pedestrians and cyclists) pass before proceeding.",
      image: PlaceHolderImages.find(img => img.id === 'yield-sign'),
    },
    {
      title: "Speed Limit 50",
      description: "Sets the maximum legal speed at 50 kilometers per hour (or miles per hour, depending on the country) for the stretch of road ahead.",
      image: PlaceHolderImages.find(img => img.id === 'speed-limit-sign'),
    }
]
