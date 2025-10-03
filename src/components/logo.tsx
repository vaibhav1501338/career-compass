
import { Compass } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-foreground transition-colors hover:text-foreground/80",
        className
      )}
    >
      <Compass className="h-6 w-6 text-primary" />
      <span className="font-headline text-lg font-bold group-data-[state=collapsed]:hidden group-data-[state=collapsed]:group-hover/sidebar:block">Career Compass</span>
    </Link>
  );
}

