import type { Meta, StoryObj } from "@storybook/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "./chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

// ─── Shared data ───────────────────────────────────────────────

const monthlyData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig;

// ─── Meta ──────────────────────────────────────────────────────

const meta = {
  title: "UI/Chart",
  component: ChartContainer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Area Chart ────────────────────────────────────────────────

export const AreaChartDefault: Story = {
  name: "Area Chart",
  render: () => (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>Showing total visitors for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            data={monthlyData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

export const AreaChartStacked: Story = {
  name: "Area Chart - Stacked",
  render: () => (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>Stacked area comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            data={monthlyData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

// ─── Bar Chart ─────────────────────────────────────────────────

export const BarChartDefault: Story = {
  name: "Bar Chart",
  render: () => (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={monthlyData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Showing total visitors for the last 6 months
      </CardFooter>
    </Card>
  ),
};

export const BarChartHorizontal: Story = {
  name: "Bar Chart - Horizontal",
  render: () => {
    const data = [
      { browser: "Chrome", visitors: 275, fill: "var(--color-chrome)" },
      { browser: "Safari", visitors: 200, fill: "var(--color-safari)" },
      { browser: "Firefox", visitors: 187, fill: "var(--color-firefox)" },
      { browser: "Edge", visitors: 173, fill: "var(--color-edge)" },
      { browser: "Other", visitors: 90, fill: "var(--color-other)" },
    ];

    const config = {
      visitors: { label: "Visitors" },
      chrome: { label: "Chrome", color: "var(--chart-1)" },
      safari: { label: "Safari", color: "var(--chart-2)" },
      firefox: { label: "Firefox", color: "var(--chart-3)" },
      edge: { label: "Edge", color: "var(--chart-4)" },
      other: { label: "Other", color: "var(--chart-5)" },
    } satisfies ChartConfig;

    return (
      <Card className="w-[550px]">
        <CardHeader>
          <CardTitle>Bar Chart - Horizontal</CardTitle>
          <CardDescription>Browser usage breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-[250px] w-full">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ left: 0 }}
            >
              <YAxis
                dataKey="browser"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  config[value as keyof typeof config]?.label ?? value
                }
              />
              <XAxis dataKey="visitors" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="visitors" layout="vertical" radius={5}>
                {data.map((entry) => (
                  <Cell key={entry.browser} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  },
};

export const BarChartWithLabel: Story = {
  name: "Bar Chart - With Labels",
  render: () => (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Bar Chart - With Labels</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={monthlyData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

// ─── Line Chart ────────────────────────────────────────────────

export const LineChartDefault: Story = {
  name: "Line Chart",
  render: () => (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Line Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            data={monthlyData}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

export const LineChartWithDots: Story = {
  name: "Line Chart - With Dots",
  render: () => (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Line Chart - With Dots</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            data={monthlyData}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{ fill: "var(--color-desktop)" }}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={{ fill: "var(--color-mobile)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

// ─── Pie Chart ─────────────────────────────────────────────────

const pieData = [
  { browser: "Chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "Safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "Firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "Edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "Other", visitors: 90, fill: "var(--color-other)" },
];

const pieConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  firefox: { label: "Firefox", color: "var(--chart-3)" },
  edge: { label: "Edge", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig;

export const PieChartDefault: Story = {
  name: "Pie Chart",
  render: () => {
    const totalVisitors = pieData.reduce((acc, curr) => acc + curr.visitors, 0);

    return (
      <Card className="w-[350px]">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Donut</CardTitle>
          <CardDescription>Browser share breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={pieConfig}
            className="mx-auto aspect-square h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pieData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Total visitors across all browsers
        </CardFooter>
      </Card>
    );
  },
};

export const PieChartWithLegend: Story = {
  name: "Pie Chart - With Legend",
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - With Legend</CardTitle>
        <CardDescription>Browser market share</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={pieConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieData}
              dataKey="visitors"
              nameKey="browser"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

// ─── Radar Chart ───────────────────────────────────────────────

const radarData = [
  { skill: "Math", desktop: 186, mobile: 80 },
  { skill: "Chinese", desktop: 305, mobile: 200 },
  { skill: "English", desktop: 237, mobile: 120 },
  { skill: "Geography", desktop: 273, mobile: 190 },
  { skill: "Physics", desktop: 209, mobile: 130 },
  { skill: "History", desktop: 214, mobile: 140 },
];

export const RadarChartDefault: Story = {
  name: "Radar Chart",
  render: () => (
    <Card className="w-[400px]">
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart</CardTitle>
        <CardDescription>Skill distribution comparison</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <RadarChart data={radarData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <PolarAngleAxis dataKey="skill" />
            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

export const RadarChartMultiple: Story = {
  name: "Radar Chart - Multiple",
  render: () => (
    <Card className="w-[400px]">
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart - Multiple</CardTitle>
        <CardDescription>Desktop vs Mobile comparison</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <RadarChart data={radarData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="skill" />
            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
            />
            <Radar
              dataKey="mobile"
              fill="var(--color-mobile)"
              fillOpacity={0.6}
            />
            <ChartLegend
              className="mt-8"
              content={<ChartLegendContent />}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

// ─── Radial Chart ──────────────────────────────────────────────

const radialData = [
  { browser: "Chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "Safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "Firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "Edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "Other", visitors: 90, fill: "var(--color-other)" },
];

export const RadialChartDefault: Story = {
  name: "Radial Chart",
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart</CardTitle>
        <CardDescription>Browser usage distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={pieConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <RadialBarChart
            data={radialData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="visitors" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Visitor count by browser
      </CardFooter>
    </Card>
  ),
};

export const RadialChartWithLabel: Story = {
  name: "Radial Chart - With Label",
  render: () => {
    const totalVisitors = radialData.reduce(
      (acc, curr) => acc + curr.visitors,
      0
    );

    return (
      <Card className="w-[350px]">
        <CardHeader className="items-center pb-0">
          <CardTitle>Radial Chart - With Label</CardTitle>
          <CardDescription>Total visitors in center</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={pieConfig}
            className="mx-auto aspect-square h-[250px]"
          >
            <RadialBarChart
              data={radialData}
              startAngle={0}
              endAngle={250}
              innerRadius={80}
              outerRadius={110}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="browser" />}
              />
              <RadialBar dataKey="visitors" background cornerRadius={10}>
                <LabelList
                  position="insideStart"
                  dataKey="browser"
                  className="fill-white capitalize mix-blend-luminosity"
                  fontSize={11}
                />
              </RadialBar>
              <PolarGrid gridType="circle" radialLines={false} stroke="none" />
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  },
};

// ─── Combined Overview ─────────────────────────────────────────

export const AllCharts: Story = {
  name: "All Charts Overview",
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Area</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <AreaChart data={monthlyData}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
              <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Bar</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Line</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
              <Line dataKey="desktop" type="monotone" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
              <Line dataKey="mobile" type="monotone" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Pie</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieConfig} className="mx-auto aspect-square h-[180px]">
            <PieChart>
              <Pie data={pieData} dataKey="visitors" nameKey="browser" innerRadius={40} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[180px]">
            <RadarChart data={radarData}>
              <PolarAngleAxis dataKey="skill" />
              <PolarGrid />
              <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.6} />
              <Radar dataKey="mobile" fill="var(--color-mobile)" fillOpacity={0.6} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Radial</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieConfig} className="mx-auto aspect-square h-[180px]">
            <RadialBarChart data={radialData} innerRadius={30} outerRadius={80}>
              <RadialBar dataKey="visitors" background />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  ),
};
