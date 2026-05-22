/** AirPath platform data — bookings, certificates, documents, billing, jobs, admin. */
import type { L10n } from "./mock";
import type { Accent } from "./academy";

const L = (es: string, en: string): L10n => ({ es, en });

/* ------------------------------------------------------------------ */
/*  Bookings (Turo-style request → approval)                            */
/* ------------------------------------------------------------------ */

export type BookingStatus = "pending" | "approved" | "rejected" | "completed";
export type BookingKind = "aircraft" | "instructor" | "charter";

export type Booking = {
  id: string;
  kind: BookingKind;
  title: string;
  subtitle: L10n;
  dateLabel: string;
  status: BookingStatus;
  price: number;
  depositPct: number;
  counterparty: string;
  requestedBy: string;
  accent: Accent;
};

export const BOOKINGS: Booking[] = [
  {
    id: "bk-1",
    kind: "aircraft",
    title: "N512AP · Cessna 172",
    subtitle: L("Time building · 3 horas de vuelo", "Time building · 3 flight hours"),
    dateLabel: "2026-06-02 · 09:00",
    status: "approved",
    price: 495,
    depositPct: 30,
    counterparty: "Carolina Duarte",
    requestedBy: "Juan Camilo Chiquiza",
    accent: "purple",
  },
  {
    id: "bk-2",
    kind: "instructor",
    title: "Cap. Andrés Morales",
    subtitle: L("Sesión de aproximaciones ILS", "ILS approaches session"),
    dateLabel: "2026-06-05 · 14:00",
    status: "pending",
    price: 150,
    depositPct: 50,
    counterparty: "Cap. Andrés Morales",
    requestedBy: "Juan Camilo Chiquiza",
    accent: "sky",
  },
  {
    id: "bk-3",
    kind: "aircraft",
    title: "N740TB · Cirrus SR20",
    subtitle: L("Cross-country · 2 horas", "Cross-country · 2 hours"),
    dateLabel: "2026-05-28 · 10:30",
    status: "completed",
    price: 490,
    depositPct: 30,
    counterparty: "Carolina Duarte",
    requestedBy: "Juan Camilo Chiquiza",
    accent: "gold",
  },
  {
    id: "bk-4",
    kind: "aircraft",
    title: "N88RG · Piper Arrow",
    subtitle: L("Práctica de tren retráctil", "Retractable gear practice"),
    dateLabel: "2026-06-08 · 08:00",
    status: "pending",
    price: 630,
    depositPct: 30,
    counterparty: "Carolina Duarte",
    requestedBy: "Mateo Herrera",
    accent: "purple",
  },
  {
    id: "bk-5",
    kind: "charter",
    title: "Empty Leg · KMIA → KTEB",
    subtitle: L("Phenom 300 · 7 asientos", "Phenom 300 · 7 seats"),
    dateLabel: "2026-06-04 · 16:00",
    status: "rejected",
    price: 8900,
    depositPct: 25,
    counterparty: "Aero Charter Group",
    requestedBy: "Juan Camilo Chiquiza",
    accent: "gold",
  },
  {
    id: "bk-6",
    kind: "aircraft",
    title: "N909XP · Piper Seminole",
    subtitle: L("Habilitación multimotor", "Multi-engine rating"),
    dateLabel: "2026-06-12 · 11:00",
    status: "pending",
    price: 730,
    depositPct: 40,
    counterparty: "Skyline Flight Academy",
    requestedBy: "Lucía Paredes",
    accent: "purple",
  },
];

/* ------------------------------------------------------------------ */
/*  Certificates                                                        */
/* ------------------------------------------------------------------ */

export type EarnedCertificate = {
  id: string;
  code: string;
  course: L10n;
  holder: string;
  issueDate: string;
  hours: number;
  status: "valid";
  accent: Accent;
};

