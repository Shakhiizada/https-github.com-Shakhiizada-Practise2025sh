"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IncidentForm } from "@/components/incident-form"
import { IncidentList } from "@/components/incident-list"
import { ProtectedRoute } from "@/components/protected-route"
import { UserMenu } from "@/components/user-menu"
import { Plus, ArrowLeft, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const initialIncidents = [
  {
    id: "INC-2024-001",
    title: "Подозрительная активность в сети",
    type: "Сетевая атака",
    severity: "Высокая",
    status: "В работе",
    assignee: "Иванов И.И.",
    created: "2024-01-15 14:30",
    description:
      "Обнаружена аномальная сетевая активность с внешних IP-адресов. Зафиксированы множественные попытки сканирования портов и подозрительный трафик.",
  },
  {
    id: "INC-2024-002",
    title: "Попытка несанкционированного доступа",
    type: "Нарушение доступа",
    severity: "Критическая",
    status: "Новый",
    assignee: "",
    created: "2024-01-15 16:45",
    description:
      "Множественные неудачные попытки входа в административную панель с различных IP-адресов. Возможна атака методом перебора паролей.",
  },
  {
    id: "INC-2024-003",
    title: "Обнаружение вредоносного ПО",
    type: "Malware",
    severity: "Средняя",
    status: "Решен",
    assignee: "Петров П.П.",
    created: "2024-01-14 09:15",
    description:
      "Антивирус обнаружил подозрительный файл на рабочей станции пользователя. Файл помещен в карантин, система очищена.",
  },
]

export default function IncidentsPage() {
  const router = useRouter()
  const { hasPermission } = useAuth()
  const [incidents, setIncidents] = useState(initialIncidents)
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit">("list")
  const [selectedIncident, setSelectedIncident] = useState<any>(null)

  const handleCreateIncident = () => {
    setSelectedIncident(null)
    setCurrentView("create")
  }

  const handleEditIncident = (incident: any) => {
    setSelectedIncident(incident)
    setCurrentView("edit")
  }

  const handleViewIncident = (incident: any) => {
    router.push(`/incidents/${incident.id}`)
  }

  const handleDeleteIncident = (id: string) => {
    setIncidents((prev) => prev.filter((inc) => inc.id !== id))
  }

  const handleSaveIncident = (incidentData: any) => {
    if (selectedIncident) {
      // Редактирование существующего
      setIncidents((prev) => prev.map((inc) => (inc.id === selectedIncident.id ? incidentData : inc)))
    } else {
      // Создание нового
      setIncidents((prev) => [incidentData, ...prev])
    }
    setCurrentView("list")
    setSelectedIncident(null)
  }

  const handleCancel = () => {
    setCurrentView("list")
    setSelectedIncident(null)
  }

  const handleAssignIncident = (id: string, assignee: string) => {
    setIncidents((prev) => prev.map((inc) => (inc.id === id ? { ...inc, assignee } : inc)))
  }

  return (
    <ProtectedRoute requiredPermission="create_incident">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-4">
              {currentView === "list" && (
                <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  На главную
                </Button>
              )}
              {currentView !== "list" && (
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
            <IncidentList
              incidents={incidents}
              onEdit={handleEditIncident}
              onView={handleViewIncident}
              onDelete={handleDeleteIncident}
              onAssign={handleAssignIncident}
            />
          )}

          {(currentView === "create" || currentView === "edit") && (
            <IncidentForm incident={selectedIncident} onSave={handleSaveIncident} onCancel={handleCancel} />
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
