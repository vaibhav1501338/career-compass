
"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid,
  MessageCircle,
  Lightbulb,
  Route,
  FileText,
  User,
  Sparkles,
  Users,
  Target,
  Mail,
  Briefcase,
  Columns,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    icon: <LayoutGrid />,
    label: "Dashboard",
  },
  {
    href: "/dashboard/chat",
    icon: <MessageCircle />,
    label: "AI Chat",
  },
  {
    href: "/dashboard/suggestions",
    icon: <Sparkles />,
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
    href: "/dashboard/cover-letter",
    icon: <Mail />,
    label: "Cover Letter",
  },
  {
    href: "/dashboard/jobs",
    icon: <Briefcase />,
    label: "Job Search",
  },
  {
    href: "/dashboard/tracker",
    icon: <Columns />,
    label: "Tracker",
  },
  {
    href: "/dashboard/networking",
    icon: <Users />,
    label: "Networking",
  },
  {
    href: "/dashboard/goals",
    icon: <Target />,
    label: "Goals",
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
            isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
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
