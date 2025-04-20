"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Home,
  Users,
  KeyRound,
  NotebookTabsIcon,
  NotebookPenIcon,
  FileText,
  LandmarkIcon,
  Logs,
  InfoIcon,
} from "lucide-react";
type User = {
  id: number;
  role: string;
};

type Ratio = {
  name: string;
  value: number | null;
  status: "green" | "yellow" | "red";
  numerator: number;
  denominator: number;
  formula: string;
};

export default function UserPage() {
  const [ratios, setRatios] = useState<Ratio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const fetchRatios = async () => {
      try {
        const res = await fetch("/api/ratios");
        const data = await res.json();
        setRatios(data);
      } catch (err) {
        console.error("Error fetching ratios:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatios();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/user");

        if (!response.ok) {
          console.error("Failed to fetch user details");
          return;
        }

        const userDetails = await response.json();
        setUser(userDetails);
        setRole(userDetails.role);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch("/api/dashboard-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user }),
        });

        const messages = await res.json();
        setMessages(messages);
      } catch (err) {
        console.error("Error fetching dashboard message:", err);
        setMessages([]); // Set to empty array on error
      }
    };

    fetchMessage();
  }, [user]);

  const menuItems = [
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
    {
      icon: LandmarkIcon,
      label: "Financial Reports",
      href: "/financial-reports",
      visible: ["MANAGER"],
    },
    {
      icon: Logs,
      label: "Event Logs",
      href: "/events",
      visible: ["ADMIN", "USER", "MANAGER"],
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Home</h1>

      {/* Financial Ratios Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Financial Ratios</h2>
        {isLoading ? (
          <p>Loading ratios...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ratios.map((ratio) => (
              <div
                key={ratio.name}
                className={clsx(
                  "rounded-lg p-4 shadow",
                  ratio.status === "green" && "bg-green-100 text-green-800",
                  ratio.status === "yellow" && "bg-yellow-100 text-yellow-800",
                  ratio.status === "red" && "bg-red-100 text-red-800"
                )}
              >
                <h3 className="font-medium">{ratio.name}</h3>
                <p className="text-lg">
                  {ratio.value !== null ? ratio.value.toFixed(2) : "N/A"}
                </p>
                <p className="text-sm mt-1 italic">
                  {ratio.formula}: {ratio.numerator} / {ratio.denominator}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Role-Based Menu Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems
            .filter((item) => item.visible.includes(role ?? ""))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 p-4 rounded border hover:bg-gray-100 transition"
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
        </div>
      </section>

      {/* Important Messages */}
      {messages.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Important Messages</h2>
          <ul className="space-y-2">
            {messages.map((msg, index) => (
              <li
                key={index}
                className="bg-blue-100 text-blue-800 p-4 rounded shadow flex items-center gap-2"
              >
                <InfoIcon />
                {msg}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
