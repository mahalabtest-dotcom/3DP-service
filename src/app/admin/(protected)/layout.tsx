import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import AdminNav from "@/components/AdminNav";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authenticated, email } = await getAdminSession();
  if (!authenticated) redirect("/admin/login");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-surface)" }}>
      <AdminNav email={email} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
