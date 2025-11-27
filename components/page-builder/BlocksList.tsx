'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GripVertical, Eye, EyeOff, ChevronUp, ChevronDown, Trash2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Block, BLOCK_CONFIGS } from './BlockTypes'

interface BlocksListProps {
  blocks: Block[]
  activeBlockId: string | null
  onSelectBlock: (blockId: string) => void
  onToggleBlock: (blockId: string) => void
  onMoveBlock: (blockId: string, direction: 'up' | 'down') => void
  onDeleteBlock: (blockId: string) => void
  isRTL: boolean
  language: 'ar' | 'en'
}

export default function BlocksList({
  blocks,
  activeBlockId,
  onSelectBlock,
  onToggleBlock,
  onMoveBlock,
  onDeleteBlock,
  isRTL,
  language
}: BlocksListProps) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <h3 className={cn("text-lg font-semibold mb-4", isRTL && "text-arabic")}>
          {language === 'ar' ? 'الأقسام' : 'Sections'}
        </h3>

        <div className="space-y-2 max-h-[700px] overflow-y-auto">
          {sortedBlocks.length === 0 ? (
            <div className={cn("text-center py-8 text-gray-500", isRTL && "text-arabic")}>
              {language === 'ar' ? 'لا توجد أقسام. أضف قسم من القائمة' : 'No sections. Add a section from the list'}
            </div>
          ) : (
            sortedBlocks.map((block, index) => {
              const config = BLOCK_CONFIGS[block.type]
              const isActive = activeBlockId === block.id
              const canMoveUp = index > 0
              const canMoveDown = index < sortedBlocks.length - 1

              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-3 rounded-lg border-2 cursor-pointer transition-all",
                    isActive
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300",
                    !block.enabled && "opacity-50"
                  )}
                  onClick={() => onSelectBlock(block.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="text-lg flex-shrink-0">{config.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-sm font-medium truncate", isRTL && "text-arabic")}>
                          {config.name[language]}
                        </div>
                        {!block.enabled && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {language === 'ar' ? 'معطل' : 'Disabled'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleBlock(block.id)
                        }}
                        className={cn(
                          "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                          block.enabled ? "text-green-600" : "text-gray-400"
                        )}
                        title={block.enabled ? (language === 'ar' ? 'إخفاء' : 'Hide') : (language === 'ar' ? 'إظهار' : 'Show')}
                      >
                        {block.enabled ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (canMoveUp) onMoveBlock(block.id, 'up')
                        }}
                        disabled={!canMoveUp}
                        className={cn(
                          "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                          !canMoveUp && "opacity-30 cursor-not-allowed"
                        )}
                        title={language === 'ar' ? 'نقل لأعلى' : 'Move up'}
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (canMoveDown) onMoveBlock(block.id, 'down')
                        }}
                        disabled={!canMoveDown}
                        className={cn(
                          "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                          !canMoveDown && "opacity-30 cursor-not-allowed"
                        )}
                        title={language === 'ar' ? 'نقل لأسفل' : 'Move down'}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
                            onDeleteBlock(block.id)
                          }
                        }}
                        className="p-1.5 rounded hover:bg-red-200 dark:hover:bg-red-900 transition-colors text-red-600"
                        title={language === 'ar' ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}

