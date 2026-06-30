import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { mockProducts, mockUsers } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Админ-панель — GetBuff.store",
  description: "Модерация пользователей, лотов и аналитика маркетплейса GetBuff",
};

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0e1015]">
      <SiteHeader />
      <main className="flex-1">
        <AdminDashboard users={mockUsers} products={mockProducts} />
      </main>
      <SiteFooter />
    </div>
  );
}
