"use client";

import {
  AlertTriangle,
  Package,
  Shield,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitial } from "@/lib/chat-ui";
import { formatProductPrice } from "@/lib/home-catalog";
import {
  getMockUserById,
  type MockProduct,
  type MockUser,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type AdminDashboardProps = {
  users: MockUser[];
  products: MockProduct[];
};

function AdminToast({
  message,
  visible,
  variant = "default",
}: {
  message: string;
  visible: boolean;
  variant?: "default" | "destructive";
}) {
  if (!visible) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-6 right-6 z-[100] max-w-sm rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl",
        "animate-in fade-in slide-in-from-bottom-4",
        variant === "destructive" ? "bg-red-600" : "bg-emerald-600"
      )}
    >
      {message}
    </div>
  );
}

function getUserEmail(user: MockUser): string {
  if (user.name.includes("@")) return user.name;
  const slug = user.name.toLowerCase().replace(/[^a-z0-9]/gi, "");
  return `${slug || user.id}@getbuff.store`;
}

function getUserDisplayName(user: MockUser): string {
  if (user.name.includes("@")) {
    return user.name.split("@")[0] ?? user.name;
  }
  return user.name;
}

function StatCard({
  title,
  value,
  icon: Icon,
  accentClassName,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accentClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-[#1c1e27]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p
            className={cn(
              "mt-2 text-2xl font-bold tabular-nums text-neutral-900 dark:text-white",
              accentClassName
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl bg-white dark:bg-[#14161d]",
            accentClassName ? "text-current" : "text-primary"
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard({ users, products }: AdminDashboardProps) {
  const [activeUsers, setActiveUsers] = useState(users);
  const [activeProducts, setActiveProducts] = useState(products);
  const [toast, setToast] = useState<{ message: string; variant: "default" | "destructive" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const marketplaceRevenue = useMemo(
    () => products.reduce((sum, product) => sum + product.price, 0),
    [products]
  );

  function handleBanUser(userId: string, userName: string) {
    setActiveUsers((prev) => prev.filter((user) => user.id !== userId));
    setToast({
      message: `Пользователь «${userName}» заблокирован`,
      variant: "destructive",
    });
  }

  function handleDeleteProduct(productId: string, productTitle: string) {
    setActiveProducts((prev) => prev.filter((product) => product.id !== productId));
    setToast({
      message: `Лот «${productTitle.slice(0, 40)}${productTitle.length > 40 ? "…" : ""}» удалён`,
      variant: "default",
    });
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-muted-foreground dark:border-neutral-800 dark:bg-[#1c1e27]">
            <Shield className="size-3.5 text-primary" />
            Moderation Console
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Админ-панель
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Модерация пользователей, лотов и аналитика маркетплейса
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Выручка маркетплейса"
          value={formatProductPrice(marketplaceRevenue)}
          icon={TrendingUp}
        />
        <StatCard
          title="Всего пользователей"
          value={String(activeUsers.length)}
          icon={Users}
        />
        <StatCard
          title="Активных лотов"
          value={String(activeProducts.length)}
          icon={Package}
        />
        <StatCard
          title="Диспуты / Жалобы"
          value="3 активных спора"
          icon={AlertTriangle}
          accentClassName="text-red-600 dark:text-red-400"
        />
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-[#1c1e27]">
        <Tabs defaultValue="users" className="gap-0">
          <div className="border-b border-neutral-200 px-4 pt-4 dark:border-neutral-800 sm:px-6">
            <TabsList
              variant="line"
              className="h-auto w-full justify-start gap-0 bg-transparent p-0"
            >
              <TabsTrigger
                value="users"
                className="rounded-none px-4 pb-3 pt-2 text-sm font-medium text-muted-foreground data-active:text-neutral-900 dark:data-active:text-white"
              >
                Пользователи
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="rounded-none px-4 pb-3 pt-2 text-sm font-medium text-muted-foreground data-active:text-neutral-900 dark:data-active:text-white"
              >
                Товары
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users" className="mt-0 p-4 sm:p-6">
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#14161d]">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-200 hover:bg-transparent dark:border-neutral-800">
                    <TableHead className="text-neutral-600 dark:text-neutral-300">
                      Пользователь
                    </TableHead>
                    <TableHead className="text-neutral-600 dark:text-neutral-300">
                      Email
                    </TableHead>
                    <TableHead className="text-neutral-600 dark:text-neutral-300">
                      Сделки
                    </TableHead>
                    <TableHead className="text-neutral-600 dark:text-neutral-300">
                      Статус
                    </TableHead>
                    <TableHead className="text-right text-neutral-600 dark:text-neutral-300">
                      Действие
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-10 text-center text-muted-foreground"
                      >
                        Нет активных пользователей
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-neutral-200 dark:border-neutral-800"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9 border border-neutral-200 dark:border-neutral-700">
                              <AvatarFallback
                                className={cn("text-xs font-bold", user.avatar)}
                              >
                                {getInitial(getUserDisplayName(user))}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-neutral-900 dark:text-white">
                              {getUserDisplayName(user)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate text-muted-foreground">
                          {getUserEmail(user)}
                        </TableCell>
                        <TableCell className="tabular-nums text-neutral-900 dark:text-white">
                          {user.totalSales}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "border-0 font-medium",
                              user.status === "online"
                                ? "bg-[#22c55e]/15 text-[#22c55e] hover:bg-[#22c55e]/15"
                                : "bg-neutral-200 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                            )}
                          >
                            {user.status === "online" ? "В сети" : "Офлайн"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="rounded-lg"
                            onClick={() =>
                              handleBanUser(user.id, getUserDisplayName(user))
                            }
                          >
                            Забанить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-0 p-4 sm:p-6">
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#14161d]">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-200 hover:bg-transparent dark:border-neutral-800">
                    <TableHead className="text-neutral-600 dark:text-neutral-300">
                      Игра
                    </TableHead>
                    <TableHead className="min-w-[220px] text-neutral-600 dark:text-neutral-300">
                      Название лота
                    </TableHead>
                    <TableHead className="text-neutral-600 dark:text-neutral-300">
                      Цена
                    </TableHead>
                    <TableHead className="text-neutral-600 dark:text-neutral-300">
                      Продавец
                    </TableHead>
                    <TableHead className="text-right text-neutral-600 dark:text-neutral-300">
                      Действие
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-10 text-center text-muted-foreground"
                      >
                        Нет активных лотов
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeProducts.map((product) => {
                      const seller = getMockUserById(product.sellerId);

                      return (
                        <TableRow
                          key={product.id}
                          className="border-neutral-200 dark:border-neutral-800"
                        >
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-neutral-200 bg-neutral-50 font-medium text-neutral-800 dark:border-neutral-700 dark:bg-[#1c1e27] dark:text-neutral-100"
                            >
                              {product.gameName}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[320px]">
                            <span className="block truncate font-medium text-neutral-900 dark:text-white">
                              {product.title}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold tabular-nums text-[#4f8cff]">
                            {formatProductPrice(product.price)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {seller?.name ?? "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                              onClick={() =>
                                handleDeleteProduct(product.id, product.title)
                              }
                            >
                              <Trash2 className="size-4" />
                              Удалить
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AdminToast
        message={toast?.message ?? ""}
        visible={Boolean(toast)}
        variant={toast?.variant ?? "default"}
      />
    </div>
  );
}
