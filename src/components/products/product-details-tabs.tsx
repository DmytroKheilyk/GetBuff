"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buildHowToReceiveContent,
  formatProductDescription,
  type ProductOffer,
} from "@/lib/types/product-offer";

type ProductDetailsTabsProps = {
  offer: ProductOffer;
};

function StructuredLines({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
      {lines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}

const panelClassName =
  "rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-[#1c1e27] sm:p-6";

export function ProductDetailsTabs({ offer }: ProductDetailsTabsProps) {
  const descriptionSource = offer.detailsDescription ?? offer.description;
  const descriptionLines = formatProductDescription(descriptionSource);
  const instructionLines = (
    offer.instructionsText ?? buildHowToReceiveContent(offer)
  ).split("\n");

  return (
    <Tabs defaultValue="description" className="gap-4">
      <TabsList className="h-auto w-full justify-start gap-1 rounded-xl border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-[#12131a] sm:w-fit">
        <TabsTrigger
          value="description"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-neutral-700 data-active:bg-white data-active:text-neutral-900 dark:text-muted-foreground dark:data-active:bg-[#1c1e27] dark:data-active:text-white"
        >
          Описание товара
        </TabsTrigger>
        <TabsTrigger
          value="howto"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-neutral-700 data-active:bg-white data-active:text-neutral-900 dark:text-muted-foreground dark:data-active:bg-[#1c1e27] dark:data-active:text-white"
        >
          Как получить
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className={panelClassName}>
        <StructuredLines
          lines={
            descriptionLines.length > 0
              ? descriptionLines
              : [descriptionSource]
          }
        />
        <ul className="mt-5 space-y-2 border-t border-neutral-200 pt-5 text-sm text-muted-foreground dark:border-neutral-800">
          <li>• Безопасная сделка через GetBuff</li>
          <li>• Поддержка в чате после покупки</li>
          <li>• Возврат средств при споре до подтверждения заказа</li>
        </ul>
      </TabsContent>

      <TabsContent value="howto" className={panelClassName}>
        <StructuredLines lines={instructionLines} />
        <div className="mt-5 rounded-xl border border-[#4f8cff]/20 bg-[#4f8cff]/5 p-4 text-sm text-neutral-700 dark:text-neutral-300">
          После оплаты откройте раздел «Мои сообщения» или нажмите «Написать
          продавцу» — переписка привязана к вашему заказу.
        </div>
      </TabsContent>
    </Tabs>
  );
}
