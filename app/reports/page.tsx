"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { UserMenu } from "@/components/user-menu"
import {
  IncidentTrendsChart,
  IncidentTypeChart,
  ResponseTimeChart,
  SeverityTrendChart,
} from "@/components/reports-charts"
import {
  Shield,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  Target,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react"

// Mock data for reports
const teamPerformance = [
  { name: "Иванов И.И.", resolved: 23, avgTime: "3.2ч", efficiency: 92 },
  { name: "Петров П.П.", resolved: 18, avgTime: "4.1ч", efficiency: 87 },
  { name: "Сидоров С.С.", resolved: 15, avgTime: "2.8ч", efficiency: 95 },
  { name: "Козлов К.К.", resolved: 12, avgTime: "5.2ч", efficiency: 78 },
]

const slaMetrics = [
  { metric: "Время первого реагирования", target: "< 1ч", actual: "45мин", status: "success" },
  { metric: "Время решения критических", target: "< 4ч", actual: "3.2ч", status: "success" },
  { metric: "Время решения высоких", target: "< 8ч", actual: "6.8ч", status: "success" },
  { metric: "Время решения средних", target: "< 24ч", actual: "18.5ч", status: "success" },
  { metric: "Процент решения в срок", target: "> 90%", actual: "89%", status: "warning" },
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [reportType, setReportType] = useState("overview")

  const handleExportReport = () => {
    // В реальном приложении здесь будет логика экспорта
    console.log("Exporting report...")
  }

  return (
    <ProtectedRoute requiredPermission="view_reports">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Отчеты и аналитика</h1>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Последние 7 дней</SelectItem>
                  <SelectItem value="30d">Последние 30 дней</SelectItem>
                  <SelectItem value="90d">Последние 3 месяца</SelectItem>
                  <SelectItem value="1y">Последний год</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Общая эффективность</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <p className="text-xs text-muted-foreground">SLA соответствие</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Среднее время решения</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2ч</div>
                  <p className="text-xs text-muted-foreground">-15% к прошлому месяцу</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Решено инцидентов</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-xs text-muted-foreground">За выбранный период</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активная команда</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Специалистов ИБ</p>
                </CardContent>
              </Card>
            </div>

            {/* Report Tabs */}
            <Tabs value={reportType} onValueChange={setReportType}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="trends">Тренды</TabsTrigger>
                <TabsTrigger value="performance">Производительность</TabsTrigger>
                <TabsTrigger value="sla">SLA метрики</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <IncidentTrendsChart />
                  <IncidentTypeChart />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponseTimeChart />
                  <Card>
                    <CardHeader>
                      <CardTitle>Ключевые показатели</CardTitle>
                      <CardDescription>Основные метрики за выбранный период</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Всего инцидентов</span>
                        <span className="font-bold">387</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Решено</span>
                        <span className="font-bold text-green-600">342</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">В работе</span>
                        <span className="font-bold text-orange-600">23</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Просрочено</span>
                        <span className="font-bold text-red-600">8</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Эскалировано</span>
                        <span className="font-bold text-blue-600">14</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <SeverityTrendChart />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Тренды по типам угроз</CardTitle>
                        <CardDescription>Изменения в категориях инцидентов</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Malware</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">+15%</span>
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Фишинг</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">-8%</span>
                              <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">DDoS атаки</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">+22%</span>
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Утечки данных</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">-12%</span>
                              <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Прогноз на следующий месяц</CardTitle>
                        <CardDescription>Ожидаемые показатели</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">~65</div>
                            <p className="text-sm text-muted-foreground">Ожидаемых инцидентов</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">3.8ч</div>
                            <p className="text-sm text-muted-foreground">Прогноз времени решения</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">92%</div>
                            <p className="text-sm text-muted-foreground">Целевая эффективность</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Производительность команды</CardTitle>
                    <CardDescription>Статистика работы специалистов за выбранный период</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamPerformance.map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">Решено: {member.resolved} инцидентов</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm font-medium">{member.avgTime}</p>
                              <p className="text-xs text-muted-foreground">Среднее время</p>
                            </div>
                            <Badge
                              variant={
                                member.efficiency >= 90
                                  ? "default"
                                  : member.efficiency >= 80
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {member.efficiency}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Загруженность по дням</CardTitle>
                      <CardDescription>Распределение инцидентов по дням недели</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].map(
                          (day, index) => {
                            const values = [18, 22, 16, 25, 28, 8, 5]
                            return (
                              <div key={day} className="flex items-center justify-between">
                                <span className="text-sm">{day}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-24 bg-muted rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full"
                                      style={{ width: `${(values[index] / 28) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium w-8">{values[index]}</span>
                                </div>
                              </div>
                            )
                          },
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Топ категорий</CardTitle>
                      <CardDescription>Наиболее частые типы инцидентов</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { name: "Malware", count: 45, trend: "+12%" },
                          { name: "Фишинг", count: 38, trend: "-5%" },
                          { name: "DDoS", count: 32, trend: "+18%" },
                          { name: "Утечка данных", count: 28, trend: "-8%" },
                          { name: "Социальная инженерия", count: 22, trend: "+3%" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{item.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{item.count}</span>
                              <span
                                className={`text-xs ${item.trend.startsWith("+") ? "text-red-500" : "text-green-500"}`}
                              >
                                {item.trend}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sla" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SLA соответствие</CardTitle>
                    <CardDescription>Соответствие целевым показателям обслуживания</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {slaMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{metric.metric}</p>
                            <p className="text-sm text-muted-foreground">Цель: {metric.target}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">{metric.actual}</p>
                              <p className="text-xs text-muted-foreground">Фактически</p>
                            </div>
                            {metric.status === "success" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : metric.status === "warning" ? (
                              <AlertTriangle className="h-5 w-5 text-orange-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Нарушения SLA</CardTitle>
                      <CardDescription>Инциденты с превышением времени</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Критические &gt; 4ч</span>
                          <span className="font-bold text-red-600">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Высокие &gt; 8ч</span>
                          <span className="font-bold text-orange-600">5</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Средние &gt; 24ч</span>
                          <span className="font-bold text-yellow-600">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Низкие &gt; 72ч</span>
                          <span className="font-bold text-green-600">2</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Улучшения</CardTitle>
                      <CardDescription>Рекомендации по оптимизации</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Автоматизация</p>
                            <p className="text-xs text-muted-foreground">Внедрить автоответы для типовых инцидентов</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Users className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Обучение</p>
                            <p className="text-xs text-muted-foreground">Повысить квалификацию команды</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Мониторинг</p>
                            <p className="text-xs text-muted-foreground">Улучшить раннее обнаружение</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
