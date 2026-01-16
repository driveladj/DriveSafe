
import FooterContentForm from "@/components/admin/footer-content-form";

export default function AdminFooterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">محتوى تذييل الصفحة</h2>
        <p className="text-muted-foreground">
          قم بتعديل معلومات الاتصال وساعات العمل التي تظهر في تذييل الموقع.
        </p>
      </div>
      <FooterContentForm />
    </div>
  );
}
