"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"

// Mock data for charts
const incidentsByMonth = [
  { month: "Янв", incidents: 45, resolved: 42 },
  { month: "Фев", incidents: 52, resolved: 48 },
  { month: "Мар", incidents: 38, resolved: 35 },
  { month: "Апр", incidents: 61, resolved: 58 },
  { month: "Май", incidents: 55, resolved: 52 },
  { month: "Июн", incidents: 67, resolved: 63 },
]

const incidentsByType = [
  { name: "Malware", value: 35, color: "#ef4444" },
  { name: "Фишинг", value: 28, color: "#f97316" },
  { name: "DDoS", value: 22, color: "#eab308" },
  { name: "Утечка данных", value: 18, color: "#22c55e" },
  { name: "Нарушение доступа", value: 24, color: "#3b82f6" },
]

const responseTimeData = [
  { day: "Пн", avgTime: 3.2, target: 4.0 },
  { day: "Вт", avgTime: 2.8, target: 4.0 },
  { day: "Ср", avgTime: 4.1, target: 4.0 },
  { day: "Чт", avgTime: 3.7, target: 4.0 },
  { day: "Пт", avgTime: 5.2, target: 4.0 },
  { day: "Сб", avgTime: 2.1, target: 4.0 },
  { day: "Вс", avgTime: 1.8, target: 4.0 },
]

const severityTrend = [
  { month: "Янв", critical: 8, high: 15, medium: 18, low: 4 },
  { month: "Фев", critical: 12, high: 18, medium: 16, low: 6 },
  { month: "Мар", critical: 6, high: 12, medium: 15, low: 5 },
  { month: "Апр", critical: 15, high: 22, medium: 19, low: 5 },
  { month: "Май", critical: 9, high: 19, medium: 21, low: 6 },
  { month: "Июн", critical: 11, high: 24, medium: 25, low: 7 },
]

export function IncidentTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Тренд инцидентов</CardTitle>
        <CardDescription>Количество инцидентов и их решение по месяцам</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            incidents: {
              label: "Инциденты",
              color: "hsl(var(--chart-1))",
            },
            resolved: {
              label: "Решено",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incidentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="incidents" fill="var(--color-incidents)" />
              <Bar dataKey="resolved" fill="var(--color-resolved)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function IncidentTypeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Распределение по типам</CardTitle>
        <CardDescription>Инциденты по категориям за последние 6 месяцев</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            malware: { label: "Malware", color: "#ef4444" },
            phishing: { label: "Фишинг", color: "#f97316" },
            ddos: { label: "DDoS", color: "#eab308" },
            leak: { label: "Утечка данных", color: "#22c55e" },
            access: { label: "Нарушение доступа", color: "#3b82f6" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incidentsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incidentsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ResponseTimeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Время реагирования</CardTitle>
        <CardDescription>Среднее время реагирования на инциденты по дням недели</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            avgTime: {
              label: "Среднее время (ч)",
              color: "hsl(var(--chart-1))",
            },
            target: {
              label: "Целевое время (ч)",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="avgTime"
                stroke="var(--color-avgTime)"
                strokeWidth={2}
                dot={{ fill: "var(--color-avgTime)" }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="var(--color-target)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "var(--color-target)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function SeverityTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Тренд критичности</CardTitle>
        <CardDescription>Распределение инцидентов по уровням критичности</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            critical: {
              label: "Критическая",
              color: "hsl(var(--chart-4))",
            },
            high: {
              label: "Высокая",
              color: "hsl(var(--chart-3))",
            },
            medium: {
              label: "Средняя",
              color: "hsl(var(--chart-2))",
            },
            low: {
              label: "Низкая",
              color: "hsl(var(--chart-5))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={severityTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="critical"
                stackId="1"
                stroke="var(--color-critical)"
                fill="var(--color-critical)"
              />
              <Area type="monotone" dataKey="high" stackId="1" stroke="var(--color-high)" fill="var(--color-high)" />
              <Area
                type="monotone"
                dataKey="medium"
                stackId="1"
                stroke="var(--color-medium)"
                fill="var(--color-medium)"
              />
              <Area type="monotone" dataKey="low" stackId="1" stroke="var(--color-low)" fill="var(--color-low)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
