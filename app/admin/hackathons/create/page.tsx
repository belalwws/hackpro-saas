"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Trophy, Users, FileText, Settings, Sparkles, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { cn } from '@/lib/utils'

export default function CreateHackathonPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isRTL = language === 'ar'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxParticipants: '',
    status: 'draft',
    prizes: {
      first: '',
      second: '',
      third: ''
    },
    requirements: [''],
    categories: [''],
    settings: {
      maxTeamSize: 4,
      allowIndividualParticipation: true,
      autoTeaming: false
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Clean up empty requirements and categories
      const cleanedData = {
        ...formData,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        categories: formData.categories.filter(cat => cat.trim() !== ''),
        settings: {
          ...formData.settings,
          evaluationCriteria: [
            { name: 'الابتكار', weight: 0.2 },
            { name: 'الأثر التقني', weight: 0.25 },
            { name: 'قابلية التنفيذ', weight: 0.25 },
            { name: 'العرض التقديمي', weight: 0.2 },
            { name: 'العمل الجماعي', weight: 0.1 },
          ]
        }
      }

      const response = await fetch('/api/admin/hackathons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to the new hackathon's homepage builder
        if (data.hackathon?.id) {
          router.push(`/admin/hackathons/${data.hackathon.id}/homepage-builder`)
        } else {
          router.push('/admin/hackathons')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || (isRTL ? 'حدث خطأ في إنشاء الهاكاثون' : 'Error creating hackathon'))
        setTimeout(() => setError(null), 5000)
      }
    } catch (error) {
      console.error('Error creating hackathon:', error)
      setError(isRTL ? 'حدث خطأ في إنشاء الهاكاثون' : 'Error creating hackathon')
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    })
  }

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData({
      ...formData,
      requirements: newRequirements
    })
  }

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    })
  }

  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [...formData.categories, '']
    })
  }

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...formData.categories]
    newCategories[index] = value
    setFormData({
      ...formData,
      categories: newCategories
    })
  }

  const removeCategory = (index: number) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/admin/hackathons">
            <Button variant="outline" size="sm">
              <ArrowLeft className={cn("w-4 h-4", isRTL ? "mr-2" : "ml-2")} />
              {isRTL ? 'العودة' : 'Back'}
            </Button>
          </Link>
          <div>
            <h1 className={cn("text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", isRTL && "text-arabic")}>
              {isRTL ? 'إنشاء هاكاثون جديد' : 'Create New Hackathon'}
            </h1>
            <p className={cn("text-gray-600 dark:text-gray-400 text-lg mt-1", isRTL && "text-arabic")}>
              {isRTL ? 'إعداد هاكاثون جديد للمشاركين' : 'Set up a new hackathon for participants'}
            </p>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className={cn("text-red-600 dark:text-red-400", isRTL && "text-arabic")}>{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-t-lg">
                <CardTitle className={cn("flex items-center gap-2 text-indigo-700 dark:text-indigo-300", isRTL && "text-arabic")}>
                  <FileText className="w-5 h-5" />
                  {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
                </CardTitle>
                <CardDescription className={cn(isRTL && "text-arabic")}>
                  {isRTL ? 'معلومات عامة عن الهاكاثون' : 'General information about the hackathon'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <Label htmlFor="title" className={cn(isRTL && "text-arabic")}>
                    {isRTL ? 'عنوان الهاكاثون' : 'Hackathon Title'} *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder={isRTL ? 'مثال: هاكاثون الذكاء الاصطناعي' : 'Example: AI Hackathon'}
                    required
                    className={cn("mt-2", isRTL && "text-arabic")}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className={cn(isRTL && "text-arabic")}>
                    {isRTL ? 'وصف الهاكاثون' : 'Description'} *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder={isRTL ? 'وصف مفصل عن الهاكاثون وأهدافه...' : 'Detailed description about the hackathon and its goals...'}
                    rows={4}
                    required
                    className={cn("mt-2", isRTL && "text-arabic")}
                  />
                </div>

                <div>
                  <Label htmlFor="status" className={cn(isRTL && "text-arabic")}>
                    {isRTL ? 'حالة الهاكاثون' : 'Status'}
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{isRTL ? 'مسودة' : 'Draft'}</SelectItem>
                      <SelectItem value="open">{isRTL ? 'مفتوح للتسجيل' : 'Open for Registration'}</SelectItem>
                      <SelectItem value="closed">{isRTL ? 'مغلق' : 'Closed'}</SelectItem>
                      <SelectItem value="completed">{isRTL ? 'مكتمل' : 'Completed'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dates and Limits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-t-lg">
                <CardTitle className={cn("flex items-center gap-2 text-blue-700 dark:text-blue-300", isRTL && "text-arabic")}>
                  <Calendar className="w-5 h-5" />
                  {isRTL ? 'التواريخ والحدود' : 'Dates & Limits'}
                </CardTitle>
                <CardDescription className={cn(isRTL && "text-arabic")}>
                  {isRTL ? 'تواريخ الهاكاثون وحدود المشاركة' : 'Hackathon dates and participation limits'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="registrationDeadline" className={cn(isRTL && "text-arabic")}>
                      {isRTL ? 'انتهاء التسجيل' : 'Registration Deadline'} *
                    </Label>
                    <Input
                      id="registrationDeadline"
                      type="datetime-local"
                      value={formData.registrationDeadline}
                      onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="startDate" className={cn(isRTL && "text-arabic")}>
                      {isRTL ? 'تاريخ البداية' : 'Start Date'} *
                    </Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate" className={cn(isRTL && "text-arabic")}>
                      {isRTL ? 'تاريخ النهاية' : 'End Date'} *
                    </Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxParticipants" className={cn(isRTL && "text-arabic")}>
                    {isRTL ? 'الحد الأقصى للمشاركين' : 'Max Participants'}
                  </Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                    placeholder={isRTL ? 'اتركه فارغاً لعدم وضع حد أقصى' : 'Leave empty for no limit'}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prizes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-t-lg">
                <CardTitle className={cn("flex items-center gap-2 text-yellow-700 dark:text-yellow-300", isRTL && "text-arabic")}>
                  <Trophy className="w-5 h-5" />
                  {isRTL ? 'الجوائز' : 'Prizes'}
                </CardTitle>
                <CardDescription className={cn(isRTL && "text-arabic")}>
                  {isRTL ? 'جوائز الهاكاثون' : 'Hackathon prizes'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="firstPrize" className={cn(isRTL && "text-arabic")}>
                      {isRTL ? 'الجائزة الأولى' : 'First Prize'}
                    </Label>
                    <Input
                      id="firstPrize"
                      value={formData.prizes.first}
                      onChange={(e) => setFormData({
                        ...formData,
                        prizes: {...formData.prizes, first: e.target.value}
                      })}
                      placeholder={isRTL ? 'مثال: 50,000 ريال' : 'Example: $5,000'}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="secondPrize" className={cn(isRTL && "text-arabic")}>
                      {isRTL ? 'الجائزة الثانية' : 'Second Prize'}
                    </Label>
                    <Input
                      id="secondPrize"
                      value={formData.prizes.second}
                      onChange={(e) => setFormData({
                        ...formData,
                        prizes: {...formData.prizes, second: e.target.value}
                      })}
                      placeholder={isRTL ? 'مثال: 30,000 ريال' : 'Example: $3,000'}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="thirdPrize" className={cn(isRTL && "text-arabic")}>
                      {isRTL ? 'الجائزة الثالثة' : 'Third Prize'}
                    </Label>
                    <Input
                      id="thirdPrize"
                      value={formData.prizes.third}
                      onChange={(e) => setFormData({
                        ...formData,
                        prizes: {...formData.prizes, third: e.target.value}
                      })}
                      placeholder={isRTL ? 'مثال: 20,000 ريال' : 'Example: $2,000'}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Requirements & Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-t-lg">
                <CardTitle className={cn("flex items-center gap-2 text-purple-700 dark:text-purple-300", isRTL && "text-arabic")}>
                  <FileText className="w-5 h-5" />
                  {isRTL ? 'المتطلبات' : 'Requirements'}
                </CardTitle>
                <CardDescription className={cn(isRTL && "text-arabic")}>
                  {isRTL ? 'متطلبات المشاركة في الهاكاثون' : 'Participation requirements'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder={isRTL ? `متطلب ${index + 1}` : `Requirement ${index + 1}`}
                      className={cn(isRTL && "text-arabic")}
                    />
                    {formData.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRequirement(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRequirement}
                  className="w-full"
                >
                  <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                  {isRTL ? 'إضافة متطلب' : 'Add Requirement'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950 rounded-t-lg">
                <CardTitle className={cn("flex items-center gap-2 text-rose-700 dark:text-rose-300", isRTL && "text-arabic")}>
                  <Sparkles className="w-5 h-5" />
                  {isRTL ? 'الفئات' : 'Categories'}
                </CardTitle>
                <CardDescription className={cn(isRTL && "text-arabic")}>
                  {isRTL ? 'فئات الهاكاثون' : 'Hackathon categories'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {formData.categories.map((cat, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={cat}
                      onChange={(e) => updateCategory(index, e.target.value)}
                      placeholder={isRTL ? `فئة ${index + 1}` : `Category ${index + 1}`}
                      className={cn(isRTL && "text-arabic")}
                    />
                    {formData.categories.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeCategory(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCategory}
                  className="w-full"
                >
                  <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                  {isRTL ? 'إضافة فئة' : 'Add Category'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-t-lg">
                <CardTitle className={cn("flex items-center gap-2 text-green-700 dark:text-green-300", isRTL && "text-arabic")}>
                  <Users className="w-5 h-5" />
                  {isRTL ? 'إعدادات الفرق' : 'Team Settings'}
                </CardTitle>
                <CardDescription className={cn(isRTL && "text-arabic")}>
                  {isRTL ? 'إعدادات تكوين الفرق والتعيين التلقائي' : 'Team formation and auto-assignment settings'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="maxTeamSize" className={cn(isRTL && "text-arabic")}>
                      {isRTL ? 'حجم الفريق للتعيين التلقائي' : 'Team Size for Auto-Assignment'} *
                    </Label>
                    <Input
                      id="maxTeamSize"
                      type="number"
                      min="2"
                      max="10"
                      value={formData.settings.maxTeamSize}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          maxTeamSize: parseInt(e.target.value) || 4
                        }
                      })}
                      placeholder="4"
                      required
                      className="mt-2"
                    />
                    <p className={cn("text-sm text-gray-600 dark:text-gray-400 mt-1", isRTL && "text-arabic")}>
                      {isRTL ? 'عدد الأشخاص في كل فريق عند استخدام التعيين التلقائي (2-10)' : 'Number of people per team when using auto-assignment (2-10)'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="allowIndividualParticipation" className={cn(isRTL && "text-arabic")}>
                      {isRTL ? 'السماح بالمشاركة الفردية' : 'Allow Individual Participation'}
                    </Label>
                    <Select
                      value={formData.settings.allowIndividualParticipation.toString()}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          allowIndividualParticipation: value === 'true'
                        }
                      })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">{isRTL ? 'نعم، السماح بالمشاركة الفردية' : 'Yes, allow individual participation'}</SelectItem>
                        <SelectItem value="false">{isRTL ? 'لا، الفرق فقط' : 'No, teams only'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className={cn("text-blue-700 dark:text-blue-300 text-sm", isRTL && "text-arabic")}>
                    💡 <strong>{isRTL ? 'حجم الفريق:' : 'Team Size:'}</strong> {isRTL 
                      ? 'يحدد عدد الأشخاص في كل فريق عند استخدام ميزة "التعيين التلقائي" في إدارة الفرق. يمكنك تغيير هذا الإعداد لاحقاً من صفحة إدارة الهاكاثون.'
                      : 'Determines the number of people per team when using the "Auto-Assignment" feature in team management. You can change this setting later from the hackathon management page.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-end gap-4 pt-6"
          >
            <Link href="/admin/hackathons">
              <Button variant="outline" size="lg">
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isRTL ? 'جاري الإنشاء...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Sparkles className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                  {isRTL ? 'إنشاء الهاكاثون' : 'Create Hackathon'}
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
