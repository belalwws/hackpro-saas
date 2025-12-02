import { useState, useEffect, useCallback } from 'react'
import { useHistory } from '@/hooks/useHistory'
import { useToast } from '@/hooks/use-toast'
import { Block, BlockType, BLOCK_CONFIGS } from '@/components/page-builder/BlockTypes'
import { arrayMove } from '@dnd-kit/sortable'
import { DragStartEvent, DragEndEvent } from '@dnd-kit/core'

export interface HomepageData {
  hackathonId: string
  isEnabled: boolean
  blocks: Block[]
  subdomain?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
}

export type ViewportSize = 'desktop' | 'tablet' | 'mobile'

interface UseHomepageBuilderProps {
  hackathonId: string
  initialData?: HomepageData
}

export function useHomepageBuilder({ hackathonId, initialData }: UseHomepageBuilderProps) {
  const { toast } = useToast()
  
  const defaultData: HomepageData = {
    hackathonId,
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
  } = useHistory<HomepageData>(initialData || defaultData)

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null)
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const [activeDraggedItem, setActiveDraggedItem] = useState<{ type: 'block' | 'new'; block?: Block; blockType?: BlockType } | null>(null)
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop')
  const [previewMode, setPreviewMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaving, setAutoSaving] = useState(false)
  const [savedUrl, setSavedUrl] = useState<string | null>(null)
  const [showUrlModal, setShowUrlModal] = useState(false)

  // Auto-save logic
  useEffect(() => {
    if (!homepageData?.blocks?.length) return

    const autoSaveInterval = setInterval(async () => {
      setAutoSaving(true)
      try {
        const response = await fetch(`/api/admin/hackathons/${hackathonId}/homepage`, {
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
    }, 30000)

    return () => clearInterval(autoSaveInterval)
  }, [homepageData, hackathonId])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/hackathons/${hackathonId}/homepage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homepageData)
      })

      if (response.ok) {
        const data = await response.json()
        setLastSaved(new Date())
        if (data.url) {
          setSavedUrl(data.url)
          setShowUrlModal(true)
        }
        toast({
          title: 'Saved successfully!',
          variant: 'default',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error saving',
          description: error.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error saving homepage:', error)
      toast({
        title: 'Error saving',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddBlock = (type: BlockType, hackathonData?: any) => {
    const config = BLOCK_CONFIGS[type]
    const newBlock: Block = {
      id: `${type}-${Date.now()}`,
      type,
      enabled: true,
      order: homepageData.blocks.length,
      data: config.defaultData(hackathonData),
      styles: config.defaultStyles
    }
    
    setHomepageData({
      ...homepageData,
      blocks: [...homepageData.blocks, newBlock]
    })
    
    setActiveBlockId(newBlock.id)
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
    setHomepageData({
      ...homepageData,
      blocks: homepageData.blocks.filter(b => b.id !== blockId)
    })
    if (activeBlockId === blockId) {
      setActiveBlockId(null)
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
    
    if (active.id.toString().startsWith('new-block-')) {
      const blockType = active.id.toString().replace('new-block-', '') as BlockType
      setActiveDraggedItem({ type: 'new', blockType })
      return
    }

    const block = homepageData.blocks.find(b => b.id === active.id)
    if (block) {
      setActiveDraggedItem({ type: 'block', block })
      setDraggedBlockId(block.id)
    }
  }

  const handleDragEnd = (event: DragEndEvent, hackathonData?: any) => {
    const { active, over } = event
    
    setActiveDraggedItem(null)
    setDraggedBlockId(null)

    if (!over) return

    if (active.id.toString().startsWith('new-block-') && (over.id === 'canvas-drop-zone' || over.id === 'preview-drop-zone')) {
      const blockType = active.id.toString().replace('new-block-', '') as BlockType
      handleAddBlock(blockType, hackathonData)
      return
    }

    if (active.id !== over.id && homepageData?.blocks) {
      const oldIndex = homepageData.blocks.findIndex((b: Block) => b.id === active.id)
      const newIndex = homepageData.blocks.findIndex((b: Block) => b.id === over.id)
      
      if (oldIndex === -1 || newIndex === -1) return

      const newBlocks = arrayMove(homepageData.blocks, oldIndex, newIndex)
      const reorderedBlocks = newBlocks.map((block: Block, index: number) => ({
        ...block,
        order: index
      }))

      setHomepageData({ ...homepageData, blocks: reorderedBlocks })
    }
  }

  return {
    homepageData,
    setHomepageData,
    activeBlockId,
    setActiveBlockId,
    hoveredBlockId,
    setHoveredBlockId,
    draggedBlockId,
    activeDraggedItem,
    viewportSize,
    setViewportSize,
    previewMode,
    setPreviewMode,
    saving,
    lastSaved,
    autoSaving,
    savedUrl,
    showUrlModal,
    setShowUrlModal,
    undo,
    redo,
    canUndo,
    canRedo,
    handleSave,
    handleAddBlock,
    handleUpdateBlock,
    handleToggleBlock,
    handleMoveBlock,
    handleDeleteBlock,
    handleDuplicateBlock,
    handleColorChange,
    handleDragStart,
    handleDragEnd
  }
}
