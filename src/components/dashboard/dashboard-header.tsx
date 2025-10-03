
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { Logo } from "@/components/logo";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Logo className="hidden md:flex"/>
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <UserNav />
      </div>
    </header>
  );
}
