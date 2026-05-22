/** Keyword-based mock replies for the AirPath AI copilot. */

export type Lang = "es" | "en";

export type AssistantReply = {
  text: string;
  bullets?: string[];
  cta?: { label: string; href: string };
};

export const WELCOME: Record<Lang, string> = {
  es: "Hola 👋 Soy tu copiloto AirPath. Preguntame lo que quieras sobre tu carrera, cursos, aeronaves, licencias o el examen FAA. Estoy acá para ayudarte a despegar.",
  en: "Hi 👋 I'm your AirPath copilot. Ask me anything about your career, courses, aircraft, licenses or the FAA exam. I'm here to help you take off.",
};

export const SUGGESTED: Record<Lang, string[]> = {
  es: [
    "¿Qué licencia necesito para volar en USA con licencia argentina?",
    "¿Qué curso me conviene para ser piloto de aerolínea?",
    "¿Cuánto cuesta hacer el time building?",
    "¿Cómo voy con mi progreso?",
    "¿Qué estudio para el examen Written?",
  ],
  en: [
    "What license do I need to fly in the USA with an Argentine license?",
    "Which course is best to become an airline pilot?",
    "How much does time building cost?",
    "How am I doing with my progress?",
    "What should I study for the Written exam?",
  ],
};

export function getReply(input: string, lang: Lang): AssistantReply {
  const q = input.toLowerCase();
  const has = (...ks: string[]) => ks.some((k) => q.includes(k));

  // FAA conversion
  if (has("conver", "anac", "argentin", "extranjer", "61.75", "validar", "validación de licencia")) {
    return lang === "es"
      ? {
          text: "Con una licencia ANAC podés operar en USA tramitando un certificado FAA basado en tu licencia extranjera (regla 61.75). Nuestro curso de Conversión FAA te prepara para todo el proceso:",
          bullets: [
            "Diferencias regulatorias FAR/AIM vs RAAC",
            "Trámite del certificado FAA 61.75 paso a paso",
            "Adaptación de fraseología y espacio aéreo US",
            "25 horas · USD 990 · aval FAA",
          ],
          cta: { label: "Ver curso de Conversión FAA", href: "/academy/conv" },
        }
      : {
          text: "With an ANAC license you can operate in the USA by processing an FAA certificate based on your foreign license (rule 61.75). Our FAA Conversion course prepares you for the whole process:",
          bullets: [
            "FAR/AIM vs RAAC regulatory differences",
            "Step-by-step FAA 61.75 certificate process",
            "US phraseology and airspace adaptation",
            "25 hours · USD 990 · FAA backed",
          ],
          cta: { label: "See FAA Conversion course", href: "/academy/conv" },
        };
  }

  // Airline career path
  if (has("aerolíne", "aerolinea", "airline", "carrera", "piloto de línea", "ruta")) {
    return lang === "es"
      ? {
          text: "La ruta completa hacia la cabina de una aerolínea tiene 4 etapas. En AirPath las cursás en orden, cada una desbloquea la siguiente:",
          bullets: [
            "1 · PPL — Piloto Privado (40 h)",
            "2 · IR — Habilitación Instrumental (40 h)",
            "3 · CPL — Piloto Comercial (250 h totales)",
            "4 · ATP — Piloto de Aerolínea (1500 h)",
          ],
          cta: { label: "Ver mi ruta de carrera", href: "/dashboard" },
        }
      : {
          text: "The full path to an airline flight deck has 4 stages. On AirPath you take them in order — each unlocks the next:",
          bullets: [
            "1 · PPL — Private Pilot (40 hr)",
            "2 · IR — Instrument Rating (40 hr)",
            "3 · CPL — Commercial Pilot (250 hr total)",
            "4 · ATP — Airline Pilot (1500 hr)",
          ],
          cta: { label: "See my career path", href: "/dashboard" },
        };
  }

  // Time building / aircraft cost
  if (has("time building", "cuesta", "costo", "precio", "renta", "rentar", "aeronave", "alquil", "cost", "rent", "hour")) {
    return lang === "es"
      ? {
          text: "Para el time building reservás aeronaves con matrícula N directamente en el marketplace. Algunos ejemplos disponibles:",
          bullets: [
            "Cessna 152 — USD 130/h (entrenador básico)",
            "Cessna 172 Skyhawk — USD 165/h (IFR · G1000)",
            "Cirrus SR20 — USD 245/h (avanzado · CAPS)",
            "Reservás tipo Turo: solicitás y el dueño aprueba.",
          ],
          cta: { label: "Explorar aeronaves", href: "/marketplace" },
        }
      : {
          text: "For time building you book N-registered aircraft directly in the marketplace. A few available examples:",
          bullets: [
            "Cessna 152 — USD 130/hr (basic trainer)",
            "Cessna 172 Skyhawk — USD 165/hr (IFR · G1000)",
            "Cirrus SR20 — USD 245/hr (advanced · CAPS)",
            "Turo-style booking: you request, the owner approves.",
          ],
          cta: { label: "Explore aircraft", href: "/marketplace" },
        };
  }

  // Progress
  if (has("progreso", "avance", "cómo voy", "como voy", "progress", "how am i", "doing")) {
    return lang === "es"
      ? {
          text: "Vas muy bien, Juan Camilo. Tu estado actual en la ruta de carrera:",
          bullets: [
            "PPL — Piloto Privado: 100% ✓ certificado",
            "IR — Habilitación Instrumental: 45% en curso",
            "Racha de estudio: 15 días seguidos 🔥",
            "Puntos AirPath: 2.480 · 4 logros desbloqueados",
          ],
          cta: { label: "Ir a mi panel", href: "/dashboard" },
        }
      : {
          text: "You're doing great, Juan Camilo. Your current career-path status:",
          bullets: [
            "PPL — Private Pilot: 100% ✓ certified",
            "IR — Instrument Rating: 45% in progress",
            "Study streak: 15 days in a row 🔥",
            "AirPath points: 2,480 · 4 achievements unlocked",
          ],
          cta: { label: "Go to my dashboard", href: "/dashboard" },
        };
  }

  // Written exam
  if (has("written", "examen", "exam", "estudi", "study", "pregunta", "question", "test")) {
    return lang === "es"
      ? {
          text: "El examen Written FAA se prepara con nuestro banco de preguntas randomizado. Cada simulacro combina 5 mecánicas distintas:",
          bullets: [
            "Multiple choice · Verdadero/Falso",
            "Identificación visual · Ordenamiento · Cálculos",
            "Categorías: regulaciones, meteo, navegación, sistemas…",
            "Con tiempo límite, lógica anti-trampa y reporte por pregunta.",
          ],
          cta: { label: "Iniciar simulacro Written", href: "/written" },
        }
      : {
          text: "You prepare for the FAA Written exam with our randomized question bank. Each mock exam mixes 5 different mechanics:",
          bullets: [
            "Multiple choice · True/False",
            "Visual identification · Ordering · Calculations",
            "Categories: regulations, weather, navigation, systems…",
            "Timed, with anti-cheat logic and per-question feedback.",
          ],
          cta: { label: "Start Written mock exam", href: "/written" },
        };
  }

  // Instructors / mentorship
  if (has("instructor", "mentor", "profe", "clase")) {
    return lang === "es"
      ? {
          text: "Podés contratar instructores FAA certificados como mentoría adicional. Reservás su disponibilidad y ellos confirman.",
          bullets: [
            "Cap. Andrés Morales — CFII/MEI · 4.9★ · USD 75/h",
            "Camila Ferrari — prep examen Written · 96% aprobación",
            "Sofía Mendoza — conversión ANAC→FAA · USD 48/h",
          ],
          cta: { label: "Ver instructores", href: "/marketplace" },
        }
      : {
          text: "You can hire certified FAA instructors as extra mentorship. You book their availability and they confirm.",
          bullets: [
            "Cap. Andrés Morales — CFII/MEI · 4.9★ · USD 75/hr",
            "Camila Ferrari — Written prep · 96% pass rate",
            "Sofía Mendoza — ANAC→FAA conversion · USD 48/hr",
          ],
          cta: { label: "See instructors", href: "/marketplace" },
        };
  }

  // Certificates
  if (has("certificad", "certificate", "verific", "diploma")) {
    return lang === "es"
      ? {
          text: "Al completar un curso recibís un certificado PDF con branding AirPath, tus horas y un código único de verificación pública. Cualquiera puede validarlo ingresando ese código.",
          cta: { label: "Ver mis certificados", href: "/certificates" },
        }
      : {
          text: "When you complete a course you get a PDF certificate with AirPath branding, your hours and a unique public verification code. Anyone can validate it by entering that code.",
          cta: { label: "See my certificates", href: "/certificates" },
        };
  }

  // Fallback
  return lang === "es"
    ? {
        text: "Buena pregunta. Puedo ayudarte con tu ruta de carrera FAA, los 5 cursos de la Academy, el examen Written, el marketplace de aeronaves e instructores, certificados y mucho más. Probá con una de estas:",
      }
    : {
        text: "Great question. I can help you with your FAA career path, the 5 Academy courses, the Written exam, the aircraft & instructor marketplace, certificates and much more. Try one of these:",
      };
}
