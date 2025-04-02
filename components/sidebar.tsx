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
  SidebarSeparator,
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
  FileText,
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
      title: "General",
      items: [
        {
          icon: Home,
          label: "Dashboard",
          href:
            role === "ADMIN"
              ? "/admin"
              : role === "MANAGER"
              ? "/manager"
              : "/user",
          visible: ["ADMIN", "MANAGER", "USER"],
        },
      ],
    },
    {
      title: "Employee Management",
      items: [
        {
          icon: Users,
          label: "Employees",
          href: "/employees",
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
    {
      title: "Accounting",
      items: [
        {
          icon: NotebookTabsIcon,
          label: "Chart of accounts",
          href: "/chart-of-accounts",
          visible: ["ADMIN", "USER", "MANAGER"],
        },
        {
          icon: NotebookPenIcon,
          label: "Create account",
          href: "/chart-of-accounts/new",
          visible: ["ADMIN"],
        },
        {
          icon: FileText,
          label: "Journal Entries",
          href: "/journal",
          visible: ["USER", "MANAGER"],
        },
      ],
    },
    {
      title: "Logging",
      items: [
        {
          icon: Logs,
          label: "Event Logs",
          href: "/events",
          visible: ["ADMIN", "USER", "MANAGER"],
        },
      ],
    },
  ];

  // Filter groups to only include those with visible items for the current role
  const filteredGroups = items.filter((group) => {
    if (isLoading) return true; // Show all groups while loading
    if (!role) return false; // Hide all groups if role isn't loaded yet

    return group.items.some((item) => item.visible.includes(role));
  });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <Link href="#" className="flex gap-2 items-center">
            <Image src={logo} alt="AccuBooks" width={50} />
            <p>AccuBooks</p>
          </Link>
        </SidebarHeader>
        {filteredGroups.map((group, index) => (
          <div key={group.title}>
            <SidebarGroup>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {isLoading
                    ? group.items.map((item) => (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton asChild>
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-6" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    : group.items
                        .filter((item) => role && item.visible.includes(role))
                        .map((item) => (
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
                        ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {index < filteredGroups.length - 1 && <SidebarSeparator />}
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
