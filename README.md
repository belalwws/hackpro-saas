# 🚀 HackPro - Professional Hackathon Management Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=for-the-badge&logo=tailwind-css)

**منصة SaaS متكاملة لإدارة وتنظيم الهاكاثونات التقنية**

[🌐 Live Demo](https://clownfish-app-px9sc.ondigitalocean.app) | [📖 Deployment Guide](./DEPLOYMENT_GUIDE.md) | [✨ Features Checklist](./FEATURES_CHECKLIST.md) | [🚀 Quick Start](./QUICK_START.md)

</div>

---

## 🎯 نظرة عامة

**HackPro** هي منصة SaaS متقدمة لإدارة الهاكاثونات التقنية بشكل احترافي. تم بناؤها باستخدام أحدث التقنيات مع دعم كامل لـ:

✨ **Multi-Tenancy** - دعم منظمات متعددة  
🌍 **Multi-Language** - العربية والإنجليزية  
🎨 **Dark Mode** - وضع داكن/فاتح  
📱 **Responsive** - متجاوب بالكامل  
⚡ **Performance** - محسّن للأداء  
🔒 **Secure** - آمن ومحمي

---

## ✨ المميزات الرئيسية

### 🎯 إدارة شاملة للهاكاثونات
- ✅ إنشاء وإدارة هاكاثونات متعددة
- ✅ نظام تسجيل مرن للمشاركين
- ✅ إدارة الفرق والمشاريع
- ✅ صفحات هبوط مخصصة لكل هاكاثون
- ✅ Custom branding & landing pages

### 👥 نظام أدوار متقدم
- **Admin** - إدارة كاملة للمنصة
- **Supervisor** - إشراف ومتابعة
- **Judge** - تقييم المشاريع
- **Expert** - تقديم الاستشارات
- **Participant** - المشاركة والتنافس

### 🏢 Multi-Tenancy & Organizations
- Isolated data per organization
- Custom branding (colors, logos, domains)
- Flexible pricing plans (Free → Enterprise)
- Usage tracking & limit enforcement

### 📊 نظام تقييم احترافي
- ✅ معايير تقييم قابلة للتخصيص
- ✅ توزيع المحكمين على الفرق
- ✅ إدخال الدرجات في الوقت الفعلي
- ✅ حساب النتائج تلقائياً
- ✅ لقطات للنتائج (snapshots)

### 📧 نظام إيميلات متطور
- ✅ قوالب إيميلات قابلة للتخصيص
- ✅ متغيرات ديناميكية
- ✅ إرفاق ملفات من Cloudinary
- ✅ إرسال جماعي مع rate limiting
- ✅ محرر نصوص غني (TipTap)

### 🎓 توليد الشهادات
- ✅ تصميم شهادات مخصص
- ✅ توليد تلقائي بأسماء المشاركين
- ✅ إرسال عبر البريد الإلكتروني
- ✅ تحميل مباشر

### 📱 واجهة مستخدم حديثة
- ✅ تصميم متجاوب (Responsive)
- ✅ دعم اللغة العربية (RTL)
- ✅ مكونات UI من shadcn/ui
- ✅ رسوميات 3D (Three.js)
- ✅ تأثيرات حركية (Framer Motion)

## 🛠️ التقنيات المستخدمة

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15.5 (App Router) |
| **Language** | TypeScript 5.0 |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma 6.15 |
| **Auth** | Jose (JWT) |
| **Styling** | Tailwind CSS 3.4 |
| **UI** | Radix UI + shadcn/ui |
| **Email** | Nodemailer + SendGrid |
| **Storage** | Cloudinary |
| **PDF** | Canvas |

### Frontend Stack
```
Next.js 15 (App Router)
React 19
TypeScript 5
Tailwind CSS 3
shadcn/ui
Framer Motion
Three.js
```

### Backend Stack
```
Next.js API Routes
Prisma ORM
PostgreSQL (Neon)
JWT Authentication
Nodemailer
Cloudinary
```

### Tools & Libraries
```
React Hook Form + Zod
date-fns
xlsx (Excel export)
canvas (Certificate generation)
bcryptjs (Password hashing)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or Neon account)
- Cloudinary account
- SMTP credentials

### Installation

```bash

# 1. Clone repository
git clone https://github.com/belalwws/hackpro-saas.git
cd hackpro-saas

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 4. Setup database
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev

# 6. Open browser
# http://localhost:3000
```

### Default Admin
- Email: `admin@hackathon.gov.sa`
- Password: `admin123`

⚠️ **Change in production!**

---

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- npm أو yarn
- PostgreSQL database (أو Neon account)
- Cloudinary account
- Gmail account (للإيميلات)

### التثبيت

```bash
# 1. استنساخ المشروع
git clone https://github.com/belalwws/hackpro-saas.git
cd hackpro-saas

# 2. تثبيت المكتبات
npm install

# 3. إعداد ملف .env
cp .env.example .env
# قم بتعديل المتغيرات البيئية

# 4. إعداد قاعدة البيانات
npx prisma generate
npx prisma db push

# 5. تشغيل السيرفر
npm run dev
```

افتح المتصفح على [http://localhost:3000](http://localhost:3000)

---

## ⚙️ المتغيرات البيئية

أنشئ ملف `.env` في المجلد الرئيسي:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Email (Gmail)
GMAIL_USER="your-email@gmail.com"
GMAIL_PASS="your-app-password"
MAIL_FROM="Platform Name <your-email@gmail.com>"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📁 هيكل المشروع

```

hackpro-saas/

├── app/                    # Next.js App Router

│   ├── api/                # API Routes

│   ├── admin/              # Admin Dashboard

│   ├── supervisor/         # Supervisor Dashboard

│   ├── judge/              # Judge Dashboard

│   ├── participant/        # Participant Dashboard

│   └── expert/             # Expert Dashboard

├── components/             # React Components

│   ├── ui/                 # shadcn/ui Components

│   └── ...

├── lib/                    # Utility Libraries

│   ├── prisma.ts           # Prisma Client

│   ├── auth.ts             # Authentication

│   ├── cloudinary.ts       # File Upload

│   └── mailer.ts           # Email Service

├── prisma/                 # Database Schema
├── scripts/                # Utility Scripts
├── public/                 # Static Files
└── schema.prisma           # Prisma Schema
```

---

## 🎯 الاستخدام

### إنشاء حساب مدير

```bash
npm run create-admin
```

### اختبار الاتصال بقاعدة البيانات

```bash
npm run db:test
```

### نسخ احتياطي لقاعدة البيانات

```bash
node scripts/backup-database.js
```

### استعادة قاعدة البيانات

```bash
node scripts/restore-database.js
```

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
- ✅ Rate limiting
- ✅ Input validation (Zod)
- ✅ SQL injection protection (Prisma)

---

## 🚀 النشر

### Digital Ocean

المشروع مُعد للنشر على Digital Ocean App Platform:

1. Push الكود على GitHub
2. ربط المشروع بـ Digital Ocean
3. إعداد المتغيرات البيئية
4. Auto-deploy عند كل push

### متغيرات البيئة المطلوبة

تأكد من إضافة جميع المتغيرات في Digital Ocean Dashboard:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GMAIL_USER`
- `GMAIL_PASS`
- `CLOUDINARY_*`

راجع [دليل النشر على Digital Ocean](./DIGITALOCEAN_DEPLOYMENT.md) للتفاصيل الكاملة.

---

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:

1. Fork المشروع
2. إنشاء branch للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للـ branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## ⚠️ ملاحظات مهمة

### قاعدة البيانات Production
- ⚠️ **قاعدة البيانات تحتوي على بيانات حقيقية**
- ⚠️ **لا تقم بحذف أو تعديل البيانات بدون نسخ احتياطي**
- ✅ استخدم `scripts/backup-database.js` قبل أي تعديلات

### الملفات والمرفقات
- ✅ جميع الملفات تُرفع على Cloudinary
- ⚠️ تحقق من حدود التخزين

### الإيميلات
- ✅ Rate limiting: 1 إيميل كل 2 ثانية
- ⚠️ تحقق من Gmail quota limits

---

## 📊 الإحصائيات

![GitHub repo size](https://img.shields.io/github/repo-size/belalwws/hackpro-saas?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/belalwws/hackpro-saas?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/belalwws/hackpro-saas?style=flat-square)

---

## 📝 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE)

---

## 📞 التواصل

لأي استفسارات أو مشاكل، يرجى فتح [Issue](https://github.com/belalwws/hackpro-saas/issues)

---

<div align="center">

**صُنع بـ ❤️ في السعودية**

[⬆ العودة للأعلى](#-منصة-هاكاثون-الابتكار-التقني)

</div>

