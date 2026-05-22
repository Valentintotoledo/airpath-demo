import {
  LayoutDashboard,
  GraduationCap,
  ClipboardCheck,
  Store,
  CalendarCheck,
  Award,
  ShieldCheck,
  CreditCard,
  Briefcase,
  Users,
  Gauge,
  Sparkles,
  User,
  UserCheck,
  Building2,
  Plane,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type RoleId =
  | "student"
  | "instructor"
  | "school"
  | "owner"
  | "admin"
  | "mechanic"
  | "employer";

export type NavKey =
  | "dashboard"
  | "academy"
  | "written"
  | "marketplace"
  | "bookings"
  | "certificates"
  | "documents"
  | "billing"
  | "jobs"
  | "students"
  | "admin"
  | "assistant";

export type NavItem = {
  key: NavKey;
  /** Dictionary key under `nav`. */
  labelKey: NavKey;
  href?: string;
  /** Special non-route action handled by the shell. */
  action?: "assistant";
  icon: LucideIcon;
};

export const NAV_ITEMS: Record<NavKey, NavItem> = {
  dashboard: { key: "dashboard", labelKey: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  academy: { key: "academy", labelKey: "academy", href: "/academy", icon: GraduationCap },
  written: { key: "written", labelKey: "written", href: "/written", icon: ClipboardCheck },
  marketplace: { key: "marketplace", labelKey: "marketplace", href: "/marketplace", icon: Store },
  bookings: { key: "bookings", labelKey: "bookings", href: "/bookings", icon: CalendarCheck },
  certificates: { key: "certificates", labelKey: "certificates", href: "/certificates", icon: Award },
  documents: { key: "documents", labelKey: "documents", href: "/documents", icon: ShieldCheck },
  billing: { key: "billing", labelKey: "billing", href: "/billing", icon: CreditCard },
  jobs: { key: "jobs", labelKey: "jobs", href: "/jobs", icon: Briefcase },
  students: { key: "students", labelKey: "students", href: "/students", icon: Users },
  admin: { key: "admin", labelKey: "admin", href: "/admin", icon: Gauge },
  assistant: { key: "assistant", labelKey: "assistant", action: "assistant", icon: Sparkles },
};

export type RoleAccent = "purple" | "gold" | "sky" | "green";

export type RoleDef = {
  id: RoleId;
  icon: LucideIcon;
  isBonus: boolean;
  accent: RoleAccent;
  nav: NavKey[];
};

export const ROLES: Record<RoleId, RoleDef> = {
  student: {
    id: "student",
    icon: User,
    isBonus: false,
    accent: "purple",
    nav: ["dashboard", "academy", "written", "marketplace", "bookings", "certificates", "documents", "billing", "assistant"],
  },
  instructor: {
    id: "instructor",
    icon: UserCheck,
    isBonus: false,
    accent: "sky",
    nav: ["dashboard", "students", "academy", "marketplace", "certificates", "documents", "billing", "assistant"],
  },
  school: {
    id: "school",
    icon: Building2,
    isBonus: false,
    accent: "gold",
    nav: ["dashboard", "students", "academy", "marketplace", "bookings", "documents", "billing", "assistant"],
  },
  owner: {
    id: "owner",
    icon: Plane,
    isBonus: false,
    accent: "green",
    nav: ["dashboard", "marketplace", "bookings", "documents", "billing", "assistant"],
  },
  admin: {
    id: "admin",
    icon: ShieldCheck,
    isBonus: false,
    accent: "purple",
    nav: ["dashboard", "admin", "marketplace", "documents", "assistant"],
  },
  mechanic: {
    id: "mechanic",
    icon: Wrench,
    isBonus: true,
    accent: "sky",
    nav: ["dashboard", "jobs", "marketplace", "documents", "billing", "assistant"],
  },
  employer: {
    id: "employer",
    icon: Briefcase,
    isBonus: true,
    accent: "gold",
    nav: ["dashboard", "jobs", "marketplace", "billing", "assistant"],
  },
};

export const ROLE_ORDER: RoleId[] = [
  "student",
  "instructor",
  "school",
  "owner",
  "admin",
  "mechanic",
  "employer",
];
