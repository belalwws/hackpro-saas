'use client'

import React, { useState } from 'react'
import { Plus, Layers, LayoutTemplate, Search, GripVertical, Trash2, Copy, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BlockType, BLOCK_CONFIGS, Block } from './BlockTypes'
import { HomepageData } from '@/hooks/useHomepageBuilder'
import { useToast } from '@/hooks/use-toast'
import { ScrollArea } from '@/components/ui/scroll-area'

interface BuilderSidebarProps {
  isRTL: boolean
  language: 'ar' | 'en'
  activeTab: 'insert' | 'layers' | 'templates'
  setActiveTab: (tab: 'insert' | 'layers' | 'templates') => void
  homepageData: HomepageData
  setHomepageData: (data: HomepageData) => void
  activeBlockId: string | null
  setActiveBlockId: (id: string | null) => void
  handleMoveBlock: (blockId: string, direction: 'up' | 'down') => void
  handleDuplicateBlock: (blockId: string) => void
  handleDeleteBlock: (blockId: string) => void
}

// Draggable Block Card for "Insert" tab
function DraggableBlockCard({ type, language }: { type: BlockType; language: 'ar' | 'en' }) {
  const config = BLOCK_CONFIGS[type]
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `new-block-${type}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 cursor-grab active:cursor-grabbing transition-all hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 group",
        isDragging && "opacity-50 scale-105 shadow-lg border-blue-500"
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
        {config.icon}
      </div>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 text-center">
        {config.name[language]}
      </span>
    </div>
  )
}

// Layer Item for "Layers" tab
function LayerItem({
  block,
  language,
  isActive,
  onSelect,
  onDuplicate,
  onDelete,
  onToggle,
}: {
  block: Block
  language: 'ar' | 'en'
  isActive: boolean
  onSelect: () => void
  onDuplicate: () => void
  onDelete: () => void
  onToggle: () => void
}) {
  const config = BLOCK_CONFIGS[block.type]
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        "group flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer",
        isActive
          ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
        isDragging && "opacity-50 shadow-lg",
        !block.enabled && "opacity-50"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
        {config.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
          {config.name[language]}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          {block.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
          <Copy className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}

export default function BuilderSidebar({
  isRTL,
  language,
  activeTab,
  setActiveTab,
  homepageData,
  setHomepageData,
  activeBlockId,
  setActiveBlockId,
  handleMoveBlock,
  handleDuplicateBlock,
  handleDeleteBlock,
}: BuilderSidebarProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const sortedBlocks = [...(homepageData?.blocks || [])].sort((a, b) => a.order - b.order)

  const filteredBlockTypes = Object.keys(BLOCK_CONFIGS).filter((type) =>
    BLOCK_CONFIGS[type as BlockType].name[language].toLowerCase().includes(searchQuery.toLowerCase())
  ) as BlockType[]

  const handleToggleBlock = (blockId: string) => {
    const updatedBlocks = (homepageData?.blocks || []).map(b => 
      b.id === blockId ? { ...b, enabled: !b.enabled } : b
    )
    setHomepageData({ ...homepageData, blocks: updatedBlocks })
  }

  const tabs = [
    { id: 'insert' as const, label: isRTL ? 'إضافة' : 'Insert', icon: Plus },
    { id: 'layers' as const, label: isRTL ? 'الطبقات' : 'Layers', icon: Layers },
    { id: 'templates' as const, label: isRTL ? 'قوالب' : 'Templates', icon: LayoutTemplate },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Tab Switcher */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {/* INSERT TAB */}
        {activeTab === 'insert' && (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder={isRTL ? 'بحث...' : 'Search blocks...'}
                  className="pl-9 h-9 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 grid grid-cols-2 gap-2">
                {filteredBlockTypes.map((type) => (
                  <DraggableBlockCard key={type} type={type} language={language} />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* LAYERS TAB */}
        {activeTab === 'layers' && (
          <ScrollArea className="h-full">
            <div className="p-3 space-y-2">
              {sortedBlocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Layers className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    {isRTL ? 'لا توجد عناصر' : 'No blocks yet'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {isRTL ? 'اسحب عنصراً من تبويب "إضافة"' : 'Drag a block from "Insert" tab'}
                  </p>
                </div>
              ) : (
                <SortableContext items={sortedBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  {sortedBlocks.map((block) => (
                    <LayerItem
                      key={block.id}
                      block={block}
                      language={language}
                      isActive={activeBlockId === block.id}
                      onSelect={() => setActiveBlockId(block.id)}
                      onDuplicate={() => handleDuplicateBlock(block.id)}
                      onDelete={() => handleDeleteBlock(block.id)}
                      onToggle={() => handleToggleBlock(block.id)}
                    />
                  ))}
                </SortableContext>
              )}
            </div>
          </ScrollArea>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <ScrollArea className="h-full">
            <div className="p-3">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <LayoutTemplate className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {isRTL ? 'قريباً' : 'Coming Soon'}
                </p>
                <p className="text-xs text-slate-400">
                  {isRTL ? 'قوالب جاهزة للاستخدام' : 'Ready-to-use templates'}
                </p>
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