export const CERTIFICATES: EarnedCertificate[] = [
  {
    id: "cert-1",
    code: "APX-PPL-7K2M9",
    course: L("Piloto Privado (PPL) — FAA Part 141", "Private Pilot (PPL) — FAA Part 141"),
    holder: "Juan Camilo Chiquiza",
    issueDate: "2026-02-18",
    hours: 40,
    status: "valid",
    accent: "purple",
  },
  {
    id: "cert-2",
    code: "APX-GND-3T8R1",
    course: L("Curso teórico de tierra — Meteorología", "Ground school — Aviation Weather"),
    holder: "Juan Camilo Chiquiza",
    issueDate: "2026-01-09",
    hours: 12,
    status: "valid",
    accent: "sky",
  },
  {
    id: "cert-3",
    code: "APX-WRN-9M4K6",
    course: L("Preparación examen Written FAA", "FAA Written exam preparation"),
    holder: "Juan Camilo Chiquiza",
    issueDate: "2025-12-02",
    hours: 18,
    status: "valid",
    accent: "gold",
  },
];

/** Used by the public verification page. */
export const VERIFY_SAMPLE_CODE = "APX-PPL-7K2M9";

/* ------------------------------------------------------------------ */
/*  Document validation                                                 */
/* ------------------------------------------------------------------ */

export type DocStatus = "verified" | "pending" | "rejected" | "missing";

export type AppDocument = {
  id: string;
  name: L10n;
  hint: L10n;
  status: DocStatus;
  updatedAt: string;
  expiry?: string;
};

export const STUDENT_DOCUMENTS: AppDocument[] = [
  {
    id: "doc-1",
    name: L("Documento de identidad con foto", "Government photo ID"),
    hint: L("Pasaporte o licencia vigente", "Valid passport or driver license"),
    status: "verified",
    updatedAt: "2026-01-14",
  },
  {
    id: "doc-2",
    name: L("Licencia de piloto FAA", "FAA Pilot License"),
    hint: L("Certificado de piloto privado", "Private pilot certificate"),
    status: "verified",
    updatedAt: "2026-02-20",
  },
  {
    id: "doc-3",
    name: L("Certificado médico", "Medical Certificate"),
    hint: L("Clase 1, 2 o 3 según operación", "Class 1, 2 or 3 per operation"),
    status: "pending",
    updatedAt: "2026-05-19",
    expiry: "2027-05-31",
  },
];

/* ------------------------------------------------------------------ */
/*  Billing — plans & transactions                                      */
/* ------------------------------------------------------------------ */

export type Plan = {
  id: string;
  name: L10n;
  tagline: L10n;
  priceMonthly: number;
  priceYearly: number;
  featured: boolean;
  features: L10n[];
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: L("Free", "Free"),
    tagline: L("Explorá la plataforma sin costo.", "Explore the platform for free."),
    priceMonthly: 0,
    priceYearly: 0,
    featured: false,
    features: [
      L("Catálogo de cursos completo", "Full course catalog"),
      L("1 curso de muestra gratuito", "1 free sample course"),
      L("Banco de preguntas limitado", "Limited question bank"),
    ],
  },
  {
    id: "pro",
    name: L("Premium Piloto", "Pilot Premium"),
    tagline: L("Todo lo que necesitás para tu ruta.", "Everything you need for your path."),
    priceMonthly: 39,
    priceYearly: 374,
    featured: true,
    features: [
      L("Acceso a los 5 cursos FAA", "Access to all 5 FAA courses"),
      L("Banco de preguntas ilimitado", "Unlimited question bank"),
      L("Simulador de examen Written", "Written exam simulator"),
      L("Certificados verificables", "Verifiable certificates"),
      L("Copiloto IA prioritario", "Priority AI copilot"),
    ],
  },
  {
    id: "career",
    name: L("Career Pro", "Career Pro"),
    tagline: L("Carrera completa + mentorías.", "Full career + mentorship."),
    priceMonthly: 89,
    priceYearly: 854,
    featured: false,
    features: [
      L("Todo lo de Premium Piloto", "Everything in Pilot Premium"),
      L("2 mentorías mensuales con instructor", "2 monthly instructor mentorships"),
      L("Descuentos en marketplace", "Marketplace discounts"),
      L("Prioridad en reservas", "Booking priority"),
    ],
  },
];

export type Transaction = {
  id: string;
  concept: L10n;
  date: string;
  amount: number;
  method: string;
  status: "paid" | "refunded";
};

