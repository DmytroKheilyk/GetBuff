import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicSellerProfile } from "@/components/users/public-seller-profile";
import {
  getMockProductsBySellerId,
  getMockUserById,
  USE_MOCK_DATA,
} from "@/lib/mock-data";

type UserProfilePageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const user = USE_MOCK_DATA ? getMockUserById(id) : undefined;

  if (!user) {
    return { title: "Продавец не найден — GetBuff.store" };
  }

  return {
    title: `${user.name} — профиль продавца — GetBuff.store`,
    description: user.description,
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;

  if (!USE_MOCK_DATA) {
    notFound();
  }

  const user = getMockUserById(id);

  if (!user) {
    notFound();
  }

  const products = getMockProductsBySellerId(user.id);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0e1015]">
      <SiteHeader />
      <main className="flex-1">
        <PublicSellerProfile user={user} products={products} />
      </main>
      <SiteFooter />
    </div>
  );
}
