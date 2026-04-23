"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"
import { UserMenu } from "@/components/user-menu"
import { Plus, ArrowLeft, Shield, Search, Filter, Loader2, Edit, Trash2, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Incident {
  id: string
  title: string
  type: string
  severity: string
  status: string
  assignee?: { id: string; name: string } | null
  assigneeId?: string | null
  createdAt: string
  description: string
}

interface User {
  id: string
  name: string
  email: string
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "CRITICAL": return "bg-red-500"
    case "HIGH": return "bg-orange-500"
    case "MEDIUM": return "bg-yellow-500"
    case "LOW": return "bg-green-500"
    default: return "bg-gray-500"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW": return "bg-blue-500"
    case "IN_PROGRESS": return "bg-orange-500"
    case "RESOLVED": return "bg-green-500"
    case "CLOSED": return "bg-gray-500"
    default: return "bg-gray-500"
  }
}

const getSeverityLabel = (severity: string) => {
  const labels: Record<string, string> = { CRITICAL: "Критическая", HIGH: "Высокая", MEDIUM: "Средняя", LOW: "Низкая" }
  return labels[severity] || severity
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = { NEW: "Новый", IN_PROGRESS: "В работе", RESOLVED: "Решен", CLOSED: "Закрыт" }
  return labels[status] || status
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    DATA_LEAK: "Утечка данных", DDOS: "DDoS атака", MALWARE: "Malware", PHISHING: "Фишинг",
    UNAUTHORIZED_ACCESS: "Несанкц. доступ", NETWORK_ATTACK: "Сетевая атака", OTHER: "Другое",
  }
  return labels[type] || type
}

export default function IncidentsPage() {
  const router = useRouter()
  const { hasPermission } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit">("list")
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "OTHER",
    severity: "MEDIUM",
    status: "NEW",
    assigneeId: "",
  })

  useEffect(() => {
    fetchIncidents()
    fetchUsers()
  }, [])

  const fetchIncidents = async () => {
    try {
      const res = await fetch("/api/incidents")
      if (res.ok) {
        const data = await res.json()
        setIncidents(data.incidents || [])
      }
    } catch (error) {
      console.error("Failed to fetch incidents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const handleCreateIncident = () => {
    setSelectedIncident(null)
    setFormData({ title: "", description: "", type: "OTHER", severity: "MEDIUM", status: "NEW", assigneeId: "" })
    setCurrentView("create")
  }

  const handleEditIncident = (incident: Incident) => {
    setSelectedIncident(incident)
    setFormData({
      title: incident.title,
      description: incident.description,
      type: incident.type,
      severity: incident.severity,
      status: incident.status,
      assigneeId: incident.assigneeId || "",
    })
    setCurrentView("edit")
  }

  const handleDeleteIncident = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот инцидент?")) return
    
    try {
      const res = await fetch(`/api/incidents/${id}`, { method: "DELETE" })
      if (res.ok) {
        setIncidents((prev) => prev.filter((inc) => inc.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete incident:", error)
    }
  }

  const handleSaveIncident = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const url = selectedIncident ? `/api/incidents/${selectedIncident.id}` : "/api/incidents"
      const method = selectedIncident ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          assigneeId: formData.assigneeId || null,
        }),
      })

      if (res.ok) {
        await fetchIncidents()
        setCurrentView("list")
        setSelectedIncident(null)
      }
    } catch (error) {
      console.error("Failed to save incident:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || incident.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <ProtectedRoute requiredPermission="create_incident">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredPermission="create_incident">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-4">
              {currentView === "list" ? (
                <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  На главную
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setCurrentView("list")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">
                  {currentView === "list" && "Управление инцидентами"}
                  {currentView === "create" && "Создание инцидента"}
                  {currentView === "edit" && "Редактирование инцидента"}
                </h1>
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              {currentView === "list" && hasPermission("create_incident") && (
                <Button onClick={handleCreateIncident}>
                  <Plus className="h-4 w-4 mr-2" />
                  Новый инцидент
                </Button>
              )}
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {currentView === "list" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск инцидентов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="NEW">Новый</SelectItem>
                    <SelectItem value="IN_PROGRESS">В работе</SelectItem>
                    <SelectItem value="RESOLVED">Решен</SelectItem>
                    <SelectItem value="CLOSED">Закрыт</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Incidents List */}
              <div className="space-y-4">
                {filteredIncidents.map((incident) => (
                  <Card key={incident.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{incident.title}</h3>
                            <Badge variant="outline">{incident.id.slice(0, 8)}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Тип: {getTypeLabel(incident.type)}</span>
                            <span>Создан: {new Date(incident.createdAt).toLocaleString("ru-RU")}</span>
                            <span>Ответственный: {incident.assignee?.name || "Не назначен"}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getSeverityColor(incident.severity)} text-white`}>
                              {getSeverityLabel(incident.severity)}
                            </Badge>
                            <Badge className={`${getStatusColor(incident.status)} text-white`}>
                              {getStatusLabel(incident.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/incidents/${incident.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {hasPermission("edit_incident") && (
                              <Button variant="ghost" size="sm" onClick={() => handleEditIncident(incident)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {hasPermission("delete_incident") && (
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteIncident(incident.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredIncidents.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">Инциденты не найдены</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {(currentView === "create" || currentView === "edit") && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>{currentView === "create" ? "Создание нового инцидента" : "Редактирование инцидента"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveIncident} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Краткое описание инцидента"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Описание *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Подробное описание инцидента"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Тип инцидента</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DATA_LEAK">Утечка данных</SelectItem>
                          <SelectItem value="DDOS">DDoS атака</SelectItem>
                          <SelectItem value="MALWARE">Malware</SelectItem>
                          <SelectItem value="PHISHING">Фишинг</SelectItem>
                          <SelectItem value="UNAUTHORIZED_ACCESS">Несанкц. доступ</SelectItem>
                          <SelectItem value="NETWORK_ATTACK">Сетевая атака</SelectItem>
                          <SelectItem value="OTHER">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Критичность</Label>
                      <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CRITICAL">Критическая</SelectItem>
                          <SelectItem value="HIGH">Высокая</SelectItem>
                          <SelectItem value="MEDIUM">Средняя</SelectItem>
                          <SelectItem value="LOW">Низкая</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Статус</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">Новый</SelectItem>
                          <SelectItem value="IN_PROGRESS">В работе</SelectItem>
                          <SelectItem value="RESOLVED">Решен</SelectItem>
                          <SelectItem value="CLOSED">Закрыт</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Ответственный</Label>
                      <Select value={formData.assigneeId} onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}>
                        <SelectTrigger><SelectValue placeholder="Не назначен" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Не назначен</SelectItem>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setCurrentView("list")}>
                      Отмена
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {currentView === "create" ? "Создать" : "Сохранить"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
