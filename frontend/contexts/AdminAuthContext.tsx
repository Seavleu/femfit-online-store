'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// Types
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'manager' | 'editor' | 'viewer'
  permissions: string[]
  lastLogin?: string
  isActive: boolean
  avatar?: string
}

export interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateUser: (userData: Partial<AdminUser>) => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

// Permission definitions
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
  DASHBOARD_ANALYTICS: 'dashboard:analytics',
  
  // Products
  PRODUCTS_VIEW: 'products:view',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_EDIT: 'products:edit',
  PRODUCTS_DELETE: 'products:delete',
  PRODUCTS_BULK: 'products:bulk',
  
  // Orders
  ORDERS_VIEW: 'orders:view',
  ORDERS_EDIT: 'orders:edit',
  ORDERS_PROCESS: 'orders:process',
  ORDERS_REFUND: 'orders:refund',
  
  // Customers
  CUSTOMERS_VIEW: 'customers:view',
  CUSTOMERS_EDIT: 'customers:edit',
  CUSTOMERS_DELETE: 'customers:delete',
  
  // Inventory
  INVENTORY_VIEW: 'inventory:view',
  INVENTORY_EDIT: 'inventory:edit',
  INVENTORY_ALERTS: 'inventory:alerts',
  
  // Content
  CONTENT_VIEW: 'content:view',
  CONTENT_EDIT: 'content:edit',
  CONTENT_PUBLISH: 'content:publish',
  
  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // Users
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
} as const

// Role definitions with permissions
export const ROLES = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    permissions: Object.values(PERMISSIONS)
  },
  ADMIN: {
    name: 'Admin',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.DASHBOARD_ANALYTICS,
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_EDIT,
      PERMISSIONS.PRODUCTS_DELETE,
      PERMISSIONS.PRODUCTS_BULK,
      PERMISSIONS.ORDERS_VIEW,
      PERMISSIONS.ORDERS_EDIT,
      PERMISSIONS.ORDERS_PROCESS,
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.CUSTOMERS_EDIT,
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.INVENTORY_EDIT,
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.CONTENT_EDIT,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.SETTINGS_VIEW,
    ]
  },
  MANAGER: {
    name: 'Manager',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_EDIT,
      PERMISSIONS.ORDERS_VIEW,
      PERMISSIONS.ORDERS_EDIT,
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.CONTENT_EDIT,
      PERMISSIONS.REPORTS_VIEW,
    ]
  },
  EDITOR: {
    name: 'Editor',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_EDIT,
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.CONTENT_EDIT,
    ]
  },
  VIEWER: {
    name: 'Viewer',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.ORDERS_VIEW,
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.REPORTS_VIEW,
    ]
  }
} as const

// Create context
const AdminAuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  })
  
  const router = useRouter()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        const userData = localStorage.getItem('admin_user')
        
        if (token && userData) {
          const user = JSON.parse(userData)
          
          // Verify token is still valid
          const isValid = await verifyToken(token)
          
          if (isValid) {
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } else {
            // Token expired, clear storage
            localStorage.removeItem('admin_token')
            localStorage.removeItem('admin_user')
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            })
          }
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to initialize authentication'
        })
      }
    }

    initializeAuth()
  }, [])

  // Verify token validity
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  // Login function
  const login = useCallback(async (identifier: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: identifier, password }) // API still expects 'email' field
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const { user, token } = await response.json()
      
      // Store in localStorage
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_user', JSON.stringify(user))
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })

      // Log successful login
      await logActivity('LOGIN', `User ${identifier} logged in successfully`)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      
      // Log failed login attempt
      await logActivity('LOGIN_FAILED', `Failed login attempt for ${identifier}`)
      
      throw error
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      if (token) {
        // Log logout activity
        await logActivity('LOGOUT', `User ${authState.user?.email} logged out`)
        
        // Call logout API
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear storage and state
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
      
      // Redirect to login
      router.push('/admin/login')
    }
  }, [authState.user?.email, router])

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) return

      const response = await fetch('/api/admin/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const { token: newToken } = await response.json()
        localStorage.setItem('admin_token', newToken)
      } else {
        // Token refresh failed, logout
        await logout()
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      await logout()
    }
  }, [logout])

  // Update user data
  const updateUser = useCallback((userData: Partial<AdminUser>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData }
      setAuthState(prev => ({ ...prev, user: updatedUser }))
      localStorage.setItem('admin_user', JSON.stringify(updatedUser))
    }
  }, [authState.user])

  // Check permission
  const hasPermission = useCallback((permission: string): boolean => {
    if (!authState.user) return false
    return authState.user.permissions.includes(permission)
  }, [authState.user])

  // Check role
  const hasRole = useCallback((role: string): boolean => {
    if (!authState.user) return false
    return authState.user.role === role
  }, [authState.user])

  // Log activity
  const logActivity = async (action: string, description: string) => {
    try {
      await fetch('/api/admin/audit-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          action,
          description,
          userId: authState.user?.id,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to log activity:', error)
    }
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshToken,
    updateUser,
    hasPermission,
    hasRole
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

// Hook to use auth context
export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermissions: string[] = []
) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading, hasPermission } = useAdminAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/admin/login')
        return
      }

      if (isAuthenticated && requiredPermissions.length > 0) {
        const hasRequiredPermissions = requiredPermissions.every(permission => 
          hasPermission(permission)
        )
        
        if (!hasRequiredPermissions) {
          router.push('/admin/unauthorized')
          return
        }
      }
    }, [isAuthenticated, isLoading, hasPermission, router])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}
