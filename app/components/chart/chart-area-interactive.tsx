"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { trafficApi } from "~/api/traffic"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Loader2 } from "lucide-react"

export const description = "An interactive area chart"

const chartConfig = {
    visitors: {
        label: "Lượt truy cập",
    },
    count: {
        label: "Truy cập",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function ChartAreaInteractive() {
    const [period, setPeriod] = React.useState<"day" | "month" | "year">("day")

    const { data: trafficData, isLoading } = useQuery({
        queryKey: ["traffic", period],
        queryFn: () => trafficApi.getStats(period),
    })

    const formattedData = React.useMemo(() => {
        if (!trafficData?.points) return []
        return trafficData.points.map((point) => ({
            date: point.period,
            count: point.count,
            zone: point.zone,
        }))
    }, [trafficData])

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Thống kê truy cập</CardTitle>
                    <CardDescription>
                        Hiển thị tổng lượt truy cập theo thời gian
                    </CardDescription>
                </div>
                <Select value={period} onValueChange={(value: "day" | "month" | "year") => setPeriod(value)}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Chọn thời gian" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="day" className="rounded-lg">
                            Theo ngày
                        </SelectItem>
                        <SelectItem value="month" className="rounded-lg">
                            Theo tháng
                        </SelectItem>
                        <SelectItem value="year" className="rounded-lg">
                            Theo năm
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {isLoading ? (
                    <div className="flex h-[250px] w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={formattedData}>
                            <defs>
                                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-count)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-count)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    if (period === 'day') {
                                        const date = new Date(value)
                                        return date.toLocaleDateString("vi-VN", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }
                                    return value;
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Thời gian
                                                        </span>
                                                        <span className="font-bold text-muted-foreground">
                                                            {period === 'day'
                                                                ? new Date(label).toLocaleDateString("vi-VN", { month: "short", day: "numeric", year: "numeric" })
                                                                : label
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Truy cập
                                                        </span>
                                                        <span className="font-bold">
                                                            {data.count}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col col-span-2">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Khu vực
                                                        </span>
                                                        <span className="font-bold text-xs">
                                                            {data.zone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                dataKey="count"
                                type="natural"
                                fill="url(#fillCount)"
                                stroke="var(--color-count)"
                                stackId="a"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
