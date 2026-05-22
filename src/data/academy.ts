/** AirPath Academy — courses, modules, lessons, question bank. Mock data. */
import type { L10n } from "./mock";

export type CourseStage = "PPL" | "IR" | "CPL" | "CFI" | "CONV";
export type CourseStatus = "completed" | "in_progress" | "available" | "locked";
export type LessonType = "video" | "reading" | "diagram" | "quiz";
export type Accent = "purple" | "gold" | "sky" | "green";

export type Lesson = {
  id: string;
  title: L10n;
  type: LessonType;
  minutes: number;
  done: boolean;
};

export type CourseModule = {
  id: string;
  title: L10n;
  summary: L10n;
  locked: boolean;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  code: string;
  stage: CourseStage;
  title: L10n;
  tagline: L10n;
  description: L10n;
  level: L10n;
  faaPart: string;
  hours: number;
  price: number;
  rating: number;
  studentsCount: number;
  accent: Accent;
  status: CourseStatus;
  progress: number;
  instructor: string;
  outcomes: L10n[];
  modules: CourseModule[];
};

const L = (es: string, en: string): L10n => ({ es, en });

function lesson(id: string, es: string, en: string, type: LessonType, minutes: number, done: boolean): Lesson {
  return { id, title: L(es, en), type, minutes, done };
}

