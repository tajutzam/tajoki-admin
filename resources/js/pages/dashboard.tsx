import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// import shadcn/ui components (ganti sesuai struktur proyekmu)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: '#2563eb',
    },
    mobile: {
        label: 'Mobile',
        color: '#60a5fa',
    },
} satisfies ChartConfig;

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Grid 3 cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Card 1: Dummy User Count */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">1234</p>
                            <p className="text-muted-foreground text-sm">Users registered</p>
                        </CardContent>
                    </Card>

                    {/* Card 2: Dummy Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Signups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Placeholder for chart */}
                            <div className="h-40 w-full rounded-md bg-gradient-to-r from-blue-500 to-indigo-600" />
                        </CardContent>
                    </Card>

                    {/* Card 3: Dummy Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Placeholder for chart */}
                            <div className="h-40 w-full rounded-md bg-gradient-to-r from-green-500 to-emerald-600" />
                        </CardContent>
                    </Card>
                </div>

                {/* Large bottom card for other content */}
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </div>
        </AppLayout>
    );
}
