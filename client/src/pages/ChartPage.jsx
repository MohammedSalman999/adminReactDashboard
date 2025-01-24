"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", total: 350, completed: 250, pending: 100 },
  { month: "February", total: 400, completed: 300, pending: 100 },
  { month: "March", total: 280, completed: 200, pending: 80 },
  { month: "April", total: 500, completed: 400, pending: 100 },
  { month: "May", total: 450, completed: 350, pending: 100 },
  { month: "June", total: 320, completed: 230, pending: 90 },
];

const chartConfig = {
  total: {
    label: "Total Tasks",
    color: "hsl(var(--chart-sapphire))", // Sapphire
  },
  completed: {
    label: "Completed Tasks",
    color: "hsl(var(--chart-emerald))", // Emerald
  },
  pending: {
    label: "Pending Tasks",
    color: "hsl(var(--chart-ruby))", // Ruby
  },
};

export default function TasksChart() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-base">Task Completion Overview</CardTitle>
        <CardDescription className="text-xs">
          January - June 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <ChartContainer config={chartConfig}>
          <BarChart
            width={350}
            height={200}
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {/* Left bar (orange), middle bar (sapphire), right bar (emerald) */}
            <Bar dataKey="pending" fill="orange" radius={4} />
            <Bar dataKey="total" fill="hsl(var(--sapphire))" radius={4} />
            <Bar dataKey="completed" fill="hsl(var(--emerald))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-1 text-xs">
        <div className="flex gap-1 font-medium">
          +5.2% Growth <TrendingUp className="h-3 w-3" />
        </div>
        <div className="text-muted-foreground">
          Task completion over 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
