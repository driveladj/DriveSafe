
import AppearanceForm from "@/components/admin/appearance-form";

export default function AdminAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">إعدادات المظهر</h2>
        <p className="text-muted-foreground">
          قم بتخصيص الخطوط والألوان لموقعك ليتناسب مع هويتك البصرية.
        </p>
      </div>
      <AppearanceForm />
    </div>
  );
}
