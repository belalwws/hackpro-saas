'use client'

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { Save, Eye, X, Settings, Plus, GripVertical, Trash2, Copy, ChevronUp, ChevronDown, Edit3, Undo2, Redo2, Monitor, Tablet, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
const HomepagePreview = lazy(() => import('@/components/page-builder/HomepagePreview'))
const BlockEditor = lazy(() => import('@/components/page-builder/BlockEditor'))
import { Block, BlockType, BLOCK_CONFIGS } from '@/components/page-builder/BlockTypes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'

interface HomepageData {
  hackathonId: string
  isEnabled: boolean
  blocks: Block[]
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile'

export default function HomepageBuilder({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const router = useRouter()
  const { language } = useLanguage()
  const { toast } = useToast()
  const isRTL = language === 'ar'
  
  const [hackathon, setHackathon] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null)
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const [showAddBlocks, setShowAddBlocks] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop')
  const [activeDraggedItem, setActiveDraggedItem] = useState<{ type: 'block' | 'new'; block?: Block; blockType?: BlockType } | null>(null)
  
  const initialData: HomepageData = {
    hackathonId: resolvedParams.id,
    isEnabled: false,
    blocks: [],
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1f2937'
    }
  }

  const {
    state: homepageData,
    setState: setHomepageData,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory<HomepageData>(initialData)

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

  useEffect(() => {
    fetchHackathon()
    fetchHomepage()
  }, [resolvedParams.id])

  // Auto-save every 30 seconds
  useEffect(() => {
    if (homepageData.blocks.length === 0) return

    const autoSaveInterval = setInterval(async () => {
      setAutoSaving(true)
      try {
        const response = await fetch(`/api/admin/hackathons/${resolvedParams.id}/homepage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...homepageData, isDraft: true })
        })

        if (response.ok) {
          setLastSaved(new Date())
        }
      } catch (error) {
        console.error('Auto-save error:', error)
      } finally {
        setAutoSaving(false)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [homepageData, resolvedParams.id])

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrl: true,
      handler: () => {
        handleSave()
      }
    },
    {
      key: 'z',
      ctrl: true,
      shift: false,
      handler: () => undo()
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      handler: () => redo()
    },
    {
      key: 'y',
      ctrl: true,
      handler: () => redo()
    },
    {
      key: 'Delete',
      handler: () => {
        if (activeBlockId) {
          handleDeleteBlock(activeBlockId)
        }
      }
    },
    {
      key: 'Escape',
      handler: () => {
        setActiveBlockId(null)
      }
    }
  ])

  const fetchHackathon = async () => {
    try {
      const response = await fetch(`/api/admin/hackathons/${resolvedParams.id}`)
      if (response.ok) {
        const data = await response.json()
        setHackathon(data.hackathon)
      }
    } catch (error) {
      console.error('Error fetching hackathon:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHomepage = async () => {
    try {
      const response = await fetch(`/api/admin/hackathons/${resolvedParams.id}/homepage`)
      if (response.ok) {
        const data = await response.json()
        if (data.blocks && data.blocks.length > 0) {
          const loadedData = {
            hackathonId: resolvedParams.id,
            isEnabled: data.isEnabled || false,
            blocks: data.blocks,
            colors: data.colors || initialData.colors
          }
          setHomepageData(loadedData)
        }
      }
    } catch (error) {
      console.error('Error fetching homepage:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/hackathons/${resolvedParams.id}/homepage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homepageData)
      })

      if (response.ok) {
        setLastSaved(new Date())
        toast({
          title: isRTL ? 'تم الحفظ بنجاح!' : 'Saved successfully!',
          variant: 'default',
        })
      } else {
        const error = await response.json()
        toast({
          title: isRTL ? 'حدث خطأ في الحفظ' : 'Error saving',
          description: error.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error saving homepage:', error)
      toast({
        title: isRTL ? 'حدث خطأ في الحفظ' : 'Error saving',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddBlock = (type: BlockType) => {
    const config = BLOCK_CONFIGS[type]
    const newBlock: Block = {
      id: `${type}-${Date.now()}`,
      type,
      enabled: true,
      order: homepageData.blocks.length,
      data: config.defaultData(hackathon),
      styles: config.defaultStyles
    }
    
    setHomepageData({
      ...homepageData,
      blocks: [...homepageData.blocks, newBlock]
    })
    
    setActiveBlockId(newBlock.id)
    setShowAddBlocks(false)
  }

  const handleUpdateBlock = (blockId: string, data: Record<string, any>) => {
    const updatedData = {
      ...homepageData,
      blocks: homepageData.blocks.map(block =>
        block.id === blockId
          ? { ...block, data: { ...block.data, ...data } }
          : block
      )
    }
    setHomepageData(updatedData)
  }

  const handleToggleBlock = (blockId: string) => {
    setHomepageData({
      ...homepageData,
      blocks: homepageData.blocks.map(block =>
        block.id === blockId
          ? { ...block, enabled: !block.enabled }
          : block
      )
    })
  }

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const blocks = [...homepageData.blocks]
    const index = blocks.findIndex(b => b.id === blockId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const temp = blocks[index]
    blocks[index] = { ...blocks[newIndex], order: blocks[index].order }
    blocks[newIndex] = { ...temp, order: blocks[newIndex].order }

    setHomepageData({ ...homepageData, blocks })
  }

  const handleDeleteBlock = (blockId: string) => {
    if (confirm(isRTL ? 'هل أنت متأكد من حذف هذا القسم؟' : 'Are you sure you want to delete this section?')) {
      setHomepageData({
        ...homepageData,
        blocks: homepageData.blocks.filter(b => b.id !== blockId)
      })
      if (activeBlockId === blockId) {
        setActiveBlockId(null)
      }
    }
  }

  const handleDuplicateBlock = (blockId: string) => {
    const block = homepageData.blocks.find(b => b.id === blockId)
    if (!block) return

    const duplicatedBlock: Block = {
      ...block,
      id: `${block.type}-${Date.now()}`,
      order: block.order + 1
    }

    const blocks = [...homepageData.blocks]
    const index = blocks.findIndex(b => b.id === blockId)
    blocks.splice(index + 1, 0, duplicatedBlock)
    setHomepageData({ ...homepageData, blocks })
  }

  const handleColorChange = (key: string, value: string) => {
    setHomepageData({
      ...homepageData,
      colors: { ...homepageData.colors, [key]: value }
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    
    // Check if dragging a new block type
    if (active.id.toString().startsWith('new-block-')) {
      const blockType = active.id.toString().replace('new-block-', '') as BlockType
      setActiveDraggedItem({ type: 'new', blockType })
      return
    }

    // Check if dragging existing block
    const block = homepageData.blocks.find(b => b.id === active.id)
    if (block) {
      setActiveDraggedItem({ type: 'block', block })
      setDraggedBlockId(block.id)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    setActiveDraggedItem(null)
    setDraggedBlockId(null)

    if (!over) return

    // Handle adding new block
    if (active.id.toString().startsWith('new-block-') && over.id === 'preview-drop-zone') {
      const blockType = active.id.toString().replace('new-block-', '') as BlockType
      handleAddBlock(blockType)
      return
    }

    // Handle reordering blocks
    if (active.id !== over.id) {
      setHomepageData(prev => {
        const oldIndex = prev.blocks.findIndex(b => b.id === active.id)
        const newIndex = prev.blocks.findIndex(b => b.id === over.id)
        
        if (oldIndex === -1 || newIndex === -1) return prev

        const newBlocks = arrayMove(prev.blocks, oldIndex, newIndex)
        // Update order values
        const reorderedBlocks = newBlocks.map((block, index) => ({
          ...block,
          order: index
        }))

        return { ...prev, blocks: reorderedBlocks }
      })
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Visual feedback during drag
  }

  const activeBlock = homepageData.blocks.find(b => b.id === activeBlockId) || null
  const sortedBlocks = [...homepageData.blocks].sort((a, b) => a.order - b.order)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className={cn("mt-4 text-gray-600 dark:text-gray-400", isRTL && "text-arabic")}>
            {isRTL ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  if (previewMode) {
    return (
      <div className="min-h-screen relative bg-white">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(false)}
            className="bg-white shadow-lg"
          >
            <X className="w-4 h-4 mr-2" />
            {isRTL ? 'إغلاق المعاينة' : 'Close Preview'}
          </Button>
        </div>
        <HomepagePreview
          blocks={homepageData.blocks}
          colors={homepageData.colors}
          hackathonId={resolvedParams.id}
          isRTL={isRTL}
        />
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        {/* Top Header Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className={cn("text-xl font-bold text-gray-900 dark:text-white", isRTL && "text-arabic")}>
                  {isRTL ? 'منشئ الصفحة الرئيسية' : 'Page Builder'}
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {hackathon?.title || 'Hackathon'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Undo/Redo Buttons */}
                <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={undo}
                    disabled={!canUndo}
                    className="h-8 w-8 p-0"
                    title={isRTL ? 'تراجع (Ctrl+Z)' : 'Undo (Ctrl+Z)'}
                  >
                    <Undo2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redo}
                    disabled={!canRedo}
                    className="h-8 w-8 p-0"
                    title={isRTL ? 'إعادة (Ctrl+Y)' : 'Redo (Ctrl+Y)'}
                  >
                    <Redo2 className="w-4 h-4" />
                  </Button>
                </div>
                {/* Responsive Preview Buttons */}
                <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
                  <Button
                    variant={viewportSize === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewportSize('desktop')}
                    className="h-8 w-8 p-0"
                    title={isRTL ? 'سطح المكتب' : 'Desktop'}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewportSize === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewportSize('tablet')}
                    className="h-8 w-8 p-0"
                    title={isRTL ? 'تابلت' : 'Tablet'}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewportSize === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewportSize('mobile')}
                    className="h-8 w-8 p-0"
                    title={isRTL ? 'جوال' : 'Mobile'}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(true)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {isRTL ? 'معاينة' : 'Preview'}
                </Button>
                {autoSaving && (
                  <span className={cn("text-xs text-gray-500 dark:text-gray-400", isRTL && "text-arabic")}>
                    {isRTL ? 'جاري الحفظ التلقائي...' : 'Auto-saving...'}
                  </span>
                )}
                {lastSaved && !autoSaving && (
                  <span className={cn("text-xs text-gray-500 dark:text-gray-400", isRTL && "text-arabic")}>
                    {isRTL ? `آخر حفظ: ${lastSaved.toLocaleTimeString('ar')}` : `Last saved: ${lastSaved.toLocaleTimeString()}`}
                  </span>
                )}
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  size="sm"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Save className="w-4 h-4" />
                  {saving ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ' : 'Save')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <PanelGroup direction={isRTL ? "row-reverse" : "row"} className="flex-1 overflow-hidden">
          {/* Left Sidebar - Blocks List */}
          <Panel defaultSize={20} minSize={15} maxSize={35} className={cn(
            "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col",
            isRTL && "border-l border-r-0"
          )}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className={cn("text-sm font-semibold text-gray-900 dark:text-white", isRTL && "text-arabic")}>
                  {isRTL ? 'الأقسام' : 'Sections'}
                </h2>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowAddBlocks(!showAddBlocks)
                      setShowTemplates(false)
                    }}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    {isRTL ? 'إضافة' : 'Add'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowTemplates(!showTemplates)
                      setShowAddBlocks(false)
                    }}
                    className="flex items-center gap-1"
                  >
                    {isRTL ? 'قوالب' : 'Templates'}
                  </Button>
                </div>
              </div>
              
              {showTemplates && (
                <div className="mb-4">
                  <TemplatesPanel
                    onSelectTemplate={(template) => {
                      setHomepageData({
                        ...homepageData,
                        blocks: template.blocks,
                        colors: template.colors
                      })
                      setShowTemplates(false)
                    }}
                    onSaveAsTemplate={(name, description) => {
                      // Save template logic here
                      toast({
                        title: isRTL ? 'تم حفظ القالب!' : 'Template saved!',
                        variant: 'default',
                      })
                    }}
                    currentBlocks={homepageData.blocks}
                    currentColors={homepageData.colors}
                    isRTL={isRTL}
                    language={language}
                  />
                </div>
              )}
              
              {showAddBlocks && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {Object.entries(BLOCK_CONFIGS).map(([type, config]) => (
                    <SortableBlockItem
                      key={`new-block-${type}`}
                      id={`new-block-${type}`}
                      type={type as BlockType}
                      config={config}
                      isRTL={isRTL}
                      language={language}
                      isNewBlock={true}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {homepageData.blocks.length === 0 ? (
                <div className={cn("text-center py-8 text-gray-500 dark:text-gray-400", isRTL && "text-arabic")}>
                  <p>{isRTL ? 'لا توجد أقسام. اضغط على "إضافة" لإضافة قسم جديد.' : 'No sections. Click "Add" to add a new section.'}</p>
                </div>
              ) : (
                <SortableContext
                  items={sortedBlocks.map(b => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {sortedBlocks.map((block) => (
                      <SortableBlockItem
                        key={block.id}
                        id={block.id}
                        block={block}
                        isRTL={isRTL}
                        language={language}
                        isActive={activeBlockId === block.id}
                        onSelect={() => setActiveBlockId(block.id)}
                        onMoveUp={() => handleMoveBlock(block.id, 'up')}
                        onMoveDown={() => handleMoveBlock(block.id, 'down')}
                        onDuplicate={() => handleDuplicateBlock(block.id)}
                        onDelete={() => handleDeleteBlock(block.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className={cn(
            "w-1 bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 transition-colors cursor-col-resize",
            isRTL && "cursor-col-resize"
          )} />

          {/* Center - Live Preview */}
          <Panel defaultSize={50} minSize={30} className="overflow-auto bg-gray-50 dark:bg-gray-900 relative">
            <div 
              className={cn(
                "min-h-full transition-all duration-300",
                viewportSize === 'tablet' && "max-w-[768px] mx-auto",
                viewportSize === 'mobile' && "max-w-[375px] mx-auto"
              )}
              id="preview-drop-zone"
            >
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              }>
                <HomepagePreview
                  blocks={homepageData.blocks}
                  colors={homepageData.colors}
                  hackathonId={resolvedParams.id}
                  isRTL={isRTL}
                  activeBlockId={activeBlockId}
                  onBlockClick={setActiveBlockId}
                  onBlockHover={setHoveredBlockId}
                  draggedBlockId={draggedBlockId}
                />
              </Suspense>
            </div>
          </Panel>

          <PanelResizeHandle className={cn(
            "w-1 bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 transition-colors cursor-col-resize",
            isRTL && "cursor-col-resize"
          )} />

          {/* Right Sidebar - Settings */}
          <Panel defaultSize={30} minSize={20} maxSize={40} className={cn(
            "bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col",
            isRTL && "border-r border-l-0"
          )}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={cn("text-sm font-semibold text-gray-900 dark:text-white", isRTL && "text-arabic")}>
                {isRTL ? 'الإعدادات' : 'Settings'}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <Tabs defaultValue="block" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="block">{isRTL ? 'المحتوى' : 'Content'}</TabsTrigger>
                  <TabsTrigger value="style">{isRTL ? 'التصميم' : 'Style'}</TabsTrigger>
                  <TabsTrigger value="advanced">{isRTL ? 'متقدم' : 'Advanced'}</TabsTrigger>
                </TabsList>

                <TabsContent value="block" className="space-y-4">
                  {activeBlock ? (
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
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
                  ) : (
                    <div className={cn("text-center py-8 text-gray-500 dark:text-gray-400", isRTL && "text-arabic")}>
                      <Settings className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>{isRTL ? 'اختر قسماً لتحريره' : 'Select a section to edit'}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="style" className="space-y-4">
                  {activeBlock ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className={cn("text-sm", isRTL && "text-arabic")}>
                          {isRTL ? 'إعدادات التصميم' : 'Style Settings'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Spacing */}
                        <div>
                          <Label className={cn("text-sm font-semibold mb-2 block", isRTL && "text-arabic")}>
                            {isRTL ? 'المسافات' : 'Spacing'}
                          </Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className={cn("text-xs", isRTL && "text-arabic")}>
                                {isRTL ? 'Padding' : 'Padding'}
                              </Label>
                              <Input
                                type="text"
                                placeholder="0px"
                                value={activeBlock.styles?.padding || ''}
                                onChange={(e) => handleUpdateBlock(activeBlock.id, {
                                  styles: { ...activeBlock.styles, padding: e.target.value }
                                })}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className={cn("text-xs", isRTL && "text-arabic")}>
                                {isRTL ? 'Margin' : 'Margin'}
                              </Label>
                              <Input
                                type="text"
                                placeholder="0px"
                                value={activeBlock.styles?.margin || ''}
                                onChange={(e) => handleUpdateBlock(activeBlock.id, {
                                  styles: { ...activeBlock.styles, margin: e.target.value }
                                })}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Typography */}
                        <div>
                          <Label className={cn("text-sm font-semibold mb-2 block", isRTL && "text-arabic")}>
                            {isRTL ? 'الخط' : 'Typography'}
                          </Label>
                          <div className="space-y-3">
                            <div>
                              <Label className={cn("text-xs", isRTL && "text-arabic")}>
                                {isRTL ? 'حجم الخط' : 'Font Size'}
                              </Label>
                              <Input
                                type="text"
                                placeholder="16px"
                                value={activeBlock.styles?.fontSize || ''}
                                onChange={(e) => handleUpdateBlock(activeBlock.id, {
                                  styles: { ...activeBlock.styles, fontSize: e.target.value }
                                })}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className={cn("text-xs", isRTL && "text-arabic")}>
                                {isRTL ? 'وزن الخط' : 'Font Weight'}
                              </Label>
                              <Input
                                type="text"
                                placeholder="400"
                                value={activeBlock.styles?.fontWeight || ''}
                                onChange={(e) => handleUpdateBlock(activeBlock.id, {
                                  styles: { ...activeBlock.styles, fontWeight: e.target.value }
                                })}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className={cn("text-xs", isRTL && "text-arabic")}>
                                {isRTL ? 'ارتفاع السطر' : 'Line Height'}
                              </Label>
                              <Input
                                type="text"
                                placeholder="1.5"
                                value={activeBlock.styles?.lineHeight || ''}
                                onChange={(e) => handleUpdateBlock(activeBlock.id, {
                                  styles: { ...activeBlock.styles, lineHeight: e.target.value }
                                })}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Colors */}
                        <div>
                          <Label className={cn("text-sm font-semibold mb-2 block", isRTL && "text-arabic")}>
                            {isRTL ? 'الألوان' : 'Colors'}
                          </Label>
                          <div className="space-y-3">
                            <div>
                              <Label className={cn("text-xs", isRTL && "text-arabic")}>
                                {isRTL ? 'لون الخلفية' : 'Background Color'}
                              </Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  type="color"
                                  value={activeBlock.styles?.backgroundColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlock(activeBlock.id, {
                                    styles: { ...activeBlock.styles, backgroundColor: e.target.value }
                                  })}
                                  className="w-16 h-10"
                                />
                                <Input
                                  type="text"
                                  value={activeBlock.styles?.backgroundColor || ''}
                                  onChange={(e) => handleUpdateBlock(activeBlock.id, {
                                    styles: { ...activeBlock.styles, backgroundColor: e.target.value }
                                  })}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className={cn("text-xs", isRTL && "text-arabic")}>
                                {isRTL ? 'لون النص' : 'Text Color'}
                              </Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  type="color"
                                  value={activeBlock.styles?.color || '#000000'}
                                  onChange={(e) => handleUpdateBlock(activeBlock.id, {
                                    styles: { ...activeBlock.styles, color: e.target.value }
                                  })}
                                  className="w-16 h-10"
                                />
                                <Input
                                  type="text"
                                  value={activeBlock.styles?.color || ''}
                                  onChange={(e) => handleUpdateBlock(activeBlock.id, {
                                    styles: { ...activeBlock.styles, color: e.target.value }
                                  })}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className={cn("text-center py-8 text-gray-500 dark:text-gray-400", isRTL && "text-arabic")}>
                      <Settings className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>{isRTL ? 'اختر قسماً لتحريره' : 'Select a section to edit'}</p>
                    </div>
                  )}
                  
                  {/* Global Colors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className={cn("text-sm", isRTL && "text-arabic")}>
                        {isRTL ? 'الألوان العامة' : 'Global Colors'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className={cn(isRTL && "text-arabic")}>
                          {isRTL ? 'اللون الأساسي' : 'Primary Color'}
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={homepageData.colors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            type="text"
                            value={homepageData.colors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className={cn(isRTL && "text-arabic")}>
                          {isRTL ? 'اللون الثانوي' : 'Secondary Color'}
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={homepageData.colors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            type="text"
                            value={homepageData.colors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className={cn(isRTL && "text-arabic")}>
                          {isRTL ? 'لون التمييز' : 'Accent Color'}
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={homepageData.colors.accent}
                            onChange={(e) => handleColorChange('accent', e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            type="text"
                            value={homepageData.colors.accent}
                            onChange={(e) => handleColorChange('accent', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className={cn(isRTL && "text-arabic")}>
                          {isRTL ? 'لون الخلفية' : 'Background Color'}
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={homepageData.colors.background}
                            onChange={(e) => handleColorChange('background', e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            type="text"
                            value={homepageData.colors.background}
                            onChange={(e) => handleColorChange('background', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className={cn(isRTL && "text-arabic")}>
                          {isRTL ? 'لون النص' : 'Text Color'}
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={homepageData.colors.text}
                            onChange={(e) => handleColorChange('text', e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            type="text"
                            value={homepageData.colors.text}
                            onChange={(e) => handleColorChange('text', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  {activeBlock ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className={cn("text-sm", isRTL && "text-arabic")}>
                          {isRTL ? 'إعدادات متقدمة' : 'Advanced Settings'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className={cn("text-sm font-semibold mb-2 block", isRTL && "text-arabic")}>
                            {isRTL ? 'CSS مخصص' : 'Custom CSS'}
                          </Label>
                          <Textarea
                            placeholder={isRTL ? 'أدخل CSS مخصص...' : 'Enter custom CSS...'}
                            value={activeBlock.styles?.customCSS || ''}
                            onChange={(e) => handleUpdateBlock(activeBlock.id, {
                              styles: { ...activeBlock.styles, customCSS: e.target.value }
                            })}
                            rows={8}
                            className="font-mono text-xs"
                          />
                          <p className={cn("text-xs text-gray-500 mt-1", isRTL && "text-arabic")}>
                            {isRTL ? 'سيتم تطبيق هذا CSS على القسم فقط' : 'This CSS will be applied to this section only'}
                          </p>
                        </div>

                        <div>
                          <Label className={cn("text-sm font-semibold mb-2 block", isRTL && "text-arabic")}>
                            {isRTL ? 'معرف CSS' : 'CSS ID'}
                          </Label>
                          <Input
                            type="text"
                            placeholder="section-id"
                            value={activeBlock.styles?.id || ''}
                            onChange={(e) => handleUpdateBlock(activeBlock.id, {
                              styles: { ...activeBlock.styles, id: e.target.value }
                            })}
                          />
                        </div>

                        <div>
                          <Label className={cn("text-sm font-semibold mb-2 block", isRTL && "text-arabic")}>
                            {isRTL ? 'فئات CSS' : 'CSS Classes'}
                          </Label>
                          <Input
                            type="text"
                            placeholder="class1 class2"
                            value={activeBlock.styles?.className || ''}
                            onChange={(e) => handleUpdateBlock(activeBlock.id, {
                              styles: { ...activeBlock.styles, className: e.target.value }
                            })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className={cn("text-center py-8 text-gray-500 dark:text-gray-400", isRTL && "text-arabic")}>
                      <Settings className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>{isRTL ? 'اختر قسماً لتحريره' : 'Select a section to edit'}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </Panel>
        </PanelGroup>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeDraggedItem ? (
            <div className="bg-white dark:bg-gray-800 border-2 border-indigo-500 rounded-lg p-4 shadow-xl">
              {activeDraggedItem.type === 'new' && activeDraggedItem.blockType ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{BLOCK_CONFIGS[activeDraggedItem.blockType].icon}</span>
                  <span className={cn("text-sm font-medium", isRTL && "text-arabic")}>
                    {BLOCK_CONFIGS[activeDraggedItem.blockType].name[language]}
                  </span>
                </div>
              ) : activeDraggedItem.block ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{BLOCK_CONFIGS[activeDraggedItem.block.type].icon}</span>
                  <span className={cn("text-sm font-medium", isRTL && "text-arabic")}>
                    {BLOCK_CONFIGS[activeDraggedItem.block.type].name[language]}
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

// Sortable Block Item Component
interface SortableBlockItemProps {
  id: string
  block?: Block
  type?: BlockType
  config?: any
  isRTL: boolean
  language: 'ar' | 'en'
  isNewBlock?: boolean
  isActive?: boolean
  onSelect?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
}

function SortableBlockItem({
  id,
  block,
  type,
  config,
  isRTL,
  language,
  isNewBlock = false,
  isActive = false,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const blockConfig = block ? BLOCK_CONFIGS[block.type] : (config || BLOCK_CONFIGS[type!])

  if (isNewBlock) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <span className="text-lg">{blockConfig.icon}</span>
          <div className="flex-1">
            <div className="text-xs font-medium text-gray-900 dark:text-white">
              {blockConfig.name[language]}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative p-3 border rounded-lg cursor-pointer transition-all",
        isActive
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
        !block?.enabled && "opacity-50",
        isDragging && "opacity-50"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-0.5"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-sm font-medium text-gray-900 dark:text-white", isRTL && "text-arabic")}>
              {blockConfig.name[language]}
            </span>
            {!block?.enabled && (
              <span className="text-xs text-gray-400">({isRTL ? 'معطل' : 'Disabled'})</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMoveUp?.()
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMoveDown?.()
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate?.()
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title={isRTL ? 'نسخ' : 'Duplicate'}
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
              className="p-1 hover:bg-red-200 dark:hover:bg-red-900 rounded text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