export const TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    concept: L("Suscripción Premium Piloto — Mayo", "Pilot Premium subscription — May"),
    date: "2026-05-01",
    amount: 39,
    method: "Visa ···· 4242",
    status: "paid",
  },
  {
    id: "tx-2",
    concept: L("Curso: Habilitación Instrumental (IR)", "Course: Instrument Rating (IR)"),
    date: "2026-04-12",
    amount: 1690,
    method: "Visa ···· 4242",
    status: "paid",
  },
  {
    id: "tx-3",
    concept: L("Reserva N740TB — depósito 30%", "Booking N740TB — 30% deposit"),
    date: "2026-04-03",
    amount: 147,
    method: "Mastercard ···· 8810",
    status: "paid",
  },
  {
    id: "tx-4",
    concept: L("Mentoría con Cap. Andrés Morales", "Mentorship with Cap. Andrés Morales"),
    date: "2026-03-21",
    amount: 75,
    method: "Visa ···· 4242",
    status: "paid",
  },
  {
    id: "tx-5",
    concept: L("Reserva cancelada — reembolso", "Cancelled booking — refund"),
    date: "2026-03-08",
    amount: 210,
    method: "Visa ···· 4242",
    status: "refunded",
  },
];

/* ------------------------------------------------------------------ */
/*  Achievements & points                                               */
/* ------------------------------------------------------------------ */

