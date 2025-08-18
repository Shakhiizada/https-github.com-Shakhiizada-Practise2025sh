"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertTriangle,
  Clock,
  User,
  FileText,
  MessageSquare,
  Edit,
  X,
  Download,
  Calendar,
  Activity,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react"

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  type: "comment" | "status_change" | "assignment" | "escalation"
}

interface IncidentDetailProps {
  incident: {
    id: string
    title: string
    type: string
    severity: string
    status: string
    assignee: string
    created: string
    description: string
    files?: string[]
    reporter?: string
    lastUpdated?: string
  }
  onStatusChange: (status: string) => void
  onAssigneeChange: (assignee: string) => void
  onAddComment: (comment: string) => void
  onClose: () => void
}

export function IncidentDetail({
  incident,
  onStatusChange,
  onAssigneeChange,
  onAddComment,
  onClose,
}: IncidentDetailProps) {
  const [newComment, setNewComment] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  // Mock comments and activity data
  const [comments] = useState<Comment[]>([
    {
      id: "1",
      author: "Иванов И.И.",
      content: "Инцидент взят в работу. Начинаю анализ логов сетевого оборудования.",
      timestamp: "2024-01-15 14:45",
      type: "comment",
    },
    {
      id: "2",
      author: "Система",
      content: "Статус изменен с 'Новый' на 'В работе'",
      timestamp: "2024-01-15 14:30",
      type: "status_change",
    },
    {
      id: "3",
      author: "Система",
      content: "Инцидент назначен пользователю Иванов И.И.",
      timestamp: "2024-01-15 14:30",
      type: "assignment",
    },
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Критическая":
        return "bg-red-500 hover:bg-red-600"
      case "Высокая":
        return "bg-orange-500 hover:bg-orange-600"
      case "Средняя":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Низкая":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Новый":
        return "bg-blue-500 hover:bg-blue-600"
      case "В работе":
        return "bg-orange-500 hover:bg-orange-600"
      case "Ожидание":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Решен":
        return "bg-green-500 hover:bg-green-600"
      case "Закрыт":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getCommentIcon = (type: string) => {
    switch (type) {
      case "status_change":
        return <Activity className="h-4 w-4 text-blue-500" />
      case "assignment":
        return <User className="h-4 w-4 text-green-500" />
      case "escalation":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">{incident.title}</h1>
                <Badge variant="outline" className="font-mono">
                  {incident.id}
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className={`${getSeverityColor(incident.severity)} text-white`}>{incident.severity}</Badge>
                <Badge className={`${getStatusColor(incident.status)} text-white`}>{incident.status}</Badge>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Закрыть
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Описание инцидента</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{incident.description}</p>
            </CardContent>
          </Card>

          {/* Files */}
          {incident.files && incident.files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Прикрепленные файлы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {incident.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments and Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Комментарии и активность</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Добавить комментарий..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Добавить комментарий
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Activity Timeline */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      {comment.type === "comment" ? (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {getCommentIcon(comment.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Изменить статус</label>
                <Select value={incident.status} onValueChange={onStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Новый">Новый</SelectItem>
                    <SelectItem value="В работе">В работе</SelectItem>
                    <SelectItem value="Ожидание">Ожидание</SelectItem>
                    <SelectItem value="Решен">Решен</SelectItem>
                    <SelectItem value="Закрыт">Закрыт</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Назначить ответственного</label>
                <Select value={incident.assignee || "Не назначен"} onValueChange={onAssigneeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите ответственного" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Не назначен">Не назначен</SelectItem>
                    <SelectItem value="Иванов И.И.">Иванов И.И.</SelectItem>
                    <SelectItem value="Петров П.П.">Петров П.П.</SelectItem>
                    <SelectItem value="Сидоров С.С.">Сидоров С.С.</SelectItem>
                    <SelectItem value="Козлов К.К.">Козлов К.К.</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Эскалировать
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Incident Details */}
          <Card>
            <CardHeader>
              <CardTitle>Детали инцидента</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Создан</p>
                    <p className="text-xs text-muted-foreground">{incident.created}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Последнее обновление</p>
                    <p className="text-xs text-muted-foreground">{incident.lastUpdated || incident.created}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Автор</p>
                    <p className="text-xs text-muted-foreground">{incident.reporter || "Система"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Тип</p>
                    <p className="text-xs text-muted-foreground">{incident.type}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SLA Status */}
          <Card>
            <CardHeader>
              <CardTitle>SLA статус</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Время реагирования</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600">В норме</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Время решения</span>
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-xs text-orange-600">Осталось 2ч</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
