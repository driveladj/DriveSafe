
import type { LucideIcon } from "lucide-react";
import { Car, Bike, Presentation, Book, Award, BarChart, UserCheck, ShieldCheck, Users, HelpCircle, Star, Smile, HeartHandshake } from "lucide-react";

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
    Icon: LucideIcon;
    image: {
      id: string;
      description: string;
      imageUrl: string;
      imageHint: string;
    }
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
    if (!id) { // Defensive check to prevent crash
        return {
            Icon: Book,
            image: { 
                imageUrl: `https://picsum.photos/seed/default/600/400`,
                imageHint: 'driving course'
            }
        }
    }
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
        Icon: courseIcons[id] || Book,
        image: courseImages[id] || { 
            imageUrl: `https://picsum.photos/seed/${seed}/600/400`,
            imageHint: 'driving course'
        }
    }
}


// --- STATIC DATA FOR OFFLINE VERSION ---

export const staticFeatures: Feature[] = [
  { id: '1', title: 'مدربون خبراء', description: 'تعلم من مدربين معتمدين وذوي خبرة ملتزمين بنجاحك.', icon: 'Award', order: 1 },
  { id: '2', title: 'جداول مرنة', description: 'نقدم دروسًا في المساء وعطلات نهاية الأسبوع لتناسب نمط حياتك المزدحم.', icon: 'BarChart', order: 2 },
  { id: '3', title: 'مركبات حديثة', description: 'تدرب في سيارات آمنة ومجهزة بأحدث التقنيات لضمان راحتك.', icon: 'Car', order: 3 },
  { id: '4', title: 'متابعة شخصية', description: 'نحن نركز على احتياجاتك الفردية لمساعدتك على التعلم بالسرعة التي تناسبك.', icon: 'UserCheck', order: 4 }
];

export const staticCourses: Omit<Course, 'Icon' | 'image'>[] = [
  { id: 'b-license', name: 'رخصة السياقة صنف ب', categoryId: '1', categoryName: 'الصنف ب', description: 'دورة شاملة للمبتدئين تغطي كل شيء من الأساسيات إلى تقنيات القيادة المتقدمة للسيارات.', details: '40 ساعة من التدريب العملي والنظري.' },
  { id: 'moto-license', name: 'رخصة السياقة للدراجات النارية', categoryId: '2', categoryName: 'الصنف أ', description: 'تعلم كيفية التعامل مع الدراجات النارية بأمان وثقة على جميع أنواع الطرق.', details: '20 ساعة من التدريب المتخصص.' },
  { id: 'theory-course', name: 'دورة قانون المرور المكثفة', categoryId: '3', categoryName: 'نظري', description: 'استعد للامتحان النظري من خلال دوراتنا المركزة التي تغطي جميع قوانين وإشارات المرور.', details: '10 جلسات تفاعلية.' }
];

export const staticFaqs: FAQ[] = [
  { id: '1', q: 'ما هي متطلبات التسجيل؟', a: 'يجب أن يكون عمرك 18 عامًا على الأقل، وأن يكون لديك بطاقة هوية سارية، وشهادة طبية تثبت قدرتك على القيادة.', order: 1 },
  { id: '2', q: 'كم من الوقت تستغرق الدورة الكاملة؟', a: 'تستغرق الدورة الكاملة عادة ما بين 4 إلى 6 أسابيع، حسب جدولك الزمني ومدى انتظامك في الدروس.', order: 2 },
  { id: '3', q: 'هل يمكنني الدفع على أقساط؟', a: 'نعم، نحن نقدم خطط دفع مرنة. يمكنك مناقشة الخيارات المتاحة مع الإدارة عند التسجيل.', order: 3 },
];

export const staticPricingTiers: PricingTier[] = [
  { id: '1', name: 'الباقة الأساسية', price: 35000, licenseType: 'الصنف ب', features: ['20 ساعة تدريب عملي', '10 ساعات تدريب نظري', 'امتحان تجريبي واحد'], bestDeal: false },
  { id: '2', name: 'الباقة المميزة', price: 45000, licenseType: 'الصنف ب', features: ['30 ساعة تدريب عملي', '15 ساعة تدريب نظري', 'امتحانان تجريبيان', 'متابعة بعد الرخصة'], bestDeal: true },
  { id: '3', name: 'باقة الدراجة النارية', price: 25000, licenseType: 'الصنف أ', features: ['15 ساعة تدريب عملي', '5 ساعات تدريب نظري', 'استعارة الخوذة والمعدات'], bestDeal: false },
];

