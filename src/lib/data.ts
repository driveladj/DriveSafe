
import type { LucideIcon } from "lucide-react";
import { Car, Bike, Presentation, Book } from "lucide-react";

export const navItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/about', label: 'من نحن' },
    { href: '/courses', label: 'الدورات' },
    { href: '/pricing', label: 'الأسعار' },
    { href: '/traffic-signs', label: 'إشارات المرور' },
    { href: '/gallery', label: 'المعرض' },
    { href: '/faq', label: 'الأسئلة الشائعة' },
    { href: '/contact', label: 'اتصل بنا' },
];

export type Feature = {
    id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
};

// Defines the basic license category (e.g., Class B)
export type LicenseCategory = {
  id: string;
  name: string;
  description?: string; // Optional short description
  createdAt?: any; // Firestore Timestamp
};

// Defines a training course that belongs to a specific license category
export type Course = {
    id:string;
    name: string;
    description?: string;
    details?: string;
    categoryId: string; // ID from LicenseCategory
    categoryName: string; // Name from LicenseCategory
    createdAt?: any; // Firestore Timestamp
};

// Defines an exam in the learning path
export type Exam = {
  id: string;
  name: string;
  description?: string;
  order: number; // The sequence of the exam in the path
  createdAt?: any; // Firestore Timestamp
};

// Represents the status of a specific exam for a single trainee
export type TraineeExam = {
  id: string; // This will be the same as the Exam ID for easy mapping
  status: 'not_started' | 'scheduled' | 'passed' | 'failed';
  scheduledDate?: any; // Firestore Timestamp for the exam date
  resultDate?: any; // Firestore Timestamp for when the result was recorded
};


export type FAQ = {
  id: string;
  q: string;
  a: string;
  order: number;
};

export type PricingTier = {
    id: string;
    name: string;
    price: number;
    licenseType: string;
    features: string[];
    bestDeal: boolean;
};

export type Testimonial = {
    id: string;
    name: string;
    role: string;
    avatar: 'Smile' | 'Users' | 'HeartHandshake';
    comment: string;
    status: 'pending' | 'approved';
};

// The following might be part of a legacy system for displaying courses.
// It can be adapted or removed later.
const courseIcons: {[key: string]: LucideIcon} = {
    'b-license': Car,
    'moto-license': Bike,
    'theory-course': Presentation,
}

const courseImages: {[key: string]: any} = {
    'b-license': {
      "id": "car-interior-1",
      "description": "The dashboard of a modern training vehicle.",
      "imageUrl": "https://images.unsplash.com/photo-1615153633779-5c932c7f4cad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxjYXIlMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzY4MjkzNzEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "car dashboard"
    },
    'moto-license': {
      "id": "motorcycle-1",
      "description": "A sleek motorcycle for specialized training.",
      "imageUrl": "https://images.unsplash.com/photo-1758887698915-779ef395fc39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxtb3RvcmN5Y2xlJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzY4Mzc1NDc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "motorcycle training"
    },
    'theory-course': {
      "id": "classroom-1",
      "description": "A bright and modern classroom for theory lessons.",
      "imageUrl": "https://images.unsplash.com/photo-1690079374922-7f50d5c1a102?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZHJpdmluZyUyMHNjaG9vbCUyMGNsYXNzcm9vbXxlbnwwfHx8fDE3NjgzNzU0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "driving school classroom"
    },
}

export function getCourseVisuals(id: string) {
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
        Icon: courseIcons[id] || Book,
        image: courseImages[id] || { 
            imageUrl: `https://picsum.photos/seed/${seed}/600/400`,
            imageHint: 'driving course'
        }
    }
}

export const trafficSigns = [
    {
      title: "علامة قف",
      description: "علامة إلزامية تتطلب من السائقين التوقف تمامًا والتأكد من خلو التقاطع قبل المتابعة.",
      image: {
        "id": "stop-sign",
        "description": "An octagonal red stop sign.",
        "imageUrl": "https://images.unsplash.com/photo-1717859258741-4bbdf06a794e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8c3RvcCUyMHNpZ258ZW58MHx8fHwxNzY4Mzc1NDc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "imageHint": "stop sign"
      },
    },
    {
      title: "علامة إعطاء الأولوية",
      description: "تشير إلى أنه يجب على السائقين إبطاء السرعة والاستعداد للتوقف للسماح بمرور حركة المرور الأخرى (بما في ذلك المشاة وراكبي الدراجات) قبل المتابعة.",
      image: {
        "id": "yield-sign",
        "description": "A triangular yield sign.",
        "imageUrl": "https://images.unsplash.com/photo-1739782968457-299957511b68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx5aWVsZCUyMHNpZ258ZW58MHx8fHwxNzY4Mzc1NDc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "imageHint": "yield sign"
      },
    },
    {
      title: "حد السرعة 50",
      description: "تحدد السرعة القانونية القصوى عند 50 كيلومترًا في الساعة (أو ميلًا في الساعة، حسب البلد) لجزء الطريق المقبل.",
      image: {
        "id": "speed-limit-sign",
        "description": "A speed limit sign indicating 50.",
        "imageUrl": "https://images.unsplash.com/photo-1696980488680-c5d50aef7a1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzcGVlZCUyMGxpbWl0fGVufDB8fHx8MTc2ODM3NTQ3OXww&ixlib=rb-4.1.0&q=80&w=1080",
        "imageHint": "speed limit"
      },
    }
]
