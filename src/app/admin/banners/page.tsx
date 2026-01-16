
import BannersManagement from "@/components/admin/banners-management";

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">إدارة إشارات المرور</h2>
        <p className="text-muted-foreground">
          إضافة وتعديل وحذف إشارات المرور التي تظهر في صفحة الإشارات.
        </p>
      </div>
      <BannersManagement />
    </div>
  );
}
