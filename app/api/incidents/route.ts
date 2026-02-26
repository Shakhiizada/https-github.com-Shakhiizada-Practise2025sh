import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const severity = searchParams.get("severity")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: Record<string, unknown> = {}

    if (status && status !== "ALL") {
      where.status = status
    }
    if (type && type !== "ALL") {
      where.type = type
    }
    if (severity && severity !== "ALL") {
      where.severity = severity
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        include: {
          creator: {
            select: { id: true, name: true, email: true, role: true },
          },
          assignee: {
            select: { id: true, name: true, email: true, role: true },
          },
          _count: { select: { comments: true, files: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.incident.count({ where }),
    ])

    return NextResponse.json({ incidents, total, page, limit })
  } catch (error) {
    console.error("Get incidents error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, type, severity, description, source, assigneeId } = body

    if (!title || !type || !severity || !description) {
      return NextResponse.json(
        { error: "Title, type, severity, and description are required" },
        { status: 400 }
      )
    }

    const incident = await prisma.incident.create({
      data: {
        title,
        type,
        severity,
        description,
        source: source || null,
        creatorId: user.userId,
        assigneeId: assigneeId || null,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true, role: true },
        },
        assignee: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    })

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "incident",
        entityId: incident.id,
        userId: user.userId,
        incidentId: incident.id,
        details: { title, type, severity },
      },
    })

    return NextResponse.json({ incident }, { status: 201 })
  } catch (error) {
    console.error("Create incident error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
