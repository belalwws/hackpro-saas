# ✅ قائمة التحقق للنشر على Digital Ocean

**تاريخ:** 30 أكتوبر 2025  
**المشروع:** HackPro SaaS

---

## 📋 قبل النشر

### 1. التحقق من الملفات المحلية

- [ ] ملف `.env` موجود ويعمل
- [ ] `npm install` ينجح بدون أخطاء
- [ ] `npm run build` ينجح بدون أخطاء
- [ ] `npm start` يشغل التطبيق محلياً
- [ ] التطبيق يعمل على `http://localhost:3000`

### 2. التحقق من قاعدة البيانات

- [ ] `DATABASE_URL` صحيح في `.env`
- [ ] يحتوي على `?sslmode=require` في النهاية
- [ ] `npx prisma generate` ينجح
- [ ] `npx prisma db push` ينجح
- [ ] الاتصال بقاعدة البيانات يعمل

### 3. التحقق من الملفات

- [ ] `schema.prisma` في مجلد `prisma/`
- [ ] `package.json` يحتوي على `postinstall` script
- [ ] `next.config.js` محسّن للإنتاج
- [ ] `app.yaml` محدّث بالإعدادات الصحيحة
- [ ] `README.md` منظم وواضح

### 4. التحقق من الخدمات الخارجية

#### Cloudinary
- [ ] حساب Cloudinary نشط
- [ ] `CLOUDINARY_CLOUD_NAME` صحيح
- [ ] `CLOUDINARY_API_KEY` صحيح
- [ ] `CLOUDINARY_API_SECRET` صحيح
- [ ] اختبار رفع ملف يعمل

#### Gmail/Email
- [ ] حساب Gmail نشط
- [ ] 2FA مفعّل
- [ ] App Password تم إنشاؤه
- [ ] `GMAIL_USER` صحيح
- [ ] `GMAIL_PASS` صحيح (App Password)
- [ ] اختبار إرسال إيميل يعمل

---

## 🚀 أثناء النشر

### 1. إعداد Digital Ocean App

- [ ] تسجيل الدخول إلى Digital Ocean
- [ ] إنشاء App جديد
- [ ] ربط GitHub repository
- [ ] اختيار branch: `main`
- [ ] تفعيل Auto Deploy

### 2. تكوين Build Settings

```yaml
Build Command: npm ci && npm run build:production
Run Command: npm start
HTTP Port: 3000
```

- [ ] Build Command صحيح
- [ ] Run Command صحيح
- [ ] HTTP Port = 3000

### 3. إضافة Environment Variables

**المتغيرات المطلوبة:**

#### Database
- [ ] `DATABASE_URL` (RUN_AND_BUILD_TIME)
- [ ] يحتوي على `?sslmode=require`

#### Authentication
- [ ] `JWT_SECRET` (RUN_AND_BUILD_TIME)
- [ ] `NEXTAUTH_URL` (RUN_AND_BUILD_TIME)
- [ ] `NEXTAUTH_SECRET` (RUN_AND_BUILD_TIME)
- [ ] `NEXT_PUBLIC_BASE_URL` (RUN_AND_BUILD_TIME)
- [ ] `NEXT_PUBLIC_APP_URL` (RUN_AND_BUILD_TIME)

#### Email
- [ ] `GMAIL_USER` (RUN_AND_BUILD_TIME)
- [ ] `GMAIL_PASS` (RUN_AND_BUILD_TIME)
- [ ] `MAIL_FROM` (RUN_TIME)

#### Cloudinary
- [ ] `CLOUDINARY_CLOUD_NAME` (RUN_AND_BUILD_TIME)
- [ ] `CLOUDINARY_API_KEY` (RUN_AND_BUILD_TIME)
- [ ] `CLOUDINARY_API_SECRET` (RUN_AND_BUILD_TIME)

#### Application
- [ ] `NODE_ENV=production` (RUN_AND_BUILD_TIME)

### 4. إعداد Health Check

- [ ] HTTP Path: `/api/health`
- [ ] Endpoint موجود ويعمل

### 5. بدء النشر

- [ ] انقر "Deploy"
- [ ] انتظر اكتمال البناء (5-10 دقائق)
- [ ] تحقق من Logs للأخطاء

---

## ✅ بعد النشر

### 1. التحقق من التطبيق

- [ ] افتح رابط التطبيق
- [ ] الصفحة الرئيسية تُحمّل
- [ ] لا توجد أخطاء 404 أو 500
- [ ] الصور والملفات الثابتة تُحمّل

### 2. اختبار الـ Endpoints

```bash
# Health Check
curl https://your-app.ondigitalocean.app/api/health

# Database Test (إذا كان موجوداً)
curl https://your-app.ondigitalocean.app/api/db-test
```

