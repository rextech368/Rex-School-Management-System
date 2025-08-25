# EDU-WISE BASIC — Developer-Ready Specification

**Version:** 1.0  
**Status:** Draft — Engineering Kickoff  
**Target:** Web App (responsive) + Optional Role-Specific Apps (Teachers, Admins, Parents)  

---

## 0) Quick Summary

EDU-WISE BASIC is a **multi-tenant, RBAC-driven school information system** that manages:

- Students & admissions
- Staff & HR
- Academics (timetables, marks, promotions)
- Finance (fees, payments, expenses, payroll)
- Notifications & communications

Key features:

- Data segmented by **academic year** and **school group** (Primary/Secondary)
- Results **gated** by fee payment progress
- REST + GraphQL APIs
- Role-specific dashboards
- Automated timetables
- Full payroll & expense accounting
- PDF generation (report cards, ID cards, payslips)
- Multi-channel notifications (SMS, Email)

---

## 1) Architecture Overview

**Frontend**
- React (Next.js) or Vue (Nuxt) — SPA/SSR
- Tailwind CSS
- shadcn/ui component library

**Backend**
- Node.js (NestJS) or Express.js or Supabase

**Database**
- Supabase (primary)
- Partitioning by `academic_year` where needed

**Cache/Queues**
- Redis for sessions, caching, job queue

**Storage**
- S3-compatible (e.g., MinIO, AWS S3)

**Optional**
- OpenSearch (logs/metrics dashboards)
- PDF Generation: Puppeteer/Playwright or wkhtmltopdf
- Background Jobs: BullMQ / Celery

**Integrations**
- SMS: Twilio or Africa-specific providers
- Email: SES/SMTP
- Biometrics import
- Bank file exports for payroll

---

### 1.1 Environment & Config

- **Environments**: `dev`, `staging`, `prod`
- **Secrets**: Vault / AWS Parameter Store

**Required ENV Vars**
```
DB_URL
REDIS_URL
S3_ACCESS_KEY
S3_SECRET_KEY
S3_BUCKET
JWT_SECRET
JWT_TTL
SMTP_HOST
SMTP_USER
SMTP_PASS
SMS_API_KEY
BASE_URL
PDF_SERVICE_URL
DEFAULT_TIMEZONE=Africa/Douala
```

---

### 1.2 Suggested Services

| Service         | Responsibilities |
|-----------------|------------------|
| `core-api`      | Students, academics, timetable, notifications |
| `finance-api`   | Fees, invoices, payments, expenses, payroll accounting |
| `hr-api`        | Employees, attendance, tasks, appraisals, payroll |
| `file-service`  | File uploads, virus scan, signed URLs |
| `notify-service`| SMS/Email sending, templates |
| `job-runner`    | Crons: promotions, payroll, reminders |

---

## 2) Roles & RBAC

**Roles**
- Super Admin — Full access across tenants
- Admin — Admissions, student management
- Finance Admin — Fees, invoices, expenses, payroll
- HR Admin — Employee & payroll management
- Teacher — Marks, attendance, own classes
- Reception/Admission Officer — Registration queue
- Parent/Guardian — Child view
- Student — Own profile & results (payment gated)
- Head Teacher — Group scope: Primary
- Principal — Group scope: Secondary
- Read-Only Auditor — Reports only

**Scope Rules**
- Data tagged: `group: Primary` or `group: Secondary`
- Head Teacher: Primary only
- Principal: Secondary only

**Permission Highlights**
- Print ID card — Admin only
- Take Payment — Finance Admin only
- Manual Promotion — Admin only
- Results View — Parent/Student gated by payment threshold

---

## 3) Data Model

All tables:
- `snake_case`
- `id` as bigint/UUID
- `created_at`, `updated_at`

...

*Full specification continues with all sections as provided above, including schema, folder structure, automation, environment, and more.*

---

*This enhanced specification includes comprehensive automation features that will significantly improve efficiency, reduce manual work, and enhance the overall user experience of the EDU-WISE BASIC system.*