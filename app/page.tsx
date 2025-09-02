"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, Activity, Users, Clock, TrendingUp, Plus, Search, Filter, Download } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/contexts/auth-context"

// Mock data for incidents
const mockIncidents = [
  {
    id: "INC-2024-001",
    title: "Подозрительная активность в сети",
    type: "Сетевая атака",
    severity: "Высокая",
    status: "В работе",
    assignee: "Иванов И.И.",
    created: "2024-01-15 14:30",
    description: "Обнаружена аномальная сетевая активность с внешних IP-адресов",
  },
  {
    id: "INC-2024-002",
    title: "Попытка несанкционированного доступа",
    type: "Нарушение доступа",
    severity: "Критическая",
    status: "Новый",
    assignee: "Не назначен",
    created: "2024-01-15 16:45",
    description: "Множественные неудачные попытки входа в административную панель",
  },
  {
    id: "INC-2024-003",
    title: "Обнаружение вредоносного ПО",
    type: "Malware",
    severity: "Средняя",
    status: "Решен",
    assignee: "Петров П.П.",
    created: "2024-01-14 09:15",
    description: "Антивирус обнаружил подозрительный файл на рабочей станции",
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Критическая":
      return "bg-red-500"
    case "Высокая":
      return "bg-orange-500"
    case "Средняя":
      return "bg-yellow-500"
    case "Низкая":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Новый":
      return "bg-blue-500"
    case "В работе":
      return "bg-orange-500"
    case "Решен":
      return "bg-green-500"
    case "Закрыт":
      return "bg-gray-500"
    default:
      return "bg-gray-500"
  }
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { hasPermission } = useAuth()
  const router = useRouter()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">SecureTracker</h1>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Поиск
              </Button>
              {hasPermission("create_incident") && (
                <Button size="sm" onClick={() => router.push("/incidents")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Новый инцидент
                </Button>
              )}
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 border-r bg-sidebar min-h-screen">
            <nav className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                Дашборд
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/incidents")}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Инциденты
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/team")}>
                <Users className="h-4 w-4 mr-2" />
                Команда
              </Button>
              {hasPermission("view_reports") && (
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/reports")}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Отчеты
                </Button>
              )}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Всего инцидентов</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">127</div>
                    <p className="text-xs text-muted-foreground">+12% за месяц</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Активные</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23</div>
                    <p className="text-xs text-muted-foreground">Требуют внимания</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Критические</CardTitle>
                    <CardDescription>Высокий приоритет</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">5</div>
                    <p className="text-xs text-muted-foreground">Высокий приоритет</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Среднее время</CardTitle>
                    <CardDescription>Время реагирования</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.2ч</div>
                    <p className="text-xs text-muted-foreground">Время реагирования</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">Обзор</TabsTrigger>
                  <TabsTrigger value="incidents">Активные инциденты</TabsTrigger>
                  {hasPermission("view_reports") && <TabsTrigger value="analytics">Аналитика</TabsTrigger>}
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Severity Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Распределение по критичности</CardTitle>
                        <CardDescription>Текущие инциденты по уровням</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Критическая</span>
                            <span className="text-sm font-medium">5</span>
                          </div>
                          <Progress value={22} className="h-2" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Высокая</span>
                            <span className="text-sm font-medium">8</span>
                          </div>
                          <Progress value={35} className="h-2" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Средняя</span>
                            <span className="text-sm font-medium">7</span>
                          </div>
                          <Progress value={30} className="h-2" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Низкая</span>
                            <span className="text-sm font-medium">3</span>
                          </div>
                          <Progress value={13} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Последняя активность</CardTitle>
                        <CardDescription>Недавние изменения в системе</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm">Инцидент INC-2024-003 закрыт</p>
                              <p className="text-xs text-muted-foreground">2 минуты назад</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm">Новый инцидент INC-2024-002</p>
                              <p className="text-xs text-muted-foreground">15 минут назад</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm">Назначен ответственный за INC-2024-001</p>
                              <p className="text-xs text-muted-foreground">1 час назад</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="incidents" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Активные инциденты</h2>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Фильтр
                      </Button>
                      {hasPermission("view_reports") && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Экспорт
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mockIncidents.map((incident) => (
                      <Card key={incident.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold">{incident.title}</h3>
                                <Badge variant="outline">{incident.id}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <span>Тип: {incident.type}</span>
                                <span>Создан: {incident.created}</span>
                                <span>Ответственный: {incident.assignee}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge className={`${getSeverityColor(incident.severity)} text-white`}>
                                {incident.severity}
                              </Badge>
                              <Badge className={`${getStatusColor(incident.status)} text-white`}>
                                {incident.status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {hasPermission("view_reports") && (
                  <TabsContent value="analytics" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Аналитика инцидентов</CardTitle>
                        <CardDescription>Статистика и тренды за последние 30 дней</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-primary">127</div>
                            <p className="text-sm text-muted-foreground">Всего инцидентов</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">89%</div>
                            <p className="text-sm text-muted-foreground">Решено вовремя</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">4.2ч</div>
                            <p className="text-sm text-muted-foreground">Среднее время</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
