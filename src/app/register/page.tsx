import RegistrationForm from "@/components/registration-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">انضم إلى أكاديمية القيادة الآمنة</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            اتخذ الخطوة الأولى نحو استقلاليتك في القيادة. املأ النموذج أدناه للبدء.
          </p>
        </div>
      </section>
      
      <section className="py-16 sm:py-24">
        <div className="container max-w-3xl">
          <RegistrationForm />
          <p className="text-center text-sm text-muted-foreground mt-8">
            هل لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
