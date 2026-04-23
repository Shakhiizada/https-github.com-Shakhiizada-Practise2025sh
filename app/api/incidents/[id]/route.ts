import { NextRequest, NextResponse } from "next/server"

// Mock incidents data
const mockIncidents: Record<string, object> = {
  "1": {
    id: "1",
    title: "Подозрительная активность в корпоративной сети",
    description: "Обнаружена подозрительная сетевая активность с внешнего IP-адреса. Зафиксированы множественные попытки подключения к критически важным серверам.",
    type: "UNAUTHORIZED_ACCESS",
    severity: "HIGH",
    status: "IN_PROGRESS",
    source: "SIEM",
    affectedSystems: "Корпоративный файервол, VPN-сервер",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    reporter: { id: "1", name: "Александр Иванов", email: "admin@company.com", role: "ADMIN", department: "Отдел ИБ" },
    assignee: { id: "2", name: "Мария Петрова", email: "analyst@company.com", role: "ANALYST", department: "Отдел ИБ" },
    comments: [
      { id: "1", content: "Начал анализ логов файервола", createdAt: new Date(Date.now() - 43200000).toISOString(), author: { id: "2", name: "Мария Петрова", role: "ANALYST" } },
      { id: "2", content: "Обнаружены попытки сканирования портов", createdAt: new Date(Date.now() - 21600000).toISOString(), author: { id: "2", name: "Мария Петрова", role: "ANALYST" } },
    ],
    files: [],
    auditLogs: [
      { id: "1", action: "Создан инцидент", createdAt: new Date(Date.now() - 86400000).toISOString(), user: { name: "Александр Иванов" } },
      { id: "2", action: "Назначен исполнитель", createdAt: new Date(Date.now() - 82800000).toISOString(), user: { name: "Александр Иванов" } },
    ],
  },
  "2": {
    id: "2",
    title: "Фишинговая рассылка сотрудникам",
    description: "Массовая фишинговая атака через электронную почту. Обнаружены письма с вредоносными ссылками.",
    type: "PHISHING",
    severity: "MEDIUM",
    status: "NEW",
    source: "Сотрудник",
    affectedSystems: "Корпоративная почта",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    reporter: { id: "3", name: "Дмитрий Сидоров", email: "employee@company.com", role: "EMPLOYEE", department: "ИТ отдел" },
    assignee: null,
    comments: [],
    files: [],
    auditLogs: [
      { id: "1", action: "Создан инцидент", createdAt: new Date(Date.now() - 172800000).toISOString(), user: { name: "Дмитрий Сидоров" } },
    ],
  },
  "3": {
    id: "3",
    title: "Обнаружено вредоносное ПО на рабочей станции",
    description: "Антивирус обнаружил троян на компьютере сотрудника бухгалтерии. Требуется немедленное реагирование.",
    type: "MALWARE",
    severity: "CRITICAL",
    status: "IN_PROGRESS",
    source: "Антивирус",
    affectedSystems: "Рабочая станция WS-001",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    reporter: { id: "2", name: "Мария Петрова", email: "analyst@company.com", role: "ANALYST", department: "Отдел ИБ" },
    assignee: { id: "1", name: "Александр Иванов", email: "admin@company.com", role: "ADMIN", department: "Отдел ИБ" },
    comments: [
      { id: "1", content: "Компьютер изолирован от сети", createdAt: new Date(Date.now() - 172800000).toISOString(), author: { id: "1", name: "Александр Иванов", role: "ADMIN" } },
    ],
    files: [],
    auditLogs: [],
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const incident = mockIncidents[id]

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    return NextResponse.json({ incident })
  } catch (error) {
    console.error("Get incident error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = mockIncidents[id]
    if (!existing) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    const updated = { ...existing, ...body, updatedAt: new Date().toISOString() }
    mockIncidents[id] = updated

    return NextResponse.json({ incident: updated })
  } catch (error) {
    console.error("Update incident error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!mockIncidents[id]) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    delete mockIncidents[id]
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete incident error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
