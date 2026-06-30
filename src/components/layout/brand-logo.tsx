import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "text-[1.35rem] font-extrabold tracking-tight",
        className
      )}
    >
      <span className="text-white">Get</span>
      <span className="bg-linear-to-r from-[#6ba1ff] to-[#4f8cff] bg-clip-text text-transparent">
        Buff
      </span>
    </span>
  );
}