export const COURSES: Course[] = [
  {
    id: "ppl",
    code: "FAA-PPL",
    stage: "PPL",
    title: L("Piloto Privado (PPL)", "Private Pilot (PPL)"),
    tagline: L("Tu primera licencia. El comienzo de todo.", "Your first license. Where it all begins."),
    description: L(
      "Formación completa para obtener la licencia de Piloto Privado bajo regulaciones FAA. Cubre aerodinámica, meteorología, navegación, regulaciones y procedimientos de vuelo.",
      "Complete training to earn your FAA Private Pilot license. Covers aerodynamics, weather, navigation, regulations and flight procedures.",
    ),
    level: L("Principiante", "Beginner"),
    faaPart: "FAA Part 141",
    hours: 40,
    price: 1290,
    rating: 4.9,
    studentsCount: 1284,
    accent: "purple",
    status: "completed",
    progress: 100,
    instructor: "Cap. Andrés Morales",
    outcomes: [
      L("Operar una aeronave monomotor con seguridad", "Safely operate a single-engine aircraft"),
      L("Planificar y ejecutar vuelos cross-country", "Plan and execute cross-country flights"),
      L("Dominar comunicaciones con torre", "Master tower communications"),
    ],
    modules: [
      {
        id: "ppl-m1",
        title: L("Fundamentos de vuelo", "Principles of flight"),
        summary: L("Aerodinámica básica y fuerzas de vuelo.", "Basic aerodynamics and flight forces."),
        locked: false,
        lessons: [
          lesson("ppl-l1", "Las cuatro fuerzas del vuelo", "The four forces of flight", "video", 14, true),
          lesson("ppl-l2", "Superficies de control", "Control surfaces", "diagram", 9, true),
          lesson("ppl-l3", "Lectura: perfil alar", "Reading: airfoil design", "reading", 12, true),
          lesson("ppl-l4", "Evaluación del módulo", "Module assessment", "quiz", 15, true),
        ],
      },
      {
        id: "ppl-m2",
        title: L("Meteorología aeronáutica", "Aviation weather"),
        summary: L("Interpretación de METAR, TAF y cartas.", "Reading METAR, TAF and weather charts."),
        locked: false,
        lessons: [
          lesson("ppl-l5", "Sistemas de presión", "Pressure systems", "video", 16, true),
          lesson("ppl-l6", "Decodificar un METAR", "Decoding a METAR", "diagram", 11, true),
          lesson("ppl-l7", "Evaluación del módulo", "Module assessment", "quiz", 15, true),
        ],
      },
      {
        id: "ppl-m3",
        title: L("Navegación y regulaciones", "Navigation & regulations"),
        summary: L("Cartas, espacio aéreo y FAR/AIM.", "Charts, airspace and FAR/AIM."),
        locked: false,
        lessons: [
          lesson("ppl-l8", "Clases de espacio aéreo", "Airspace classes", "video", 18, true),
          lesson("ppl-l9", "Navegación por estima", "Dead reckoning navigation", "diagram", 13, true),
          lesson("ppl-l10", "Examen Written de práctica", "Practice Written exam", "quiz", 30, true),
        ],
      },
    ],
  },
  {
    id: "ir",
    code: "FAA-IR",
    stage: "IR",
    title: L("Habilitación Instrumental (IR)", "Instrument Rating (IR)"),
    tagline: L("Volá cuando otros no pueden.", "Fly when others can't."),
    description: L(
      "Habilitación para volar bajo reglas de vuelo por instrumentos (IFR). Procedimientos de aproximación, navegación instrumental y gestión de fallas.",
      "Rating to fly under instrument flight rules (IFR). Approach procedures, instrument navigation and failure management.",
    ),
    level: L("Intermedio", "Intermediate"),
    faaPart: "FAA Part 141",
    hours: 40,
    price: 1690,
    rating: 4.8,
    studentsCount: 742,
    accent: "sky",
    status: "in_progress",
    progress: 45,
    instructor: "Cap. Andrés Morales",
    outcomes: [
      L("Volar aproximaciones de precisión ILS", "Fly ILS precision approaches"),
      L("Operar en condiciones IMC con seguridad", "Operate safely in IMC conditions"),
      L("Gestionar fallas de instrumentos", "Manage instrument failures"),
    ],
    modules: [
      {
        id: "ir-m1",
        title: L("Vuelo por instrumentos", "Instrument flying"),
        summary: L("Scan, control de actitud y errores.", "Scan, attitude control and errors."),
        locked: false,
        lessons: [
          lesson("ir-l1", "El scan de instrumentos", "The instrument scan", "video", 17, true),
          lesson("ir-l2", "Errores del sistema pitot-estático", "Pitot-static system errors", "diagram", 12, true),
          lesson("ir-l3", "Evaluación del módulo", "Module assessment", "quiz", 15, true),
        ],
      },
      {
        id: "ir-m2",
        title: L("Procedimientos de aproximación", "Approach procedures"),
        summary: L("ILS, VOR, RNAV y circling.", "ILS, VOR, RNAV and circling."),
        locked: false,
        lessons: [
          lesson("ir-l4", "Anatomía de una aproximación ILS", "Anatomy of an ILS approach", "video", 21, true),
          lesson("ir-l5", "Cartas de aproximación Jeppesen", "Jeppesen approach charts", "diagram", 16, false),
          lesson("ir-l6", "Aproximaciones perdidas", "Missed approaches", "video", 14, false),
          lesson("ir-l7", "Evaluación del módulo", "Module assessment", "quiz", 15, false),
        ],
      },
      {
        id: "ir-m3",
        title: L("Vuelo IFR en ruta", "IFR enroute flying"),
        summary: L("Planes de vuelo, holding y desvíos.", "Flight plans, holding and diversions."),
        locked: true,
        lessons: [
          lesson("ir-l8", "Planificación de vuelo IFR", "IFR flight planning", "video", 19, false),
          lesson("ir-l9", "Procedimientos de holding", "Holding procedures", "diagram", 15, false),
          lesson("ir-l10", "Examen Written de práctica", "Practice Written exam", "quiz", 30, false),
        ],
      },
    ],
  },
  {
    id: "cpl",
    code: "FAA-CPL",
    stage: "CPL",
    title: L("Piloto Comercial (CPL)", "Commercial Pilot (CPL)"),
    tagline: L("Cobrá por hacer lo que amás.", "Get paid to do what you love."),
    description: L(
      "Licencia que te habilita a volar profesionalmente por remuneración. Maniobras comerciales, operaciones complejas y estándares de precisión.",
      "License that lets you fly professionally for compensation. Commercial maneuvers, complex operations and precision standards.",
    ),
    level: L("Avanzado", "Advanced"),
    faaPart: "FAA Part 141",
    hours: 120,
    price: 2490,
    rating: 4.9,
    studentsCount: 416,
    accent: "gold",
    status: "available",
    progress: 0,
    instructor: "Cap. Andrés Morales",
    outcomes: [
      L("Ejecutar maniobras comerciales con precisión", "Execute commercial maneuvers with precision"),
      L("Operar aeronaves de alto rendimiento", "Operate high-performance aircraft"),
      L("Cumplir estándares ACS comerciales", "Meet commercial ACS standards"),
    ],
    modules: [
      {
        id: "cpl-m1",
        title: L("Maniobras comerciales", "Commercial maneuvers"),
        summary: L("Chandelles, lazy eights y ochos.", "Chandelles, lazy eights and eights."),
        locked: false,
        lessons: [
          lesson("cpl-l1", "Chandelles y lazy eights", "Chandelles and lazy eights", "video", 20, false),
          lesson("cpl-l2", "Ochos sobre pilones", "Eights on pylons", "diagram", 14, false),
          lesson("cpl-l3", "Evaluación del módulo", "Module assessment", "quiz", 15, false),
        ],
      },
      {
        id: "cpl-m2",
        title: L("Operaciones de alto rendimiento", "High-performance operations"),
        summary: L("Tren retráctil, hélice de paso variable.", "Retractable gear, constant-speed prop."),
        locked: true,
        lessons: [
          lesson("cpl-l4", "Aeronaves complejas", "Complex aircraft", "video", 18, false),
          lesson("cpl-l5", "Performance y peso/balance", "Performance and weight/balance", "diagram", 16, false),
          lesson("cpl-l6", "Evaluación del módulo", "Module assessment", "quiz", 15, false),
        ],
      },
    ],
  },
  {
    id: "cfi",
    code: "FAA-CFI",
    stage: "CFI",
    title: L("Instructor de Vuelo (CFI)", "Flight Instructor (CFI)"),
    tagline: L("Enseñá a volar. Multiplicá tu impacto.", "Teach others to fly. Multiply your impact."),
    description: L(
      "Conviértete en instructor certificado FAA. Fundamentos de instrucción, psicología del aprendizaje y técnicas de enseñanza en vuelo.",
      "Become an FAA certified instructor. Fundamentals of instruction, learning psychology and in-flight teaching techniques.",
    ),
    level: L("Avanzado", "Advanced"),
    faaPart: "FAA Part 141",
    hours: 60,
    price: 2190,
    rating: 4.7,
    studentsCount: 238,
    accent: "green",
    status: "locked",
    progress: 0,
    instructor: "Cap. Andrés Morales",
    outcomes: [
      L("Aplicar fundamentos de instrucción (FOI)", "Apply fundamentals of instruction (FOI)"),
      L("Diseñar lecciones de vuelo efectivas", "Design effective flight lessons"),
      L("Evaluar y corregir a estudiantes", "Assess and correct students"),
    ],
    modules: [
      {
        id: "cfi-m1",
        title: L("Fundamentos de instrucción", "Fundamentals of instruction"),
        summary: L("Cómo aprenden los estudiantes.", "How students learn."),
        locked: true,
        lessons: [
          lesson("cfi-l1", "El proceso de aprendizaje", "The learning process", "video", 16, false),
          lesson("cfi-l2", "Técnicas de enseñanza", "Teaching techniques", "reading", 14, false),
          lesson("cfi-l3", "Evaluación del módulo", "Module assessment", "quiz", 15, false),
        ],
      },
    ],
  },
  {
    id: "conv",
    code: "FAA-CONV",
    stage: "CONV",
    title: L("Conversión a Licencia FAA", "FAA License Conversion"),
    tagline: L("Tu licencia ANAC, ahora también FAA.", "Your ANAC license, now FAA too."),
    description: L(
      "Programa de diferencias y adaptación para pilotos con licencia extranjera (ANAC y otras) que buscan operar bajo regulaciones FAA en USA.",
      "Differences and adaptation program for pilots with a foreign license (ANAC and others) seeking to operate under FAA regulations in the USA.",
    ),
    level: L("Variable", "Variable"),
    faaPart: "FAA 61.75 / Part 141",
    hours: 25,
    price: 990,
    rating: 4.9,
    studentsCount: 531,
    accent: "purple",
    status: "available",
    progress: 0,
    instructor: "Cap. Andrés Morales",
    outcomes: [
      L("Entender las diferencias regulatorias FAA vs ANAC", "Understand FAA vs ANAC regulatory differences"),
      L("Tramitar el certificado FAA 61.75", "Process the FAA 61.75 certificate"),
      L("Aprobar el examen de conversión", "Pass the conversion exam"),
    ],
    modules: [
      {
        id: "conv-m1",
        title: L("Diferencias regulatorias", "Regulatory differences"),
        summary: L("FAR/AIM vs RAAC. Qué cambia.", "FAR/AIM vs RAAC. What changes."),
        locked: false,
        lessons: [
          lesson("conv-l1", "FAA vs ANAC: el mapa completo", "FAA vs ANAC: the full map", "video", 22, false),
          lesson("conv-l2", "Espacio aéreo y fraseología", "Airspace and phraseology", "diagram", 15, false),
          lesson("conv-l3", "El certificado 61.75 paso a paso", "The 61.75 certificate step by step", "reading", 18, false),
          lesson("conv-l4", "Evaluación del módulo", "Module assessment", "quiz", 15, false),
        ],
      },
      {
        id: "conv-m2",
        title: L("Adaptación operacional", "Operational adaptation"),
        summary: L("Volar en el sistema FAA día a día.", "Flying the FAA system day to day."),
        locked: true,
        lessons: [
          lesson("conv-l5", "Operaciones en aeropuertos US", "Operations at US airports", "video", 17, false),
          lesson("conv-l6", "Examen de conversión", "Conversion exam", "quiz", 30, false),
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Written exam — question bank                                        */
/* ------------------------------------------------------------------ */

export type QCategory = "regs" | "weather" | "nav" | "aero" | "systems" | "procedures";
export type QType = "multiple" | "truefalse" | "visual" | "ordering" | "calculation";
export type QDifficulty = "basic" | "intermediate" | "advanced";

export type ExamQuestion = {
  id: string;
  category: QCategory;
  type: QType;
  difficulty: QDifficulty;
  prompt: L10n;
  options?: L10n[];
  correctIndex?: number;
  orderItems?: L10n[];
  calcAnswer?: number;
  calcUnit?: string;
  calcTolerance?: number;
  explanation: L10n;
};

export const QUESTION_CATEGORIES: { id: QCategory; label: L10n }[] = [
  { id: "regs", label: L("Regulaciones", "Regulations") },
  { id: "weather", label: L("Meteorología", "Weather") },
  { id: "nav", label: L("Navegación", "Navigation") },
  { id: "aero", label: L("Aerodinámica", "Aerodynamics") },
  { id: "systems", label: L("Sistemas", "Systems") },
  { id: "procedures", label: L("Procedimientos", "Procedures") },
];

export const QUESTION_BANK: ExamQuestion[] = [
  {
    id: "q1",
    category: "regs",
    type: "multiple",
    difficulty: "basic",
    prompt: L(
      "¿Cuál es la altitud mínima de vuelo sobre áreas congestionadas según la FAR 91.119?",
      "What is the minimum flight altitude over congested areas per FAR 91.119?",
    ),
    options: [
      L("500 ft sobre el obstáculo más alto", "500 ft above the highest obstacle"),
      L("1000 ft sobre el obstáculo más alto en radio de 2000 ft", "1000 ft above the highest obstacle within 2000 ft"),
      L("2000 ft AGL en todo momento", "2000 ft AGL at all times"),
      L("No hay altitud mínima establecida", "There is no established minimum"),
    ],
    correctIndex: 1,
    explanation: L(
      "La FAR 91.119 exige 1000 ft sobre el obstáculo más alto dentro de un radio horizontal de 2000 ft de la aeronave en áreas congestionadas.",
      "FAR 91.119 requires 1000 ft above the highest obstacle within a 2000 ft horizontal radius of the aircraft over congested areas.",
    ),
  },
  {
    id: "q2",
    category: "weather",
    type: "truefalse",
    difficulty: "basic",
    prompt: L(
      "Un METAR que reporta 'OVC008' indica techo de nubes cubierto a 800 pies AGL.",
      "A METAR reporting 'OVC008' indicates an overcast ceiling at 800 feet AGL.",
    ),
    options: [L("Verdadero", "True"), L("Falso", "False")],
    correctIndex: 0,
    explanation: L(
      "Correcto. 'OVC' significa overcast (cubierto) y '008' son cientos de pies: 800 ft AGL.",
      "Correct. 'OVC' means overcast and '008' is hundreds of feet: 800 ft AGL.",
    ),
  },
  {
    id: "q3",
    category: "aero",
    type: "multiple",
    difficulty: "intermediate",
    prompt: L(
      "¿Qué ocurre con la velocidad de pérdida (stall) cuando aumenta el peso de la aeronave?",
      "What happens to stall speed when aircraft weight increases?",
    ),
    options: [
      L("Disminuye", "It decreases"),
      L("Aumenta", "It increases"),
      L("No cambia", "It stays the same"),
      L("Depende del viento", "It depends on wind"),
    ],
    correctIndex: 1,
    explanation: L(
      "Mayor peso requiere mayor sustentación, por lo que la aeronave debe volar a mayor velocidad para no entrar en pérdida.",
      "More weight requires more lift, so the aircraft must fly faster to avoid a stall.",
    ),
  },
  {
    id: "q4",
    category: "nav",
    type: "visual",
    difficulty: "intermediate",
    prompt: L(
      "Observá el símbolo de carta sectional. ¿Qué tipo de espacio aéreo representa una línea azul punteada?",
      "Look at the sectional chart symbol. What airspace does a dashed blue line represent?",
    ),
    options: [
      L("Espacio aéreo Clase B", "Class B airspace"),
      L("Espacio aéreo Clase C", "Class C airspace"),
      L("Espacio aéreo Clase D", "Class D airspace"),
      L("Espacio aéreo Clase E en superficie", "Class E surface airspace"),
    ],
    correctIndex: 2,
    explanation: L(
      "La línea azul segmentada (dashed) en una carta sectional representa el espacio aéreo Clase D, usualmente alrededor de aeropuertos con torre.",
      "The dashed blue line on a sectional chart represents Class D airspace, typically around towered airports.",
    ),
  },
  {
    id: "q5",
    category: "procedures",
    type: "ordering",
    difficulty: "intermediate",
    prompt: L(
      "Ordená los pasos correctos del procedimiento de despegue normal.",
      "Order the correct steps of a normal takeoff procedure.",
    ),
    orderItems: [
      L("Aplicar potencia máxima suavemente", "Smoothly apply full power"),
      L("Verificar instrumentos del motor", "Check engine instruments"),
      L("Rotar a la velocidad de rotación (Vr)", "Rotate at rotation speed (Vr)"),
      L("Establecer velocidad de ascenso (Vy)", "Establish climb speed (Vy)"),
    ],
    explanation: L(
      "El orden correcto: potencia → verificar instrumentos → rotar en Vr → ascenso en Vy.",
      "Correct order: power → check instruments → rotate at Vr → climb at Vy.",
    ),
  },
  {
    id: "q6",
    category: "nav",
    type: "calculation",
    difficulty: "intermediate",
    prompt: L(
      "Volás a 120 nudos de velocidad respecto al suelo. ¿Cuántos minutos tardás en recorrer 30 millas náuticas?",
      "You fly at 120 knots ground speed. How many minutes to cover 30 nautical miles?",
    ),
    calcAnswer: 15,
    calcUnit: "min",
    calcTolerance: 1,
    explanation: L(
      "Tiempo = distancia / velocidad = 30 NM / 120 kt = 0.25 h = 15 minutos.",
      "Time = distance / speed = 30 NM / 120 kt = 0.25 hr = 15 minutes.",
    ),
  },
  {
    id: "q7",
    category: "weather",
    type: "multiple",
    difficulty: "advanced",
    prompt: L(
      "¿Qué fenómeno meteorológico representa el mayor peligro durante una aproximación final?",
      "Which weather phenomenon poses the greatest hazard during final approach?",
    ),
    options: [
      L("Niebla ligera", "Light fog"),
      L("Cizalladura del viento (wind shear)", "Wind shear"),
      L("Cielo despejado", "Clear skies"),
      L("Viento en calma", "Calm wind"),
    ],
    correctIndex: 1,
    explanation: L(
      "La cizalladura del viento puede causar pérdida súbita de sustentación cerca del suelo, siendo crítica en aproximación final.",
      "Wind shear can cause sudden loss of lift near the ground, critical during final approach.",
    ),
  },
  {
    id: "q8",
    category: "systems",
    type: "truefalse",
    difficulty: "intermediate",
    prompt: L(
      "El sistema pitot-estático afecta directamente al altímetro, velocímetro y variómetro.",
      "The pitot-static system directly affects the altimeter, airspeed indicator and vertical speed indicator.",
    ),
    options: [L("Verdadero", "True"), L("Falso", "False")],
    correctIndex: 0,
    explanation: L(
      "Correcto. Los tres instrumentos dependen de las presiones estática y/o de impacto del sistema pitot-estático.",
      "Correct. All three instruments depend on static and/or ram pressure from the pitot-static system.",
    ),
  },
  {
    id: "q9",
    category: "regs",
    type: "multiple",
    difficulty: "intermediate",
    prompt: L(
      "¿Cada cuánto debe realizarse una revisión de vuelo (flight review) según la FAR 61.56?",
      "How often must a flight review be completed per FAR 61.56?",
    ),
    options: [
      L("Cada 12 meses calendario", "Every 12 calendar months"),
      L("Cada 24 meses calendario", "Every 24 calendar months"),
      L("Cada 6 meses", "Every 6 months"),
      L("Solo una vez", "Only once"),
    ],
    correctIndex: 1,
    explanation: L(
      "La FAR 61.56 requiere una revisión de vuelo cada 24 meses calendario para actuar como piloto al mando.",
      "FAR 61.56 requires a flight review every 24 calendar months to act as pilot in command.",
    ),
  },
  {
    id: "q10",
    category: "aero",
    type: "calculation",
    difficulty: "advanced",
    prompt: L(
      "Una aeronave pesa 2400 lb y genera 2400 lb de sustentación en vuelo recto y nivelado. En un viraje de 60° de inclinación, ¿cuánta sustentación necesita (factor de carga 2G)?",
      "An aircraft weighs 2400 lb and generates 2400 lb of lift in straight-and-level flight. In a 60° bank turn, how much lift is needed (load factor 2G)?",
    ),
    calcAnswer: 4800,
    calcUnit: "lb",
    calcTolerance: 50,
    explanation: L(
      "En un viraje de 60° el factor de carga es 2G, por lo que la sustentación requerida es 2400 lb × 2 = 4800 lb.",
      "In a 60° bank the load factor is 2G, so required lift is 2400 lb × 2 = 4800 lb.",
    ),
  },
  {
    id: "q11",
    category: "procedures",
    type: "multiple",
    difficulty: "basic",
    prompt: L(
      "Ante una falla de motor en vuelo, ¿cuál es la primera acción del piloto?",
      "Upon an engine failure in flight, what is the pilot's first action?",
    ),
    options: [
      L("Establecer la velocidad de mejor planeo", "Establish best glide speed"),
      L("Llamar a la torre inmediatamente", "Call the tower immediately"),
      L("Apagar todos los sistemas eléctricos", "Shut down all electrical systems"),
      L("Bajar el tren de aterrizaje", "Lower the landing gear"),
    ],
    correctIndex: 0,
    explanation: L(
      "Aviar, navegar, comunicar: lo primero es establecer la velocidad de mejor planeo para maximizar el alcance y el tiempo.",
      "Aviate, navigate, communicate: first establish best glide speed to maximize range and time.",
    ),
  },
  {
    id: "q12",
    category: "nav",
    type: "visual",
    difficulty: "basic",
    prompt: L(
      "En una rosa de los vientos, ¿qué rumbo magnético corresponde al este?",
      "On a compass rose, what magnetic heading corresponds to east?",
    ),
    options: [L("000°", "000°"), L("090°", "090°"), L("180°", "180°"), L("270°", "270°")],
    correctIndex: 1,
    explanation: L(
      "El este corresponde a un rumbo de 090°. Norte 000°, este 090°, sur 180°, oeste 270°.",
      "East corresponds to a 090° heading. North 000°, east 090°, south 180°, west 270°.",
    ),
  },
];
