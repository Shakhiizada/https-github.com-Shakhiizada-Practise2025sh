import { NextRequest, NextResponse } from "next/server"

// Mock incidents data
const mockIncidents = [
  {
    id: "1",
    title: "Подозрительная активность в корпоративной сети",
    description: "Обнаружена подозрительная сетевая активность с внешнего IP-адреса.",
    type: "UNAUTHORIZED_ACCESS",
    severity: "HIGH",
    status: "IN_PROGRESS",
    source: "SIEM",
    affectedSystems: "Корпоративный файервол",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    reporter: { id: "1", name: "Александр Иванов", email: "admin@company.com" },
    assignee: { id: "2", name: "Мария Петрова", email: "analyst@company.com" },
  },
  {
    id: "2",
    title: "Фишинговая рассылка сотрудникам",
    description: "Массовая фишинговая атака через электронную почту.",
    type: "PHISHING",
    severity: "MEDIUM",
    status: "NEW",
    source: "Сотрудник",
    affectedSystems: "Корпоративная почта",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    reporter: { id: "3", name: "Дмитрий Сидоров", email: "employee@company.com" },
    assignee: null,
  },
  {
    id: "3",
    title: "Обнаружено вредоносное ПО на рабочей станции",
    description: "Антивирус обнаружил троян на компьютере сотрудника бухгалтерии.",
    type: "MALWARE",
    severity: "CRITICAL",
    status: "IN_PROGRESS",
    source: "Антивирус",
    affectedSystems: "Рабочая станция WS-001",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    reporter: { id: "2", name: "Мария Петрова", email: "analyst@company.com" },
    assignee: { id: "1", name: "Александр Иванов", email: "admin@company.com" },
  },
  {
    id: "4",
    title: "Утечка данных клиентов",
    description: "Обнаружена потенциальная утечка персональных данных клиентов.",
    type: "DATA_LEAK",
    severity: "CRITICAL",
    status: "RESOLVED",
    source: "Внутренний аудит",
    affectedSystems: "CRM система",
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    reporter: { id: "1", name: "Александр Иванов", email: "admin@company.com" },
    assignee: { id: "2", name: "Мария Петрова", email: "analyst@company.com" },
  },
  {
    id: "5",
    title: "DDoS атака на веб-сервер",
    description: "Зафиксирована распределенная атака отказа в обслуживании.",
    type: "DDOS",
    severity: "HIGH",
    status: "CLOSED",
    source: "Мониторинг",
    affectedSystems: "Веб-сервер",
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
    reporter: { id: "2", name: "Мария Петрова", email: "analyst@company.com" },
    assignee: { id: "1", name: "Александр Иванов", email: "admin@company.com" },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const type = searchParams.get("type")

    let filteredIncidents = [...mockIncidents]

    if (status) {
      const statuses = status.split(",")
      filteredIncidents = filteredIncidents.filter(i => statuses.includes(i.status))
    }

    if (severity) {
      filteredIncidents = filteredIncidents.filter(i => i.severity === severity)
    }

    if (type) {
      filteredIncidents = filteredIncidents.filter(i => i.type === type)
    }

    return NextResponse.json({
      incidents: filteredIncidents,
      total: filteredIncidents.length,
      limit: 50,
      offset: 0,
    })
  } catch (error) {
    console.error("Get incidents error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, type, severity } = body

    if (!title || !description || !type || !severity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newIncident = {
      id: String(mockIncidents.length + 1),
      title,
      description,
      type,
      severity,
      status: "NEW",
      source: body.source || "",
      affectedSystems: body.affectedSystems || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reporter: { id: "1", name: "Текущий пользователь", email: "user@company.com" },
      assignee: null,
    }

    return NextResponse.json(newIncident, { status: 201 })
  } catch (error) {
    console.error("Create incident error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
