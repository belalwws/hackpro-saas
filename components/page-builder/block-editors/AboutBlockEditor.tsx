'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Block } from '../BlockTypes'

interface AboutBlockEditorProps {
  block: Block
  onUpdate: (data: Record<string, any>) => void
  isRTL: boolean
  language: 'ar' | 'en'
}

export default function AboutBlockEditor({ block, onUpdate, isRTL, language }: AboutBlockEditorProps) {
  const features = block.data.features || []

  const updateFeature = (index: number, field: string, value: any) => {
    const newFeatures = [...features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    onUpdate({ features: newFeatures })
  }

  const addFeature = () => {
    onUpdate({ features: [...features, { icon: '✨', title: '', description: '' }] })
  }

  const removeFeature = (index: number) => {
    onUpdate({ features: features.filter((_: any, i: number) => i !== index) })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className={cn(isRTL && "text-arabic")}>{language === 'ar' ? 'العنوان' : 'Title'}</Label>
        <Input
          value={block.data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className={cn(isRTL && "text-arabic")}
        />
      </div>

      <div>
        <Label className={cn(isRTL && "text-arabic")}>{language === 'ar' ? 'الوصف' : 'Description'}</Label>
        <Textarea
          value={block.data.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={5}
          className={cn(isRTL && "text-arabic")}
        />
      </div>

      <div>
        <Label className={cn(isRTL && "text-arabic")}>{language === 'ar' ? 'صورة (URL)' : 'Image URL'}</Label>
        <Input
          value={block.data.image || ''}
          onChange={(e) => onUpdate({ image: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className={cn(isRTL && "text-arabic")}>
            {language === 'ar' ? 'المميزات' : 'Features'}
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addFeature}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة' : 'Add'}
          </Button>
        </div>

        <div className="space-y-2">
          {features.map((feature: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-2">
                <Input
                  value={feature.icon || ''}
                  onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                  placeholder="✨"
                  className="w-20"
                />
                <div className="flex-1 space-y-2">
                  <Input
                    value={feature.title || ''}
                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                    placeholder={language === 'ar' ? 'عنوان الميزة' : 'Feature title'}
                    className={cn(isRTL && "text-arabic")}
                  />
                  <Textarea
                    value={feature.description || ''}
                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                    placeholder={language === 'ar' ? 'وصف الميزة' : 'Feature description'}
                    rows={2}
                    className={cn(isRTL && "text-arabic")}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

