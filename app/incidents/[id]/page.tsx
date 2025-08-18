"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { IncidentDetail } from "@/components/incident-detail"
import { ProtectedRoute } from "@/components/protected-route"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield } from "lucide-react"

// Mock data - в реальном приложении это будет из API
const mockIncidents = [
  {
    id: "INC-2024-001",
    title: "Подозрительная активность в сети",
    type: "Сетевая атака",
    severity: "Высокая",
    status: "В работе",
    assignee: "Иванов И.И.",
    created: "2024-01-15 14:30",
    lastUpdated: "2024-01-15 16:45",
    reporter: "Система мониторинга",
    description:
      "Обнаружена аномальная сетевая активность с внешних IP-адресов. Зафиксированы множественные попытки сканирования портов и подозрительный трафик. Источники атаки: 192.168.1.100, 10.0.0.50. Затронутые системы: веб-сервер, база данных. Необходимо провести детальный анализ логов и принять меры по блокировке подозрительных IP-адресов.",
    files: ["network_logs_15012024.txt", "firewall_report.pdf", "traffic_analysis.xlsx"],
  },
  {
    id: "INC-2024-002",
    title: "Попытка несанкционированного доступа",
    type: "Нарушение доступа",
    severity: "Критическая",
    status: "Новый",
    assignee: "",
    created: "2024-01-15 16:45",
    reporter: "Администратор системы",
    description:
      "Множественные неудачные попытки входа в административную панель с различных IP-адресов. Возможна атака методом перебора паролей (brute force). Обнаружено более 500 попыток входа за последний час.",
    files: ["auth_logs.txt", "failed_attempts.csv"],
  },
  {
    id: "INC-2024-003",
    title: "Обнаружение вредоносного ПО",
    type: "Malware",
    severity: "Средняя",
    status: "Решен",
    assignee: "Петров П.П.",
    created: "2024-01-14 09:15",
    lastUpdated: "2024-01-14 15:30",
    reporter: "Антивирусная система",
    description:
      "Антивирус обнаружил подозрительный файл на рабочей станции пользователя. Файл помещен в карантин, система очищена. Проведена полная проверка системы, дополнительных угроз не обнаружено.",
    files: ["malware_report.pdf", "scan_results.txt"],
  },
]

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [incident, setIncident] = useState<any>(null)

  useEffect(() => {
    const foundIncident = mockIncidents.find((inc) => inc.id === params.id)
    setIncident(foundIncident)
  }, [params.id])

  const handleStatusChange = (status: string) => {
    if (incident) {
      setIncident({ ...incident, status })
      // В реальном приложении здесь будет API вызов
      console.log(`Status changed to: ${status}`)
    }
  }

  const handleAssigneeChange = (assignee: string) => {
    if (incident) {
      setIncident({ ...incident, assignee })
      // В реальном приложении здесь будет API вызов
      console.log(`Assigned to: ${assignee}`)
    }
  }

  const handleAddComment = (comment: string) => {
    // В реальном приложении здесь будет API вызов
    console.log(`New comment: ${comment}`)
  }

  const handleClose = () => {
    router.push("/incidents")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/incidents")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к списку
              </Button>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">SecureTracker</h1>
              </div>
            </div>
            <div className="ml-auto">
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {incident ? (
            <IncidentDetail
              incident={incident}
              onStatusChange={handleStatusChange}
              onAssigneeChange={handleAssigneeChange}
              onAddComment={handleAddComment}
              onClose={handleClose}
            />
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Инцидент не найден</h2>
              <p className="text-muted-foreground mb-4">Инцидент с ID {params.id} не существует</p>
              <Button onClick={() => router.push("/incidents")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться к списку
              </Button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
