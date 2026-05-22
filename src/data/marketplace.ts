/** AirPath Marketplace — aircraft, instructors, schools, charter. Mock data. */
import type { L10n } from "./mock";
import type { Accent } from "./academy";

const L = (es: string, en: string): L10n => ({ es, en });

/* ------------------------------------------------------------------ */
/*  Aircraft                                                            */
/* ------------------------------------------------------------------ */

export type Aircraft = {
  id: string;
  tailNumber: string;
  model: string;
  year: number;
  category: L10n;
  totalHours: number;
  seats: number;
  location: string;
  pricePerHour: number;
  rating: number;
  reviews: number;
  owner: string;
  accent: Accent;
  timeBuilding: boolean;
  available: boolean;
  certifications: string[];
  specs: { label: L10n; value: string }[];
};

export const AIRCRAFT: Aircraft[] = [
  {
    id: "ac-1",
    tailNumber: "N512AP",
    model: "Cessna 172 Skyhawk",
    year: 2019,
    category: L("Monomotor pistón", "Single-engine piston"),
    totalHours: 2840,
    seats: 4,
    location: "Fort Lauderdale, FL",
    pricePerHour: 165,
    rating: 4.9,
    reviews: 87,
    owner: "Carolina Duarte",
    accent: "purple",
    timeBuilding: true,
    available: true,
    certifications: ["IFR", "GPS WAAS", "ADS-B"],
    specs: [
      { label: L("Velocidad crucero", "Cruise speed"), value: "124 kt" },
      { label: L("Autonomía", "Range"), value: "640 NM" },
      { label: L("Aviónica", "Avionics"), value: "Garmin G1000" },
    ],
  },
  {
    id: "ac-2",
    tailNumber: "N88RG",
    model: "Piper Arrow PA-28R",
    year: 2016,
    category: L("Complejo retráctil", "Complex retractable"),
    totalHours: 3960,
    seats: 4,
    location: "Miami, FL",
    pricePerHour: 210,
    rating: 4.8,
    reviews: 54,
    owner: "Carolina Duarte",
    accent: "sky",
    timeBuilding: true,
    available: true,
    certifications: ["IFR", "Complejo", "ADS-B"],
    specs: [
      { label: L("Velocidad crucero", "Cruise speed"), value: "137 kt" },
      { label: L("Autonomía", "Range"), value: "720 NM" },
      { label: L("Tren", "Gear"), value: L("Retráctil", "Retractable").es },
    ],
  },
  {
    id: "ac-3",
    tailNumber: "N740TB",
    model: "Cirrus SR20",
    year: 2021,
    category: L("Monomotor avanzado", "Advanced single-engine"),
    totalHours: 1120,
    seats: 4,
    location: "Austin, TX",
    pricePerHour: 245,
    rating: 5.0,
    reviews: 41,
    owner: "Carolina Duarte",
    accent: "gold",
    timeBuilding: true,
    available: true,
    certifications: ["IFR", "CAPS", "Perspective+"],
    specs: [
      { label: L("Velocidad crucero", "Cruise speed"), value: "155 kt" },
      { label: L("Autonomía", "Range"), value: "709 NM" },
      { label: L("Paracaídas", "Parachute"), value: "CAPS" },
    ],
  },
  {
    id: "ac-4",
    tailNumber: "N219ME",
    model: "Diamond DA42 Twin Star",
    year: 2018,
    category: L("Multimotor", "Multi-engine"),
    totalHours: 2210,
    seats: 4,
    location: "Phoenix, AZ",
    pricePerHour: 390,
    rating: 4.9,
    reviews: 33,
    owner: "Skyline Flight Academy",
    accent: "purple",
    timeBuilding: true,
    available: true,
    certifications: ["IFR", "Multimotor", "Diesel"],
    specs: [
      { label: L("Velocidad crucero", "Cruise speed"), value: "165 kt" },
      { label: L("Motores", "Engines"), value: "2 × Austro AE300" },
      { label: L("Autonomía", "Range"), value: "1200 NM" },
    ],
  },
  {
    id: "ac-5",
    tailNumber: "N301SK",
    model: "Cessna 152",
    year: 2014,
    category: L("Entrenador básico", "Basic trainer"),
    totalHours: 6740,
    seats: 2,
    location: "San Diego, CA",
    pricePerHour: 130,
    rating: 4.7,
    reviews: 112,
    owner: "Skyline Flight Academy",
    accent: "green",
    timeBuilding: true,
    available: true,
    certifications: ["VFR", "ADS-B"],
    specs: [
      { label: L("Velocidad crucero", "Cruise speed"), value: "107 kt" },
      { label: L("Autonomía", "Range"), value: "415 NM" },
      { label: L("Ideal para", "Ideal for"), value: "PPL" },
    ],
  },
  {
    id: "ac-6",
    tailNumber: "N455AV",
    model: "Beechcraft Bonanza G36",
    year: 2020,
    category: L("Monomotor de alto rendimiento", "High-performance single"),
    totalHours: 980,
    seats: 6,
    location: "Dallas, TX",
    pricePerHour: 320,
    rating: 5.0,
    reviews: 27,
    owner: "Carolina Duarte",
    accent: "gold",
    timeBuilding: false,
    available: true,
    certifications: ["IFR", "Alto rendimiento", "G1000 NXi"],
    specs: [
      { label: L("Velocidad crucero", "Cruise speed"), value: "176 kt" },
      { label: L("Autonomía", "Range"), value: "920 NM" },
      { label: L("Asientos", "Seats"), value: "6" },
    ],
  },
  {
    id: "ac-7",
    tailNumber: "N612CL",
    model: "Cessna 172 Skyhawk",
    year: 2017,
    category: L("Monomotor pistón", "Single-engine piston"),
    totalHours: 4310,
    seats: 4,
    location: "Bogotá, Colombia",
    pricePerHour: 145,
    rating: 4.8,
    reviews: 63,
    owner: "Skyline Flight Academy",
    accent: "sky",
    timeBuilding: true,
    available: false,
    certifications: ["IFR", "GPS", "ADS-B"],
    specs: [
      { label: L("Velocidad crucero", "Cruise speed"), value: "122 kt" },
      { label: L("Autonomía", "Range"), value: "630 NM" },
      { label: L("Aviónica", "Avionics"), value: "Garmin G1000" },
    ],
  },
  {
    id: "ac-8",
    tailNumber: "N909XP",
    model: "Piper Seminole PA-44",
    year: 2019,
    category: L("Multimotor entrenador", "Multi-engine trainer"),
    totalHours: 1870,
    seats: 4,
    location: "Orlando, FL",
    pricePerHour: 365,
    rating: 4.9,
    reviews: 38,
    owner: "Skyline Flight Academy",
    accent: "purple",
    timeBuilding: true,
    available: true,
    certifications: ["IFR", "Multimotor", "ADS-B"],
    specs: [
      { label: L("Velocidad crucero", "Cruise speed"), value: "162 kt" },
      { label: L("Motores", "Engines"), value: "2 × Lycoming O-360" },
      { label: L("Ideal para", "Ideal for"), value: "CPL / ME" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Instructors                                                         */
/* ------------------------------------------------------------------ */

export type Instructor = {
  id: string;
  name: string;
  initials: string;
  ratings: string[];
  specialties: L10n[];
  location: string;
  hourlyRate: number;
  rating: number;
  reviews: number;
  hoursLogged: number;
  accent: Accent;
  available: boolean;
  bio: L10n;
};

export const INSTRUCTORS: Instructor[] = [
  {
    id: "in-1",
    name: "Cap. Andrés Morales",
    initials: "AM",
    ratings: ["CFI", "CFII", "MEI"],
    specialties: [L("Habilitación instrumental", "Instrument rating"), L("Multimotor", "Multi-engine")],
    location: "Miami, FL",
    hourlyRate: 75,
    rating: 4.9,
    reviews: 214,
    hoursLogged: 8400,
    accent: "purple",
    available: true,
    bio: L(
      "Piloto de aerolínea e instructor FAA con más de 8.000 horas. Especialista en formación instrumental y conversión de licencias.",
      "Airline pilot and FAA instructor with over 8,000 hours. Specialist in instrument training and license conversion.",
    ),
  },
  {
    id: "in-2",
    name: "Valentina Ríos",
    initials: "VR",
    ratings: ["CFI", "CFII"],
    specialties: [L("Piloto privado", "Private pilot"), L("Vuelo nocturno", "Night flying")],
    location: "Fort Lauderdale, FL",
    hourlyRate: 62,
    rating: 4.8,
    reviews: 156,
    hoursLogged: 4200,
    accent: "sky",
    available: true,
    bio: L(
      "Instructora apasionada por los primeros pasos en aviación. Paciente y metódica con estudiantes nuevos.",
      "Instructor passionate about first steps in aviation. Patient and methodical with new students.",
    ),
  },
  {
    id: "in-3",
    name: "Daniel Okafor",
    initials: "DO",
    ratings: ["CFI", "CFII", "MEI"],
    specialties: [L("Piloto comercial", "Commercial pilot"), L("Maniobras", "Maneuvers")],
    location: "Phoenix, AZ",
    hourlyRate: 80,
    rating: 5.0,
    reviews: 98,
    hoursLogged: 6100,
    accent: "gold",
    available: true,
    bio: L(
      "Examinador designado y experto en estándares ACS comerciales. Forma pilotos listos para aerolínea.",
      "Designated examiner and expert in commercial ACS standards. Trains airline-ready pilots.",
    ),
  },
  {
    id: "in-4",
    name: "Sofía Mendoza",
    initials: "SM",
    ratings: ["CFI"],
    specialties: [L("Piloto privado", "Private pilot"), L("Conversión ANAC→FAA", "ANAC→FAA conversion")],
    location: "Bogotá, Colombia",
    hourlyRate: 48,
    rating: 4.9,
    reviews: 73,
    hoursLogged: 2900,
    accent: "green",
    available: true,
    bio: L(
      "Especialista en acompañar a pilotos latinoamericanos en su conversión al sistema FAA.",
      "Specialist in guiding Latin American pilots through their FAA conversion.",
    ),
  },
  {
    id: "in-5",
    name: "Marcus Bennett",
    initials: "MB",
    ratings: ["CFI", "CFII", "MEI"],
    specialties: [L("Multimotor", "Multi-engine"), L("Alto rendimiento", "High performance")],
    location: "Dallas, TX",
    hourlyRate: 85,
    rating: 4.7,
    reviews: 121,
    hoursLogged: 7300,
    accent: "purple",
    available: false,
    bio: L(
      "20 años de experiencia. Instructor de instructores y mentor de carrera para futuros pilotos de línea.",
      "20 years of experience. Instructor of instructors and career mentor for future airline pilots.",
    ),
  },
  {
    id: "in-6",
    name: "Camila Ferrari",
    initials: "CF",
    ratings: ["CFI", "CFII"],
    specialties: [L("Habilitación instrumental", "Instrument rating"), L("Examen Written", "Written exam")],
    location: "San Diego, CA",
    hourlyRate: 68,
    rating: 4.9,
    reviews: 142,
    hoursLogged: 5000,
    accent: "sky",
    available: true,
    bio: L(
      "Mentora de preparación para el examen Written FAA. Tasa de aprobación del 96% entre sus alumnos.",
      "FAA Written exam prep mentor. 96% pass rate among her students.",
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Flight schools                                                      */
/* ------------------------------------------------------------------ */

export type School = {
  id: string;
  name: string;
  initials: string;
  location: string;
  country: string;
  flag: string;
  rating: number;
  reviews: number;
  studentsCount: number;
  verified: boolean;
  accent: Accent;
  priceFrom: number;
  programs: L10n[];
  highlight: L10n;
};

export const SCHOOLS: School[] = [
  {
    id: "sc-1",
    name: "Skyline Flight Academy",
    initials: "SF",
    location: "Fort Lauderdale, FL",
    country: "USA",
    flag: "🇺🇸",
    rating: 4.9,
    reviews: 312,
    studentsCount: 480,
    verified: true,
    accent: "purple",
    priceFrom: 52000,
    programs: [L("PPL", "PPL"), L("IR", "IR"), L("CPL", "CPL"), L("CFI", "CFI")],
    highlight: L("Carrera completa cero-a-aerolínea en 14 meses.", "Full zero-to-airline career in 14 months."),
  },
  {
    id: "sc-2",
    name: "Andes Aviation Center",
    initials: "AA",
    location: "Bogotá, Colombia",
    country: "Colombia",
    flag: "🇨🇴",
    rating: 4.8,
    reviews: 187,
    studentsCount: 260,
    verified: true,
    accent: "gold",
    priceFrom: 45000,
    programs: [L("PPL", "PPL"), L("Conversión FAA", "FAA conversion"), L("IR", "IR")],
    highlight: L("Sacá tu licencia desde USD 45.000, no USD 110.000.", "Get your license from USD 45,000, not USD 110,000."),
  },
  {
    id: "sc-3",
    name: "Pampa Wings Flight School",
    initials: "PW",
    location: "Buenos Aires, Argentina",
    country: "Argentina",
    flag: "🇦🇷",
    rating: 4.7,
    reviews: 143,
    studentsCount: 190,
    verified: true,
    accent: "sky",
    priceFrom: 48000,
    programs: [L("PPL", "PPL"), L("Conversión ANAC↔FAA", "ANAC↔FAA conversion")],
    highlight: L("Doble aval ANAC y FAA en un mismo programa.", "Dual ANAC and FAA approval in one program."),
  },
  {
    id: "sc-4",
    name: "Desert Sky Aviation",
    initials: "DS",
    location: "Phoenix, AZ",
    country: "USA",
    flag: "🇺🇸",
    rating: 4.9,
    reviews: 268,
    studentsCount: 410,
    verified: true,
    accent: "gold",
    priceFrom: 58000,
    programs: [L("PPL", "PPL"), L("IR", "IR"), L("CPL", "CPL"), L("Multimotor", "Multi-engine")],
    highlight: L("330 días de sol al año: más vuelo, menos demoras.", "330 sunny days a year: more flying, fewer delays."),
  },
  {
    id: "sc-5",
    name: "Azteca Flight Training",
    initials: "AF",
    location: "Ciudad de México, México",
    country: "México",
    flag: "🇲🇽",
    rating: 4.6,
    reviews: 96,
    studentsCount: 150,
    verified: true,
    accent: "green",
    priceFrom: 46000,
    programs: [L("PPL", "PPL"), L("Conversión FAA", "FAA conversion")],
    highlight: L("Puente directo a programas FAA en USA.", "Direct bridge to FAA programs in the USA."),
  },
  {
    id: "sc-6",
    name: "Coastal Aviators",
    initials: "CA",
    location: "San Diego, CA",
    country: "USA",
    flag: "🇺🇸",
    rating: 4.8,
    reviews: 201,
    studentsCount: 330,
    verified: true,
    accent: "purple",
    priceFrom: 60000,
    programs: [L("PPL", "PPL"), L("IR", "IR"), L("CPL", "CPL")],
    highlight: L("Flota moderna con aviónica glass cockpit.", "Modern fleet with glass cockpit avionics."),
  },
];

/* ------------------------------------------------------------------ */
/*  Charter & empty legs                                                */
/* ------------------------------------------------------------------ */

export type CharterListing = {
  id: string;
  kind: "charter" | "emptyleg";
  operator: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  date: string;
  aircraft: string;
  seats: number;
  price: number;
  accent: Accent;
};

export const CHARTERS: CharterListing[] = [
  {
    id: "ch-1",
    kind: "emptyleg",
    operator: "Aero Charter Group",
    from: "Miami",
    fromCode: "KMIA",
    to: "Nueva York",
    toCode: "KTEB",
    date: "2026-06-04",
    aircraft: "Embraer Phenom 300",
    seats: 7,
    price: 8900,
    accent: "gold",
  },
  {
    id: "ch-2",
    kind: "emptyleg",
    operator: "Blue Horizon Jets",
    from: "Los Ángeles",
    fromCode: "KLAX",
    to: "Las Vegas",
    toCode: "KLAS",
    date: "2026-06-06",
    aircraft: "Citation CJ3",
    seats: 6,
    price: 4200,
    accent: "sky",
  },
  {
    id: "ch-3",
    kind: "charter",
    operator: "Aero Charter Group",
    from: "Fort Lauderdale",
    fromCode: "KFLL",
    to: "Bahamas",
    toCode: "MYNN",
    date: "2026-06-09",
    aircraft: "King Air 350",
    seats: 9,
    price: 6500,
    accent: "purple",
  },
  {
    id: "ch-4",
    kind: "emptyleg",
    operator: "Pampa Executive",
    from: "Buenos Aires",
    fromCode: "SABE",
    to: "Punta del Este",
    toCode: "SULS",
    date: "2026-06-11",
    aircraft: "Phenom 100",
    seats: 4,
    price: 3100,
    accent: "green",
  },
  {
    id: "ch-5",
    kind: "charter",
    operator: "Blue Horizon Jets",
    from: "Dallas",
    fromCode: "KDAL",
    to: "Aspen",
    toCode: "KASE",
    date: "2026-06-14",
    aircraft: "Challenger 350",
    seats: 8,
    price: 11200,
    accent: "gold",
  },
];
