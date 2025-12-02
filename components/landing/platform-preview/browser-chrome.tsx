'use client'

import { Lock, Shield, RefreshCw, ChevronLeft, ChevronRight, Star, Share2, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BrowserChromeProps {
  url?: string
  isRTL?: boolean
}

export function BrowserChrome({ url = 'app.hackpro.sa/dashboard', isRTL }: BrowserChromeProps) {
  return (
    <div className="bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-900/95 px-4 py-3 flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-700/80">
      {/* Window Controls */}
      <div className="flex gap-2 items-center">
        <motion.div 
          className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow-sm shadow-red-500/30 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
        <motion.div 
          className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm shadow-amber-500/30 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
        <motion.div 
          className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-sm shadow-green-500/30 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      </div>
      
      {/* Navigation Buttons */}
      <div className={cn("hidden sm:flex items-center gap-1", isRTL && "flex-row-reverse")}>
        <motion.button 
          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </motion.button>
        <motion.button 
          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </motion.button>
        <motion.button 
          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
        </motion.button>
      </div>
      
      {/* URL Bar */}
      <div className="flex-1 flex justify-center max-w-2xl mx-auto">
        <motion.div 
          className="w-full bg-white dark:bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-3 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-2">
            <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
              <Shield className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <Lock className="w-3 h-3 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 flex items-center gap-1.5">
            <span className="text-green-600 dark:text-green-400 font-medium text-xs">https://</span>
            <span className="font-mono text-sm text-slate-700 dark:text-slate-300 font-medium">{url}</span>
          </div>
          <motion.div 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
          >
            <Star className="w-4 h-4 text-slate-400 hover:text-amber-400 cursor-pointer transition-colors" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Right Actions */}
      <div className="hidden sm:flex items-center gap-1">
        <motion.button 
          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-4 h-4 text-slate-400" />
        </motion.button>
        <motion.button 
          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </motion.button>
      </div>
    </div>
  )
}
