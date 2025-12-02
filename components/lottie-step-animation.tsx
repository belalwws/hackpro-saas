'use client'

import { motion } from 'framer-motion'
import { Rocket, Users, UsersRound, Star, Trophy, Plus, UserPlus, Settings, BarChart3, Award } from 'lucide-react'

// Step illustrations with icons and colors
const STEP_CONFIG = [
  {
    icon: Rocket,
    secondaryIcon: Plus,
    color: 'from-blue-500 to-indigo-600',
    glowColor: 'blue',
    label: 'إنشاء',
  },
  {
    icon: UserPlus,
    secondaryIcon: Users,
    color: 'from-purple-500 to-pink-600',
    glowColor: 'purple',
    label: 'تسجيل',
  },
  {
    icon: UsersRound,
    secondaryIcon: Settings,
    color: 'from-green-500 to-emerald-600',
    glowColor: 'green',
    label: 'فرق',
  },
  {
    icon: Star,
    secondaryIcon: BarChart3,
    color: 'from-yellow-500 to-orange-500',
    glowColor: 'yellow',
    label: 'تقييم',
  },
  {
    icon: Trophy,
    secondaryIcon: Award,
    color: 'from-orange-500 to-red-500',
    glowColor: 'orange',
    label: 'نتائج',
  },
]

export function LottieStepAnimation({ stepIndex }: { stepIndex: number }) {
  const config = STEP_CONFIG[stepIndex] || STEP_CONFIG[0]
  const Icon = config.icon
  const SecondaryIcon = config.secondaryIcon

  return (
    <div className="w-full h-64 md:h-72 lg:h-80 flex items-center justify-center">
      <div className="relative">
        {/* Glow effect behind */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${config.color} rounded-full blur-3xl opacity-40 scale-150`}
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`absolute inset-0 bg-gradient-to-br ${config.color} rounded-full blur-2xl opacity-30 scale-125`}
        />
        
        {/* Main container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative"
        >
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-dashed opacity-30`}
            style={{ borderColor: config.glowColor === 'blue' ? '#3b82f6' : config.glowColor === 'purple' ? '#a855f7' : config.glowColor === 'green' ? '#22c55e' : config.glowColor === 'yellow' ? '#eab308' : '#f97316' }}
          />
          
          {/* Main circle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`absolute inset-4 md:inset-5 bg-gradient-to-br ${config.color} rounded-full shadow-2xl flex items-center justify-center`}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Icon className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg" />
            </motion.div>
          </motion.div>
          
          {/* Floating secondary icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring" }}
            animate={{ y: [-5, 5] }}
            className="absolute -top-2 -right-2 md:-top-3 md:-right-3"
          >
            <div className={`w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-slate-800 rounded-xl shadow-xl flex items-center justify-center`}>
              <SecondaryIcon className={`w-6 h-6 md:w-7 md:h-7`} style={{ color: config.glowColor === 'blue' ? '#3b82f6' : config.glowColor === 'purple' ? '#a855f7' : config.glowColor === 'green' ? '#22c55e' : config.glowColor === 'yellow' ? '#eab308' : '#f97316' }} />
            </div>
          </motion.div>
          
          {/* Floating particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1],
                y: [-10, -30],
                x: [0, (i - 1) * 20]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.3
              }}
              className={`absolute bottom-0 left-1/2 w-2 h-2 rounded-full`}
              style={{ 
                backgroundColor: config.glowColor === 'blue' ? '#3b82f6' : config.glowColor === 'purple' ? '#a855f7' : config.glowColor === 'green' ? '#22c55e' : config.glowColor === 'yellow' ? '#eab308' : '#f97316',
                marginLeft: (i - 1) * 15
              }}
            />
          ))}
        </motion.div>
        
        {/* Step label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2"
        >
          <span className={`px-4 py-1.5 bg-gradient-to-r ${config.color} text-white text-sm font-bold rounded-full shadow-lg`}>
            {config.label}
          </span>
        </motion.div>
      </div>
    </div>
  )
}