export type Achievement = {
  id: string;
  icon: string;
  title: L10n;
  description: L10n;
  points: number;
  unlocked: boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    icon: "rocket",
    title: L("Primer despegue", "First takeoff"),
    description: L("Completaste tu primera lección.", "Completed your first lesson."),
    points: 100,
    unlocked: true,
  },
  {
    id: "ach-2",
    icon: "award",
    title: L("Piloto Privado", "Private Pilot"),
    description: L("Obtuviste tu licencia PPL.", "Earned your PPL license."),
    points: 800,
    unlocked: true,
  },
  {
    id: "ach-3",
    icon: "flame",
    title: L("Racha de 15 días", "15-day streak"),
    description: L("Estudiaste 15 días seguidos.", "Studied 15 days in a row."),
    points: 300,
    unlocked: true,
  },
  {
    id: "ach-4",
    icon: "target",
    title: L("Francotirador del Written", "Written sharpshooter"),
    description: L("90%+ en un simulacro de examen.", "90%+ on a practice exam."),
    points: 250,
    unlocked: true,
  },
  {
    id: "ach-5",
    icon: "compass",
    title: L("Navegante", "Navigator"),
    description: L("Completá el módulo de navegación IR.", "Complete the IR navigation module."),
    points: 400,
    unlocked: false,
  },
  {
    id: "ach-6",
    icon: "trophy",
    title: L("Comandante", "Commander"),
    description: L("Obtené tu licencia comercial.", "Earn your commercial license."),
    points: 1500,
    unlocked: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Students (instructor / school view)                                 */
/* ------------------------------------------------------------------ */

export type StudentRecord = {
  id: string;
  name: string;
  initials: string;
  course: L10n;
  progress: number;
  nextSession: string;
  status: L10n;
  accent: Accent;
};

export const STUDENT_RECORDS: StudentRecord[] = [
  {
    id: "st-1",
    name: "Juan Camilo Chiquiza",
    initials: "JC",
    course: L("Habilitación Instrumental (IR)", "Instrument Rating (IR)"),
    progress: 45,
    nextSession: "2026-06-05",
    status: L("Al día", "On track"),
    accent: "purple",
  },
  {
    id: "st-2",
    name: "Mateo Herrera",
    initials: "MH",
    course: L("Piloto Privado (PPL)", "Private Pilot (PPL)"),
    progress: 72,
    nextSession: "2026-06-03",
    status: L("Al día", "On track"),
    accent: "sky",
  },
  {
    id: "st-3",
    name: "Lucía Paredes",
    initials: "LP",
    course: L("Piloto Comercial (CPL)", "Commercial Pilot (CPL)"),
    progress: 28,
    nextSession: "2026-06-07",
    status: L("Necesita apoyo", "Needs support"),
    accent: "gold",
  },
  {
    id: "st-4",
    name: "Tomás Aguirre",
    initials: "TA",
    course: L("Piloto Privado (PPL)", "Private Pilot (PPL)"),
    progress: 91,
    nextSession: "2026-06-02",
    status: L("Listo para checkride", "Checkride ready"),
    accent: "green",
  },
  {
    id: "st-5",
    name: "Renata Salas",
    initials: "RS",
    course: L("Conversión a Licencia FAA", "FAA License Conversion"),
    progress: 60,
    nextSession: "2026-06-09",
    status: L("Al día", "On track"),
    accent: "purple",
  },
];

/* ------------------------------------------------------------------ */
/*  Job board                                                           */
/* ------------------------------------------------------------------ */

export type JobCategory = "pilot" | "instructor" | "mechanic" | "ops";

export type Job = {
  id: string;
  title: L10n;
  company: string;
  companyInitials: string;
  location: string;
  type: L10n;
  category: JobCategory;
  salary: string;
  minHours: string;
  posted: string;
  accent: Accent;
  tags: L10n[];
};

export const JOBS: Job[] = [
  {
    id: "job-1",
    title: L("Primer Oficial — Airbus A320", "First Officer — Airbus A320"),
    company: "Aero Charter Group",
    companyInitials: "AC",
    location: "Miami, FL",
    type: L("Tiempo completo", "Full-time"),
    category: "pilot",
    salary: "$78k–$95k",
    minHours: "1500 h",
    posted: "2026-05-18",
    accent: "purple",
    tags: [L("ATP", "ATP"), L("Jet", "Jet"), L("Reubicación", "Relocation")],
  },
  {
    id: "job-2",
    title: L("Instructor de Vuelo CFII", "Flight Instructor CFII"),
    company: "Skyline Flight Academy",
    companyInitials: "SF",
    location: "Fort Lauderdale, FL",
    type: L("Tiempo completo", "Full-time"),
    category: "instructor",
    salary: "$52k–$68k",
    minHours: "500 h",
    posted: "2026-05-20",
    accent: "sky",
    tags: [L("CFI/CFII", "CFI/CFII"), L("Time building", "Time building")],
  },
  {
    id: "job-3",
    title: L("Mecánico A&P certificado", "Certified A&P Mechanic"),
    company: "Desert Sky Aviation",
    companyInitials: "DS",
    location: "Phoenix, AZ",
    type: L("Tiempo completo", "Full-time"),
    category: "mechanic",
    salary: "$60k–$82k",
    minHours: "—",
    posted: "2026-05-15",
    accent: "gold",
    tags: [L("A&P", "A&P"), L("Turbina", "Turbine")],
  },
  {
    id: "job-4",
    title: L("Piloto de Charter — King Air 350", "Charter Pilot — King Air 350"),
    company: "Blue Horizon Jets",
    companyInitials: "BH",
    location: "Dallas, TX",
    type: L("Contrato", "Contract"),
    category: "pilot",
    salary: "$340/día",
    minHours: "1200 h",
    posted: "2026-05-21",
    accent: "purple",
    tags: [L("Multimotor", "Multi-engine"), L("Turbohélice", "Turboprop")],
  },
  {
    id: "job-5",
    title: L("Coordinador de Operaciones de Vuelo", "Flight Operations Coordinator"),
    company: "Andes Aviation Center",
    companyInitials: "AA",
    location: "Bogotá, Colombia",
    type: L("Tiempo completo", "Full-time"),
    category: "ops",
    salary: "$28k–$36k",
    minHours: "—",
    posted: "2026-05-12",
    accent: "green",
    tags: [L("Despacho", "Dispatch"), L("Bilingüe", "Bilingual")],
  },
  {
    id: "job-6",
    title: L("Mecánico de línea — turno noche", "Line Mechanic — night shift"),
    company: "Aero Charter Group",
    companyInitials: "AC",
    location: "Miami, FL",
    type: L("Medio tiempo", "Part-time"),
    category: "mechanic",
    salary: "$32/hora",
    minHours: "—",
    posted: "2026-05-22",
    accent: "sky",
    tags: [L("A&P", "A&P"), L("Línea", "Line")],
  },
];

/* ------------------------------------------------------------------ */
/*  Admin metrics                                                       */
/* ------------------------------------------------------------------ */

export const ADMIN_METRICS = {
  revenueMonthly: 184_320,
  revenueGrowth: 18.4,
  revenueByStream: [
    { key: "courses", label: L("Cursos", "Courses"), value: 78_400, accent: "purple" as Accent },
    { key: "subs", label: L("Suscripciones", "Subscriptions"), value: 42_900, accent: "sky" as Accent },
    { key: "mentorships", label: L("Mentorías", "Mentorships"), value: 21_600, accent: "green" as Accent },
    { key: "bookings", label: L("Reservas", "Bookings"), value: 26_800, accent: "gold" as Accent },
    { key: "commissions", label: L("Comisiones marketplace", "Marketplace commissions"), value: 14_620, accent: "purple" as Accent },
  ],
  revenueTrend: [
    { month: "Nov", value: 118 },
    { month: "Dic", value: 131 },
    { month: "Ene", value: 142 },
    { month: "Feb", value: 138 },
    { month: "Mar", value: 156 },
    { month: "Abr", value: 171 },
    { month: "May", value: 184 },
  ],
  activeUsers: 6_842,
  usersGrowth: 12.1,
  retention: 87,
  churn: 4.2,
  usersByRole: [
    { label: L("Estudiantes / Pilotos", "Students / Pilots"), value: 5180 },
    { label: L("Instructores", "Instructors"), value: 612 },
    { label: L("Escuelas", "Schools"), value: 94 },
    { label: L("Propietarios", "Aircraft owners"), value: 486 },
    { label: L("Mecánicos", "Mechanics"), value: 318 },
    { label: L("Empleadores", "Employers"), value: 152 },
  ],
  courseCompletion: 73,
  courseDropout: 11,
  pendingApprovals: 14,
  leadsThisMonth: 1_290,
  funnel: [
    { label: L("Visitantes", "Visitors"), value: 24_800 },
    { label: L("Registrados", "Registered"), value: 6_842 },
    { label: L("Pagos", "Paid"), value: 1_960 },
  ],
  marketplaceListings: 312,
  marketplaceBookings: 487,
  academyEngagement: 81,
};

export type AdminUser = {
  id: string;
  name: string;
  initials: string;
  role: L10n;
  joined: string;
  status: "active" | "pending";
  accent: Accent;
};

export const ADMIN_USERS: AdminUser[] = [
  { id: "au-1", name: "Juan Camilo Chiquiza", initials: "JC", role: L("Estudiante / Piloto", "Student / Pilot"), joined: "2025-08-11", status: "active", accent: "purple" },
  { id: "au-2", name: "Cap. Andrés Morales", initials: "AM", role: L("Instructor FAA", "FAA Instructor"), joined: "2024-11-02", status: "active", accent: "sky" },
  { id: "au-3", name: "Skyline Flight Academy", initials: "SF", role: L("Escuela de Vuelo", "Flight School"), joined: "2024-06-19", status: "active", accent: "gold" },
  { id: "au-4", name: "Carolina Duarte", initials: "CD", role: L("Propietaria de Aeronave", "Aircraft Owner"), joined: "2025-02-08", status: "active", accent: "green" },
  { id: "au-5", name: "Renata Salas", initials: "RS", role: L("Estudiante / Piloto", "Student / Pilot"), joined: "2026-05-20", status: "pending", accent: "purple" },
  { id: "au-6", name: "Diego Sánchez", initials: "DS", role: L("Mecánico Certificado", "Certified Mechanic"), joined: "2026-05-21", status: "pending", accent: "sky" },
];

export type ValidationItem = {
  id: string;
  user: string;
  initials: string;
  doc: L10n;
  submitted: string;
  accent: Accent;
};

export const PENDING_VALIDATIONS: ValidationItem[] = [
  { id: "v-1", user: "Renata Salas", initials: "RS", doc: L("Certificado médico Clase 2", "Class 2 Medical Certificate"), submitted: "2026-05-21", accent: "purple" },
  { id: "v-2", user: "Diego Sánchez", initials: "DS", doc: L("Licencia A&P", "A&P License"), submitted: "2026-05-21", accent: "sky" },
  { id: "v-3", user: "Tomás Aguirre", initials: "TA", doc: L("Documento de identidad", "Government photo ID"), submitted: "2026-05-20", accent: "green" },
  { id: "v-4", user: "Lucía Paredes", initials: "LP", doc: L("Licencia de piloto FAA", "FAA Pilot License"), submitted: "2026-05-19", accent: "gold" },
];
