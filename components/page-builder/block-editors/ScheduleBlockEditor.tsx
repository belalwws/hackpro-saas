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

interface ScheduleBlockEditorProps {
  block: Block
  onUpdate: (data: Record<string, any>) => void
  isRTL: boolean
  language: 'ar' | 'en'
}

export default function ScheduleBlockEditor({ block, onUpdate, isRTL, language }: ScheduleBlockEditorProps) {
  const events = block.data.events || []

  const updateEvent = (index: number, field: string, value: any) => {
    const newEvents = [...events]
    newEvents[index] = { ...newEvents[index], [field]: value }
    onUpdate({ events: newEvents })
  }

  const addEvent = () => {
    onUpdate({ events: [...events, { date: new Date().toISOString(), time: '', title: '', description: '' }] })
  }

  const removeEvent = (index: number) => {
    onUpdate({ events: events.filter((_: any, i: number) => i !== index) })
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
            {language === 'ar' ? 'الأحداث' : 'Events'}
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addEvent}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة حدث' : 'Add Event'}
          </Button>
        </div>

        <div className="space-y-2">
          {events.map((event: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input
                  type="date"
                  value={event.date ? new Date(event.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateEvent(index, 'date', new Date(e.target.value).toISOString())}
                />
                <Input
                  type="time"
                  value={event.time || ''}
                  onChange={(e) => updateEvent(index, 'time', e.target.value)}
                />
              </div>
              <Input
                value={event.title || ''}
                onChange={(e) => updateEvent(index, 'title', e.target.value)}
                placeholder={language === 'ar' ? 'عنوان الحدث' : 'Event title'}
                className={cn("mb-2", isRTL && "text-arabic")}
              />
              <div className="flex gap-2">
                <Textarea
                  value={event.description || ''}
                  onChange={(e) => updateEvent(index, 'description', e.target.value)}
                  placeholder={language === 'ar' ? 'وصف الحدث' : 'Event description'}
                  rows={2}
                  className={cn("flex-1", isRTL && "text-arabic")}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEvent(index)}
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

