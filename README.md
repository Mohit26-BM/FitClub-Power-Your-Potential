# FitClub — Gym Management System

A production-quality, full-stack gym management web application built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Converted from a C++ console application into a modern web platform with role-based dashboards, member self-registration, attendance tracking, and a complete membership lifecycle.

---

## Tech Stack

| Layer            | Technology                                       |
| ---------------- | ------------------------------------------------ |
| Framework        | Next.js 15 (App Router)                          |
| Language         | TypeScript (strict mode)                         |
| Styling          | Tailwind CSS v3                                  |
| Database         | SQLite (via Prisma ORM v5)                       |
| Auth             | NextAuth v5 (JWT sessions, Credentials provider) |
| Validation       | Zod + React Hook Form                            |
| Password hashing | bcryptjs (salt rounds 12)                        |
| Icons            | lucide-react                                     |
| Date utilities   | date-fns                                         |
| Runtime          | Node.js 18+                                      |

---

## Features

### Public

- **Home page** — Hero, About, Membership Plans (with realistic pricing), Features, Testimonials, Contact/Inquiry form, CTA
- **Self-registration** — Members sign up with Member ID, mobile, BMI, and plan; fee collected at the gym desk
- **Forgot password** — Verify identity with Member ID + mobile, receive a 6-digit reset code, set new password
- **Scroll animations** — Fade/slide-in effects on all homepage sections

### Member Portal (`/member`)

- Profile overview — membership status, plan, expiry, fee status
- BMI analysis with personalised fitness recommendations
- Slot booking — view available time slots and book one
- Attendance history — view all past check-ins
- Settings — update mobile number / BMI, change password

### Admin Dashboard (`/admin`)

- **Stats overview** — total members, fee paid, expiring soon, expired, new inquiries, slot occupancy
- **Revenue by plan** — live calculation based on current plan fees
- **Member management** — add, view, delete, search members; toggle fee status; reset passwords
- **Membership renewal** — extend expiry by plan (from current expiry or today if expired)
- **Slot management** — create and manage daily time slots with capacity limits
- **Attendance** — mark daily attendance per member with one click; optimistic UI
- **Inquiries** — manage contact form submissions; update status (New → Contacted → Enrolled)
- **Settings** — change admin password

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
git clone https://github.com/your-username/fitclub.git
cd fitclub
npm install
```

### Environment Variables

Create **both** files (Prisma CLI reads `.env`; Next.js reads `.env.local`):

**.env**

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**.env.local**

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### Database Setup

Push the schema to SQLite:

```bash
npm run db:push
```

Seed the database (creates admin account + 10 default time slots):

```bash
npm run db:seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Default Credentials

| Role   | Login field | Value                   |
| ------ | ----------- | ----------------------- |
| Admin  | Username    | `admin`                 |
| Admin  | Password    | `Admin@123`             |
| Member | Member ID   | Set during registration |
| Member | Password    | Set during registration |

> Change the admin password immediately after first login via **Admin → Settings**.

---

## Project Structure

```
fitclub/
├── prisma/
│   ├── schema.prisma        # Database models
│   └── seed.ts              # Admin + slot seed data
├── public/
│   ├── favicon.svg
│   └── images/              # hero.jpg, about-1/2/3.jpg (add your own)
├── src/
│   ├── actions/             # Server actions
│   │   ├── admin.actions.ts
│   │   ├── attendance.actions.ts
│   │   ├── auth.actions.ts  # Password reset
│   │   ├── contact.actions.ts
│   │   ├── member.actions.ts
│   │   └── slot.actions.ts
│   ├── app/
│   │   ├── (auth)/          # Login, Register, Forgot/Reset password
│   │   ├── (dashboard)/
│   │   │   ├── admin/       # Admin pages
│   │   │   └── member/      # Member pages
│   │   ├── api/auth/        # NextAuth route handler
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── admin/           # Admin-specific components
│   │   ├── auth/            # Login, Register forms
│   │   ├── home/            # Hero, Plans, Features, etc.
│   │   ├── layout/          # Navbar, Sidebar, Footer
│   │   ├── member/          # Member-specific components
│   │   └── ui/              # Shared: Button, Card, Badge, Input
│   ├── lib/
│   │   ├── auth.config.ts   # Edge-safe NextAuth config (middleware)
│   │   ├── auth.ts          # Full NextAuth config (bcryptjs)
│   │   ├── bmi.ts           # BMI categories + advice
│   │   ├── db.ts            # Prisma client singleton
│   │   ├── utils.ts         # cn, formatDate, calcExpiryDate, etc.
│   │   └── validations.ts   # Zod schemas
│   ├── middleware.ts         # Route protection
│   └── types/
│       └── index.ts         # Shared types + plan constants
└── package.json
```

---

## Database Models

| Model                | Purpose                               |
| -------------------- | ------------------------------------- |
| `Admin`              | Admin credentials                     |
| `Member`             | Member profile, plan, BMI, fee status |
| `Slot`               | Daily time slots with capacity        |
| `SlotBooking`        | Member ↔ slot assignment              |
| `Attendance`         | Daily check-in records per member     |
| `PasswordResetToken` | 6-digit reset codes (30 min TTL)      |
| `ContactInquiry`     | Home page contact form submissions    |

---

## API Routes

| Route                     | Method             | Description                      |
| ------------------------- | ------------------ | -------------------------------- |
| `/api/auth/[...nextauth]` | GET, POST          | NextAuth handler                 |
| `/api/members`            | GET                | Search/list members (admin only) |
| `/api/members/[id]`       | GET, PATCH, DELETE | Member CRUD (admin only)         |
| `/api/slots`              | GET, POST          | List/create slots (admin only)   |
| `/api/slots/[id]/book`    | POST               | Book a slot (member only)        |

All mutation operations use **Server Actions** rather than API routes where possible.

---

## Membership Plans

| Plan      | Price   | Duration                |
| --------- | ------- | ----------------------- |
| Monthly   | ₹2,499  | 1 month                 |
| Quarterly | ₹6,499  | 3 months (save ₹998)    |
| Annual    | ₹21,999 | 12 months (save ₹7,989) |

---

## Security

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT sessions with `AUTH_SECRET`
- Route protection via Next.js middleware (Edge-safe, no bcryptjs)
- Zod validation on all server actions and API inputs
- Prisma parameterised queries (SQL injection protection)
- Role-based access control: `admin` and `member` roles enforced server-side
- Password reset tokens expire after 30 minutes and are single-use

---

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run db:push    # Push schema to database
npm run db:seed    # Seed admin + slots
```

---

## Image Placeholders

The site uses gradient fallbacks when images are missing. To add real images, place these files in `public/images/`:

| File          | Used in                 | Recommended size |
| ------------- | ----------------------- | ---------------- |
| `hero.jpg`    | Hero background         | 1920×1080        |
| `about-1.jpg` | Premium Equipment panel | 800×600          |
| `about-2.jpg` | Expert Trainers panel   | 800×600          |
| `about-3.jpg` | Group Training panel    | 800×600          |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.
