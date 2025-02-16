"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User, Users, Home, KeyRound } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useEffect, useState } from "react";

interface MenuItem {
  icon: React.ComponentType;
  label: string;
  href: string;
  visible: string[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const items: MenuGroup[] = [
  {
    title: "Menu",
    items: [
      {
        icon: Home,
        label: "Home",
        href: "/admin",
        visible: ["ADMIN", "USER", "MANAGER"],
      },
      {
        icon: Users,
        label: "View employees",
        href: "/employees",
        visible: ["ADMIN"],
      },
      {
        icon: User,
        label: "Create employee",
        href: "/employees/new",
        visible: ["ADMIN"],
      },
      {
        icon: KeyRound,
        label: "Expired passwords",
        href: "/employees/expired-passwords",
        visible: ["ADMIN"],
      },
    ],
  },
];

const AppSidebar = () => {
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const role: string | undefined = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];
    setRole(role);
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <Link href="#" className="flex gap-2 items-center">
            <Image src={logo} alt="AccuBooks" width={50} />
            <p>AccuBooks</p>
          </Link>
        </SidebarHeader>
        {items.map((i) => (
          <SidebarGroup key={i.title}>
            <>
              <SidebarGroupLabel>{i.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {i.items.map((item) => {
                    if (role && item.visible.includes(role)) {
                      return (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton asChild>
                            <Link href={item.href}>
                              <item.icon />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    }
                    return null;
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
