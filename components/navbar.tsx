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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
interface UserDetails {
  firstName: string;
  lastName: string;
  role: string;
  username: string;
  profilePictureUrl?: string;
}

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
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
          profilePictureUrl: userDetails.profilePictureUrl,
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications", {
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Failed to fetch notifications");
          return;
        }

        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
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
        {/* Replace the Bell button with NotificationPopover */}
        <NotificationPopover />

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
                        src={
                          user?.profilePictureUrl ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName}%${user?.lastName}`
                        }
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

  const NotificationPopover = () => {
    const markAsRead = async (id: number) => {
      try {
        const response = await fetch(`/api/notifications/${id}/read`, {
          method: "PATCH",
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Failed to mark notification as read");
          return;
        }

        // Update the local state
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => prev - 1);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setOpen(!open)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No new notifications.
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 rounded ${
                    notification.isRead ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  {!notification.isRead && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
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
