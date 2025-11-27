'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Download, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Block } from './BlockTypes'

interface Template {
  id: string
  name: { ar: string; en: string } | string
  description: { ar: string; en: string } | string
  thumbnail?: string
  blocks: Block[]
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
}

interface TemplatesPanelProps {
  onSelectTemplate: (template: Template) => void
  onSaveAsTemplate: (name: string, description: string) => void
  currentBlocks: Block[]
  currentColors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  isRTL: boolean
  language: 'ar' | 'en'
}

const defaultTemplates: Template[] = [
  {
    id: 'landing-page',
    name: { ar: 'صفحة هبوط', en: 'Landing Page' },
    description: { ar: 'صفحة هبوط احترافية مع جميع الأقسام الأساسية', en: 'Professional landing page with all essential sections' },
    blocks: [],
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1f2937'
    }
  },
  {
    id: 'event-page',
    name: { ar: 'صفحة حدث', en: 'Event Page' },
    description: { ar: 'صفحة مخصصة للفعاليات والهاكاثونات', en: 'Page designed for events and hackathons' },
    blocks: [],
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937'
    }
  },
  {
    id: 'minimal',
    name: { ar: 'تصميم بسيط', en: 'Minimal Design' },
    description: { ar: 'تصميم بسيط وأنيق', en: 'Simple and elegant design' },
    blocks: [],
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#000000',
      background: '#ffffff',
      text: '#000000'
    }
  }
]

export default function TemplatesPanel({
  onSelectTemplate,
  onSaveAsTemplate,
  currentBlocks,
  currentColors,
  isRTL,
  language
}: TemplatesPanelProps) {
  const [showSaveDialog, setShowSaveDialog] = React.useState(false)
  const [templateName, setTemplateName] = React.useState('')
  const [templateDescription, setTemplateDescription] = React.useState('')

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return
    onSaveAsTemplate(templateName, templateDescription)
    setShowSaveDialog(false)
    setTemplateName('')
    setTemplateDescription('')
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className={cn("text-sm", isRTL && "text-arabic")}>
            {isRTL ? 'حفظ كقالب' : 'Save as Template'}
          </CardTitle>
          <CardDescription className={cn(isRTL && "text-arabic")}>
            {isRTL ? 'احفظ التصميم الحالي كقالب للاستخدام لاحقاً' : 'Save current design as a template for later use'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showSaveDialog ? (
            <Button
              onClick={() => setShowSaveDialog(true)}
              className="w-full"
              variant="outline"
            >
              <Save className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
              {isRTL ? 'حفظ كقالب' : 'Save as Template'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className={cn(isRTL && "text-arabic")}>
                  {isRTL ? 'اسم القالب' : 'Template Name'}
                </Label>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder={isRTL ? 'أدخل اسم القالب' : 'Enter template name'}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className={cn(isRTL && "text-arabic")}>
                  {isRTL ? 'الوصف' : 'Description'}
                </Label>
                <Input
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder={isRTL ? 'أدخل وصف القالب' : 'Enter template description'}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveTemplate}
                  className="flex-1"
                  disabled={!templateName.trim()}
                >
                  {isRTL ? 'حفظ' : 'Save'}
                </Button>
                <Button
                  onClick={() => {
                    setShowSaveDialog(false)
                    setTemplateName('')
                    setTemplateDescription('')
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={cn("text-sm", isRTL && "text-arabic")}>
            {isRTL ? 'القوالب الجاهزة' : 'Pre-built Templates'}
          </CardTitle>
          <CardDescription className={cn(isRTL && "text-arabic")}>
            {isRTL ? 'اختر قالباً جاهزاً للبدء' : 'Choose a pre-built template to start'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {defaultTemplates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              className="w-full justify-start h-auto p-4"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="text-left flex-1">
                <div className={cn("font-medium mb-1", isRTL && "text-arabic")}>
                  {typeof template.name === 'object' ? template.name[language] : template.name}
                </div>
                <div className={cn("text-xs text-gray-500", isRTL && "text-arabic")}>
                  {typeof template.description === 'object' ? template.description[language] : template.description}
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

