/**
 * Organization Hook
 * 
 * Simplified hook that wraps the organization context
 * Provides easy access to organization data and helpers
 */

import { useOrganizationContext } from '@/contexts/organization-context'

export function useOrganization() {
  return useOrganizationContext()
}

// Re-export helpers for convenience
export {
  formatBytes,
  getPlanName,
  getPlanColor,
  type Organization,
  type UsageMetrics
} from '@/contexts/organization-context'
