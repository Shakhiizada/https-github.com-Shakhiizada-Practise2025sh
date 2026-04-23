import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")

  // Create users
  const adminPassword = await bcrypt.hash("admin123", 12)
  const analystPassword = await bcrypt.hash("analyst123", 12)
  const employeePassword = await bcrypt.hash("employee123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@company.com" },
    update: {},
    create: {
      email: "admin@company.com",
      name: "Администратор Системы",
      password: adminPassword,
      role: "ADMIN",
      department: "IT Безопасность",
    },
  })

  const analyst = await prisma.user.upsert({
    where: { email: "analyst@company.com" },
    update: {},
    create: {
      email: "analyst@company.com",
      name: "Иванов Иван Иванович",
      password: analystPassword,
      role: "ANALYST",
      department: "Анализ угроз",
    },
  })

  const employee = await prisma.user.upsert({
    where: { email: "employee@company.com" },
    update: {},
    create: {
      email: "employee@company.com",
      name: "Петров Петр Петрович",
      password: employeePassword,
      role: "EMPLOYEE",
      department: "Техническая поддержка",
    },
  })

  console.log("Users created:", { admin: admin.id, analyst: analyst.id, employee: employee.id })

  // Create sample incidents
  const incidents = await Promise.all([
    prisma.incident.create({
      data: {
        title: "Подозрительная активность в сети",
        description: "Обнаружена аномальная сетевая активность с внешних IP-адресов. Зафиксированы множественные попытки сканирования портов и подозрительный трафик.",
        type: "NETWORK_ATTACK",
        severity: "HIGH",
        status: "IN_PROGRESS",
        reporterId: admin.id,
        assigneeId: analyst.id,
      },
    }),
    prisma.incident.create({
      data: {
        title: "Попытка несанкционированного доступа",
        description: "Множественные неудачные попытки входа в административную панель с различных IP-адресов. Возможна атака методом перебора паролей.",
        type: "UNAUTHORIZED_ACCESS",
        severity: "CRITICAL",
        status: "NEW",
        reporterId: employee.id,
      },
    }),
    prisma.incident.create({
      data: {
        title: "Обнаружение вредоносного ПО",
        description: "Антивирус обнаружил подозрительный файл на рабочей станции пользователя. Файл помещен в карантин, система очищена.",
        type: "MALWARE",
        severity: "MEDIUM",
        status: "RESOLVED",
        reporterId: analyst.id,
        assigneeId: analyst.id,
        resolvedAt: new Date(),
      },
    }),
    prisma.incident.create({
      data: {
        title: "Фишинговое письмо",
        description: "Сотрудник получил подозрительное письмо с просьбой ввести учетные данные. Письмо было идентифицировано как фишинговое.",
        type: "PHISHING",
        severity: "MEDIUM",
        status: "CLOSED",
        reporterId: employee.id,
        assigneeId: analyst.id,
        resolvedAt: new Date(Date.now() - 86400000),
        closedAt: new Date(),
      },
    }),
    prisma.incident.create({
      data: {
        title: "DDoS атака на веб-сервер",
        description: "Зафиксирована распределенная атака на отказ в обслуживании. Сервер временно недоступен.",
        type: "DDOS",
        severity: "CRITICAL",
        status: "IN_PROGRESS",
        reporterId: admin.id,
        assigneeId: admin.id,
      },
    }),
    prisma.incident.create({
      data: {
        title: "Утечка конфиденциальных данных",
        description: "Обнаружена возможная утечка персональных данных клиентов через незащищенный API endpoint.",
        type: "DATA_LEAK",
        severity: "CRITICAL",
        status: "NEW",
        reporterId: analyst.id,
      },
    }),
  ])

  console.log(`Created ${incidents.length} incidents`)

  // Create sample comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: "Начато расследование инцидента. Заблокированы подозрительные IP-адреса.",
        incidentId: incidents[0].id,
        authorId: analyst.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Проведен анализ логов. Выявлены паттерны атаки.",
        incidentId: incidents[0].id,
        authorId: analyst.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Вредоносный файл отправлен на анализ в песочницу.",
        incidentId: incidents[2].id,
        authorId: analyst.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Анализ завершен. Угроза нейтрализована.",
        incidentId: incidents[2].id,
        authorId: analyst.id,
      },
    }),
  ])

  console.log(`Created ${comments.length} comments`)

  // Create audit logs
  const auditLogs = await Promise.all([
    prisma.auditLog.create({
      data: {
        action: "INCIDENT_CREATED",
        entityType: "Incident",
        entityId: incidents[0].id,
        userId: admin.id,
        details: { title: incidents[0].title },
      },
    }),
    prisma.auditLog.create({
      data: {
        action: "STATUS_CHANGED",
        entityType: "Incident",
        entityId: incidents[0].id,
        userId: analyst.id,
        details: { oldStatus: "NEW", newStatus: "IN_PROGRESS" },
      },
    }),
    prisma.auditLog.create({
      data: {
        action: "ASSIGNEE_CHANGED",
        entityType: "Incident",
        entityId: incidents[0].id,
        userId: admin.id,
        details: { assigneeName: analyst.name },
      },
    }),
  ])

  console.log(`Created ${auditLogs.length} audit logs`)

  console.log("Database seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
