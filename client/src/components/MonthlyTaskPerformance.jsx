"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const chartConfig = {
  total: {
    label: "Total Tasks",
    color: "hsl(221.2, 83.2%, 53.3%)", // Sapphire blue
  },
  finished: {
    label: "Completed Tasks",
    color: "hsl(142, 71%, 45%)", // Green
  },
  pending: {
    label: "Pending Tasks",
    color: "hsl(32, 95%, 44%)", // Orange
  },
}

export function MonthlyTaskPerformance({ data }) {
  const calculateTrend = (data) => {
    if (data.length < 2) return { trend: 0, icon: Minus }
    const lastMonth = data[data.length - 1].finished
    const secondLastMonth = data[data.length - 2].finished
    const trend = ((lastMonth - secondLastMonth) / secondLastMonth) * 100
    return {
      trend: trend.toFixed(1),
      icon: trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus,
    }
  }

  const performanceTrend = calculateTrend(data)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Monthly Task Performance</CardTitle>
        <CardDescription>Task distribution over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
              <Legend />
              <Bar dataKey="total" fill={chartConfig.total.color} name="Total Tasks" radius={[4, 4, 0, 0]} />
              <Bar dataKey="finished" fill={chartConfig.finished.color} name="Completed Tasks" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill={chartConfig.pending.color} name="Pending Tasks" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          {performanceTrend.trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : performanceTrend.trend < 0 ? (
            <TrendingDown className="h-4 w-4 text-red-500" />
          ) : (
            <Minus className="h-4 w-4 text-gray-500" />
          )}
          <span>
            {performanceTrend.trend > 0
              ? "Trending up"
              : performanceTrend.trend < 0
              ? "Trending down"
              : "No change"}{" "}
            by {Math.abs(performanceTrend.trend)}% this month
          </span>
        </div>
        <div className="text-muted-foreground">
          Showing task performance for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

