'use client'

import { Rocket, X } from 'lucide-react'

interface CreateModalProps {
  isOpen: boolean
  onClose: () => void
  isRTL?: boolean
}

export function CreateModal({ isOpen, onClose, isRTL = false }: CreateModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Rocket className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold">
              {isRTL ? 'أنشئ هاكاثون جديد' : 'Create Hackathon'}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {isRTL ? 'ابدأ الآن' : 'Start your journey'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {isRTL ? 'اسم الهاكاثون' : 'Hackathon Name'}
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder={isRTL ? "مثال: هاكاثون الابتكار" : "e.g. Innovation Hackathon"}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {isRTL ? 'تاريخ البدء' : 'Start Date'}
              </label>
              <input 
                type="date" 
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {isRTL ? 'المشاركين' : 'Participants'}
              </label>
              <input 
                type="number" 
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="100"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            {isRTL ? 'إنشاء' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}
