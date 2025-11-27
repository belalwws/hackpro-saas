'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Block } from '../BlockTypes'
import { cn } from '@/lib/utils'

interface ContactBlockPreviewProps {
  block: Block
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  hackathonId: string
  isRTL: boolean
}

export default function ContactBlockPreview({ block, colors, hackathonId, isRTL }: ContactBlockPreviewProps) {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto">
        <h2 className={cn(
          "text-4xl font-bold text-center mb-12",
          isRTL && "text-arabic"
        )} style={{ color: colors.text }}>
          {block.data.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {block.data.email && (
            <Card className="p-6 text-center">
              <Mail className="w-8 h-8 mx-auto mb-2" style={{ color: colors.primary }} />
              <p className={cn("font-semibold", isRTL && "text-arabic")} style={{ color: colors.text }}>
                {block.data.email}
              </p>
            </Card>
          )}
          {block.data.phone && (
            <Card className="p-6 text-center">
              <Phone className="w-8 h-8 mx-auto mb-2" style={{ color: colors.primary }} />
              <p className={cn("font-semibold", isRTL && "text-arabic")} style={{ color: colors.text }}>
                {block.data.phone}
              </p>
            </Card>
          )}
          {block.data.address && (
            <Card className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: colors.primary }} />
              <p className={cn("font-semibold", isRTL && "text-arabic")} style={{ color: colors.text }}>
                {block.data.address}
              </p>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}

