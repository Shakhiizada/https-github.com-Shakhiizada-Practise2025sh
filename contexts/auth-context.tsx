"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "admin" | "analyst" | "employee"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  department?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  "admin@company.com": {
    password: "admin123",
    user: {
      id: "1",
      name: "Администратор Системы",
      email: "admin@company.com",
      role: "admin",
      department: "IT Безопасность",
    },
  },
  "analyst@company.com": {
    password: "analyst123",
    user: {
      id: "2",
      name: "Иванов И.И.",
      email: "analyst@company.com",
      role: "analyst",
      department: "Анализ угроз",
    },
  },
  "employee@company.com": {
    password: "employee123",
    user: {
      id: "3",
      name: "Петров П.П.",
      email: "employee@company.com",
      role: "employee",
      department: "Техническая поддержка",
    },
  },
}

// Role permissions
const rolePermissions: Record<UserRole, string[]> = {
  admin: ["create_incident", "edit_incident", "delete_incident", "assign_incident", "view_reports", "manage_users"],
  analyst: ["create_incident", "edit_incident", "assign_incident", "view_reports"],
  employee: ["create_incident", "view_incident"],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = mockUsers[email]
    if (userData && userData.password === password) {
      setUser(userData.user)
      localStorage.setItem("auth_user", JSON.stringify(userData.user))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_user")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return rolePermissions[user.role]?.includes(permission) || false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
