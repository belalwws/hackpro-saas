# 🚀 HackPro - Professional Hackathon Management SaaS Platform# 🚀 منصة هاكاثون الابتكار التقني



<div align="center"><div align="center">



**The Ultimate Multi-Tenant Hackathon Management Platform**![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748?style=for-the-badge&logo=prisma)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)

[![Prisma](https://img.shields.io/badge/Prisma-6.15-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)

منصة متكاملة لإدارة وتنظيم الهاكاثونات التقنية

🌐 [Live Demo](https://hackpro.cloud) • 📖 [Documentation](./DOCUMENTATION.md) • 🚀 [Get Started](#-getting-started)

[🌐 Live Demo](https://clownfish-app-px9sc.ondigitalocean.app) | [📖 Documentation](./PROJECT_OVERVIEW.md) | [🔧 Technical Details](./TECHNICAL_SUMMARY.md)

</div>

</div>

---

---

## 🎯 About

## ✨ المميزات

**HackPro** is a comprehensive SaaS platform for managing hackathons at scale. Built with **multi-tenancy** from the ground up, it enables organizations to:

### 🎯 إدارة شاملة للهاكاثونات

✅ Create & manage unlimited hackathons  - ✅ إنشاء وإدارة هاكاثونات متعددة

✅ Handle thousands of participants efficiently  - ✅ نظام تسجيل مرن للمشاركين

✅ Advanced judging with customizable criteria  - ✅ إدارة الفرق والمشاريع

✅ Automated certificate generation  - ✅ صفحات هبوط مخصصة لكل هاكاثون

✅ Real-time analytics & reporting  

✅ Custom branding & landing pages  ### 👥 نظام أدوار متقدم

- **Admin** - إدارة كاملة للمنصة

---- **Supervisor** - إشراف ومتابعة

- **Judge** - تقييم المشاريع

## ✨ Key Features- **Expert** - تقديم الاستشارات

- **Participant** - المشاركة والتنافس

### 🏢 Multi-Tenancy & Organizations

- Isolated data per organization### 📊 نظام تقييم احترافي

- Custom branding (colors, logos, domains)- ✅ معايير تقييم قابلة للتخصيص

- Flexible pricing plans (Free → Enterprise)- ✅ توزيع المحكمين على الفرق

- Usage tracking & limit enforcement- ✅ إدخال الدرجات في الوقت الفعلي

- ✅ حساب النتائج تلقائياً

### 👥 User Management- ✅ لقطات للنتائج (snapshots)

- Role-based access (Admin, Judge, Expert, Supervisor, Participant)

- Team collaboration with permissions### 📧 نظام إيميلات متطور

- SSO ready (Google/Microsoft)- ✅ قوالب إيميلات قابلة للتخصيص

- 2FA support- ✅ متغيرات ديناميكية

- ✅ إرفاق ملفات من Cloudinary

### 🎯 Hackathon Management- ✅ إرسال جماعي مع rate limiting

- Dynamic registration forms- ✅ محرر نصوص غني (TipTap)

- Team formation & management

- Project submissions (Cloudinary)### 🎓 توليد الشهادات

- Live leaderboards- ✅ تصميم شهادات مخصص

- Automated certificates- ✅ توليد تلقائي بأسماء المشاركين

- ✅ إرسال عبر البريد الإلكتروني

### ⚖️ Judging System- ✅ تحميل مباشر

- Custom evaluation criteria

- Star ratings (1-5)### 📱 واجهة مستخدم حديثة

- Real-time score aggregation- ✅ تصميم متجاوب (Responsive)

- Judge dashboard- ✅ دعم اللغة العربية (RTL)

- ✅ مكونات UI من shadcn/ui

### 📊 Analytics- ✅ رسوميات 3D (Three.js)

- Comprehensive dashboards- ✅ تأثيرات حركية (Framer Motion)

- Participant statistics

- Performance metrics---

- Excel/CSV exports

## 🛠️ التقنيات المستخدمة

---

### Frontend

## 🛠 Tech Stack```

Next.js 15 (App Router)

| Category | Technology |React 19

|----------|------------|TypeScript 5

| **Framework** | Next.js 15.5 (App Router) |Tailwind CSS 3

| **Language** | TypeScript 5.0 |shadcn/ui

| **Database** | PostgreSQL (Neon) |Framer Motion

| **ORM** | Prisma 6.15 |Three.js

| **Auth** | Jose (JWT) |```

| **Styling** | Tailwind CSS 3.4 |

| **UI** | Radix UI + shadcn/ui |### Backend

| **Email** | Nodemailer + SendGrid |```

| **Storage** | Cloudinary |Next.js API Routes

| **PDF** | Canvas |Prisma ORM

PostgreSQL (Neon)

---JWT Authentication

Nodemailer

## 🚀 Getting StartedCloudinary

```

### Prerequisites

- Node.js 18+### Tools & Libraries

- PostgreSQL (or Neon account)```

- Cloudinary accountReact Hook Form + Zod

- SMTP credentialsdate-fns

xlsx (Excel export)

### Installationcanvas (Certificate generation)

bcryptjs (Password hashing)

```bash```

# 1. Clone repository

git clone https://github.com/belalwws/hackpro-saas.git---

cd hackpro-saas

## 🚀 البدء السريع

# 2. Install dependencies

npm install### المتطلبات

- Node.js 18+

# 3. Configure environment- npm أو yarn

cp .env.example .env- PostgreSQL database (أو Neon account)

# Edit .env with your credentials- Cloudinary account

- Gmail account (للإيميلات)

# 4. Setup database

npx prisma generate### التثبيت

npx prisma db push

```bash

# 5. Run development server# 1. استنساخ المشروع

npm run devgit clone https://github.com/your-username/Hk-main.git

cd Hk-main

# 6. Open browser

# http://localhost:3000# 2. تثبيت المكتبات

```npm install



### Default Admin# 3. إعداد ملف .env

- Email: `admin@hackathon.gov.sa`cp .env.example .env

- Password: `admin123`# قم بتعديل المتغيرات البيئية



⚠️ Change in production!# 4. إعداد قاعدة البيانات

npx prisma generate

---npx prisma db push



## 📁 Project Structure# 5. تشغيل السيرفر

npm run dev

``````

hackpro-saas/

├── app/                    # Next.js App Routerافتح المتصفح على [http://localhost:3000](http://localhost:3000)

│   ├── api/                # API Routes

│   │   ├── organization/   # Multi-tenancy---

│   │   ├── hackathons/     # Hackathon management

│   │   └── ...## ⚙️ المتغيرات البيئية

│   ├── admin/              # Admin dashboard

│   ├── saas/               # Landing pageأنشئ ملف `.env` في المجلد الرئيسي:

│   └── ...

├── components/             # React components```env

│   ├── ui/                 # shadcn/ui# Database

│   └── ...DATABASE_URL="postgresql://user:password@host:5432/database"

├── lib/                    # Utilities

│   ├── multi-tenancy.ts    # MT utilities# Authentication

│   ├── auth.ts             # AuthenticationJWT_SECRET="your-super-secret-jwt-key"

│   └── ...NEXTAUTH_URL="http://localhost:3000"

├── hooks/                  # Custom hooksNEXTAUTH_SECRET="your-nextauth-secret"

├── prisma/                 # Database schema

└── ...# Email (Gmail)

```GMAIL_USER="your-email@gmail.com"

GMAIL_PASS="your-app-password"

---MAIL_FROM="Platform Name <your-email@gmail.com>"



## 🏗 Multi-Tenancy Architecture# Cloudinary

CLOUDINARY_CLOUD_NAME="your-cloud-name"

```typescriptCLOUDINARY_API_KEY="your-api-key"

// Organization modelCLOUDINARY_API_SECRET="your-api-secret"

model Organization {

  id        String @id# Application

  name      StringNODE_ENV="development"

  slug      String @uniqueNEXT_PUBLIC_APP_URL="http://localhost:3000"

  plan      Plan   @default(free)```

  

  hackathons Hackathon[]---

  users      OrganizationUser[]

}## 📁 هيكل المشروع



// Every hackathon belongs to an organization```

model Hackathon {Hk-main/

  id             String @id├── app/                    # Next.js App Router

  organizationId String  // Tenant isolation│   ├── api/               # API Routes

  title          String│   ├── admin/             # Admin Dashboard

  // ...│   ├── supervisor/        # Supervisor Dashboard

  │   ├── judge/             # Judge Dashboard

  organization Organization @relation(...)│   ├── participant/       # Participant Dashboard

}│   └── expert/            # Expert Dashboard

```├── components/            # React Components

│   ├── ui/               # shadcn/ui Components

**Usage Limits** per plan:│   └── ...

```typescript├── lib/                   # Utility Libraries

free:         1 hackathon,  50 participants│   ├── prisma.ts         # Prisma Client

professional: 10 hackathons, unlimited participants│   ├── auth.ts           # Authentication

enterprise:   unlimited everything│   ├── cloudinary.ts     # File Upload

```│   └── mailer.ts         # Email Service

├── prisma/               # Database Schema

---├── scripts/              # Utility Scripts

├── public/               # Static Files

## 📡 API Overview└── schema.prisma         # Prisma Schema

```

### Authentication

```bash---

Cookie: auth-token=<JWT>

```## 🎯 الاستخدام



### Endpoints### إنشاء حساب مدير

```bash

# Organizations```bash

GET    /api/organization/currentnpm run create-admin

POST   /api/organization/switch```

GET    /api/organization/usage

### اختبار الاتصال بقاعدة البيانات

# Hackathons

GET    /api/hackathons```bash

POST   /api/hackathonsnpm run db:test

GET    /api/hackathons/:id```



# Participants### نسخ احتياطي لقاعدة البيانات

POST   /api/participants

GET    /api/participants/:id```bash

node scripts/backup-database.js

# Judges```

POST   /api/judges/invite

POST   /api/scores### استعادة قاعدة البيانات

```

```bash

---node scripts/restore-database.js

```

## 🌐 Deployment

---

### Recommended

- **Hosting**: Vercel / DigitalOcean## 📚 الوثائق

- **Database**: Neon (Serverless Postgres)

- **Storage**: Cloudinary- [📋 نظرة عامة على المشروع](./PROJECT_OVERVIEW.md)

- **Email**: SendGrid- [🔧 الملخص التقني](./TECHNICAL_SUMMARY.md)

- [🗄️ Database Schema](./schema.prisma)

### Vercel (One-Click)

1. Push to GitHub---

2. Import in Vercel

3. Set env variables## 🔐 الأمان

4. Deploy 🎉

- ✅ JWT-based authentication

---- ✅ Role-based access control (RBAC)

- ✅ Password hashing (bcryptjs)

## 🤝 Contributing- ✅ Secure httpOnly cookies

- ✅ Rate limiting

1. Fork the repo- ✅ Input validation (Zod)

2. Create branch (`feature/amazing`)- ✅ SQL injection protection (Prisma)

3. Commit changes

4. Push & open PR---



---## 🚀 النشر



## 📝 License### Digital Ocean



MIT License - see [LICENSE](LICENSE)المشروع مُعد للنشر على Digital Ocean App Platform:



---1. Push الكود على GitHub

2. ربط المشروع بـ Digital Ocean

## 👨‍💻 Author3. إعداد المتغيرات البيئية

4. Auto-deploy عند كل push

**Belal**  

GitHub: [@belalwws](https://github.com/belalwws)### متغيرات البيئة المطلوبة



---تأكد من إضافة جميع المتغيرات في Digital Ocean Dashboard:

- `DATABASE_URL`

<div align="center">- `JWT_SECRET`

- `NEXTAUTH_URL`

**Made with ❤️ for the hackathon community**- `NEXTAUTH_SECRET`

- `GMAIL_USER`

⭐ Star us on GitHub!- `GMAIL_PASS`

- `CLOUDINARY_*`

[Report Bug](https://github.com/belalwws/hackpro-saas/issues) • [Request Feature](https://github.com/belalwws/hackpro-saas/issues)

---

</div>

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

![GitHub repo size](https://img.shields.io/github/repo-size/your-username/Hk-main?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/your-username/Hk-main?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/your-username/Hk-main?style=flat-square)

---

## 📝 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE)

---

## 📞 التواصل

لأي استفسارات أو مشاكل، يرجى فتح [Issue](https://github.com/your-username/Hk-main/issues)

---

<div align="center">

**صُنع بـ ❤️ في السعودية**

[⬆ العودة للأعلى](#-منصة-هاكاثون-الابتكار-التقني)

</div>

