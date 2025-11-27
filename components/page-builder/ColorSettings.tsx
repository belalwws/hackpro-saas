'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ColorSettingsProps {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  onColorChange: (key: string, value: string) => void
  isRTL: boolean
  language: 'ar' | 'en'
}

const colorLabels: Record<string, { ar: string; en: string }> = {
  primary: { ar: 'اللون الأساسي', en: 'Primary Color' },
  secondary: { ar: 'اللون الثانوي', en: 'Secondary Color' },
  accent: { ar: 'اللون المميز', en: 'Accent Color' },
  background: { ar: 'خلفية', en: 'Background' },
  text: { ar: 'نص', en: 'Text' }
}

export default function ColorSettings({
  colors,
  onColorChange,
  isRTL,
  language
}: ColorSettingsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className={cn("text-lg font-semibold mb-4 flex items-center gap-2", isRTL && "text-arabic")}>
          <Palette className="w-5 h-5" />
          {language === 'ar' ? 'الألوان' : 'Colors'}
        </h2>
        <div className="space-y-4">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key}>
              <Label className={cn("text-sm mb-2 block", isRTL && "text-arabic")}>
                {colorLabels[key][language]}
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={value}
                  onChange={(e) => onColorChange(key, e.target.value)}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => onColorChange(key, e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

