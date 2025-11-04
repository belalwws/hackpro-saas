'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ========================================
// TYPES
// ========================================

export interface Organization {
  id: string
  name: string
  slug: string
  logo?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  domain?: string
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'suspended' | 'cancelled' | 'trial'
  
  // Plan Limits
  maxHackathons: number
  maxUsers: number
  maxParticipants: number
  maxStorage: number
  maxEmailsPerMonth: number
  
  // Billing
  billingEmail?: string
  billingName?: string
  
  createdAt: string
  updatedAt: string
}

export interface UsageMetrics {
  hackathonsUsed: number
  usersUsed: number
  participantsUsed: number
  emailsSent: number
  storageUsed: number
  apiCallsMade: number
}

interface OrganizationContextType {
  organization: Organization | null
  usage: UsageMetrics | null
  isLoading: boolean
  error: string | null
  
  // Actions
  switchOrganization: (organizationId: string) => Promise<void>
  refreshOrganization: () => Promise<void>
  refreshUsage: () => Promise<void>
  
  // Helpers
  checkLimit: (type: 'hackathons' | 'users' | 'participants' | 'emails' | 'storage') => {
    allowed: boolean
    current: number
    limit: number
    percentage: number
  }
  isOwner: boolean
  canManageBilling: boolean
}

// ========================================
// CONTEXT
// ========================================

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

// ========================================
// PROVIDER
// ========================================

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [usage, setUsage] = useState<UsageMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [canManageBilling, setCanManageBilling] = useState(false)
  const router = useRouter()

  // ========================================
  // FETCH ORGANIZATION
  // ========================================
  
  const fetchOrganization = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/organization/current', {
        credentials: 'include',
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          // User doesn't belong to any organization
          setOrganization(null)
          setIsLoading(false)
          return
        }
        throw new Error('فشل في تحميل بيانات المنظمة')
      }
      
      const data = await response.json()
      setOrganization(data.organization)
      setIsOwner(data.isOwner || false)
      setCanManageBilling(data.canManageBilling || false)
    } catch (err) {
      console.error('Error fetching organization:', err)
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ========================================
  // FETCH USAGE
  // ========================================
  
  const fetchUsage = useCallback(async () => {
    if (!organization) return
    
    try {
      const response = await fetch('/api/organization/usage', {
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error('فشل في تحميل بيانات الاستخدام')
      }
      
      const data = await response.json()
      setUsage(data.usage)
    } catch (err) {
      console.error('Error fetching usage:', err)
    }
  }, [organization])

  // ========================================
  // SWITCH ORGANIZATION
  // ========================================
  
  const switchOrganization = useCallback(async (organizationId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/organization/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ organizationId }),
      })
      
      if (!response.ok) {
        throw new Error('فشل في تبديل المنظمة')
      }
      
      await fetchOrganization()
      await fetchUsage()
      
      // Refresh the page to update all data
      router.refresh()
    } catch (err) {
      console.error('Error switching organization:', err)
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }, [fetchOrganization, fetchUsage, router])

  // ========================================
  // CHECK LIMIT
  // ========================================
  
  const checkLimit = useCallback((
    type: 'hackathons' | 'users' | 'participants' | 'emails' | 'storage'
  ) => {
    if (!organization || !usage) {
      return { allowed: false, current: 0, limit: 0, percentage: 0 }
    }

    const limitMap = {
      hackathons: organization.maxHackathons,
      users: organization.maxUsers,
      participants: organization.maxParticipants,
      emails: organization.maxEmailsPerMonth,
      storage: organization.maxStorage,
    }

    const usageMap = {
      hackathons: usage.hackathonsUsed,
      users: usage.usersUsed,
      participants: usage.participantsUsed,
      emails: usage.emailsSent,
      storage: usage.storageUsed,
    }

    const limit = limitMap[type]
    const current = usageMap[type]
    const percentage = limit === 0 ? 0 : Math.round((current / limit) * 100)

    return {
      allowed: current < limit,
      current,
      limit,
      percentage,
    }
  }, [organization, usage])

  // ========================================
  // EFFECTS
  // ========================================
  
  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  useEffect(() => {
    if (organization) {
      fetchUsage()
    }
  }, [organization, fetchUsage])

  // ========================================
  // CONTEXT VALUE
  // ========================================
  
  const value: OrganizationContextType = {
    organization,
    usage,
    isLoading,
    error,
    switchOrganization,
    refreshOrganization: fetchOrganization,
    refreshUsage: fetchUsage,
    checkLimit,
    isOwner,
    canManageBilling,
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}

// ========================================
// HOOK
// ========================================

export function useOrganizationContext() {
  const context = useContext(OrganizationContext)
  
  if (context === undefined) {
    throw new Error('useOrganizationContext must be used within OrganizationProvider')
  }
  
  return context
}

// ========================================
// HELPERS
// ========================================

export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  let size = bytes

  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }

  return `${size.toFixed(2)} ${units[i]}`
}

export function getPlanName(plan: Organization['plan']): string {
  const names = {
    free: 'مجاني',
    starter: 'مبتدئ',
    professional: 'احترافي',
    enterprise: 'مؤسسات',
  }
  return names[plan]
}

export function getPlanColor(plan: Organization['plan']): string {
  const colors = {
    free: 'bg-gray-500',
    starter: 'bg-blue-500',
    professional: 'bg-purple-500',
    enterprise: 'bg-yellow-500',
  }
  return colors[plan]
}


