"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "ADMIN" | "ANALYST" | "EMPLOYEE"

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

// Mock users for demo
const mockUsers: Record<string, { password: string; user: User }> = {
  "admin@company.com": {
    password: "admin123",
    user: {
      id: "1",
      name: "Александр Иванов",
      email: "admin@company.com",
      role: "ADMIN",
      department: "Отдел ИБ",
    },
  },
  "analyst@company.com": {
    password: "analyst123",
    user: {
      id: "2",
      name: "Мария Петрова",
      email: "analyst@company.com",
      role: "ANALYST",
      department: "Отдел ИБ",
    },
  },
  "employee@company.com": {
    password: "employee123",
    user: {
      id: "3",
      name: "Дмитрий Сидоров",
      email: "employee@company.com",
      role: "EMPLOYEE",
      department: "ИТ отдел",
    },
  },
}

// Role permissions
const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: ["create_incident", "edit_incident", "delete_incident", "assign_incident", "view_reports", "manage_users"],
  ANALYST: ["create_incident", "edit_incident", "assign_incident", "view_reports"],
  EMPLOYEE: ["create_incident", "view_incident"],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockUser = mockUsers[email.toLowerCase()]
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user)
      localStorage.setItem("user", JSON.stringify(mockUser.user))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return rolePermissions[user.role]?.includes(permission) || false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
