'use client'

import React, { memo } from 'react'
import { Block, BLOCK_CONFIGS } from './BlockTypes'
import HeroBlockPreview from './block-previews/HeroBlockPreview'
import AboutBlockPreview from './block-previews/AboutBlockPreview'
import ScheduleBlockPreview from './block-previews/ScheduleBlockPreview'
import PrizesBlockPreview from './block-previews/PrizesBlockPreview'
import FAQBlockPreview from './block-previews/FAQBlockPreview'
import ContactBlockPreview from './block-previews/ContactBlockPreview'
import StatsBlockPreview from './block-previews/StatsBlockPreview'
import { cn } from '@/lib/utils'
import { Edit3 } from 'lucide-react'

interface HomepagePreviewProps {
  blocks: Block[]
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  hackathonId: string
  isRTL: boolean
  activeBlockId?: string | null
  onBlockClick?: (blockId: string) => void
  onBlockHover?: (blockId: string | null) => void
  draggedBlockId?: string | null
}

function HomepagePreview({
  blocks,
  colors,
  hackathonId,
  isRTL,
  activeBlockId,
  onBlockClick,
  onBlockHover,
  draggedBlockId
}: HomepagePreviewProps) {
  const sortedBlocks = [...blocks]
    .filter(block => block.enabled)
    .sort((a, b) => a.order - b.order)

  const renderBlock = (block: Block) => {
    const props = {
      block,
      colors,
      hackathonId,
      isRTL
    }

    const isActive = activeBlockId === block.id
    const config = BLOCK_CONFIGS[block.type]

    let blockComponent
    switch (block.type) {
      case 'hero':
        blockComponent = <HeroBlockPreview key={block.id} {...props} />
        break
      case 'about':
        blockComponent = <AboutBlockPreview key={block.id} {...props} />
        break
      case 'schedule':
        blockComponent = <ScheduleBlockPreview key={block.id} {...props} />
        break
      case 'prizes':
        blockComponent = <PrizesBlockPreview key={block.id} {...props} />
        break
      case 'faq':
        blockComponent = <FAQBlockPreview key={block.id} {...props} />
        break
      case 'contact':
        blockComponent = <ContactBlockPreview key={block.id} {...props} />
        break
      case 'stats':
        blockComponent = <StatsBlockPreview key={block.id} {...props} />
        break
      case 'testimonials':
      case 'features':
      case 'gallery':
      case 'countdown':
      case 'sponsors':
      case 'timeline':
      case 'pricing':
      case 'cta':
        // Placeholder previews for missing blocks
        blockComponent = (
          <div key={block.id} className="p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg m-4">
            <div className="text-4xl mb-4">{BLOCK_CONFIGS[block.type].icon}</div>
            <h3 className={cn("text-xl font-semibold mb-2", isRTL && "text-arabic")}>
              {block.data?.title || BLOCK_CONFIGS[block.type].name[isRTL ? 'ar' : 'en']}
            </h3>
            <p className={cn("text-gray-500", isRTL && "text-arabic")}>
              {isRTL ? 'معاينة هذا القسم قيد التطوير' : 'Preview for this section is under development'}
            </p>
          </div>
        )
        break
      default:
        return null
    }

    // If in editor mode (onBlockClick is provided), wrap with interactive overlay
    if (onBlockClick) {
      return (
        <div
          key={block.id}
          className={cn(
            "relative group",
            isActive && "ring-2 ring-indigo-500 ring-offset-2"
          )}
          onClick={(e) => {
            e.stopPropagation()
            onBlockClick(block.id)
          }}
          onMouseEnter={() => onBlockHover?.(block.id)}
          onMouseLeave={() => onBlockHover?.(null)}
        >
          {/* Overlay indicator */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 z-10 h-1 transition-all",
              isActive
                ? "bg-indigo-500"
                : "bg-transparent group-hover:bg-indigo-300"
            )}
          />
          
          {/* Edit button on hover */}
          {!isActive && (
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium shadow-lg">
                <Edit3 className="w-3 h-3" />
                {config.name[isRTL ? 'ar' : 'en']}
              </div>
            </div>
          )}

          {/* Active indicator */}
          {isActive && (
            <div className="absolute top-2 right-2 z-20">
              <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium shadow-lg">
                <Edit3 className="w-3 h-3" />
                {isRTL ? 'جاري التحرير' : 'Editing'}
              </div>
            </div>
          )}

          {blockComponent}
        </div>
      )
    }

    return blockComponent
  }

  return (
    <div 
      className="min-h-screen w-full relative"
      style={{ 
        backgroundColor: colors.background,
        color: colors.text,
        direction: isRTL ? 'rtl' : 'ltr'
      }}
      id="preview-drop-zone"
    >
      {sortedBlocks.length === 0 && draggedBlockId && (
        <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg m-4">
          <p className={cn("text-indigo-600 dark:text-indigo-400 font-medium", isRTL && "text-arabic")}>
            {isRTL ? 'أسقط القسم هنا' : 'Drop section here'}
          </p>
        </div>
      )}
      {sortedBlocks.map(block => renderBlock(block))}
    </div>
  )
}

export default memo(HomepagePreview)

