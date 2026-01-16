"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Timestamp } from "firebase/firestore"

interface Trainee {
    uid: string;
    firstName: string;
    lastName: string;
    licenseType: string;
    createdAt: Timestamp;
    status?: 'مؤكد' | 'في الانتظار' | 'مكتمل' | 'ملغي';
}

interface TraineeRegistrationsChartProps {
    trainees: Trainee[];
}

export function TraineeRegistrationsChart({ trainees }: TraineeRegistrationsChartProps) {
    const processChartData = (trainees: Trainee[]) => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - i)
            return d.toISOString().split('T')[0]
        }).reverse();

        const registrations = last7Days.map(day => ({
            date: day,
            "المسجلون": 0,
        }));

        const registrationMap = new Map(registrations.map(r => [r.date, r]));

        trainees.forEach(trainee => {
            if (trainee.createdAt) {
                const registrationDate = trainee.createdAt.toDate().toISOString().split('T')[0];
                if (registrationMap.has(registrationDate)) {
                    const dayData = registrationMap.get(registrationDate);
                    if (dayData) {
                        dayData["المسجلون"]++;
                    }
                }
            }
        });

        return Array.from(registrationMap.values());
    }

    const chartData = processChartData(trainees);
    const totalNewTrainees = chartData.reduce((acc, curr) => acc + curr["المسجلون"], 0);

    const chartConfig = {
        "المسجلون": {
            label: "المسجلون",
            color: "hsl(var(--chart-1))",
        },
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>المتدربون الجدد</CardTitle>
                <CardDescription>آخر 7 أيام</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        dir="rtl"
                    >
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('ar-DZ', { day: 'numeric', month: 'short' })}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            allowDecimals={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar
                            dataKey="المسجلون"
                            fill="var(--color-المسجلون)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    لديك {totalNewTrainees} متدربًا جديدًا في الأسبوع الماضي <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    عرض تحليلات المتدربين المسجلين
                </div>
            </CardFooter>
        </Card>
    )
}