- [ ] `/api/health` يعيد `status: healthy`
- [ ] Database connection يعمل

### 3. اختبار الوظائف الأساسية

- [ ] تسجيل الدخول يعمل
- [ ] إنشاء حساب يعمل
- [ ] رفع الملفات يعمل (Cloudinary)
- [ ] إرسال الإيميلات يعمل
- [ ] قاعدة البيانات تحفظ البيانات

### 4. فحص الأداء

- [ ] سرعة تحميل الصفحات مقبولة
- [ ] لا توجد تأخيرات كبيرة
- [ ] الصور محسّنة

### 5. مراجعة Logs

```bash
# من CLI
doctl apps logs YOUR_APP_ID web

# أو من Dashboard
Apps → Your App → Runtime Logs
```

- [ ] لا توجد أخطاء في Logs
- [ ] لا توجد تحذيرات مهمة

---

## 🐛 حل المشاكل

### إذا فشل البناء (Build Failed)

1. [ ] راجع Build Logs
2. [ ] تحقق من `package.json` scripts
3. [ ] تحقق من `postinstall` script
4. [ ] تحقق من المتغيرات البيئية
5. [ ] راجع [DIGITALOCEAN_FIX_GUIDE.md](./DIGITALOCEAN_FIX_GUIDE.md)

### إذا كان التطبيق لا يعمل (502 Bad Gateway)

1. [ ] تحقق من Runtime Logs
2. [ ] تحقق من `DATABASE_URL`
3. [ ] تحقق من HTTP Port (3000)
4. [ ] أعد تشغيل التطبيق
5. [ ] راجع [DIGITALOCEAN_FIX_GUIDE.md](./DIGITALOCEAN_FIX_GUIDE.md)

### إذا كانت قاعدة البيانات لا تعمل

1. [ ] تحقق من `DATABASE_URL` يحتوي على `?sslmode=require`
2. [ ] تحقق من Neon database نشط
3. [ ] اختبر الاتصال من local
4. [ ] راجع Prisma logs

### إذا كانت الإيميلات لا تُرسل

1. [ ] تحقق من `GMAIL_USER` و `GMAIL_PASS`
2. [ ] تأكد من استخدام App Password
3. [ ] تحقق من Gmail quota
4. [ ] اختبر محلياً أولاً

---

## 📊 مراقبة ما بعد النشر

### اليوم الأول

- [ ] فحص Logs كل ساعة
- [ ] مراقبة الأخطاء
- [ ] اختبار جميع الوظائف
- [ ] جمع feedback من المستخدمين

### الأسبوع الأول

- [ ] فحص Logs يومياً
- [ ] مراقبة الأداء
- [ ] تتبع الأخطاء
- [ ] عمل نسخة احتياطية من قاعدة البيانات

### شهرياً

- [ ] مراجعة Logs
- [ ] تحديث المكتبات
- [ ] نسخ احتياطي لقاعدة البيانات
- [ ] مراجعة الأمان

---

## 🔐 الأمان

### قبل النشر

- [ ] تغيير كلمات المرور الافتراضية
- [ ] استخدام secrets قوية
- [ ] تفعيل HTTPS (افتراضي في DO)
- [ ] مراجعة الصلاحيات

### بعد النشر

- [ ] مراقبة محاولات الدخول
- [ ] تفعيل rate limiting
- [ ] مراجعة logs للأنشطة المشبوهة
- [ ] تحديث المكتبات بانتظام

---

## 📝 التوثيق

- [ ] تحديث README.md
- [ ] توثيق المتغيرات البيئية
- [ ] توثيق خطوات النشر
- [ ] توثيق المشاكل والحلول

---

## 🎉 النشر الناجح!

عند اكتمال جميع النقاط أعلاه:

✅ التطبيق منشور بنجاح  
✅ جميع الوظائف تعمل  
✅ لا توجد أخطاء  
✅ الأداء جيد  
✅ الأمان محسّن  

**تهانينا! 🎊**

---

## 📚 مراجع إضافية

- [DIGITALOCEAN_DEPLOYMENT.md](./DIGITALOCEAN_DEPLOYMENT.md) - دليل النشر الكامل
- [DIGITALOCEAN_FIX_GUIDE.md](./DIGITALOCEAN_FIX_GUIDE.md) - حل المشاكل
- [README.md](./README.md) - الوثائق الرئيسية
- [Digital Ocean Docs](https://docs.digitalocean.com/products/app-platform/)

---

**آخر تحديث:** 30 أكتوبر 2025  
**الحالة:** ✅ جاهز للاستخدام

