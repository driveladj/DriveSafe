
import HomeContentForm from "@/components/admin/home-content-form";

export default function AdminHomePageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">محتوى الصفحة الرئيسية</h2>
        <p className="text-muted-foreground">
          قم بتعديل المحتوى الذي يظهر في صفحة الهبوط العامة.
        </p>
      </div>
      <HomeContentForm />
    </div>
  );
}
