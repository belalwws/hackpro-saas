'use client'

import React, { useState } from 'react'
import { Save, Eye, Undo2, Redo2, Monitor, Tablet, Smartphone, ChevronLeft, Loader2, Globe, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ViewportSize } from '@/hooks/useHomepageBuilder'
import { useRouter } from 'next/navigation'

interface BuilderHeaderProps {
  hackathonTitle: string
  isRTL: boolean
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  viewportSize: ViewportSize
  setViewportSize: (size: ViewportSize) => void
  previewMode: boolean
  setPreviewMode: (mode: boolean) => void
  saving: boolean
  lastSaved: Date | null
  autoSaving: boolean
  handleSave: () => void
  subdomain?: string
  onSubdomainChange?: (subdomain: string) => void
}

export default function BuilderHeader({
  hackathonTitle,
  isRTL,
  undo,
  redo,
  canUndo,
  canRedo,
  viewportSize,
  setViewportSize,
  previewMode,
  setPreviewMode,
  saving,
  lastSaved,
  autoSaving,
  handleSave,
  subdomain,
  onSubdomainChange
}: BuilderHeaderProps) {
  const router = useRouter()
  const [showSubdomainDialog, setShowSubdomainDialog] = useState(false)
  const [tempSubdomain, setTempSubdomain] = useState(subdomain || '')

  const viewportOptions = [
    { id: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { id: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ]

  return (
    <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0">
      {/* Left Section - Back & Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9 rounded-lg"
        >
          <ChevronLeft className={cn("w-5 h-5", isRTL && "rotate-180")} />
        </Button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        <div>
          <h1 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
            {isRTL ? 'منشئ الصفحة' : 'Page Builder'}
          </h1>
          <p className="text-xs text-slate-500 truncate max-w-[200px]">
            {hackathonTitle || 'Untitled'}
          </p>
        </div>
      </div>

      {/* Center Section - Viewport Switcher */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {viewportOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setViewportSize(option.id)}
              className={cn(
                "p-2 rounded-md transition-all",
                viewportSize === option.id
                  ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
              title={option.label}
            >
              <option.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            className="h-9 w-9 rounded-lg"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            className="h-9 w-9 rounded-lg"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Subdomain Settings */}
        <Dialog open={showSubdomainDialog} onOpenChange={setShowSubdomainDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg gap-2"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{isRTL ? 'Subdomain' : 'Subdomain'}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isRTL ? 'إعدادات Subdomain' : 'Subdomain Settings'}</DialogTitle>
              <DialogDescription>
                {isRTL 
                  ? 'أدخل subdomain للصفحة (مثال: myhackathon → myhackathon.hackpro.cloud)'
                  : 'Enter a subdomain for your page (e.g., myhackathon → myhackathon.hackpro.cloud)'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>{isRTL ? 'Subdomain' : 'Subdomain'}</Label>
                <Input
                  value={tempSubdomain}
                  onChange={(e) => setTempSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder={isRTL ? 'myhackathon' : 'myhackathon'}
                  className="mt-2"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {tempSubdomain 
                    ? `${window.location.protocol}//${tempSubdomain}.${window.location.hostname.replace(/^[^.]+\./, '')}`
                    : (isRTL ? 'سيتم استخدام الرابط العادي' : 'Will use regular URL')}
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTempSubdomain(subdomain || '')
                    setShowSubdomainDialog(false)
                  }}
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  onClick={() => {
                    onSubdomainChange?.(tempSubdomain)
                    setShowSubdomainDialog(false)
                  }}
                >
                  {isRTL ? 'حفظ' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreviewMode(true)}
          className="h-9 rounded-lg gap-2"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">{isRTL ? 'معاينة' : 'Preview'}</span>
        </Button>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
          className="h-9 rounded-lg gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {saving ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ' : 'Save')}
          </span>
        </Button>
      </div>
    </div>
  )
}

