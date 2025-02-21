"use client";

import { Pie, PieChart } from "recharts";
import { UsersRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Skeleton } from "@/components/ui/skeleton";

import { useEffect, useState } from "react";

const chartConfig = {
  number: {
    label: "Number of employees",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
  admins: {
    label: "Admins",
    color: "hsl(var(--chart-2))",
  },
  managers: {
    label: "Managers",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const CountChart = () => {
  const [users, setUsers] = useState(0);
  const [admins, setAdmins] = useState(0);
  const [managers, setManagers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/employees");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const counts = data.reduce(
          (
            acc: { users: number; admins: number; managers: number },
            user: { role: string }
          ) => {
            if (user.role === "USER") acc.users++;
            else if (user.role === "ADMIN") acc.admins++;
            else if (user.role === "MANAGER") acc.managers++;
            return acc;
          },
          { users: 0, admins: 0, managers: 0 }
        );

        setUsers(counts.users);
        setAdmins(counts.admins);
        setManagers(counts.managers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { role: "users", number: users, fill: "hsl(var(--chart-1))" },
    { role: "admins", number: admins, fill: "hsl(var(--chart-2))" },
    { role: "managers", number: managers, fill: "hsl(var(--chart-3))" },
  ];

  return (
    <Card className="flex flex-col md:h-[25rem]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Employees</CardTitle>
        <CardDescription>2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="number"
                  nameKey="role"
                  innerRadius={60}
                />
              </PieChart>
            </ChartContainer>
            <UsersRound
              className="absolute inset-0 md:bottom-[50px] left-[5px] m-auto"
              width={40}
              height={40}
              color="#000000"
            />
          </>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Total employees for this year
        </div>
      </CardFooter>
    </Card>
  );
};

export default CountChart;
