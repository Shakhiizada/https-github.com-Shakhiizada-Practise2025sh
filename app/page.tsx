"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, Activity, Users, Clock, TrendingUp, Plus, Search, Filter, Download, Loader2 } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/contexts/auth-context"

interface Stats {
  totalIncidents: number
  activeIncidents: number
  criticalIncidents: number
  averageResponseTime: string
  incidentsByType: Array<{ type: string; count: number }>
  incidentsBySeverity: Array<{ severity: string; count: number }>
  recentActivity: Array<{
    id: string
    action: string
    incidentId: string
    incidentTitle: string
    userName: string
    createdAt: string
  }>
}

interface Incident {
  id: string
  title: string
  type: string
  severity: string
  status: string
  assignee?: { name: string } | null
  createdAt: string
  description: string
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-500"
    case "HIGH":
      return "bg-orange-500"
    case "MEDIUM":
      return "bg-yellow-500"
    case "LOW":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-blue-500"
    case "IN_PROGRESS":
      return "bg-orange-500"
    case "RESOLVED":
      return "bg-green-500"
    case "CLOSED":
      return "bg-gray-500"
    default:
      return "bg-gray-500"
  }
}

const getSeverityLabel = (severity: string) => {
  const labels: Record<string, string> = {
    CRITICAL: "Критическая",
    HIGH: "Высокая",
    MEDIUM: "Средняя",
    LOW: "Низкая",
  }
  return labels[severity] || severity
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    NEW: "Новый",
    IN_PROGRESS: "В работе",
    RESOLVED: "Решен",
    CLOSED: "Закрыт",
  }
  return labels[status] || status
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    DATA_LEAK: "Утечка данных",
    DDOS: "DDoS атака",
    MALWARE: "Malware",
    PHISHING: "Фишинг",
    UNAUTHORIZED_ACCESS: "Несанкц. доступ",
    NETWORK_ATTACK: "Сетевая атака",
    OTHER: "Другое",
  }
  return labels[type] || type
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<Stats | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, incidentsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/incidents?status=NEW,IN_PROGRESS&limit=10"),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (incidentsRes.ok) {
          const incidentsData = await incidentsRes.json()
          setIncidents(incidentsData.incidents || [])
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    )
  }

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
                    <div className="text-2xl font-bold">{stats?.totalIncidents || 0}</div>
                    <p className="text-xs text-muted-foreground">За все время</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Активные</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.activeIncidents || 0}</div>
                    <p className="text-xs text-muted-foreground">Требуют внимания</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Критические</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats?.criticalIncidents || 0}</div>
                    <p className="text-xs text-muted-foreground">Высокий приоритет</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Среднее время</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.averageResponseTime || "N/A"}</div>
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
                          {stats?.incidentsBySeverity?.map((item) => {
                            const total = stats.totalIncidents || 1
                            const percentage = Math.round((item.count / total) * 100)
                            return (
                              <div key={item.severity}>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{getSeverityLabel(item.severity)}</span>
                                  <span className="text-sm font-medium">{item.count}</span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            )
                          })}
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
                          {stats?.recentActivity?.slice(0, 5).map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  {activity.action} - {activity.incidentTitle}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {activity.userName} - {new Date(activity.createdAt).toLocaleString("ru-RU")}
                                </p>
                              </div>
                            </div>
                          ))}
                          {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                            <p className="text-sm text-muted-foreground">Нет недавней активности</p>
                          )}
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
                    {incidents.map((incident) => (
                      <Card key={incident.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/incidents/${incident.id}`)}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold">{incident.title}</h3>
                                <Badge variant="outline">{incident.id.slice(0, 8)}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <span>Тип: {getTypeLabel(incident.type)}</span>
                                <span>Создан: {new Date(incident.createdAt).toLocaleString("ru-RU")}</span>
                                <span>Ответственный: {incident.assignee?.name || "Не назначен"}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge className={`${getSeverityColor(incident.severity)} text-white`}>
                                {getSeverityLabel(incident.severity)}
                              </Badge>
                              <Badge className={`${getStatusColor(incident.status)} text-white`}>
                                {getStatusLabel(incident.status)}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {incidents.length === 0 && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <p className="text-muted-foreground">Нет активных инцидентов</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {hasPermission("view_reports") && (
                  <TabsContent value="analytics" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Аналитика инцидентов</CardTitle>
                        <CardDescription>Статистика и тренды</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-primary">{stats?.totalIncidents || 0}</div>
                            <p className="text-sm text-muted-foreground">Всего инцидентов</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                              {stats?.totalIncidents 
                                ? Math.round(((stats.totalIncidents - stats.activeIncidents) / stats.totalIncidents) * 100) 
                                : 0}%
                            </div>
                            <p className="text-sm text-muted-foreground">Решено</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">{stats?.averageResponseTime || "N/A"}</div>
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
