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

interface PrizesBlockEditorProps {
  block: Block
  onUpdate: (data: Record<string, any>) => void
  isRTL: boolean
  language: 'ar' | 'en'
}

export default function PrizesBlockEditor({ block, onUpdate, isRTL, language }: PrizesBlockEditorProps) {
  const prizes = block.data.prizes || []

  const updatePrize = (index: number, field: string, value: any) => {
    const newPrizes = [...prizes]
    newPrizes[index] = { ...newPrizes[index], [field]: value }
    onUpdate({ prizes: newPrizes })
  }

  const addPrize = () => {
    onUpdate({ prizes: [...prizes, { position: '', amount: '', currency: '', description: '' }] })
  }

  const removePrize = (index: number) => {
    onUpdate({ prizes: prizes.filter((_: any, i: number) => i !== index) })
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
            {language === 'ar' ? 'الجوائز' : 'Prizes'}
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addPrize}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة جائزة' : 'Add Prize'}
          </Button>
        </div>

        <div className="space-y-2">
          {prizes.map((prize: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <Input
                  value={prize.position || ''}
                  onChange={(e) => updatePrize(index, 'position', e.target.value)}
                  placeholder={language === 'ar' ? 'المركز' : 'Position'}
                  className={cn(isRTL && "text-arabic")}
                />
                <Input
                  value={prize.amount || ''}
                  onChange={(e) => updatePrize(index, 'amount', e.target.value)}
                  placeholder={language === 'ar' ? 'المبلغ' : 'Amount'}
                />
                <Input
                  value={prize.currency || ''}
                  onChange={(e) => updatePrize(index, 'currency', e.target.value)}
                  placeholder={language === 'ar' ? 'العملة' : 'Currency'}
                  className={cn(isRTL && "text-arabic")}
                />
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={prize.description || ''}
                  onChange={(e) => updatePrize(index, 'description', e.target.value)}
                  placeholder={language === 'ar' ? 'الوصف' : 'Description'}
                  rows={2}
                  className={cn("flex-1", isRTL && "text-arabic")}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePrize(index)}
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

