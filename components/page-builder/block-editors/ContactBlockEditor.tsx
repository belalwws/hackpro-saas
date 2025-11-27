'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Block } from '../BlockTypes'

interface ContactBlockEditorProps {
  block: Block
  onUpdate: (data: Record<string, any>) => void
  isRTL: boolean
  language: 'ar' | 'en'
}

export default function ContactBlockEditor({ block, onUpdate, isRTL, language }: ContactBlockEditorProps) {
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={cn(isRTL && "text-arabic")}>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
          <Input
            type="email"
            value={block.data.email || ''}
            onChange={(e) => onUpdate({ email: e.target.value })}
          />
        </div>
        <div>
          <Label className={cn(isRTL && "text-arabic")}>{language === 'ar' ? 'الهاتف' : 'Phone'}</Label>
          <Input
            value={block.data.phone || ''}
            onChange={(e) => onUpdate({ phone: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label className={cn(isRTL && "text-arabic")}>{language === 'ar' ? 'العنوان' : 'Address'}</Label>
        <Textarea
          value={block.data.address || ''}
          onChange={(e) => onUpdate({ address: e.target.value })}
          rows={2}
          className={cn(isRTL && "text-arabic")}
        />
      </div>
    </div>
  )
}

