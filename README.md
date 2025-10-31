# 🎯 HackPro SaaS - منصة إدارة الهاكاثونات الاحترافية

<div align="center">

![HackPro Logo](https://via.placeholder.com/200x200?text=HackPro)

**منصة SaaS متكاملة لإدارة الهاكاثونات والمسابقات التقنية**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[العربية](#) | [English](#)

</div>

---

## 📋 نظرة عامة

**HackPro SaaS** هي منصة شاملة لإدارة الهاكاثونات والمسابقات التقنية، مصممة لتوفير تجربة سلسة للمنظمين والمشاركين والحكام. تدعم المنصة Multi-tenancy مع عزل كامل للبيانات بين المنظمات.

---

## ✨ المميزات الرئيسية

### 🏢 إدارة المنظمات (Multi-tenancy)
- إنشاء وإدارة منظمات متعددة
- عزل كامل للبيانات بين المنظمات
- نظام صلاحيات متقدم لكل منظمة
- إعدادات مخصصة لكل منظمة

### 🎪 إدارة الهاكاثونات
- إنشاء وتخصيص الهاكاثونات
- إدارة المراحل والجداول الزمنية
- نظام تسجيل المشاركين
- تتبع حالة الهاكاثون (قادم، جاري، منتهي)

### 👥 إدارة الفرق والمشاركين
- تكوين الفرق تلقائياً أو يدوياً
- إدارة أعضاء الفريق
- تتبع حالة المشاركة
- نظام دعوات الفريق

### 📊 نظام التقييم المتقدم
- معايير تقييم مخصصة
- تقييم متعدد المراحل
- حساب النتائج تلقائياً
- تقارير تفصيلية للنتائج

### 🏆 الجوائز والشهادات
- إدارة الجوائز والفائزين
- توليد شهادات PDF تلقائياً
- تخصيص تصميم الشهادات
- إرسال الشهادات عبر البريد

### 📧 نظام الإشعارات
- إشعارات بريد إلكتروني
- إشعارات داخل المنصة
- قوالب بريد مخصصة
- Rate limiting للبريد

### 🔐 الأمان والصلاحيات
- مصادقة JWT
- نظام أدوار متقدم (Admin, Supervisor, Judge, Expert, Participant)
- تشفير كلمات المرور
- Cookies آمنة

### 📁 إدارة الملفات
- رفع الملفات عبر Cloudinary
- دعم الصور والمستندات
- معاينة الملفات
- إدارة المرفقات

---

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 15.5** - React Framework مع App Router
- **TypeScript 5.0** - Type Safety
- **Tailwind CSS 3.4** - Utility-first CSS
- **shadcn/ui** - مكونات UI جاهزة
- **Radix UI** - مكونات UI Accessible
- **React Hook Form** - إدارة النماذج
- **Zod** - Schema Validation

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma 6.15** - ORM
- **PostgreSQL** - قاعدة البيانات (Neon)
- **Jose** - JWT Authentication
- **bcryptjs** - Password Hashing

### خدمات خارجية
- **Cloudinary** - تخزين الملفات
- **Nodemailer** - إرسال البريد
- **Gmail/SendGrid** - SMTP
- **Neon** - PostgreSQL Serverless

### أدوات التطوير
- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **TypeScript** - Type Checking

---

## 🚀 البدء السريع

### المتطلبات الأساسية

- Node.js 18+
- npm أو yarn أو pnpm
- حساب PostgreSQL (Neon مجاني)
- حساب Cloudinary (مجاني)
- حساب Gmail (للبريد)

### التثبيت

1. **استنساخ المشروع**
```bash
git clone https://github.com/belalwws/hackpro-saas.git
cd hackpro-saas
```

2. **تثبيت المكتبات**
```bash
npm install
```

3. **إعداد المتغيرات البيئية**
```bash
cp .env.example .env
```

ثم عدّل ملف `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Email
GMAIL_USER="your-email@gmail.com"
GMAIL_PASS="your-gmail-app-password"
MAIL_FROM="HackPro <noreply@hackpro.com>"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. **إعداد قاعدة البيانات**
```bash
npx prisma generate
npx prisma db push
```

5. **تشغيل المشروع**
```bash
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

---

## 📁 هيكل المشروع

```
hackpro-saas/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # صفحات المصادقة
│   ├── (dashboard)/              # صفحات Dashboard
│   ├── api/                      # API Routes
│   └── layout.tsx                # Root Layout
├── components/                   # React Components
│   ├── ui/                       # shadcn/ui Components
│   ├── forms/                    # Form Components
│   └── shared/                   # Shared Components
├── lib/                          # Utilities
│   ├── prisma.ts                 # Prisma Client
│   ├── auth.ts                   # Authentication
│   ├── mailer.ts                 # Email Service
│   └── utils.ts                  # Helper Functions
├── prisma/                       # Prisma Schema
│   └── schema.prisma             # Database Schema
├── public/                       # Static Files
├── types/                        # TypeScript Types
└── middleware.ts                 # Next.js Middleware
```

---

## 🎯 الاستخدام

### إنشاء حساب Admin

```bash
npm run create-admin
```

### اختبار قاعدة البيانات

```bash
npm run db:test
```

### نسخ احتياطي لقاعدة البيانات

```bash
npm run db:backup
```

### استعادة قاعدة البيانات

```bash
npm run db:restore
```

---

## 🌐 النشر

### Digital Ocean App Platform

راجع الدليل الشامل: [دليل النشر على Digital Ocean](./DIGITALOCEAN_DEPLOYMENT.md)

**خطوات سريعة:**

1. Push الكود إلى GitHub
2. إنشاء App على Digital Ocean
3. ربط GitHub Repository
4. إضافة المتغيرات البيئية
5. Deploy!

**ملفات مهمة:**
- `app.yaml` - تكوين Digital Ocean
- `DIGITALOCEAN_FIX_GUIDE.md` - حل المشاكل الشائعة
- `DEPLOYMENT_CHECKLIST.md` - قائمة التحقق

---

## 📚 الوثائق

- [📖 دليل النشر](./DEPLOYMENT_GUIDE.md)
- [🚀 دليل النشر على Digital Ocean](./DIGITALOCEAN_DEPLOYMENT.md)
- [🔧 دليل حل مشاكل Digital Ocean](./DIGITALOCEAN_FIX_GUIDE.md)
- [✅ قائمة التحقق للنشر](./DEPLOYMENT_CHECKLIST.md)
- [✨ قائمة المميزات](./FEATURES_CHECKLIST.md)
- [⚡ البدء السريع](./QUICK_START.md)
- [📝 ملخص التنظيف والإصلاحات](./CLEANUP_AND_FIX_SUMMARY.md)

---

## 🔐 الأمان

- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Password hashing (bcryptjs)
- ✅ Secure httpOnly cookies
- ✅ CSRF protection
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection
- ✅ Rate limiting

---

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

---

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 👨‍💻 المطور

**Belal**
- GitHub: [@belalwws](https://github.com/belalwws)
- Repository: [hackpro-saas](https://github.com/belalwws/hackpro-saas)

---

## 🙏 شكر وتقدير

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

## 📞 الدعم

إذا واجهت أي مشاكل:

1. راجع [DIGITALOCEAN_FIX_GUIDE.md](./DIGITALOCEAN_FIX_GUIDE.md)
2. راجع [Issues](https://github.com/belalwws/hackpro-saas/issues)
3. افتح Issue جديد

---

<div align="center">

**صُنع بـ ❤️ في السعودية**

⭐ إذا أعجبك المشروع، لا تنسَ إعطائه نجمة!

</div>

