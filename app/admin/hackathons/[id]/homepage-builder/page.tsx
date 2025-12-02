'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { cn } from '@/lib/utils'
import { useHomepageBuilder } from '@/hooks/useHomepageBuilder'
import { BLOCK_CONFIGS } from '@/components/page-builder/BlockTypes'
import { useLanguage } from '@/contexts/language-context'

// Components
import BuilderHeader from '@/components/page-builder/BuilderHeader'
import BuilderSidebar from '@/components/page-builder/BuilderSidebar'
import BuilderCanvas from '@/components/page-builder/BuilderCanvas'
import BuilderSettingsPanel from '@/components/page-builder/BuilderSettingsPanel'
import HomepagePreview from '@/components/page-builder/HomepagePreview'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X, Loader2, Copy, Check, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function HomepageBuilder({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const { language } = useLanguage()
  const isRTL = language === 'ar'
  const { toast } = useToast()

  const [hackathon, setHackathon] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  
  // State for sidebar views
  const [activeSidebarTab, setActiveSidebarTab] = useState<'insert' | 'layers' | 'templates'>('insert')

  const builder = useHomepageBuilder({
    hackathonId: resolvedParams.id
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        builder.handleSave()
      }
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (builder.canUndo) builder.undo()
      }
      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z = Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (builder.canRedo) builder.redo()
      }
      // Delete/Backspace = Delete selected block
      if ((e.key === 'Delete' || e.key === 'Backspace') && builder.activeBlockId) {
        // Only delete if not focused on an input
        const activeElement = document.activeElement
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault()
          builder.handleDeleteBlock(builder.activeBlockId)
        }
      }
      // Escape = Deselect block
      if (e.key === 'Escape') {
        builder.setActiveBlockId(null)
        builder.setPreviewMode(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [builder])

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch Hackathon
        const hResponse = await fetch(`/api/admin/hackathons/${resolvedParams.id}`)
        if (hResponse.ok) {
          const hData = await hResponse.json()
          setHackathon(hData.hackathon)
        }

        // Fetch Homepage Data
        const hpResponse = await fetch(`/api/admin/hackathons/${resolvedParams.id}/homepage`)
        if (hpResponse.ok) {
          const hpData = await hpResponse.json()
          if (hpData.blocks && hpData.blocks.length > 0) {
            builder.setHomepageData({
              hackathonId: resolvedParams.id,
              isEnabled: hpData.isEnabled || false,
              blocks: hpData.blocks,
              colors: hpData.colors || builder.homepageData.colors
            })
          }
        }
      } catch (error) {
        console.error('Error initializing builder:', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 text-sm font-medium">Loading Builder...</p>
      </div>
    )
  }

  // Full Screen Preview Mode
  if (builder.previewMode) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 overflow-hidden flex flex-col animate-in fade-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
          {/* Left - Back Button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => builder.setPreviewMode(false)}
              variant="ghost"
              size="icon"
              className="rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="font-semibold text-lg">
              {isRTL ? 'معاينة الصفحة' : 'Page Preview'}
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {builder.savedUrl && (
              <Button
                onClick={() => window.open(builder.savedUrl!, '_blank')}
                variant="outline"
                className="rounded-lg gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                {isRTL ? 'فتح في تبويب جديد' : 'Open in New Tab'}
              </Button>
            )}
            <Button
              onClick={() => builder.setPreviewMode(false)}
              className="rounded-lg gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isRTL ? 'العودة للتحرير' : 'Back to Editor'}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
           <HomepagePreview
              blocks={builder.homepageData?.blocks || []}
              colors={builder.homepageData?.colors || { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899', background: '#ffffff', text: '#1f2937' }}
              hackathonId={resolvedParams.id}
              isRTL={isRTL}
            />
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={builder.handleDragStart}
      onDragEnd={(e) => builder.handleDragEnd(e, hackathon)}
    >
      <div className="h-screen flex flex-col bg-white dark:bg-slate-950 overflow-hidden font-sans">
        {/* Top Header */}
        <BuilderHeader
          hackathonTitle={hackathon?.title}
          isRTL={isRTL}
          undo={builder.undo}
          redo={builder.redo}
          canUndo={builder.canUndo}
          canRedo={builder.canRedo}
          viewportSize={builder.viewportSize}
          setViewportSize={builder.setViewportSize}
          previewMode={builder.previewMode}
          setPreviewMode={builder.setPreviewMode}
          saving={builder.saving}
          lastSaved={builder.lastSaved}
          autoSaving={builder.autoSaving}
          handleSave={builder.handleSave}
          subdomain={builder.homepageData?.subdomain}
          onSubdomainChange={(subdomain) => {
            builder.setHomepageData({
              ...builder.homepageData,
              subdomain
            })
          }}
        />

        {/* Main Workspace */}
        <div className="flex-1 overflow-hidden">
          <PanelGroup direction="horizontal" className="h-full">
            
            {/* Left Sidebar (Tools & Layers) - Rendered first in LTR, last in RTL */}
            {!isRTL && (
              <>
                <Panel defaultSize={20} minSize={15} maxSize={25} className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-10 flex flex-col">
                  <BuilderSidebar
                    isRTL={isRTL}
                    language={language}
                    activeTab={activeSidebarTab}
                    setActiveTab={setActiveSidebarTab}
                    homepageData={builder.homepageData}
                    setHomepageData={builder.setHomepageData}
                    activeBlockId={builder.activeBlockId}
                    setActiveBlockId={builder.setActiveBlockId}
                    handleMoveBlock={builder.handleMoveBlock}
                    handleDuplicateBlock={builder.handleDuplicateBlock}
                    handleDeleteBlock={builder.handleDeleteBlock}
                  />
                </Panel>
                <PanelResizeHandle className="w-[1px] bg-slate-200 dark:bg-slate-800 transition-colors hover:bg-blue-500 hover:w-[2px] z-20" />
              </>
            )}

            {isRTL && (
               <>
                <Panel defaultSize={25} minSize={20} maxSize={30} className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-10">
                  <BuilderSettingsPanel
                    isRTL={isRTL}
                    language={language}
                    activeBlockId={builder.activeBlockId}
                    homepageData={builder.homepageData}
                    hackathon={hackathon}
                    handleUpdateBlock={builder.handleUpdateBlock}
                    handleToggleBlock={builder.handleToggleBlock}
                    handleColorChange={builder.handleColorChange}
                  />
                </Panel>
                <PanelResizeHandle className="w-[1px] bg-slate-200 dark:bg-slate-800 transition-colors hover:bg-blue-500 hover:w-[2px] z-20" />
               </>
            )}

            {/* Center Canvas (The Stage) */}
            <Panel defaultSize={55} minSize={30} className="bg-slate-100/50 dark:bg-slate-950/50 relative">
              <BuilderCanvas
                homepageData={builder.homepageData}
                hackathonId={resolvedParams.id}
                isRTL={isRTL}
                viewportSize={builder.viewportSize}
                activeBlockId={builder.activeBlockId}
                setActiveBlockId={builder.setActiveBlockId}
                setHoveredBlockId={builder.setHoveredBlockId}
                draggedBlockId={builder.draggedBlockId}
              />
            </Panel>

            {/* Right Sidebar (Properties) - Rendered last in LTR, first in RTL (swapped above) */}
            {!isRTL && (
              <>
                <PanelResizeHandle className="w-[1px] bg-slate-200 dark:bg-slate-800 transition-colors hover:bg-blue-500 hover:w-[2px] z-20" />
                <Panel defaultSize={25} minSize={20} maxSize={30} className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-10">
                   <BuilderSettingsPanel
                    isRTL={isRTL}
                    language={language}
                    activeBlockId={builder.activeBlockId}
                    homepageData={builder.homepageData}
                    hackathon={hackathon}
                    handleUpdateBlock={builder.handleUpdateBlock}
                    handleToggleBlock={builder.handleToggleBlock}
                    handleColorChange={builder.handleColorChange}
                  />
                </Panel>
              </>
            )}

            {isRTL && (
              <>
                <PanelResizeHandle className="w-[1px] bg-slate-200 dark:bg-slate-800 transition-colors hover:bg-blue-500 hover:w-[2px] z-20" />
                <Panel defaultSize={20} minSize={15} maxSize={25} className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-10 flex flex-col">
                  <BuilderSidebar
                    isRTL={isRTL}
                    language={language}
                    activeTab={activeSidebarTab}
                    setActiveTab={setActiveSidebarTab}
                    homepageData={builder.homepageData}
                    setHomepageData={builder.setHomepageData}
                    activeBlockId={builder.activeBlockId}
                    setActiveBlockId={builder.setActiveBlockId}
                    handleMoveBlock={builder.handleMoveBlock}
                    handleDuplicateBlock={builder.handleDuplicateBlock}
                    handleDeleteBlock={builder.handleDeleteBlock}
                  />
                </Panel>
              </>
            )}

          </PanelGroup>
        </div>

        {/* Dragging Overlay */}
        <DragOverlay dropAnimation={{
            duration: 250,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}>
          {builder.activeDraggedItem ? (
             <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-blue-500 p-4 w-64 opacity-90 rotate-3 cursor-grabbing">
                <div className="flex items-center gap-3">
                   <div className="text-2xl">
                     {builder.activeDraggedItem.type === 'new' && builder.activeDraggedItem.blockType 
                        ? BLOCK_CONFIGS[builder.activeDraggedItem.blockType].icon 
                        : BLOCK_CONFIGS[builder.activeDraggedItem.block!.type].icon}
                   </div>
                   <div className="font-medium text-sm">
                     {builder.activeDraggedItem.type === 'new' && builder.activeDraggedItem.blockType
                        ? BLOCK_CONFIGS[builder.activeDraggedItem.blockType].name[language]
                        : BLOCK_CONFIGS[builder.activeDraggedItem.block!.type].name[language]}
                   </div>
                </div>
             </div>
          ) : null}
        </DragOverlay>

        {/* URL Modal */}
        <Dialog open={builder.showUrlModal} onOpenChange={builder.setShowUrlModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isRTL ? 'تم الحفظ بنجاح!' : 'Saved Successfully!'}</DialogTitle>
              <DialogDescription>
                {isRTL 
                  ? 'رابط الصفحة للمشاركين:'
                  : 'Share this link with participants:'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <input
                  readOnly
                  value={builder.savedUrl || ''}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-mono"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (builder.savedUrl) {
                      navigator.clipboard.writeText(builder.savedUrl)
                      setCopied(true)
                      toast({
                        title: isRTL ? 'تم النسخ!' : 'Copied!',
                        variant: 'default',
                      })
                      setTimeout(() => setCopied(false), 2000)
                    }
                  }}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => builder.setShowUrlModal(false)}
                >
                  {isRTL ? 'إغلاق' : 'Close'}
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (builder.savedUrl) {
                      window.open(builder.savedUrl, '_blank')
                    }
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {isRTL ? 'فتح الرابط' : 'Open Link'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DndContext>
  )
}

