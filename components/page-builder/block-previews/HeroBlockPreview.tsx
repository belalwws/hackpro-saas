'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Block } from '../BlockTypes'
import { cn } from '@/lib/utils'

interface HeroBlockPreviewProps {
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

export default function HeroBlockPreview({ block, colors, hackathonId, isRTL }: HeroBlockPreviewProps) {
  const backgroundStyle = block.data.backgroundImage
    ? {
        backgroundImage: `url(${block.data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : {
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      }

  return (
    <section
      className="relative min-h-[600px] flex items-center justify-center text-white"
      style={backgroundStyle}
    >
      {block.data.overlay && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className={cn(
          "text-5xl md:text-7xl font-bold mb-6",
          isRTL && "text-arabic"
        )}>
          {block.data.title}
        </h1>
        <p className={cn(
          "text-xl md:text-2xl mb-8 opacity-90",
          isRTL && "text-arabic"
        )}>
          {block.data.subtitle}
        </p>
        {block.data.ctaText && (
          <Button
            size="lg"
            onClick={() => window.open(block.data.ctaLink || `/hackathons/${hackathonId}/register-form`, '_blank')}
            className="px-8 py-6 text-lg"
            style={{ backgroundColor: colors.accent }}
          >
            {block.data.ctaText}
          </Button>
        )}
      </div>
    </section>
  )
}

