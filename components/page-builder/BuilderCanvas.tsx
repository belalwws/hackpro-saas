'use client'

import React, { Suspense, lazy } from 'react'
import { cn } from '@/lib/utils'
import { HomepageData, ViewportSize } from '@/hooks/useHomepageBuilder'
import { Loader2, Plus } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'

const HomepagePreview = lazy(() => import('./HomepagePreview'))

interface BuilderCanvasProps {
  homepageData: HomepageData
  hackathonId: string
  isRTL: boolean
  viewportSize: ViewportSize
  activeBlockId: string | null
  setActiveBlockId: (id: string | null) => void
  setHoveredBlockId: (id: string | null) => void
  draggedBlockId: string | null
}

export default function BuilderCanvas({
  homepageData,
  hackathonId,
  isRTL,
  viewportSize,
  activeBlockId,
  setActiveBlockId,
  setHoveredBlockId,
  draggedBlockId
}: BuilderCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  })

  const hasBlocks = homepageData?.blocks?.length > 0

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.3) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Canvas Content */}
      <div className="absolute inset-0 overflow-auto flex items-start justify-center p-6 md:p-10">
        <div
          ref={setNodeRef}
          className={cn(
            "relative transition-all duration-300 ease-out",
            // Viewport sizing
            viewportSize === 'desktop' && "w-full max-w-[1200px] min-h-[600px]",
            viewportSize === 'tablet' && "w-[768px] min-h-[1024px]",
            viewportSize === 'mobile' && "w-[375px] min-h-[667px]",
            // Frame styling
            "bg-white dark:bg-slate-950 rounded-lg shadow-2xl overflow-hidden",
            viewportSize !== 'desktop' && "border border-slate-200 dark:border-slate-800",
            // Drop zone highlight
            isOver && "ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-100 dark:ring-offset-slate-900"
          )}
        >
          {/* Browser Chrome for non-mobile */}
          {viewportSize === 'desktop' && (
            <div className="h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-3 gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4">
                <div className="h-5 bg-white dark:bg-slate-700 rounded-md max-w-md mx-auto" />
              </div>
            </div>
          )}

          {/* Mobile Notch */}
          {viewportSize === 'mobile' && (
            <div className="h-7 bg-slate-950 flex items-end justify-center pb-1">
              <div className="w-20 h-5 bg-slate-900 rounded-full" />
            </div>
          )}

          {/* Preview Content */}
          <div className={cn(
            "w-full overflow-y-auto overflow-x-hidden",
            viewportSize === 'mobile' && "h-[calc(667px-28px)]",
            viewportSize === 'tablet' && "h-[1024px]",
            viewportSize === 'desktop' && "min-h-[568px]"
          )}>
            {hasBlocks ? (
              <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              }>
                <HomepagePreview
                  blocks={homepageData.blocks}
                  colors={homepageData.colors}
                  hackathonId={hackathonId}
                  isRTL={isRTL}
                  activeBlockId={activeBlockId}
                  onBlockClick={setActiveBlockId}
                  onBlockHover={setHoveredBlockId}
                  draggedBlockId={draggedBlockId}
                />
              </Suspense>
            ) : (
              <div className={cn(
                "h-full min-h-[400px] flex flex-col items-center justify-center p-8 transition-colors",
                isOver ? "bg-blue-50 dark:bg-blue-900/20" : "bg-slate-50 dark:bg-slate-900/50"
              )}>
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                  isOver ? "bg-blue-100 dark:bg-blue-800/30" : "bg-slate-100 dark:bg-slate-800"
                )}>
                  <Plus className={cn(
                    "w-10 h-10 transition-colors",
                    isOver ? "text-blue-600" : "text-slate-400"
                  )} />
                </div>
                <h3 className={cn(
                  "text-lg font-semibold mb-2 transition-colors",
                  isOver ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"
                )}>
                  {isOver 
                    ? (isRTL ? 'أفلت هنا!' : 'Drop here!')
                    : (isRTL ? 'ابدأ بناء صفحتك' : 'Start building your page')
                  }
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
                  {isRTL 
                    ? 'اسحب العناصر من الشريط الجانبي وأفلتها هنا'
                    : 'Drag blocks from the sidebar and drop them here'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

