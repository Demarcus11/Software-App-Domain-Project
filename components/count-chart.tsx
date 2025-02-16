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
const chartData = [
  { role: "users", number: 275, fill: "hsl(var(--chart-1))" },
  { role: "admins", number: 200, fill: "hsl(var(--chart-2))" },
  { role: "managers", number: 187, fill: "hsl(var(--chart-3))" },
];

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
  return (
    <Card className="flex flex-col md:h-[25rem]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Active Employees</CardTitle>
        <CardDescription>2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 relative">
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
          className="absolute inset-0 bottom-[15px] left-[5px] m-auto"
          width={40}
          height={40}
          color="#000000"
        />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this year
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total employees for this year
        </div>
      </CardFooter>
    </Card>
  );
};

export default CountChart;
