import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const type = searchParams.get("type")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("incidents")
      .select(`
        *,
        reporter:profiles!incidents_reporter_id_fkey(id, name, email),
        assignee:profiles!incidents_assignee_id_fkey(id, name, email)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      const statuses = status.split(",")
      query = query.in("status", statuses)
    }

    if (severity) {
      query = query.eq("severity", severity)
    }

    if (type) {
      query = query.eq("type", type)
    }

    const { data: incidents, count, error } = await query

    if (error) {
      console.error("Error fetching incidents:", error)
      return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 })
    }

    return NextResponse.json({
      incidents: incidents || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Get incidents error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, type, severity, source, affectedSystems, assigneeId } = body

    if (!title || !description || !type || !severity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: incident, error } = await supabase
      .from("incidents")
      .insert({
        title,
        description,
        type,
        severity,
        status: "NEW",
        source,
        affected_systems: affectedSystems,
        reporter_id: user.id,
        assignee_id: assigneeId || null,
      })
      .select(`
        *,
        reporter:profiles!incidents_reporter_id_fkey(id, name, email),
        assignee:profiles!incidents_assignee_id_fkey(id, name, email)
      `)
      .single()

    if (error) {
      console.error("Error creating incident:", error)
      return NextResponse.json({ error: "Failed to create incident" }, { status: 500 })
    }

    // Create audit log
    await supabase.from("audit_logs").insert({
      action: "CREATE_INCIDENT",
      entity_type: "incident",
      entity_id: incident.id,
      new_values: incident,
      user_id: user.id,
    })

    return NextResponse.json(incident, { status: 201 })
  } catch (error) {
    console.error("Create incident error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
