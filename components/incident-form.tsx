"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Upload, FileText, Save, AlertTriangle } from "lucide-react"

interface IncidentFormProps {
  incident?: any
  onSave: (incident: any) => void
  onCancel: () => void
}

export function IncidentForm({ incident, onSave, onCancel }: IncidentFormProps) {
  const [formData, setFormData] = useState({
    title: incident?.title || "",
    type: incident?.type || "",
    severity: incident?.severity || "",
    status: incident?.status || "Новый",
    assignee: incident?.assignee || "",
    description: incident?.description || "",
    files: incident?.files || [],
  })

  const [attachedFiles, setAttachedFiles] = useState<File[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newIncident = {
      ...formData,
      id: incident?.id || `INC-2024-${String(Date.now()).slice(-3)}`,
      created: incident?.created || new Date().toLocaleString("ru-RU"),
      files: [...formData.files, ...attachedFiles.map((f) => f.name)],
    }
    onSave(newIncident)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <span>{incident ? "Редактирование инцидента" : "Создание нового инцидента"}</span>
        </CardTitle>
        <CardDescription>
          {incident ? `Редактирование инцидента ${incident.id}` : "Заполните форму для регистрации нового инцидента"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Название инцидента *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Краткое описание инцидента"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Тип инцидента *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Утечка данных">Утечка данных</SelectItem>
                  <SelectItem value="DDoS атака">DDoS атака</SelectItem>
                  <SelectItem value="Malware">Malware</SelectItem>
                  <SelectItem value="Фишинг">Фишинг</SelectItem>
                  <SelectItem value="Нарушение доступа">Нарушение доступа</SelectItem>
                  <SelectItem value="Сетевая атака">Сетевая атака</SelectItem>
                  <SelectItem value="Социальная инженерия">Социальная инженерия</SelectItem>
                  <SelectItem value="Другое">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Уровень критичности *</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите уровень" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Критическая">Критическая</SelectItem>
                  <SelectItem value="Высокая">Высокая</SelectItem>
                  <SelectItem value="Средняя">Средняя</SelectItem>
                  <SelectItem value="Низкая">Низкая</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="assignee">Ответственный</Label>
              <Select
                value={formData.assignee}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, assignee: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Назначить ответственного" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Иванов И.И.">Иванов И.И.</SelectItem>
                  <SelectItem value="Петров П.П.">Петров П.П.</SelectItem>
                  <SelectItem value="Сидоров С.С.">Сидоров С.С.</SelectItem>
                  <SelectItem value="Козлов К.К.">Козлов К.К.</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Подробное описание *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Детальное описание инцидента, обстоятельства, предпринятые действия..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Прикрепленные файлы</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Перетащите файлы сюда или нажмите для выбора</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.zip"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  Выбрать файлы
                </Button>
              </div>
            </div>

            {attachedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Выбранные файлы:</p>
                <div className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(file.size / 1024).toFixed(1)} KB
                        </Badge>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {incident ? "Сохранить изменения" : "Создать инцидент"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
