
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-transparent px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 bg-muted/50" />
        </div>
        <UserNav />
      </div>
    </header>
  );
}
