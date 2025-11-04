'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOrganization, getPlanName, getPlanColor } from '@/hooks/use-organization'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Building2, 
  ChevronDown, 
  Settings, 
  CreditCard, 
  Users, 
  BarChart3,
  Plus,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserOrganization {
  id: string
  name: string
  logo?: string
  plan: string
  role: string
}

export function OrganizationSwitcher() {
  const router = useRouter()
  const { organization, isLoading, switchOrganization } = useOrganization()
  const [userOrganizations, setUserOrganizations] = useState<UserOrganization[]>([])
  const [loadingOrgs, setLoadingOrgs] = useState(false)

  // Fetch user's organizations
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        setLoadingOrgs(true)
        const response = await fetch('/api/organization/list', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setUserOrganizations(data.organizations || [])
        }
      } catch (error) {
        console.error('Error fetching organizations:', error)
      } finally {
        setLoadingOrgs(false)
      }
    }

    fetchOrganizations()
  }, [])

  const handleSwitchOrganization = async (orgId: string) => {
    if (orgId === organization?.id) return
    
    try {
      await switchOrganization(orgId)
      router.refresh()
    } catch (error) {
      console.error('Error switching organization:', error)
    }
  }

  if (isLoading || !organization) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted animate-pulse">
        <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
        <div className="flex-1 space-y-1">
          <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
          <div className="h-3 w-16 bg-muted-foreground/20 rounded" />
        </div>
      </div>
    )
  }

  const initials = organization.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between gap-2 px-3 py-6 h-auto"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={organization.logo} alt={organization.name} />
              <AvatarFallback 
                className="text-xs font-semibold"
                style={{ backgroundColor: organization.primaryColor }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="font-semibold text-sm truncate w-full text-right">
                {organization.name}
              </span>
              <div className="flex items-center gap-1.5">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs px-1.5 py-0 h-5",
                    getPlanColor(organization.plan),
                    "text-white"
                  )}
                >
                  {getPlanName(organization.plan)}
                </Badge>
              </div>
            </div>
          </div>
          
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          المنظمة الحالية
        </DropdownMenuLabel>
        
        {/* Current Organization */}
        <div className="px-2 py-3 bg-muted/50 rounded-md mx-2 mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={organization.logo} alt={organization.name} />
              <AvatarFallback style={{ backgroundColor: organization.primaryColor }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{organization.name}</p>
              <p className="text-xs text-muted-foreground">
                {organization.slug}
              </p>
            </div>
            
            <Check className="h-4 w-4 text-green-600" />
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Other Organizations */}
        {userOrganizations.length > 1 && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              المنظمات الأخرى
            </DropdownMenuLabel>
            
            {userOrganizations
              .filter(org => org.id !== organization.id)
              .map(org => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleSwitchOrganization(org.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={org.logo} alt={org.name} />
                      <AvatarFallback>
                        {org.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{org.name}</p>
                      <p className="text-xs text-muted-foreground">{org.role}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            
            <DropdownMenuSeparator />
          </>
        )}

        {/* Quick Actions */}
        <DropdownMenuItem
          onClick={() => router.push('/organizations')}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>إعدادات المنظمة</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/organizations/team')}
          className="cursor-pointer"
        >
          <Users className="mr-2 h-4 w-4" />
          <span>الفريق والأعضاء</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/organizations/usage')}
          className="cursor-pointer"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          <span>الاستخدام والحدود</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/organizations/billing')}
          className="cursor-pointer"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>الفواتير والاشتراك</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Create New Organization */}
        <DropdownMenuItem
          onClick={() => router.push('/signup')}
          className="cursor-pointer text-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>إنشاء منظمة جديدة</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Compact version for mobile or sidebar
export function OrganizationSwitcherCompact() {
  const { organization, isLoading } = useOrganization()
  const router = useRouter()

  if (isLoading || !organization) {
    return (
      <div className="flex items-center justify-center p-2">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
      </div>
    )
  }

  const initials = organization.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={organization.logo} alt={organization.name} />
            <AvatarFallback style={{ backgroundColor: organization.primaryColor }}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-semibold">{organization.name}</span>
            <span className="text-xs text-muted-foreground font-normal">
              {getPlanName(organization.plan)}
            </span>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => router.push('/organizations')}>
          <Building2 className="mr-2 h-4 w-4" />
          <span>إدارة المنظمة</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


