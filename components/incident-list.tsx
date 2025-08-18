"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Edit, Eye, Trash2, UserPlus, MessageSquare } from "lucide-react"

interface Incident {
  id: string
  title: string
  type: string
  severity: string
  status: string
  assignee: string
  created: string
  description: string
}

interface IncidentListProps {
  incidents: Incident[]
  onEdit: (incident: Incident) => void
  onView: (incident: Incident) => void
  onDelete: (id: string) => void
  onAssign: (id: string, assignee: string) => void
}

export function IncidentList({ incidents, onEdit, onView, onDelete, onAssign }: IncidentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

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

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter

    return matchesSearch && matchesStatus && matchesSeverity
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры и поиск</CardTitle>
          <CardDescription>Найдите нужные инциденты</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию, описанию или ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="Новый">Новый</SelectItem>
                <SelectItem value="В работе">В работе</SelectItem>
                <SelectItem value="Ожидание">Ожидание</SelectItem>
                <SelectItem value="Решен">Решен</SelectItem>
                <SelectItem value="Закрыт">Закрыт</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Критичность" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все уровни</SelectItem>
                <SelectItem value="Критическая">Критическая</SelectItem>
                <SelectItem value="Высокая">Высокая</SelectItem>
                <SelectItem value="Средняя">Средняя</SelectItem>
                <SelectItem value="Низкая">Низкая</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Найдено инцидентов: {filteredIncidents.length}</h3>
        </div>

        {filteredIncidents.map((incident) => (
          <Card key={incident.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3
                      className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors"
                      onClick={() => onView(incident)}
                    >
                      {incident.title}
                    </h3>
                    <Badge variant="outline" className="font-mono text-xs">
                      {incident.id}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{incident.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <span className="font-medium">Тип:</span>
                      <span>{incident.type}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="font-medium">Создан:</span>
                      <span>{incident.created}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="font-medium">Ответственный:</span>
                      <span>{incident.assignee || "Не назначен"}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-3 ml-6">
                  <div className="flex space-x-2">
                    <Badge className={`${getSeverityColor(incident.severity)} text-white`}>{incident.severity}</Badge>
                    <Badge className={`${getStatusColor(incident.status)} text-white`}>{incident.status}</Badge>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(incident)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Просмотр
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(incident)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Назначить
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Комментарий
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(incident.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredIncidents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Инциденты не найдены</h3>
                <p>Попробуйте изменить параметры поиска или фильтры</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
