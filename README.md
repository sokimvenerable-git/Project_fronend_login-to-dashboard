# Fullstack Website (React + PHP + MySQL) — ភាសាខ្មែរ Admin Dashboard

ប្រព័ន្ធគ្រប់គ្រង (Admin Dashboard) ជាភាសាខ្មែរ សាងសង់ដោយ **React (Vite)** នៅផ្នែក frontend, **PHP REST API** នៅផ្នែក backend, និង **MySQL** សម្រាប់ទិន្នន័យ។

## រចនាសម្ព័ន្ធ Folder
```
fullstack-website/
├── frontend/   → React (Vite) app — UI ភាសាខ្មែរ ស្ទីលងងឹតពណ៌ស្វាយ
├── backend/    → PHP REST API (JWT-like token auth)
└── database/   → MySQL schema + sample data (database.sql)
```

## ១. រៀបចំ Database
```
mysql -u root -p < database/database.sql
```
ឬ Import ឯកសារ `database/database.sql` តាម phpMyAdmin / HeidiSQL។ Script នេះ `CREATE DATABASE IF NOT EXISTS` ដូច្នេះអាចរត់ម្ដងទៀតដោយសុវត្ថិភាព (មិនលុបទិន្នន័យចាស់ចោលទេ)។

## ២. រៀបចំ Backend (PHP)
1. ដាក់ project ទាំងមូលក្នុង folder `www` របស់ Laragon/XAMPP, ឧ. `C:\laragon\www\fullstack-website\`
2. ពិនិត្យ `backend/config/database.php` — លំនាំដើមប្រើ user `root` ពាក្យសម្ងាត់ទទេ។
3. បើក `http://localhost/fullstack-website/backend/api/test.php` ដើម្បីប្រាកដថា DB ភ្ជាប់ដំណើរការ។
4. **សំខាន់៖** ប្តូរតម្លៃនៅក្នុង `backend/config/auth.php` (`APP_SECRET`) មុននឹងដាក់ឲ្យប្រើពិតប្រាកដ។

## ៣. រៀបចំ Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
បើកនៅ `http://localhost:5173`។ ប្រសិនបើ path របស់ backend ខុសពី default សូមចម្លង `.env.example` ទៅ `.env` ហើយកែ `VITE_API_URL`។

## គណនីសាកល្បង
- អ៊ីមែល៖ `admin@example.com`
- ពាក្យសម្ងាត់៖ `password`
- តួនាទី៖ admin

(មានគណនី `john@example.com` / `password` ជា role `user` ផងដែរ)

## មុខងារ Admin
- **ទំព័រ Login/Register** — ភាសាខ្មែរ ស្ទីលងងឹតដូច mockup, ចុះឈ្មោះថ្មីទទួលបាន role `user` ស្វ័យប្រវត្តិ
- **Dashboard** — កាតស្ថិតិ ៤ (ចំណូល/ការបញ្ជាទិញ/ផលិតផល/អ្នកប្រើប្រាស់), ក្រាហ្វិកចំណូល ១៤ ថ្ងៃ, ក្រាហ្វិកស្ថានភាពការបញ្ជាទិញ, តារាងការបញ្ជាទិញថ្មីៗ
- **Products** — តារាង + ទម្រង់ Add/Edit (Name, Price, **Description**), លុបបាន
- **Orders** — បង្កើតការបញ្ជាទិញ (ជ្រើសផលិតផល គណនា Total ស្វ័យប្រវត្តិ), ប្តូរស្ថានភាព, លុបបាន
- **Users** — CRUD ពេញលេញ (បន្ថែម/កែប្រែ/លុប), កំណត់ role admin/user
- **Reports** — Total Revenue / Total Orders / Avg. Order Value + ក្រាហ្វិកធំៗ (និន្នាការ ១៤ ថ្ងៃ, ចំណូលប្រចាំខែ ៦ខែ, ស្ថានភាព, អតិថិជនកំពូល)
- **Settings** — កែឈ្មោះ/Email និងប្តូរ Password
- **Sidebar** — Icon លើម៉ឺនុយនីមួយៗ (lucide-react)

## Database schema
- `users`: id, name, email (unique), password (bcrypt hash), role (`admin`/`user`), created_at
- `products`: id, name, price, description, created_at
- `orders`: id, customer_name, user_id (FK → users, nullable), total, status (`pending`/`processing`/`completed`/`cancelled`), created_at

## ចំណាំសុវត្ថិភាព
- ពាក្យសម្ងាត់ hash ដោយ `password_hash()` (bcrypt) — មិនផ្ទុកជា plain text ទេ។
- គ្រប់ SQL query ប្រើ PDO prepared statements ការពារ SQL injection។
- Token ជា **signed token (HMAC-SHA256)**៖ មិនមែន JWT ស្តង់ដារពេញលេញទេ ប៉ុន្តែផ្ទៀងផ្ទាត់ signature និងកាលបរិច្ឆេទផុតកំណត់ (៧ថ្ងៃ)។ សម្រាប់ production ពិតប្រាកដ គួរប្តូរទៅ `firebase/php-jwt` ឬស្រដៀងគ្នា និងប្តូរ `APP_SECRET`។
- Endpoint `admin/*` ទាំងអស់តម្រូវ Authorization token (`require_auth()`); សកម្មភាព write លើ `users.php` (add/edit/delete) ទាមទារ role `admin`។
- CORS កំណត់ត្រឹមតែ origin `http://localhost:5173` (កែក្នុង `backend/config/cors.php` បើប្តូរ port/domain)។
- Public register ផ្តល់ role `user` ជានិច្ច (មិនអាចចុះឈ្មោះជា admin ដោយផ្ទាល់បានទេ)។
# Project_fronend_login-to-dashboard
