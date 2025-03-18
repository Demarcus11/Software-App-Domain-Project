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
import {
  User,
  Users,
  Home,
  KeyRound,
  NotebookTabsIcon,
  NotebookPenIcon,
  Logs,
  NotebookText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

const AppSidebar = () => {
  const [role, setRole] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/user");

        if (!response.ok) {
          console.error("Failed to fetch user details");
          return;
        }

        const userDetails = await response.json();
        setRole(userDetails.role);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserDetails();
  }, []);

  const items: MenuGroup[] = [
    {
      title: "Menu",
      items: [
        {
          icon: Home,
          label: "Home",
          href:
            role === "ADMIN"
              ? "/admin"
              : role === "MANAGER"
              ? "/manager"
              : "/user",
          visible: ["ADMIN", "MANAGER", "USER"],
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
        {
          icon: NotebookTabsIcon,
          label: "Chart of accounts",
          href: "/chart-of-accounts",
          visible: ["ADMIN", "USER", "MANAGER"], // Fixed: Use an array of strings
        },
        {
          icon: NotebookPenIcon,
          label: "Create account",
          href: "/chart-of-accounts/new",
          visible: ["ADMIN"],
        },
        {
          icon: Logs,
          label: "Event Logs",
          href: "/events",
          visible: ["ADMIN", "USER", "MANAGER"],
        },
        {
          icon: NotebookText,
          label: "Journal",
          href: "/journal",
          visible: ["ADMIN", "USER", "MANAGER"],
        },
      ],
    },
  ];

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
                  {isLoading
                    ? i.items.map((item) => (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton asChild>
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-6" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    : i.items.map((item) => {
                        if (role && item.visible.includes(role)) {
                          return (
                            <SidebarMenuItem key={item.label}>
                              <SidebarMenuButton asChild>
                                <Link
                                  href={item.href}
                                  className="flex items-center gap-2"
                                >
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
