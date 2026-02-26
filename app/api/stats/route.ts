import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [
      totalIncidents,
      activeIncidents,
      resolvedIncidents,
      criticalIncidents,
      byType,
      byStatus,
      bySeverity,
      recentIncidents,
      recentActivity,
      monthlyStats,
    ] = await Promise.all([
      prisma.incident.count(),
      prisma.incident.count({
        where: { status: { in: ["NEW", "IN_PROGRESS"] } },
      }),
      prisma.incident.count({
        where: { status: { in: ["RESOLVED", "CLOSED"] } },
      }),
      prisma.incident.count({ where: { severity: "CRITICAL" } }),
      prisma.incident.groupBy({
        by: ["type"],
        _count: { type: true },
      }),
      prisma.incident.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.incident.groupBy({
        by: ["severity"],
        _count: { severity: true },
      }),
      prisma.incident.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          creator: { select: { name: true } },
          assignee: { select: { name: true } },
        },
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
        },
      }),
      // Monthly stats for last 6 months
      prisma.$queryRaw`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
          COUNT(*)::int as count
        FROM incidents 
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,
    ])

    const typeLabels: Record<string, string> = {
      DATA_LEAK: "Утечка данных",
      DDOS: "DDoS",
      MALWARE: "Вредоносное ПО",
      PHISHING: "Фишинг",
      UNAUTHORIZED_ACCESS: "Несанкц. доступ",
      INSIDER_THREAT: "Внутренняя угроза",
      OTHER: "Другое",
    }

    const statusLabels: Record<string, string> = {
      NEW: "Новый",
      IN_PROGRESS: "В работе",
      RESOLVED: "Решен",
      CLOSED: "Закрыт",
    }

    const severityLabels: Record<string, string> = {
      LOW: "Низкий",
      MEDIUM: "Средний",
      HIGH: "Высокий",
      CRITICAL: "Критический",
    }

    return NextResponse.json({
      totals: {
        total: totalIncidents,
        active: activeIncidents,
        resolved: resolvedIncidents,
        critical: criticalIncidents,
      },
      byType: byType.map((t) => ({
        name: typeLabels[t.type] || t.type,
        value: t._count.type,
        key: t.type,
      })),
      byStatus: byStatus.map((s) => ({
        name: statusLabels[s.status] || s.status,
        value: s._count.status,
        key: s.status,
      })),
      bySeverity: bySeverity.map((s) => ({
        name: severityLabels[s.severity] || s.severity,
        value: s._count.severity,
        key: s.severity,
      })),
      recentIncidents,
      recentActivity,
      monthlyStats,
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
