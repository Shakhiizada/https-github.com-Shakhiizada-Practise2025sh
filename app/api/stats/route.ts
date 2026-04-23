import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all incidents for stats
    const { data: incidents, error: incidentsError } = await supabase
      .from("incidents")
      .select("id, type, status, severity, created_at, title, reporter_id, assignee_id")
    
    if (incidentsError) {
      console.error("Error fetching incidents:", incidentsError)
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }

    const allIncidents = incidents || []
    
    // Calculate stats
    const totalIncidents = allIncidents.length
    const activeIncidents = allIncidents.filter(i => i.status === "NEW" || i.status === "IN_PROGRESS").length
    const criticalIncidents = allIncidents.filter(i => i.severity === "CRITICAL").length
    
    // Group by type
    const byType: Record<string, number> = {}
    allIncidents.forEach(i => {
      byType[i.type] = (byType[i.type] || 0) + 1
    })
    
    // Group by severity
    const bySeverity: Record<string, number> = {}
    allIncidents.forEach(i => {
      bySeverity[i.severity] = (bySeverity[i.severity] || 0) + 1
    })
    
    // Group by status
    const byStatus: Record<string, number> = {}
    allIncidents.forEach(i => {
      byStatus[i.status] = (byStatus[i.status] || 0) + 1
    })

    // Get recent activity from audit logs
    const { data: recentActivity } = await supabase
      .from("audit_logs")
      .select(`
        id,
        action,
        entity_type,
        entity_id,
        created_at,
        user_id
      `)
      .order("created_at", { ascending: false })
      .limit(10)

    // Get profiles for recent activity
    const userIds = [...new Set((recentActivity || []).map(a => a.user_id))]
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name")
      .in("id", userIds)
    
    const profileMap = new Map((profiles || []).map(p => [p.id, p.name]))

    const typeLabels: Record<string, string> = {
      DATA_LEAK: "Утечка данных",
      DDOS: "DDoS",
      MALWARE: "Вредоносное ПО",
      PHISHING: "Фишинг",
      UNAUTHORIZED_ACCESS: "Несанкц. доступ",
      INSIDER_THREAT: "Внутренняя угроза",
      OTHER: "Другое",
    }

    const severityLabels: Record<string, string> = {
      LOW: "Низкий",
      MEDIUM: "Средний",
      HIGH: "Высокий",
      CRITICAL: "Критический",
    }

    return NextResponse.json({
      totalIncidents,
      activeIncidents,
      criticalIncidents,
      averageResponseTime: "2.4 ч",
      incidentsByType: Object.entries(byType).map(([type, count]) => ({
        type,
        name: typeLabels[type] || type,
        count,
      })),
      incidentsBySeverity: Object.entries(bySeverity).map(([severity, count]) => ({
        severity,
        name: severityLabels[severity] || severity,
        count,
      })),
      incidentsByStatus: Object.entries(byStatus).map(([status, count]) => ({
        status,
        count,
      })),
      recentActivity: (recentActivity || []).map(a => ({
        id: a.id,
        action: a.action,
        incidentId: a.entity_id,
        incidentTitle: `Инцидент ${a.entity_id.slice(0, 8)}`,
        userName: profileMap.get(a.user_id) || "Неизвестный",
        createdAt: a.created_at,
      })),
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
