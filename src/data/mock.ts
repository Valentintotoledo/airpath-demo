/**
 * AirPath mock data. Typed as if a real API would replace it.
 * Bilingual strings are stored as { es, en } pairs.
 */
import type { RoleId } from "@/lib/roles";

export type L10n = { es: string; en: string };

/* ------------------------------------------------------------------ */
/*  Users / personas                                                   */
/* ------------------------------------------------------------------ */

export type DemoUser = {
  id: string;
  role: RoleId;
  name: string;
  email: string;
  headline: L10n;
  location: string;
  initials: string;
  points: number;
  verified: boolean;
  memberSince: string;
};

export const DEMO_USERS: Record<RoleId, DemoUser> = {
  student: {
    id: "u-student",
    role: "student",
    name: "Juan Camilo Chiquiza",
    email: "juancamilo@airpath.demo",
    headline: { es: "Piloto en formación · Etapa Instrument Rating", en: "Pilot in training · Instrument Rating stage" },
    location: "Bogotá, Colombia",
    initials: "JC",
    points: 2480,
    verified: true,
    memberSince: "2025-08",
  },
  instructor: {
    id: "u-instructor",
    role: "instructor",
    name: "Cap. Andrés Morales",
    email: "andres.morales@airpath.demo",
    headline: { es: "Instructor FAA CFII/MEI · 4.9 ★", en: "FAA Instructor CFII/MEI · 4.9 ★" },
    location: "Miami, FL",
    initials: "AM",
    points: 8120,
    verified: true,
    memberSince: "2024-11",
  },
  school: {
    id: "u-school",
    role: "school",
    name: "Skyline Flight Academy",
    email: "ops@skylineflight.demo",
    headline: { es: "Escuela certificada FAA Part 141", en: "FAA Part 141 certified school" },
    location: "Fort Lauderdale, FL",
    initials: "SF",
    points: 0,
    verified: true,
    memberSince: "2024-06",
  },
  owner: {
    id: "u-owner",
    role: "owner",
    name: "Carolina Duarte",
    email: "carolina.duarte@airpath.demo",
    headline: { es: "Propietaria · 3 aeronaves en operación", en: "Owner · 3 aircraft in operation" },
    location: "Austin, TX",
    initials: "CD",
    points: 1340,
    verified: true,
    memberSince: "2025-02",
  },
  admin: {
    id: "u-admin",
    role: "admin",
    name: "Equipo AirPath",
    email: "admin@airpath.demo",
    headline: { es: "Administrador de la plataforma", en: "Platform administrator" },
    location: "Operaciones globales",
    initials: "AP",
    points: 0,
    verified: true,
    memberSince: "2024-01",
  },
  mechanic: {
    id: "u-mechanic",
    role: "mechanic",
    name: "Diego Sánchez",
    email: "diego.sanchez@airpath.demo",
    headline: { es: "Mecánico A&P certificado FAA", en: "FAA certified A&P mechanic" },
    location: "Houston, TX",
    initials: "DS",
    points: 960,
    verified: true,
    memberSince: "2025-04",
  },
  employer: {
    id: "u-employer",
    role: "employer",
    name: "Aero Charter Group",
    email: "talent@aerocharter.demo",
    headline: { es: "Operador charter · contratando pilotos", en: "Charter operator · hiring pilots" },
    location: "Miami, FL",
    initials: "AC",
    points: 0,
    verified: true,
    memberSince: "2024-09",
  },
};

/* ------------------------------------------------------------------ */
/*  Career path — PPL → IR → CPL → Airline                             */
/* ------------------------------------------------------------------ */

export type StageStatus = "completed" | "current" | "locked";

export type CareerStage = {
  id: string;
  code: string;
  name: L10n;
  blurb: L10n;
  status: StageStatus;
  progress: number;
  hours: L10n;
};

export const CAREER_STAGES: CareerStage[] = [
  {
    id: "stage-ppl",
    code: "PPL",
    name: { es: "Piloto Privado", en: "Private Pilot" },
    blurb: { es: "Tu primera licencia. Volás solo y con pasajeros.", en: "Your first license. Fly solo and with passengers." },
    status: "completed",
    progress: 100,
    hours: { es: "40 h mínimo", en: "40 hr minimum" },
  },
  {
    id: "stage-ir",
    code: "IR",
    name: { es: "Habilitación Instrumental", en: "Instrument Rating" },
    blurb: { es: "Volá en condiciones meteorológicas instrumentales.", en: "Fly in instrument meteorological conditions." },
    status: "current",
    progress: 45,
    hours: { es: "40 h instrumento", en: "40 hr instrument" },
  },
  {
    id: "stage-cpl",
    code: "CPL",
    name: { es: "Piloto Comercial", en: "Commercial Pilot" },
    blurb: { es: "Cobrá por volar. El salto profesional.", en: "Get paid to fly. The professional leap." },
    status: "locked",
    progress: 0,
    hours: { es: "250 h totales", en: "250 hr total" },
  },
  {
    id: "stage-atp",
    code: "ATP",
    name: { es: "Piloto de Aerolínea", en: "Airline Pilot" },
    blurb: { es: "El objetivo final: cabina de una aerolínea.", en: "The final goal: an airline flight deck." },
    status: "locked",
    progress: 0,
    hours: { es: "1500 h ATP", en: "1500 hr ATP" },
  },
];

/** Demo login pre-filled for the prospect. Any input also works. */
export const DEMO_LOGIN = {
  email: "juancamilo@airpath.demo",
  password: "AirPath2025",
};

export function getDemoUser(role: RoleId): DemoUser {
  return DEMO_USERS[role];
}
