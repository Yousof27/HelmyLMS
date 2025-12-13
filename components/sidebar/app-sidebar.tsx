"use client";

import * as React from "react";
import {
  IconChartBar,
  IconFolder,
  IconHelp,
  IconBook,
  IconSearch,
  IconSettings,
  IconUsers,
  type Icon,
  IconLayoutDashboardFilled,
} from "@tabler/icons-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import Logo from "@/public/logo.png";
import Link from "next/link";

const navSecondary = [
  {
    title: "Settings",
    url: "#",
    icon: IconSettings,
  },
  {
    title: "Get Help",
    url: "#",
    icon: IconHelp,
  },
  {
    title: "Search",
    url: "#",
    icon: IconSearch,
  },
];

const iconMap: Record<string, Icon> = {
  IconChartBar,
  IconBook,
  IconFolder,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconLayoutDashboardFilled,
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  navMain: {
    title: string;
    url: string;
    icon?: string;
  }[];
};

export function AppSidebar({ navMain, ...props }: AppSidebarProps) {
  const navMainWithIcons = navMain.map((item) => ({
    ...item,
    icon: item.icon ? iconMap[item.icon] : undefined,
  }));
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-transparent w-fit">
              <Link href={"/"}>
                <Image src={Logo} alt="Logo" className="size-5 rounded-lg" />
                <span className="text-base font-semibold">HelmyLMS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithIcons} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
