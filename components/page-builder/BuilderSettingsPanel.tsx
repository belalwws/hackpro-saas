'use client'

import React, { Suspense, lazy } from 'react'
import { Settings, Palette, MousePointer, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { HomepageData } from '@/hooks/useHomepageBuilder'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BLOCK_CONFIGS } from './BlockTypes'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const BlockEditor = lazy(() => import('./BlockEditor'))

interface BuilderSettingsPanelProps {
  isRTL: boolean
  language: 'ar' | 'en'
  activeBlockId: string | null
  homepageData: HomepageData
  hackathon: any
  handleUpdateBlock: (blockId: string, data: Record<string, any>) => void
  handleToggleBlock: (blockId: string) => void
  handleColorChange: (key: string, value: string) => void
}

// Color Input Component
function ColorInput({ 
  label, 
  value, 
  onChange 
}: { 
  label: string
  value: string
  onChange: (value: string) => void 
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-xs text-slate-500 capitalize flex-1">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
          <input
            type="color"
            className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <Input
          className="w-24 h-8 text-xs font-mono uppercase"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export default function BuilderSettingsPanel({
  isRTL,
  language,
  activeBlockId,
  homepageData,
  hackathon,
  handleUpdateBlock,
  handleToggleBlock,
  handleColorChange
}: BuilderSettingsPanelProps) {
  const activeBlock = (homepageData?.blocks && Array.isArray(homepageData.blocks))
    ? homepageData.blocks.find(b => b.id === activeBlockId) || null
    : null
  const [openSections, setOpenSections] = React.useState<string[]>(['content', 'colors'])

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2 shrink-0">
        <Settings className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {isRTL ? 'الخصائص' : 'Properties'}
        </span>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {activeBlock ? (
            <>
              {/* Block Header */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                    {BLOCK_CONFIGS[activeBlock.type].icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {BLOCK_CONFIGS[activeBlock.type].name[language]}
                    </p>
                    <p className="text-xs text-slate-500">
                      {activeBlock.enabled ? (isRTL ? 'مفعّل' : 'Visible') : (isRTL ? 'مخفي' : 'Hidden')}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={activeBlock.enabled}
                  onCheckedChange={() => handleToggleBlock(activeBlock.id)}
                />
              </div>

              {/* Content Section */}
              <Collapsible open={openSections.includes('content')} onOpenChange={() => toggleSection('content')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {isRTL ? 'المحتوى' : 'Content'}
                  </span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-slate-400 transition-transform",
                    openSections.includes('content') && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                      </div>
                    }>
                      <BlockEditor
                        block={activeBlock}
                        hackathon={hackathon}
                        onUpdate={(data) => handleUpdateBlock(activeBlock.id, data)}
                        onToggle={() => handleToggleBlock(activeBlock.id)}
                        isRTL={isRTL}
                        language={language}
                      />
                    </Suspense>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          ) : (
            /* No Block Selected - Show Global Settings */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <MousePointer className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                {isRTL ? 'لم يتم اختيار عنصر' : 'No block selected'}
              </p>
              <p className="text-xs text-slate-400">
                {isRTL ? 'اضغط على عنصر لتعديله' : 'Click a block to edit it'}
              </p>
            </div>
          )}

          {/* Global Colors Section - Always Visible */}
          <Collapsible open={openSections.includes('colors')} onOpenChange={() => toggleSection('colors')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {isRTL ? 'الألوان العامة' : 'Theme Colors'}
                </span>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-slate-400 transition-transform",
                openSections.includes('colors') && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <ColorInput
                  label={isRTL ? 'الأساسي' : 'Primary'}
                  value={homepageData?.colors?.primary || '#6366f1'}
                  onChange={(v) => handleColorChange('primary', v)}
                />
                <ColorInput
                  label={isRTL ? 'الثانوي' : 'Secondary'}
                  value={homepageData?.colors?.secondary || '#8b5cf6'}
                  onChange={(v) => handleColorChange('secondary', v)}
                />
                <ColorInput
                  label={isRTL ? 'التمييز' : 'Accent'}
                  value={homepageData?.colors?.accent || '#ec4899'}
                  onChange={(v) => handleColorChange('accent', v)}
                />
                <ColorInput
                  label={isRTL ? 'الخلفية' : 'Background'}
                  value={homepageData?.colors?.background || '#ffffff'}
                  onChange={(v) => handleColorChange('background', v)}
                />
                <ColorInput
                  label={isRTL ? 'النص' : 'Text'}
                  value={homepageData?.colors?.text || '#1f2937'}
                  onChange={(v) => handleColorChange('text', v)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  )
}

