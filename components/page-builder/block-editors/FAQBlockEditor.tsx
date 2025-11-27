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

interface FAQBlockEditorProps {
  block: Block
  onUpdate: (data: Record<string, any>) => void
  isRTL: boolean
  language: 'ar' | 'en'
}

export default function FAQBlockEditor({ block, onUpdate, isRTL, language }: FAQBlockEditorProps) {
  const questions = block.data.questions || []

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    onUpdate({ questions: newQuestions })
  }

  const addQuestion = () => {
    onUpdate({ questions: [...questions, { question: '', answer: '' }] })
  }

  const removeQuestion = (index: number) => {
    onUpdate({ questions: questions.filter((_: any, i: number) => i !== index) })
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
            {language === 'ar' ? 'الأسئلة' : 'Questions'}
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addQuestion}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة سؤال' : 'Add Question'}
          </Button>
        </div>

        <div className="space-y-2">
          {questions.map((faq: any, index: number) => (
            <Card key={index} className="p-4">
              <Input
                value={faq.question || ''}
                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                placeholder={language === 'ar' ? 'السؤال' : 'Question'}
                className={cn("mb-2", isRTL && "text-arabic")}
              />
              <div className="flex gap-2">
                <Textarea
                  value={faq.answer || ''}
                  onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                  placeholder={language === 'ar' ? 'الإجابة' : 'Answer'}
                  rows={3}
                  className={cn("flex-1", isRTL && "text-arabic")}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(index)}
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

