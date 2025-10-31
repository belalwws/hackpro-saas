# 🔧 دليل حل مشاكل النشر على Digital Ocean

**تاريخ التحديث:** 30 أكتوبر 2025  
**الحالة:** ✅ جاهز للتطبيق

---

## 🎯 المشاكل الشائعة والحلول

### 1️⃣ المشكلة: Build Failed على Digital Ocean

#### الأعراض:
```
Error: Build failed
npm ERR! code ELIFECYCLE
```

#### الحلول:

**أ) تحديث package.json**

تأكد من وجود هذه الـ scripts:

```json
{
  "scripts": {
    "build": "next build",
    "build:production": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

**ب) تحديث app.yaml**

```yaml
name: hackpro-saas
services:
- name: web
  github:
    repo: belalwws/hackpro-saas
    branch: main
  build_command: npm ci && npm run build:production
  run_command: npm start
  http_port: 3000
  health_check:
    http_path: /api/health
```

**ج) إنشاء endpoint للـ health check**

أنشئ ملف `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  })
}
```

---

### 2️⃣ المشكلة: Database Connection Error

#### الأعراض:
```
Error: Can't reach database server
PrismaClientInitializationError
```

#### الحلول:

**أ) تحقق من DATABASE_URL**

يجب أن يكون بهذا الشكل:
```
postgresql://user:password@host:5432/database?sslmode=require
```

⚠️ **مهم جداً:** يجب إضافة `?sslmode=require` في النهاية!

**ب) تحديث المتغيرات البيئية في Digital Ocean**

1. اذهب إلى App → Settings → Environment Variables
2. تأكد من أن `DATABASE_URL` موجود في **RUN_AND_BUILD_TIME**
3. أعد نشر التطبيق

**ج) اختبار الاتصال**

أنشئ ملف `app/api/db-test/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$connect()
    return NextResponse.json({ status: 'connected' })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 })
  }
}
```

---

### 3️⃣ المشكلة: Prisma Schema Not Found

#### الأعراض:
```
Error: Could not find Prisma Schema
```

#### الحل:

تأكد من أن `schema.prisma` في المكان الصحيح:
```
prisma/
  └── schema.prisma
```

وليس في الجذر!

---

### 4️⃣ المشكلة: Environment Variables غير موجودة

#### الأعراض:
```
Error: JWT_SECRET is not defined
Error: CLOUDINARY_CLOUD_NAME is not defined
```

#### الحل:

**قائمة المتغيرات المطلوبة:**

```env
# Database
DATABASE_URL=postgresql://...?sslmode=require

# Authentication
JWT_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.ondigitalocean.app
NEXTAUTH_SECRET=your-nextauth-secret

# Email
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
MAIL_FROM=HackPro <noreply@hackpro.com>

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.ondigitalocean.app
NEXT_PUBLIC_BASE_URL=https://your-app.ondigitalocean.app
```

**كيفية إضافتها في Digital Ocean:**

1. اذهب إلى App → Settings → Environment Variables
2. انقر "Edit"
3. أضف كل متغير على حدة
4. اختر **RUN_AND_BUILD_TIME** للمتغيرات المهمة
5. احفظ وأعد النشر

---

### 5️⃣ المشكلة: 502 Bad Gateway

#### الأعراض:
التطبيق لا يفتح ويظهر خطأ 502

#### الحلول:

**أ) تحقق من PORT**

في `package.json`:
```json
{
  "scripts": {
    "start": "next start -p ${PORT:-3000}"
  }
}
```

**ب) تحقق من app.yaml**

```yaml
http_port: 3000
```

**ج) أعد تشغيل التطبيق**

من Digital Ocean Dashboard:
- Apps → Your App → Actions → Restart

---

### 6️⃣ المشكلة: Canvas Module Error

#### الأعراض:
```
Error: Cannot find module 'canvas'
```

#### الحل:

في `next.config.js`:

```javascript
webpack: (config, { isServer }) => {
  if (isServer) {
    config.externals.push('canvas')
  }
  return config
}
```

---

### 7️⃣ المشكلة: Emails لا تُرسل

#### الأعراض:
الإيميلات لا تصل للمستخدمين

#### الحلول:

**أ) استخدم Gmail App Password**

1. فعّل 2FA على حساب Gmail
2. اذهب إلى https://myaccount.google.com/apppasswords
3. أنشئ App Password جديد
4. استخدمه في `GMAIL_PASS`

**ب) تحقق من SMTP Settings**

في `lib/mailer.ts`:

```typescript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})
```

---

### 8️⃣ المشكلة: Static Files لا تُحمّل

#### الأعراض:
الصور والملفات الثابتة لا تظهر

#### الحل:

في `next.config.js`:

```javascript
const nextConfig = {
  output: 'standalone',
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
}
```

---

## 🚀 خطوات النشر الصحيحة

### الخطوة 1: التحضير المحلي

```bash
# 1. تأكد من أن كل شيء يعمل محلياً
npm install
npm run build
npm start