export const staticTestimonials: Testimonial[] = [
  { id: '1', name: 'أحمد علي', role: 'سائق جديد', avatar: 'Smile', comment: 'تجربة رائعة! المدربون كانوا صبورين جدا ومحترفين. نجحت في الامتحان من المحاولة الأولى بفضلهم.', status: 'approved' },
  { id: '2', name: 'فاطمة الزهراء', role: 'طالبة جامعية', avatar: 'Users', comment: 'الجداول المرنة ساعدتني كثيرا على التنسيق بين دراستي ودروس القيادة. أنصح بهم بشدة.', status: 'approved' },
  { id: '3', name: 'خالد بن الوليد', role: 'موظف', avatar: 'HeartHandshake', comment: 'كنت خائفا من القيادة في المدينة، لكن الأكاديمية أعطتني الثقة التي أحتاجها. شكرًا لكم!', status: 'approved' },
];

export const staticTrafficSignCategories = [
    { id: '1', name: 'إشارات الخطر', description: 'تنبه السائقين إلى المخاطر المحتملة على الطريق.' },
    { id: '2', name: 'إشارات المنع', description: 'تمنع السائقين من القيام بأفعال معينة.' },
    { id: '3', name: 'إشارات الإلزام', description: 'تجبر السائقين على اتباع توجيهات معينة.' }
];

export const staticTrafficSigns = [
    { id: '1', name: 'خطر: منعطف حاد', description: 'يشير إلى وجود منعطف حاد إلى اليسار أو اليمين.', imageUrl: 'https://picsum.photos/seed/sign1/200/200', categoryId: '1' },
    { id: '2', name: 'ممنوع التجاوز', description: 'يمنع تجاوز المركبات الأخرى في هذا الجزء من الطريق.', imageUrl: 'https://picsum.photos/seed/sign2/200/200', categoryId: '2' },
    { id: '3', name: 'اتجاه إجباري للأمام', description: 'يجب على السائقين الاستمرار في السير إلى الأمام فقط.', imageUrl: 'https://picsum.photos/seed/sign3/200/200', categoryId: '3' }
];

export const staticAboutContent = {
    title: 'حول أكاديمية القيادة الآمنة',
    subtitle: 'مهمتنا هي تمكين السائقين بالمعرفة والمهارات اللازمة للتنقل في طرق اليوم بثقة وسلامة.',
    storyTitle: 'قصتنا',
    storyContent: 'تأسست أكاديميتنا على يد فريق من المدربين ذوي الخبرة والشغف بالقيادة الدفاعية، ونحن ملتزمون بإنشاء جيل جديد من السائقين المسؤولين. نحن نؤمن بأن تعليم القيادة يتجاوز مجرد اجتياز الاختبار؛ إنه يتعلق بغرس عادات تدوم مدى الحياة وتحافظ على سلامة الجميع على الطريق.',
};

export const staticHomePageContent = {
    siteName: 'أكاديمية القيادة الآمنة',
    heroTitle: 'قُد بثقة.',
    heroSubtitle: 'انضم إلى أكاديميتنا للحصول على تعليمات من الخبراء، ومركبات حديثة، ونهج شخصي لمساعدتك على أن تصبح سائقًا آمنًا وواثقًا مدى الحياة.',
    featuresTitle: 'لماذا تختارنا؟',
    featuresSubtitle: 'نحن ملتزمون بتقديم أعلى مستويات الجودة في تعليم القيادة.',
    ownerName: 'السيد أحمد',
    ownerBio: 'مؤسس ومدير الأكاديمية، بخبرة تمتد لأكثر من 20 عامًا في مجال تعليم السياقة والسلامة المرورية.',
    ownerImageUrl: 'https://picsum.photos/seed/owner/200/200',
};

export const staticFooterContent = {
  phone: '+213 (0) 555 123 456',
  email: 'contact@drivesafe-dz.com',
  facebookUrl: '#',
  workHoursWeek: 'الأحد - الخميس: 9:00 صباحًا - 7:00 مساءً',
  workHoursSat: 'السبت: 10:00 صباحًا - 4:00 مساءً',
  workHoursSun: 'الجمعة: مغلق',
};
