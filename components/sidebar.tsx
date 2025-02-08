import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";

const items = [
  {
    title: "View users",
    url: "/users",
    icon: User,
  },
  {
    title: "Create users",
    url: "/users/create",
    icon: User,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <Link href="#" className="flex gap-2 items-center">
            <Image src={logo} alt="AccuBooks" width={50} />
            <p>AccuBooks</p>
          </Link>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
