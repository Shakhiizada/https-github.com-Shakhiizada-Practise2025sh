import { NextResponse } from "next/server"

// Mock data for stats
export async function GET() {
  try {
    return NextResponse.json({
      totalIncidents: 47,
      activeIncidents: 12,
      criticalIncidents: 3,
      averageResponseTime: "2.4 ч",
      incidentsByType: [
        { type: "PHISHING", name: "Фишинг", count: 15 },
        { type: "MALWARE", name: "Вредоносное ПО", count: 12 },
        { type: "DATA_LEAK", name: "Утечка данных", count: 8 },
        { type: "UNAUTHORIZED_ACCESS", name: "Несанкц. доступ", count: 6 },
        { type: "DDOS", name: "DDoS", count: 4 },
        { type: "INSIDER_THREAT", name: "Внутренняя угроза", count: 2 },
      ],
      incidentsBySeverity: [
        { severity: "LOW", name: "Низкий", count: 18 },
        { severity: "MEDIUM", name: "Средний", count: 16 },
        { severity: "HIGH", name: "Высокий", count: 10 },
        { severity: "CRITICAL", name: "Критический", count: 3 },
      ],
      incidentsByStatus: [
        { status: "NEW", count: 5 },
        { status: "IN_PROGRESS", count: 7 },
        { status: "RESOLVED", count: 20 },
        { status: "CLOSED", count: 15 },
      ],
      recentActivity: [
        {
          id: "1",
          action: "Создан инцидент",
          incidentId: "INC-047",
          incidentTitle: "Подозрительная активность в сети",
          userName: "Александр Иванов",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          action: "Изменен статус",
          incidentId: "INC-045",
          incidentTitle: "Фишинговое письмо",
          userName: "Мария Петрова",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "3",
          action: "Добавлен комментарий",
          incidentId: "INC-043",
          incidentTitle: "Обнаружен вирус",
          userName: "Дмитрий Сидоров",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ],
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
