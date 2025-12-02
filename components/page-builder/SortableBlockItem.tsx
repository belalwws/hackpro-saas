import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GripVertical, ChevronUp, ChevronDown, Copy, Trash2 } from 'lucide-react'
import { Block, BlockType, BLOCK_CONFIGS } from './BlockTypes'

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

export default function SortableBlockItem({
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
                className="group flex flex-col items-center justify-center p-3 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing aspect-square"
            >
                <div className="text-2xl mb-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                    {blockConfig.icon}
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {blockConfig.name[language]}
                </div>
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative border rounded-lg transition-all duration-200 overflow-hidden",
                isActive
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-800",
                !block?.enabled && "opacity-60 grayscale",
                isDragging && "opacity-50 shadow-lg scale-105 z-50"
            )}
            onClick={onSelect}
        >
            <div className="flex items-center h-10">
                <div
                    {...attributes}
                    {...listeners}
                    className={cn(
                        "w-8 h-full flex items-center justify-center cursor-grab active:cursor-grabbing border-r border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600",
                        isRTL && "border-r-0 border-l"
                    )}
                >
                    <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 px-3 min-w-0 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-slate-400">
                            {blockConfig.icon}
                        </span>
                        <span className={cn("text-xs font-medium text-slate-700 dark:text-slate-200 truncate", isRTL && "text-arabic")}>
                            {blockConfig.name[language]}
                        </span>
                    </div>
                    
                    {!block?.enabled && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {isRTL ? 'مخفي' : 'Hidden'}
                        </span>
                    )}
                </div>

                <div className={cn(
                    "flex items-center h-full px-1 gap-0.5 transition-opacity border-l border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    isRTL && "border-l-0 border-r"
                )}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDuplicate?.()
                        }}
                        title={isRTL ? 'نسخ' : 'Duplicate'}
                    >
                        <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete?.()
                        }}
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

