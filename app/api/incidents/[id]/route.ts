import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
        assignee: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        files: {
          include: {
            uploadedBy: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        auditLogs: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    })

    if (!incident) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ incident })
  } catch (error) {
    console.error("Get incident error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, type, severity, status, description, source, assigneeId } = body

    const existing = await prisma.incident.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (type !== undefined) updateData.type = type
    if (severity !== undefined) updateData.severity = severity
    if (status !== undefined) updateData.status = status
    if (description !== undefined) updateData.description = description
    if (source !== undefined) updateData.source = source
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId || null

    const incident = await prisma.incident.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: { id: true, name: true, email: true, role: true },
        },
        assignee: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    })

    // Create audit log entries for changes
    const changes: string[] = []
    if (status && status !== existing.status) {
      changes.push(`status: ${existing.status} -> ${status}`)
      await prisma.comment.create({
        data: {
          content: `Status changed from ${existing.status} to ${status}`,
          type: "status_change",
          incidentId: id,
          authorId: user.userId,
        },
      })
    }
    if (assigneeId && assigneeId !== existing.assigneeId) {
      changes.push(`assignee changed`)
      await prisma.comment.create({
        data: {
          content: `Incident reassigned`,
          type: "assignment",
          incidentId: id,
          authorId: user.userId,
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "incident",
        entityId: id,
        userId: user.userId,
        incidentId: id,
        details: { changes },
      },
    })

    return NextResponse.json({ incident })
  } catch (error) {
    console.error("Update incident error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    await prisma.auditLog.deleteMany({ where: { incidentId: id } })
    await prisma.incident.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete incident error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
