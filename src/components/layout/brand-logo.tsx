import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "text-xl font-black tracking-tighter uppercase",
        className
      )}
    >
      <span className="text-white">GET</span>
      <span className="bg-linear-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(74,222,128,0.45)]">
        BUFF
      </span>
    </span>
  );
}
