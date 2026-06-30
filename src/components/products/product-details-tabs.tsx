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
    <div className="space-y-3 text-sm leading-relaxed text-[#c5c9d4]">
      {lines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}

export function ProductDetailsTabs({ offer }: ProductDetailsTabsProps) {
  const descriptionLines = formatProductDescription(offer.description);
  const instructionLines = buildHowToReceiveContent(offer).split("\n");

  return (
    <Tabs defaultValue="description" className="gap-4">
      <TabsList className="h-auto w-full justify-start gap-1 rounded-xl border border-border bg-[#12131a] p-1 sm:w-fit">
        <TabsTrigger
          value="description"
          className="rounded-lg px-4 py-2 text-sm font-semibold data-active:bg-[#1c1e27] data-active:text-[#e8eaef]"
        >
          Описание товара
        </TabsTrigger>
        <TabsTrigger
          value="howto"
          className="rounded-lg px-4 py-2 text-sm font-semibold data-active:bg-[#1c1e27] data-active:text-[#e8eaef]"
        >
          Как получить
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="description"
        className="rounded-2xl border border-border bg-[#1c1e27] p-5 sm:p-6"
      >
        <StructuredLines
          lines={
            descriptionLines.length > 0
              ? descriptionLines
              : [offer.description]
          }
        />
        <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
          <li>• Безопасная сделка через GetBuff</li>
          <li>• Поддержка в чате после покупки</li>
          <li>• Возврат средств при споре до подтверждения заказа</li>
        </ul>
      </TabsContent>

      <TabsContent
        value="howto"
        className="rounded-2xl border border-border bg-[#1c1e27] p-5 sm:p-6"
      >
        <StructuredLines lines={instructionLines} />
        <div className="mt-5 rounded-xl border border-[#4f8cff]/20 bg-[#4f8cff]/5 p-4 text-sm text-[#c5c9d4]">
          После оплаты откройте раздел «Мои сообщения» или нажмите «Написать
          продавцу» — переписка привязана к вашему заказу.
        </div>
      </TabsContent>
    </Tabs>
  );
}
