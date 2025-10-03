
"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  useSidebar,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSidebar() {
    const { user } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/");
      };

    return (
        <Sidebar>
            <div className="relative flex h-full w-full flex-col p-2">
                <SidebarHeader>
                    <Logo className="text-white hover:text-white/90" />
                </SidebarHeader>
                <SidebarContent className="p-0 flex-grow mt-4">
                    <SidebarNav />
                </SidebarContent>
                <SidebarFooter className="p-0">
                    <SidebarMenuButton variant="ghost" onClick={handleSignOut} className="w-full justify-start text-white hover:text-white hover:bg-white/10" tooltip="Logout">
                        <LogOut />
                        <span className="group-data-[state=collapsed]:hidden">Logout</span>
                    </SidebarMenuButton>
                </SidebarFooter>
            </div>
      </Sidebar>
    );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Logo />
            <div className="flex items-center gap-2 mt-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-40" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
        <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
