
import AboutContentForm from "@/components/admin/about-content-form";

export default function AdminAboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">محتوى صفحة "من نحن"</h2>
        <p className="text-muted-foreground">
          قم بتعديل المحتوى الذي يظهر في صفحة "من نحن" العامة.
        </p>
      </div>
      <AboutContentForm />
    </div>
  );
}
