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
      default:
        // Placeholder for blocks without preview
        blockComponent = (
          <div key={block.id} className="py-16 px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                {config.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {block.data?.title || config.name[isRTL ? 'ar' : 'en']}
              </h3>
              <p className="text-slate-500 text-sm">
                {isRTL ? 'قسم قيد التطوير' : 'Section under development'}
              </p>
            </div>
          </div>
        )
    }

    // If in editor mode, wrap with interactive overlay
    if (onBlockClick) {
      return (
        <div
          key={block.id}
          className={cn(
            "relative group cursor-pointer transition-all",
            isActive && "ring-2 ring-blue-500 ring-inset"
          )}
          onClick={(e) => {
            e.stopPropagation()
            onBlockClick(block.id)
          }}
          onMouseEnter={() => onBlockHover?.(block.id)}
          onMouseLeave={() => onBlockHover?.(null)}
        >
          {/* Selection Indicator */}
          {isActive && (
            <div className="absolute top-2 left-2 z-20 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md shadow-lg flex items-center gap-1.5">
              {config.icon}
              <span>{config.name[isRTL ? 'ar' : 'en']}</span>
            </div>
          )}

          {/* Hover Overlay */}
          {!isActive && (
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors z-10 pointer-events-none" />
          )}

          {/* Hover Label */}
          {!isActive && (
            <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-slate-900/80 text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1.5">
                {config.icon}
                <span>{config.name[isRTL ? 'ar' : 'en']}</span>
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
      className="min-h-full w-full"
      style={{ 
        backgroundColor: colors.background,
        color: colors.text,
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      {sortedBlocks.map(block => renderBlock(block))}
    </div>
  )
}

export default memo(HomepagePreview)

