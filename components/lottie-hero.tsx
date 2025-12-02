'use client'

import { motion } from 'framer-motion'
import { Users, Trophy, Rocket, Code, Zap, BarChart3, Award, Calendar } from 'lucide-react'

export function LottieHero() {
  return (
    <div className="relative w-full max-w-lg mx-auto p-4">
      {/* Enhanced Glow effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#155DFC]/30 to-[#1248C9]/30 rounded-3xl blur-3xl" />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-br from-[#155DFC]/20 to-[#1248C9]/20 rounded-3xl blur-2xl"
      />
      <motion.div 
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -inset-4 bg-gradient-to-br from-[#155DFC]/15 to-[#1248C9]/15 rounded-3xl blur-3xl"
      />
      
      {/* Main Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-sm"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)' 
        }}
      >
        {/* Browser Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 h-6 bg-slate-200 dark:bg-slate-700 rounded-md mx-4 flex items-center px-3">
            <span className="text-xs text-slate-400">hackpro.app/dashboard</span>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="p-5">
          {/* Welcome header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-slate-500 dark:text-slate-400"
              >
                لوحة التحكم
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                مرحباً! 👋
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="w-10 h-10 bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-xl flex items-center justify-center"
            >
              <Rocket className="w-5 h-5 text-white" />
            </motion.div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: Users, color: 'from-blue-500 to-blue-600', value: '2,547', label: 'مشارك' },
              { icon: Trophy, color: 'from-yellow-500 to-orange-500', value: '156', label: 'هاكاثون' },
              { icon: Award, color: 'from-[#155DFC] to-[#1248C9]', value: '89', label: 'فائز' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center"
              >
                <div className={`w-9 h-9 bg-gradient-to-br ${stat.color} rounded-lg mx-auto mb-2 flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          
          {/* Active Hackathon Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-xl p-4 text-white mb-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">هاكاثون نشط</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">مباشر</span>
            </div>
            <div className="font-bold mb-2">هاكاثون الابتكار 2024</div>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" /> 234
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> 3 أيام
              </div>
            </div>
          </motion.div>
          
          {/* Progress bars */}
          <div className="space-y-3">
            {[
              { label: 'التسجيلات', width: '78%', color: 'bg-blue-500' },
              { label: 'المشاريع', width: '45%', color: 'bg-[#155DFC]' },
            ].map((bar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{bar.label}</span>
                  <span className="text-slate-900 dark:text-white font-medium">{bar.width}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: bar.width }}
                    transition={{ delay: 0.9 + i * 0.1, duration: 0.8 }}
                    className={`h-full ${bar.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="absolute -top-3 -right-3"
      >
        {/* Glow behind Live badge */}
        <div className="absolute inset-0 bg-green-500/40 rounded-full blur-lg scale-150" />
        <motion.div
          animate={{ y: [-3, 3] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="relative bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-1"
          style={{ boxShadow: '0 10px 25px rgba(34, 197, 94, 0.5)' }}
        >
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          Live
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="absolute -bottom-3 -left-3"
      >
        {/* Glow behind +24% badge */}
        <div className="absolute inset-0 bg-blue-600/40 rounded-full blur-lg scale-150" />
        <motion.div
          animate={{ y: [3, -3] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
          className="relative bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-1"
          style={{ boxShadow: '0 10px 25px rgba(37, 99, 235, 0.5)' }}
        >
          <BarChart3 className="w-3 h-3" />
          +24%
        </motion.div>
      </motion.div>
    </div>
  )
}