# 2. اختبر الاتصال بقاعدة البيانات
npm run db:test

# 3. Commit التغييرات
git add .
git commit -m "Fix deployment issues"
git push origin main
```

### الخطوة 2: إعداد Digital Ocean

1. **إنشاء App جديد**
   - اذهب إلى https://cloud.digitalocean.com/apps
   - انقر "Create App"
   - اختر GitHub repository

2. **تكوين Build Settings**
   - Build Command: `npm ci && npm run build:production`
   - Run Command: `npm start`
   - HTTP Port: `3000`

3. **إضافة Environment Variables**
   - أضف جميع المتغيرات من القائمة أعلاه
   - تأكد من اختيار **RUN_AND_BUILD_TIME**

4. **إضافة Health Check**
   - HTTP Path: `/api/health`

### الخطوة 3: النشر

1. انقر "Deploy"
2. انتظر حتى ينتهي البناء (5-10 دقائق)
3. افتح الرابط المُعطى

### الخطوة 4: التحقق

```bash
# اختبر الـ health endpoint
curl https://your-app.ondigitalocean.app/api/health

# اختبر الاتصال بقاعدة البيانات
curl https://your-app.ondigitalocean.app/api/db-test
```

---

## 📋 Checklist قبل النشر

- [ ] ✅ ملف `.env` محلي يعمل بشكل صحيح
- [ ] ✅ `npm run build` ينجح محلياً
- [ ] ✅ `schema.prisma` في مجلد `prisma/`
- [ ] ✅ `postinstall` script موجود في `package.json`
- [ ] ✅ جميع المتغيرات البيئية مُضافة في Digital Ocean
- [ ] ✅ `DATABASE_URL` يحتوي على `?sslmode=require`
- [ ] ✅ Health check endpoint موجود
- [ ] ✅ Gmail App Password مُعد بشكل صحيح
- [ ] ✅ Cloudinary credentials صحيحة

---

## 🐛 Debugging Tips

### عرض Logs في Digital Ocean

```bash
# من Terminal
doctl apps logs YOUR_APP_ID web

# أو من Dashboard
Apps → Your App → Runtime Logs
```

### اختبار محلي بـ Production Mode

```bash
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

### فحص المتغيرات البيئية

أنشئ endpoint مؤقت:

```typescript
// app/api/debug-env/route.ts
export async function GET() {
  return NextResponse.json({
    hasDatabase: !!process.env.DATABASE_URL,
    hasJWT: !!process.env.JWT_SECRET,
    hasCloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
    nodeEnv: process.env.NODE_ENV,
  })
}
```

⚠️ **احذف هذا الـ endpoint بعد الاختبار!**

---

## 📞 الدعم

إذا واجهت مشاكل:

1. راجع [DIGITALOCEAN_DEPLOYMENT.md](./DIGITALOCEAN_DEPLOYMENT.md)
2. افحص الـ Logs في Digital Ocean
3. افتح [Issue على GitHub](https://github.com/belalwws/hackpro-saas/issues)

---

**تم التحديث:** 30 أكتوبر 2025  
**الحالة:** ✅ جاهز للاستخدام

