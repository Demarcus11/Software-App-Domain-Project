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
import { Calendar } from "@/components/ui/calendar";
import { Calendar1Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserDetails {
  firstName: string;
  lastName: string;
  role: string;
  username: string;
}

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Failed to fetch user details");
          return;
        }

        const userDetails = await response.json();
        setUser({
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          role: userDetails.role,
          username: userDetails.username,
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserDetails();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to logout");
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const PopupCalendar = () => {
    return (
      <TooltipProvider>
        <Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger asChild>
                <button className="grid h-7 min-w-7 shrink-0 items-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200/80">
                  <Calendar1Icon className="size-4" />
                </button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1">
              <DropdownMenuItem
                className="focus:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Calendar />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipContent className="bg-neutral-800">Calendar</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const ProfileSection = () => {
    return (
      <div className="flex items-center gap-4 md:ml-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-800">
              Notfications
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <DropdownMenu>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger className="flex items-center gap-5">
                  <div className="grid gap-1">
                    {isLoading ? (
                      <Skeleton className="w-24 h-4" />
                    ) : (
                      <p className="text-sm">{user?.username}</p>
                    )}
                    {isLoading ? (
                      <Skeleton className="w-12 h-4 ml-auto" />
                    ) : (
                      <p className="text-sm ml-auto">{user?.role}</p>
                    )}
                  </div>
                  {isLoading ? (
                    <Skeleton className="w-10 h-10 rounded-full" />
                  ) : (
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName}%${user?.lastName}`}
                        alt={`${user?.firstName} ${user?.lastName}`}
                      />
                      <AvatarFallback className="text-black">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent className="bg-neutral-800">Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <nav className="flex items-center justify-between text-black py-4 md:col-start-1 md:col-end-[-1] row-start-1 row-end-2">
      <Link href="#" className="flex gap-2 items-center md:hidden">
        <Image src={logo} alt="AccuBooks" width={50} />
      </Link>

      <PopupCalendar />

      <ProfileSection />
    </nav>
  );
};

export default Navbar;
