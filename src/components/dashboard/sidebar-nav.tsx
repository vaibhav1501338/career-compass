
"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  Lightbulb,
  Route,
  FileText,
  User,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    icon: <LayoutDashboard />,
    label: "Dashboard",
  },
  {
    href: "/dashboard/chat",
    icon: <MessageSquare />,
    label: "AI Chat",
  },
  {
    href: "/dashboard/suggestions",
    icon: <Lightbulb />,
    label: "Suggestions",
  },
  {
    href: "/dashboard/roadmaps",
    icon: <Route />,
    label: "Roadmaps",
  },
  {
    href: "/dashboard/resume",
    icon: <FileText />,
    label: "Resume",
  },
  {
    href: "/dashboard/profile",
    icon: <User />,
    label: "Profile",
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
