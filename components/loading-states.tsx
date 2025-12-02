'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
        </div>
      </motion.div>
    </div>
  )
}

export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
  }
  
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className={cn(
          sizeClasses[size],
          "border-[#155DFC]/20 dark:border-[#155DFC]/30 border-t-[#155DFC] dark:border-t-[#155DFC] rounded-full relative"
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <div className="absolute inset-0 border-2 border-transparent border-t-[#1248C9]/40 dark:border-t-[#1248C9]/50 rounded-full animate-spin" 
             style={{ animationDuration: '1.2s' }} />
      </motion.div>
    </div>
  )
}

export function LoadingDots({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }
  
  return (
    <div className={cn("flex items-center justify-center gap-2 rtl:gap-reverse", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            sizeClasses[size],
            "bg-[#155DFC] dark:bg-[#155DFC] rounded-full"
          )}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Modern button loader component
export function ButtonLoader({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={cn("w-5 h-5 border-2 border-white/30 border-t-white rounded-full", className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
    />
  )
}

// Full page loader with modern design
export function PageLoader({ message, className = '' }: { message?: string; className?: string }) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative mb-6">
          <motion.div
            className="w-16 h-16 border-4 border-[#155DFC]/20 dark:border-[#155DFC]/30 border-t-[#155DFC] rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-8 h-8 bg-[#155DFC]/10 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
        {message && (
          <p className="text-slate-600 dark:text-slate-400 font-medium mb-4">
            {message}
          </p>
        )}
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#155DFC] rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
