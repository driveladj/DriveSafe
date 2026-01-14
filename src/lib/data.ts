
import type { LucideIcon } from "lucide-react";
import { Award, Car, Check, HeartHandshake, Bike, Presentation, Smile, Star, Users } from "lucide-react";
import { PlaceHolderImages } from "./placeholder-images";

export const navItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/about', label: 'من نحن' },
    { href: '/courses', label: 'الدورات' },
    { href: '/pricing', label: 'الأسعار' },
    { href: '/banners', label: 'اللافتات' },
    { href: '/gallery', label: 'المعرض' },
    { href: '/faq', label: 'الأسئلة الشائعة' },
    { href: '/contact', label: 'اتصل بنا' },
];

export const features = [
    {
        Icon: Award,
        title: "مدربون معتمدون",
        description: "مدربونا معتمدون من الحكومة، ذوو خبرة، ومكرسون لنجاحك.",
    },
    {
        Icon: Star,
        title: "معدل نجاح مرتفع",
        description: "نفخر بمعدل نجاح مرتفع، بفضل طرق التدريس الفعالة لدينا.",
    },
    {
        Icon: Car,
        title: "مركبات حديثة",
        description: "تعلم القيادة في أسطول من المركبات الجديدة والآمنة والمزودة بتحكم مزدوج.",
    },
    {
        Icon: Users,
        title: "تدريب شخصي",
        description: "نقوم بتصميم دروسنا لتناسب وتيرة تعلمك واحتياجاتك الفردية لتحقيق نتائج أفضل.",
    },
];

export type Course = {
    id: string;
    name: string;
    description: string;
    details: string;
    Icon: LucideIcon;
    image: {
        imageUrl: string;
        imageHint: string;
    } | undefined;
}

const courseIcons: {[key: string]: LucideIcon} = {
    'b-license': Car,
    'moto-license': Bike,
    'theory-course': Presentation,
}

const courseImages: {[key: string]: any} = {
    'b-license': PlaceHolderImages.find(img => img.id === 'car-interior-1'),
    'moto-license': PlaceHolderImages.find(img => img.id === 'motorcycle-1'),
    'theory-course': PlaceHolderImages.find(img => img.id === 'classroom-1'),
}

export function getCourseVisuals(id: string) {
    return {
        Icon: courseIcons[id] || Car,
        image: courseImages[id]
    }
}

export const pricingTiers = [
  { 
    id: 'basic', 
    name: 'الباقة الأساسية', 
    price: '450', 
    licenseType: 'الفئة ب', 
    features: ['20 درسًا نظريًا', '20 درسًا عمليًا', 'امتحان داخلي'], 
    bestDeal: false 
  },
  { 
    id: 'premium', 
    name: 'الباقة المميزة', 
    price: '650', 
    licenseType: 'الفئة ب', 
    features: ['دروس نظرية غير محدودة', '30 درسًا عمليًا', 'شامل رسوم الامتحان الرسمي', 'تتبع التقدم الشخصي'], 
    bestDeal: true 
  },
  { 
    id: 'motorcycle', 
    name: 'دورة الدراجات النارية', 
    price: '350', 
    licenseType: 'دراجة نارية (A)', 
    features: ['15 درسًا نظريًا', '20 درسًا عمليًا', 'توفير المعدات'], 
    bestDeal: false 
  },
];


export const faqs = [
  { q: 'ما هي متطلبات التسجيل؟', a: 'يجب أن يكون عمرك 18 عامًا على الأقل وأن تمتلك بطاقة هوية وطنية سارية. قد تكون هناك حاجة لشهادة طبية لبعض فئات الرخص.' },
  { q: 'كم من الوقت يستغرق التدريب؟', a: 'تعتمد المدة على الباقة التي تختارها وسرعة تعلمك الشخصية. في المتوسط، يكمل الطلاب تدريب رخصة الفئة ب في غضون شهرين إلى 3 أشهر.' },
  { q: 'هل يمكنني جدولة الدروس في عطلات نهاية الأسبوع؟', a: 'نعم، نحن نقدم جداول زمنية مرنة، بما في ذلك الأمسيات وعطلات نهاية الأسبوع، لتناسب جدولك المزدحم. يرجى الاتصال بنا للتحقق من التوفر.' },
  { q: 'ماذا يشمل سعر الباقة؟', a: 'يشمل سعر كل باقة العدد المحدد من الدروس النظرية والعملية. قد تكون رسوم الامتحان الرسمي منفصلة ما لم يُنص على خلاف ذلك، كما في باقتنا المميزة.' },
  { q: 'هل أحتاج إلى مركبتي الخاصة؟', a: 'لا، يتم إجراء جميع التدريبات في مركباتنا الحديثة ذات التحكم المزدوج من أجل سلامتك وراحتك. بالنسبة لدورات الدراجات النارية، نوفر أيضًا المركبة ومعدات السلامة.' },
];

export const testimonials = [
  {
    name: "عائشة ك.",
    role: "سائقة جديدة",
    avatar: Smile,
    comment: "أكاديمية القيادة الآمنة جعلت تعلم القيادة سهلاً وخالياً من التوتر! كان مدربي صبوراً وداعماً بشكل لا يصدق. لقد نجحت في اختباري من المحاولة الأولى!",
  },
  {
    name: "محمد ر.",
    role: "متحمس للدراجات النارية",
    avatar: Users,
    comment: "كانت دورة الدراجات النارية رائعة. المدربون خبراء حقيقيون ويركزون بشدة على السلامة. أشعر بثقة أكبر على الطريق الآن. موصى به بشدة!",
  },
  {
    name: "فاطمة ز.",
    role: "طالبة",
    avatar: HeartHandshake,
    comment: "كنت متوترة للغاية بشأن القيادة، لكن فريق أكاديمية القيادة الآمنة كان مرحبًا جدًا. لقد ساعدوني في بناء ثقتي خطوة بخطوة. تجربة رائعة!",
  },
];

export const trafficSigns = [
    {
      title: "علامة قف",
      description: "علامة إلزامية تتطلب من السائقين التوقف تمامًا والتأكد من خلو التقاطع قبل المتابعة.",
      image: PlaceHolderImages.find(img => img.id === 'stop-sign'),
    },
    {
      title: "علامة إعطاء الأولوية",
      description: "تشير إلى أنه يجب على السائقين إبطاء السرعة والاستعداد للتوقف للسماح بمرور حركة المرور الأخرى (بما في ذلك المشاة وراكبي الدراجات) قبل المتابعة.",
      image: PlaceHolderImages.find(img => img.id === 'yield-sign'),
    },
    {
      title: "حد السرعة 50",
      description: "تحدد السرعة القانونية القصوى عند 50 كيلومترًا في الساعة (أو ميلًا في الساعة، حسب البلد) لجزء الطريق المقبل.",
      image: PlaceHolderImages.find(img => img.id === 'speed-limit-sign'),
    }
]
