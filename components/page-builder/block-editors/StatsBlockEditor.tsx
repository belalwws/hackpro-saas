'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Block } from '../BlockTypes'

interface StatsBlockEditorProps {
  block: Block
  onUpdate: (data: Record<string, any>) => void
  isRTL: boolean
  language: 'ar' | 'en'
}

export default function StatsBlockEditor({ block, onUpdate, isRTL, language }: StatsBlockEditorProps) {
  const stats = block.data.stats || []

  const updateStat = (index: number, field: string, value: any) => {
    const newStats = [...stats]
    newStats[index] = { ...newStats[index], [field]: value }
    onUpdate({ stats: newStats })
  }

  const addStat = () => {
    onUpdate({ stats: [...stats, { number: '', label: '' }] })
  }

  const removeStat = (index: number) => {
    onUpdate({ stats: stats.filter((_: any, i: number) => i !== index) })
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
        <div className="flex items-center justify-between mb-2">
          <Label className={cn(isRTL && "text-arabic")}>
            {language === 'ar' ? 'الإحصائيات' : 'Statistics'}
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addStat}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة إحصائية' : 'Add Statistic'}
          </Button>
        </div>

        <div className="space-y-2">
          {stats.map((stat: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex gap-2">
                <Input
                  value={stat.number || ''}
                  onChange={(e) => updateStat(index, 'number', e.target.value)}
                  placeholder={language === 'ar' ? 'الرقم' : 'Number'}
                  className="flex-1"
                />
                <Input
                  value={stat.label || ''}
                  onChange={(e) => updateStat(index, 'label', e.target.value)}
                  placeholder={language === 'ar' ? 'التسمية' : 'Label'}
                  className={cn("flex-1", isRTL && "text-arabic")}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStat(index)}
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

