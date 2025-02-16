"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const logout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between text-black py-4 md:col-start-1 md:col-end-[-1] row-start-1 row-end-2">
      <Link href="#" className="flex gap-2 items-center md:hidden">
        <Image src={logo} alt="AccuBooks" width={50} />
      </Link>

      <div className="flex items-center gap-4 md:ml-auto">
        <Button variant="ghost" size="icon">
          <Bell />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-5">
            <div className="grid gap-1">
              <p className="text-sm">John Doe</p>
              <p className="text-right text-xs">Admin</p>
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
              <AvatarFallback className="text-black">JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
