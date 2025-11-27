'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plus, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { BLOCK_CONFIGS, BlockType } from './BlockTypes'

interface BlockSidebarProps {
  onAddBlock: (type: BlockType) => void
  isRTL: boolean
  language: 'ar' | 'en'
}

const categories = [
  { id: 'content', label: { ar: 'المحتوى', en: 'Content' } },
  { id: 'layout', label: { ar: 'التخطيط', en: 'Layout' } },
  { id: 'interactive', label: { ar: 'تفاعلي', en: 'Interactive' } },
  { id: 'media', label: { ar: 'وسائط', en: 'Media' } }
]

export default function BlockSidebar({ onAddBlock, isRTL, language }: BlockSidebarProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')

  const filteredBlocks = selectedCategory === 'all'
    ? Object.entries(BLOCK_CONFIGS)
    : Object.entries(BLOCK_CONFIGS).filter(([_, config]) => config.category === selectedCategory)

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className={cn("text-lg font-semibold mb-3", isRTL && "text-arabic")}>
            {language === 'ar' ? 'إضافة قسم' : 'Add Section'}
          </h3>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="text-xs"
            >
              {language === 'ar' ? 'الكل' : 'All'}
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="text-xs"
              >
                {cat.label[language]}
              </Button>
            ))}
          </div>
        </div>

        {/* Blocks List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredBlocks.map(([type, config]) => (
            <motion.div
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => onAddBlock(type as BlockType)}
                className={cn(
                  "w-full p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700",
                  "hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
                  "transition-all text-right flex items-center gap-3",
                  isRTL && "text-arabic"
                )}
              >
                <div className="text-2xl">{config.icon}</div>
                <div className="flex-1 text-sm font-medium">
                  {config.name[language]}
                </div>
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

