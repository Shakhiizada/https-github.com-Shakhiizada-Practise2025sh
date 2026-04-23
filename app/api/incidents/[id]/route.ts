import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const { data: incident, error } = await supabase
      .from("incidents")
      .select(`
        *,
        reporter:profiles!incidents_reporter_id_fkey(id, name, email, role, department),
        assignee:profiles!incidents_assignee_id_fkey(id, name, email, role, department)
      `)
      .eq("id", id)
      .single()

    if (error || !incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    // Get comments
    const { data: comments } = await supabase
      .from("comments")
      .select(`
        *,
        author:profiles(id, name, email, role)
      `)
      .eq("incident_id", id)
      .order("created_at", { ascending: false })

    // Get files
    const { data: files } = await supabase
      .from("files")
      .select(`
        *,
        uploader:profiles(id, name)
      `)
      .eq("incident_id", id)
      .order("created_at", { ascending: false })

    // Get audit logs
    const { data: auditLogs } = await supabase
      .from("audit_logs")
      .select(`
        *,
        user:profiles(id, name)
      `)
      .eq("entity_id", id)
      .eq("entity_type", "incident")
      .order("created_at", { ascending: false })
      .limit(20)

    return NextResponse.json({
      incident: {
        ...incident,
        comments: comments || [],
        files: files || [],
        auditLogs: auditLogs || [],
      },
    })
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
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, type, severity, status, description, source, assigneeId } = body

    // Get existing incident
    const { data: existing } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (type !== undefined) updateData.type = type
    if (severity !== undefined) updateData.severity = severity
    if (status !== undefined) updateData.status = status
    if (description !== undefined) updateData.description = description
    if (source !== undefined) updateData.source = source
    if (assigneeId !== undefined) updateData.assignee_id = assigneeId || null

    const { data: incident, error } = await supabase
      .from("incidents")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        reporter:profiles!incidents_reporter_id_fkey(id, name, email, role),
        assignee:profiles!incidents_assignee_id_fkey(id, name, email, role)
      `)
      .single()

    if (error) {
      console.error("Error updating incident:", error)
      return NextResponse.json({ error: "Failed to update incident" }, { status: 500 })
    }

    // Create audit log
    await supabase.from("audit_logs").insert({
      action: "UPDATE_INCIDENT",
      entity_type: "incident",
      entity_id: id,
      old_values: existing,
      new_values: incident,
      user_id: user.id,
    })

    return NextResponse.json({ incident })
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
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    const { error } = await supabase
      .from("incidents")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting incident:", error)
      return NextResponse.json({ error: "Failed to delete incident" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete incident error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
