"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/protected-route"
import { UserMenu } from "@/components/user-menu"
import { Shield, ArrowLeft, Users, Mail, Phone, Calendar, Activity, Clock, Target } from "lucide-react"

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "Иванов Иван Иванович",
    role: "Ведущий специалист ИБ",
    email: "ivanov@company.com",
    phone: "+7 (999) 123-45-67",
    avatar: "И.И.",
    status: "Онлайн",
    experience: "5 лет",
    specialization: ["Malware анализ", "Форензика", "Реагирование на инциденты"],
    stats: {
      resolved: 23,
      avgTime: "3.2ч",
      efficiency: 92,
      activeIncidents: 3,
    },
  },
  {
    id: 2,
    name: "Петров Петр Петрович",
    role: "Специалист ИБ",
    email: "petrov@company.com",
    phone: "+7 (999) 234-56-78",
    avatar: "П.П.",
    status: "Онлайн",
    experience: "3 года",
    specialization: ["Сетевая безопасность", "DDoS защита", "Мониторинг"],
    stats: {
      resolved: 18,
      avgTime: "4.1ч",
      efficiency: 87,
      activeIncidents: 2,
    },
  },
  {
    id: 3,
    name: "Сидоров Сидор Сидорович",
    role: "Младший специалист ИБ",
    email: "sidorov@company.com",
    phone: "+7 (999) 345-67-89",
    avatar: "С.С.",
    status: "Отсутствует",
    experience: "2 года",
    specialization: ["Веб-безопасность", "Уязвимости", "Тестирование"],
    stats: {
      resolved: 15,
      avgTime: "2.8ч",
      efficiency: 95,
      activeIncidents: 1,
    },
  },
  {
    id: 4,
    name: "Козлов Козел Козлович",
    role: "Стажер",
    email: "kozlov@company.com",
    phone: "+7 (999) 456-78-90",
    avatar: "К.К.",
    status: "Онлайн",
    experience: "6 месяцев",
    specialization: ["Документооборот", "Первичный анализ", "Поддержка"],
    stats: {
      resolved: 12,
      avgTime: "5.2ч",
      efficiency: 78,
      activeIncidents: 4,
    },
  },
]

export default function TeamPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Онлайн":
        return "bg-green-500"
      case "Занят":
        return "bg-orange-500"
      case "Отсутствует":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Команда ИБ</h1>
              </div>
            </div>
            <div className="ml-auto">
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
                  <CardTitle className="text-sm font-medium">Всего специалистов</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">4 онлайн сейчас</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Средняя эффективность</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">88%</div>
                  <p className="text-xs text-muted-foreground">+5% к прошлому месяцу</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активных инцидентов</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">10</div>
                  <p className="text-xs text-muted-foreground">В работе у команды</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Среднее время</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.8ч</div>
                  <p className="text-xs text-muted-foreground">Время решения</p>
                </CardContent>
              </Card>
            </div>

            {/* Team Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Обзор команды</TabsTrigger>
                <TabsTrigger value="members">Участники</TabsTrigger>
                <TabsTrigger value="performance">Производительность</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Статус команды</CardTitle>
                      <CardDescription>Текущая доступность специалистов</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Онлайн</span>
                          </div>
                          <span className="font-bold">8</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-sm">Занят</span>
                          </div>
                          <span className="font-bold">2</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            <span className="text-sm">Отсутствует</span>
                          </div>
                          <span className="font-bold">2</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Распределение нагрузки</CardTitle>
                      <CardDescription>Активные инциденты по специалистам</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">{member.avatar}</span>
                              </div>
                              <span className="text-sm">
                                {member.name.split(" ")[0]} {member.name.split(" ")[1][0]}.
                              </span>
                            </div>
                            <Badge variant={member.stats.activeIncidents > 3 ? "destructive" : "secondary"}>
                              {member.stats.activeIncidents}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {teamMembers.map((member) => (
                    <Card key={member.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-medium">{member.avatar}</span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{member.name}</CardTitle>
                              <CardDescription>{member.role}</CardDescription>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(member.status)} text-white`}>{member.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Опыт: {member.experience}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Специализация:</p>
                          <div className="flex flex-wrap gap-1">
                            {member.specialization.map((spec, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{member.stats.resolved}</div>
                            <p className="text-xs text-muted-foreground">Решено</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{member.stats.efficiency}%</div>
                            <p className="text-xs text-muted-foreground">Эффективность</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Рейтинг производительности</CardTitle>
                    <CardDescription>Статистика работы за текущий месяц</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamMembers
                        .sort((a, b) => b.stats.efficiency - a.stats.efficiency)
                        .map((member, index) => (
                          <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <span className="text-sm font-bold">#{index + 1}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium">{member.avatar}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-sm text-muted-foreground">{member.role}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6">
                              <div className="text-center">
                                <p className="text-sm font-medium">{member.stats.resolved}</p>
                                <p className="text-xs text-muted-foreground">Решено</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium">{member.stats.avgTime}</p>
                                <p className="text-xs text-muted-foreground">Среднее время</p>
                              </div>
                              <Badge
                                variant={
                                  member.stats.efficiency >= 90
                                    ? "default"
                                    : member.stats.efficiency >= 80
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {member.stats.efficiency}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
