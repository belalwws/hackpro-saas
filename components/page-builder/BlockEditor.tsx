'use client'

import React, { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Block, BLOCK_CONFIGS } from './BlockTypes'
import HeroBlockEditor from './block-editors/HeroBlockEditor'
import AboutBlockEditor from './block-editors/AboutBlockEditor'
import ScheduleBlockEditor from './block-editors/ScheduleBlockEditor'
import PrizesBlockEditor from './block-editors/PrizesBlockEditor'
import FAQBlockEditor from './block-editors/FAQBlockEditor'
import ContactBlockEditor from './block-editors/ContactBlockEditor'
import StatsBlockEditor from './block-editors/StatsBlockEditor'

interface BlockEditorProps {
  block: Block | null
  hackathon: any
  onUpdate: (data: Record<string, any>) => void
  onToggle: () => void
  isRTL: boolean
  language: 'ar' | 'en'
}

function BlockEditor({
  block,
  hackathon,
  onUpdate,
  onToggle,
  isRTL,
  language
}: BlockEditorProps) {
  if (!block) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4 text-6xl">📝</div>
          <h3 className={cn("text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2", isRTL && "text-arabic")}>
            {language === 'ar' ? 'اختر قسم للتعديل' : 'Select a section to edit'}
          </h3>
          <p className={cn("text-gray-500 dark:text-gray-500", isRTL && "text-arabic")}>
            {language === 'ar' 
              ? 'انقر على قسم من القائمة الجانبية لبدء التعديل' 
              : 'Click on a section from the sidebar to start editing'}
          </p>
        </CardContent>
      </Card>
    )
  }

  const config = BLOCK_CONFIGS[block.type]

  const renderEditor = () => {
    switch (block.type) {
      case 'hero':
        return <HeroBlockEditor block={block} onUpdate={onUpdate} isRTL={isRTL} language={language} />
      case 'about':
        return <AboutBlockEditor block={block} onUpdate={onUpdate} isRTL={isRTL} language={language} />
      case 'schedule':
        return <ScheduleBlockEditor block={block} onUpdate={onUpdate} isRTL={isRTL} language={language} />
      case 'prizes':
        return <PrizesBlockEditor block={block} onUpdate={onUpdate} isRTL={isRTL} language={language} />
      case 'faq':
        return <FAQBlockEditor block={block} onUpdate={onUpdate} isRTL={isRTL} language={language} />
      case 'contact':
        return <ContactBlockEditor block={block} onUpdate={onUpdate} isRTL={isRTL} language={language} />
      case 'stats':
        return <StatsBlockEditor block={block} onUpdate={onUpdate} isRTL={isRTL} language={language} />
      case 'testimonials':
      case 'features':
      case 'gallery':
      case 'countdown':
      case 'sponsors':
      case 'timeline':
      case 'pricing':
      case 'cta':
        // Placeholder editors for missing blocks
        return (
          <div className={cn("text-center py-8 text-gray-500", isRTL && "text-arabic")}>
            <p className="mb-4">{language === 'ar' ? 'محرر هذا القسم قيد التطوير' : 'Editor for this section is under development'}</p>
            <div className="space-y-2">
              <Label className={cn(isRTL && "text-arabic")}>
                {language === 'ar' ? 'العنوان' : 'Title'}
              </Label>
              <Input
                value={block.data?.title || ''}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder={language === 'ar' ? 'أدخل العنوان' : 'Enter title'}
              />
            </div>
          </div>
        )
      default:
        return (
          <div className={cn("text-center py-8 text-gray-500", isRTL && "text-arabic")}>
            {language === 'ar' ? 'محرر غير متاح لهذا النوع' : 'Editor not available for this type'}
          </div>
        )
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{config.icon}</div>
            <div>
              <h2 className={cn("text-xl font-semibold", isRTL && "text-arabic")}>
                {config.name[language]}
              </h2>
              <p className={cn("text-sm text-gray-500", isRTL && "text-arabic")}>
                {language === 'ar' ? 'تعديل القسم' : 'Edit Section'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className={cn("text-sm", isRTL && "text-arabic")}>
              {language === 'ar' ? 'مفعل' : 'Enabled'}
            </Label>
            <Switch
              checked={block.enabled}
              onCheckedChange={onToggle}
            />
          </div>
        </div>

        {renderEditor()}
      </CardContent>
    </Card>
  )
}

export default memo(BlockEditor)

