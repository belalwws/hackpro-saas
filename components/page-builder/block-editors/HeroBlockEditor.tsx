'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Block } from '../BlockTypes'

interface HeroBlockEditorProps {
  block: Block
  onUpdate: (data: Record<string, any>) => void
  isRTL: boolean
  language: 'ar' | 'en'
}

export default function HeroBlockEditor({ block, onUpdate, isRTL, language }: HeroBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className={cn(isRTL && "text-arabic")}>{language === 'ar' ? 'العنوان' : 'Title'}</Label>
        <Input
          value={block.data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder={language === 'ar' ? 'عنوان الهاكاثون' : 'Hackathon title'}
          className={cn(isRTL && "text-arabic")}
        />
      </div>

      <div>
        <Label className={cn(isRTL && "text-arabic")}>{language === 'ar' ? 'الوصف' : 'Subtitle'}</Label>
        <Textarea
          value={block.data.subtitle || ''}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          placeholder={language === 'ar' ? 'وصف الهاكاثون' : 'Hackathon description'}
          rows={3}
          className={cn(isRTL && "text-arabic")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={cn(isRTL && "text-arabic")}>{language === 'ar' ? 'نص الزر' : 'Button Text'}</Label>
          <Input
            value={block.data.ctaText || ''}
            onChange={(e) => onUpdate({ ctaText: e.target.value })}
            placeholder={language === 'ar' ? 'سجل الآن' : 'Register Now'}
            className={cn(isRTL && "text-arabic")}
          />
        </div>
        <div>
          <Label className={cn(isRTL && "text-arabic")}>{language === 'ar' ? 'رابط الزر' : 'Button Link'}</Label>
          <Input
            value={block.data.ctaLink || ''}
            onChange={(e) => onUpdate({ ctaLink: e.target.value })}
            placeholder="/hackathons/.../register-form"
          />
        </div>
      </div>

      <div>
        <Label className={cn(isRTL && "text-arabic")}>{language === 'ar' ? 'صورة الخلفية (URL)' : 'Background Image URL'}</Label>
        <Input
          value={block.data.backgroundImage || ''}
          onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className={cn(isRTL && "text-arabic")}>
          {language === 'ar' ? 'إضافة طبقة داكنة' : 'Add Dark Overlay'}
        </Label>
        <Switch
          checked={block.data.overlay ?? true}
          onCheckedChange={(checked) => onUpdate({ overlay: checked })}
        />
      </div>
    </div>
  )
}

