"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  GraduationCap,
  MapPin,
  Plane,
  PlaneTakeoff,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTr } from "@/lib/i18n";
import {
  AIRCRAFT,
  CHARTERS,
  INSTRUCTORS,
  SCHOOLS,
  type Aircraft,
  type CharterListing,
  type Instructor,
  type School,
} from "@/data/marketplace";
import { PageHeading } from "@/components/page-heading";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
import { toneGradient, toneIcon, toneText, type Accent } from "@/lib/tone";
import { cn } from "@/lib/cn";

type Tr = ReturnType<typeof useTr>;
type Vertical = "aircraft" | "instructors" | "schools" | "charter";

/* Discriminated union for the selected detail item. */
type Selected =
  | { kind: "aircraft"; item: Aircraft }
  | { kind: "instructor"; item: Instructor }
  | { kind: "school"; item: School }
  | { kind: "charter"; item: CharterListing };

export default function MarketplacePage() {
  const tr = useTr();
  const [vertical, setVertical] = useState<Vertical>("aircraft");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Selected | null>(null);

  const tabs: TabItem[] = [
    { id: "aircraft", label: tr({ es: "Aeronaves", en: "Aircraft" }), icon: Plane, count: AIRCRAFT.length },
    { id: "instructors", label: tr({ es: "Instructores FAA", en: "FAA Instructors" }), icon: GraduationCap, count: INSTRUCTORS.length },
    { id: "schools", label: tr({ es: "Escuelas", en: "Schools" }), icon: ShieldCheck, count: SCHOOLS.length },
    { id: "charter", label: tr({ es: "Charter & Empty Legs", en: "Charter & Empty Legs" }), icon: PlaneTakeoff, count: CHARTERS.length },
  ];

  const onTab = (id: string) => {
    setVertical(id as Vertical);
    setQuery("");
    setFilter("all");
  };

  const q = query.trim().toLowerCase();

  /* ----- Filtering per vertical ----- */
  const aircraftList = useMemo(() => {
    return AIRCRAFT.filter((a) => {
      const text = `${a.model} ${a.tailNumber} ${a.location}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (filter === "timebuilding" && !a.timeBuilding) return false;
      if (filter === "available" && !a.available) return false;
      return true;
    });
  }, [q, filter]);

  const instructorList = useMemo(() => {
    return INSTRUCTORS.filter((i) => {
      const text = `${i.name} ${i.location} ${i.ratings.join(" ")}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (filter === "available" && !i.available) return false;
      if (filter === "topRated" && i.rating < 4.9) return false;
      return true;
    });
  }, [q, filter]);

  const schoolList = useMemo(() => {
    return SCHOOLS.filter((s) => {
      const text = `${s.name} ${s.location} ${s.country}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (filter === "verified" && !s.verified) return false;
      return true;
    });
  }, [q, filter]);

  const charterList = useMemo(() => {
    return CHARTERS.filter((c) => {
      const text = `${c.from} ${c.to} ${c.fromCode} ${c.toCode} ${c.operator} ${c.aircraft}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (filter === "charter" && c.kind !== "charter") return false;
      if (filter === "emptyleg" && c.kind !== "emptyleg") return false;
      return true;
    });
  }, [q, filter]);

  const count =
    vertical === "aircraft"
      ? aircraftList.length
      : vertical === "instructors"
        ? instructorList.length
        : vertical === "schools"
          ? schoolList.length
          : charterList.length;

  /* ----- Filter chips per vertical ----- */
  const chips: { id: string; label: string }[] =
    vertical === "aircraft"
      ? [
          { id: "all", label: tr({ es: "Todas", en: "All" }) },
          { id: "timebuilding", label: tr({ es: "Time building", en: "Time building" }) },
          { id: "available", label: tr({ es: "Disponibles ahora", en: "Available now" }) },
        ]
      : vertical === "instructors"
        ? [
            { id: "all", label: tr({ es: "Todos", en: "All" }) },
            { id: "available", label: tr({ es: "Disponibles ahora", en: "Available now" }) },
            { id: "topRated", label: tr({ es: "Mejor valorados", en: "Top rated" }) },
          ]
        : vertical === "schools"
          ? [
              { id: "all", label: tr({ es: "Todas", en: "All" }) },
              { id: "verified", label: tr({ es: "Verificadas", en: "Verified" }) },
            ]
          : [
              { id: "all", label: tr({ es: "Todos", en: "All" }) },
              { id: "charter", label: tr({ es: "Charter", en: "Charter" }) },
              { id: "emptyleg", label: tr({ es: "Empty legs", en: "Empty legs" }) },
            ];

  const searchPlaceholder = tr(
    vertical === "aircraft"
      ? { es: "Buscar por modelo, matrícula o ubicación…", en: "Search by model, tail number or location…" }
      : vertical === "instructors"
        ? { es: "Buscar por nombre, rating o ubicación…", en: "Search by name, rating or location…" }
        : vertical === "schools"
          ? { es: "Buscar por escuela, país o ciudad…", en: "Search by school, country or city…" }
          : { es: "Buscar por ruta, operador o aeronave…", en: "Search by route, operator or aircraft…" },
  );

  return (
    <div className="space-y-6">
      <PageHeading
        title="Marketplace"
        subtitle={tr({
          es: "Aeronaves, instructores FAA, escuelas y vuelos charter",
          en: "Aircraft, FAA instructors, schools and charter flights",
        })}
        action={
          <Badge variant="gold" dot pulse className="hidden sm:inline-flex">
            {tr({ es: "Demo en vivo", en: "Live demo" })}
          </Badge>
        }
      />

      {/* Document validation banner */}
      <Link
        href="/documents"
        className="group flex items-center gap-3 rounded-2xl border border-accent-500/35 bg-gradient-to-r from-accent-500/[0.12] via-surface to-surface p-4 transition hover:border-accent-500/55"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-500/15 text-gold-ink">
          <ShieldCheck className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-content">
            {tr({
              es: "Validá tus documentos antes de operar",
              en: "Validate your documents before operating",
            })}
          </p>
          <p className="mt-0.5 text-xs text-content-muted">
            {tr({
              es: "Todo piloto debe completar Photo ID, licencia FAA y certificado médico para reservar.",
              en: "Every pilot must complete Photo ID, FAA license and medical certificate to book.",
            })}
          </p>
        </div>
        <span className="hidden items-center gap-1 text-xs font-bold text-gold-ink transition group-hover:gap-2 sm:inline-flex">
          {tr({ es: "Ir a documentos", en: "Go to documents" })}
          <ArrowRight className="size-4" />
        </span>
      </Link>

      {/* Vertical tabs */}
      <Tabs tabs={tabs} active={vertical} onChange={onTab} />

      {/* Search + filter chips */}
      <div className="space-y-3">
        <Input icon={Search} placeholder={searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {chips.map((chip) => {
            const on = chip.id === filter;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition",
                  on
                    ? "border-primary-500/45 bg-primary-600/15 text-purple-ink"
                    : "border-hairline bg-surface text-content-muted hover:text-content",
                )}
              >
                {chip.label}
              </button>
            );
          })}
          <span className="ml-auto hidden shrink-0 items-center px-1 text-xs font-semibold text-content-muted sm:inline-flex">
            {tr({ es: `${count} resultados`, en: `${count} results` })}
          </span>
        </div>
      </div>

      {/* Grids */}
      {vertical === "aircraft" &&
        (aircraftList.length === 0 ? (
          <NoResults tr={tr} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aircraftList.map((a) => (
              <AircraftCard key={a.id} a={a} tr={tr} onClick={() => setSelected({ kind: "aircraft", item: a })} />
            ))}
          </div>
        ))}

      {vertical === "instructors" &&
        (instructorList.length === 0 ? (
          <NoResults tr={tr} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {instructorList.map((i) => (
              <InstructorCard key={i.id} i={i} tr={tr} onClick={() => setSelected({ kind: "instructor", item: i })} />
            ))}
          </div>
        ))}

      {vertical === "schools" &&
        (schoolList.length === 0 ? (
          <NoResults tr={tr} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schoolList.map((s) => (
              <SchoolCard key={s.id} s={s} tr={tr} onClick={() => setSelected({ kind: "school", item: s })} />
            ))}
          </div>
        ))}

      {vertical === "charter" &&
        (charterList.length === 0 ? (
          <NoResults tr={tr} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {charterList.map((c) => (
              <CharterCard key={c.id} c={c} tr={tr} onClick={() => setSelected({ kind: "charter", item: c })} />
            ))}
          </div>
        ))}

      {/* Detail modal */}
      <DetailModal selected={selected} tr={tr} onClose={() => setSelected(null)} />
    </div>
  );
}

/* ================= Shared bits ================= */

function NoResults({ tr }: { tr: Tr }) {
  return (
    <EmptyState
      icon={Search}
      title={tr({ es: "Sin resultados", en: "No results" })}
      description={tr({
        es: "Probá con otros términos de búsqueda o quitá los filtros activos.",
        en: "Try other search terms or clear the active filters.",
      })}
    />
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-content">
      <Star className="size-3.5 text-gold-ink" fill="currentColor" />
      {rating.toFixed(1)}
    </span>
  );
}

function Chip({ children, accent }: { children: React.ReactNode; accent?: Accent }) {
  return (
    <span
      className={cn(
        "rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
        accent ? toneIcon[accent] : "bg-surface-2 text-content-muted",
      )}
    >
      {children}
    </span>
  );
}

function MetaRow({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-content-muted">
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{children}</span>
    </span>
  );
}

/* ================= Aircraft card ================= */

function AircraftCard({ a, tr, onClick }: { a: Aircraft; tr: Tr; onClick: () => void }) {
  return (
    <Card interactive onClick={onClick} className="flex cursor-pointer flex-col overflow-hidden">
      {/* Gradient header */}
      <div className={cn("relative h-24 bg-gradient-to-br p-4", toneGradient[a.accent])}>
        <div className="absolute -right-6 -top-8 size-28 rounded-full bg-white/10 blur-xl" />
        <div className="relative flex items-start justify-between">
          <Plane className="size-7 text-white/90" />
          <span className="rounded-md bg-neutral-950/35 px-2 py-1 font-mono text-xs font-bold text-white">
            {a.tailNumber}
          </span>
        </div>
        {a.timeBuilding && (
          <Badge variant="solidGold" className="absolute bottom-3 left-4">
            <Clock className="size-3" />
            Time building
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold tracking-tight text-content">{a.model}</h3>
        <p className="mt-0.5 text-xs text-content-muted">
          {a.year} · {tr(a.category)}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
          <MetaRow icon={MapPin}>{a.location}</MetaRow>
          <MetaRow icon={Clock}>
            {tr({
              es: `${a.totalHours.toLocaleString("es")} h`,
              en: `${a.totalHours.toLocaleString("en")} hr`,
            })}
          </MetaRow>
          <MetaRow icon={Users}>{tr({ es: `${a.seats} asientos`, en: `${a.seats} seats` })}</MetaRow>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {a.certifications.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-hairline pt-3">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-content">
              ${a.pricePerHour}
              <span className="text-xs font-semibold text-content-muted">/h</span>
            </p>
            <Stars rating={a.rating} />
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-bold",
              a.available ? "text-success-500" : "text-content-muted",
            )}
          >
            <span className={cn("size-2 rounded-full", a.available ? "bg-success-500" : "bg-content-muted/50")} />
            {a.available
              ? tr({ es: "Disponible", en: "Available" })
              : tr({ es: "No disponible", en: "Unavailable" })}
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ================= Instructor card ================= */

function InstructorCard({ i, tr, onClick }: { i: Instructor; tr: Tr; onClick: () => void }) {
  return (
    <Card interactive onClick={onClick} className="flex cursor-pointer flex-col p-4">
      <div className="flex items-start gap-3">
        <Avatar initials={i.initials} accent={i.accent} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold tracking-tight text-content">{i.name}</h3>
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-content-muted">
            <MapPin className="size-3.5" />
            {i.location}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {i.ratings.map((r) => (
              <Chip key={r} accent={i.accent}>
                {r}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {i.specialties.map((s, idx) => (
          <Chip key={idx}>{tr(s)}</Chip>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
        <MetaRow icon={Clock}>
          {tr({
            es: `${i.hoursLogged.toLocaleString("es")} h registradas`,
            en: `${i.hoursLogged.toLocaleString("en")} hr logged`,
          })}
        </MetaRow>
        <span className="inline-flex items-center gap-1 text-xs text-content-muted">
          <Star className="size-3.5 text-gold-ink" fill="currentColor" />
          <span className="font-bold text-content">{i.rating.toFixed(1)}</span>
          {tr({ es: `· ${i.reviews} reseñas`, en: `· ${i.reviews} reviews` })}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
        <p className="text-lg font-extrabold tracking-tight text-content">
          ${i.hourlyRate}
          <span className="text-xs font-semibold text-content-muted">/h</span>
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-bold",
            i.available ? "text-success-500" : "text-content-muted",
          )}
        >
          <span className={cn("size-2 rounded-full", i.available ? "bg-success-500" : "bg-content-muted/50")} />
          {i.available
            ? tr({ es: "Disponible", en: "Available" })
            : tr({ es: "Agenda completa", en: "Fully booked" })}
        </span>
      </div>
    </Card>
  );
}

/* ================= School card ================= */

function SchoolCard({ s, tr, onClick }: { s: School; tr: Tr; onClick: () => void }) {
  return (
    <Card interactive onClick={onClick} className="flex cursor-pointer flex-col p-4">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br font-extrabold text-white",
            toneGradient[s.accent],
          )}
        >
          {s.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-bold tracking-tight text-content">{s.name}</h3>
            {s.verified && <ShieldCheck className="size-4 shrink-0 text-gold-ink" />}
          </div>
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-content-muted">
            <span>{s.flag}</span>
            {s.country} · {s.location}
          </p>
          {s.verified && (
            <Badge variant="gold" className="mt-1.5">
              {tr({ es: "Verificada", en: "Verified" })}
            </Badge>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-content-muted">{tr(s.highlight)}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {s.programs.map((p, idx) => (
          <Chip key={idx}>{tr(p)}</Chip>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
        <span className="inline-flex items-center gap-1 text-xs text-content-muted">
          <Star className="size-3.5 text-gold-ink" fill="currentColor" />
          <span className="font-bold text-content">{s.rating.toFixed(1)}</span>
          {tr({ es: `· ${s.reviews} reseñas`, en: `· ${s.reviews} reviews` })}
        </span>
        <MetaRow icon={Users}>
          {tr({ es: `${s.studentsCount} estudiantes`, en: `${s.studentsCount} students` })}
        </MetaRow>
      </div>

      <div className="mt-4 border-t border-hairline pt-3">
        <p className="text-sm text-content-muted">
          {tr({ es: "Desde", en: "From" })}{" "}
          <span className="text-lg font-extrabold tracking-tight text-content">
            ${s.priceFrom.toLocaleString("es")}
          </span>
        </p>
      </div>
    </Card>
  );
}

/* ================= Charter card ================= */

function CharterCard({ c, tr, onClick }: { c: CharterListing; tr: Tr; onClick: () => void }) {
  const isEmpty = c.kind === "emptyleg";
  return (
    <Card interactive onClick={onClick} className="flex cursor-pointer flex-col p-4">
      <div className="flex items-center justify-between">
        <Badge variant={isEmpty ? "sky" : "purple"}>
          {isEmpty ? tr({ es: "Empty leg", en: "Empty leg" }) : tr({ es: "Charter", en: "Charter" })}
        </Badge>
        <span className="inline-flex items-center gap-1 text-xs text-content-muted">
          <CalendarCheck className="size-3.5" />
          {c.date}
        </span>
      </div>

      {/* Route */}
      <div className="mt-3 flex items-center gap-2">
        <div className="min-w-0">
          <p className="font-mono text-sm font-bold text-content">{c.fromCode}</p>
          <p className="truncate text-xs text-content-muted">{c.from}</p>
        </div>
        <div className="flex flex-1 items-center gap-1 px-1">
          <span className="h-px flex-1 bg-hairline" />
          <PlaneTakeoff className={cn("size-4 shrink-0", toneText[c.accent])} />
          <span className="h-px flex-1 bg-hairline" />
        </div>
        <div className="min-w-0 text-right">
          <p className="font-mono text-sm font-bold text-content">{c.toCode}</p>
          <p className="truncate text-xs text-content-muted">{c.to}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
        <MetaRow icon={Plane}>{c.aircraft}</MetaRow>
        <MetaRow icon={Users}>{tr({ es: `${c.seats} asientos`, en: `${c.seats} seats` })}</MetaRow>
      </div>
      <p className="mt-1.5 text-xs text-content-muted">{c.operator}</p>

      <div className="mt-4 flex items-end justify-between border-t border-hairline pt-3">
        <p className="text-lg font-extrabold tracking-tight text-content">
          ${c.price.toLocaleString("es")}
          <span className="text-xs font-semibold text-content-muted">
            {" "}
            {tr({ es: "/ vuelo", en: "/ flight" })}
          </span>
        </p>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-ink">
          {tr({ es: "Ver detalle", en: "View detail" })}
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Card>
  );
}

/* ================= Detail modal + reservation flow ================= */

type FlowStep = "details" | "form" | "sent";

function DetailModal({ selected, tr, onClose }: { selected: Selected | null; tr: Tr; onClose: () => void }) {
  const [step, setStep] = useState<FlowStep>("details");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const reset = () => {
    setStep("details");
    setDate("");
    setNotes("");
  };

  const handleClose = () => {
    onClose();
    // Defer reset so the closing animation doesn't flash the details step.
    setTimeout(reset, 250);
  };

  const open = selected !== null;
  const isMentorship = selected?.kind === "instructor";

  const title =
    selected?.kind === "aircraft"
      ? selected.item.model
      : selected?.kind === "instructor"
        ? selected.item.name
        : selected?.kind === "school"
          ? selected.item.name
          : selected?.kind === "charter"
            ? `${selected.item.fromCode} → ${selected.item.toCode}`
            : "";

  return (
    <Modal open={open} onClose={handleClose} title={title} size="lg">
      {selected && step === "details" && <DetailBody selected={selected} tr={tr} />}

      {selected && step === "form" && (
        <RequestForm
          tr={tr}
          isMentorship={isMentorship}
          date={date}
          notes={notes}
          onDate={setDate}
          onNotes={setNotes}
        />
      )}

      {selected && step === "sent" && <SentState tr={tr} isMentorship={isMentorship} date={date} />}

      {/* Footer actions per step */}
      <div className="mt-5 flex flex-col gap-2 border-t border-hairline pt-4 sm:flex-row sm:justify-end">
        {step === "details" && (
          <>
            <Button variant="outline" onClick={handleClose}>
              {tr({ es: "Cerrar", en: "Close" })}
            </Button>
            <Button leftIcon={CalendarCheck} onClick={() => setStep("form")}>
              {isMentorship
                ? tr({ es: "Solicitar mentoría", en: "Request mentorship" })
                : tr({ es: "Solicitar reserva", en: "Request booking" })}
            </Button>
          </>
        )}
        {step === "form" && (
          <>
            <Button variant="outline" onClick={() => setStep("details")}>
              {tr({ es: "Volver", en: "Back" })}
            </Button>
            <Button variant="gold" leftIcon={Sparkles} disabled={!date} onClick={() => setStep("sent")}>
              {tr({ es: "Enviar solicitud", en: "Send request" })}
            </Button>
          </>
        )}
        {step === "sent" && (
          <Button fullWidth onClick={handleClose}>
            {tr({ es: "Entendido", en: "Got it" })}
          </Button>
        )}
      </div>
    </Modal>
  );
}

/* ----- Step 1: details ----- */

function DetailBody({ selected, tr }: { selected: Selected; tr: Tr }) {
  if (selected.kind === "aircraft") {
    const a = selected.item;
    return (
      <div className="space-y-4">
        <div className={cn("relative overflow-hidden rounded-xl bg-gradient-to-br p-4", toneGradient[a.accent])}>
          <div className="absolute -right-8 -top-10 size-32 rounded-full bg-white/10 blur-xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="font-mono text-lg font-extrabold text-white">{a.tailNumber}</p>
              <p className="text-xs text-white/80">
                {a.year} · {tr(a.category)}
              </p>
            </div>
            <Plane className="size-8 text-white/90" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {a.timeBuilding && (
            <Badge variant="gold">
              <Clock className="size-3" /> Time building
            </Badge>
          )}
          <Stars rating={a.rating} />
          <span className="text-xs text-content-muted">
            {tr({ es: `${a.reviews} reseñas`, en: `${a.reviews} reviews` })}
          </span>
          <span className="ml-auto text-base font-extrabold text-content">
            ${a.pricePerHour}
            <span className="text-xs font-semibold text-content-muted">/h</span>
          </span>
        </div>

        <SpecGrid
          items={[
            { label: tr({ es: "Ubicación", en: "Location" }), value: a.location },
            { label: tr({ es: "Horas totales", en: "Total hours" }), value: `${a.totalHours.toLocaleString("es")} h` },
            { label: tr({ es: "Asientos", en: "Seats" }), value: String(a.seats) },
            { label: tr({ es: "Propietario", en: "Owner" }), value: a.owner },
            ...a.specs.map((s) => ({ label: tr(s.label), value: s.value })),
          ]}
        />

        <div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-content-muted">
            {tr({ es: "Certificaciones", en: "Certifications" })}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {a.certifications.map((c) => (
              <Chip key={c} accent={a.accent}>
                {c}
              </Chip>
            ))}
          </div>
        </div>

        <ApprovalNote tr={tr} />
      </div>
    );
  }

  if (selected.kind === "instructor") {
    const i = selected.item;
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar initials={i.initials} accent={i.accent} size="xl" ring />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              {i.ratings.map((r) => (
                <Chip key={r} accent={i.accent}>
                  {r}
                </Chip>
              ))}
            </div>
            <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-content-muted">
              <MapPin className="size-3.5" />
              {i.location}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <Stars rating={i.rating} />
              <span className="text-xs text-content-muted">
                {tr({ es: `${i.reviews} reseñas`, en: `${i.reviews} reviews` })}
              </span>
            </div>
          </div>
          <span className="text-base font-extrabold text-content">
            ${i.hourlyRate}
            <span className="text-xs font-semibold text-content-muted">/h</span>
          </span>
        </div>

        <p className="text-sm leading-relaxed text-content-muted">{tr(i.bio)}</p>

        <SpecGrid
          items={[
            {
              label: tr({ es: "Horas registradas", en: "Hours logged" }),
              value: `${i.hoursLogged.toLocaleString("es")} h`,
            },
            { label: tr({ es: "Calificación", en: "Rating" }), value: `${i.rating.toFixed(1)} ★` },
            { label: tr({ es: "Habilitaciones", en: "Ratings" }), value: i.ratings.join(" · ") },
            {
              label: tr({ es: "Disponibilidad", en: "Availability" }),
              value: i.available
                ? tr({ es: "Disponible", en: "Available" })
                : tr({ es: "Agenda completa", en: "Fully booked" }),
            },
          ]}
        />

        <div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-content-muted">
            {tr({ es: "Especialidades", en: "Specialties" })}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {i.specialties.map((s, idx) => (
              <Chip key={idx}>{tr(s)}</Chip>
            ))}
          </div>
        </div>

        <ApprovalNote tr={tr} mentorship />
      </div>
    );
  }

  if (selected.kind === "school") {
    const s = selected.item;
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-lg font-extrabold text-white",
              toneGradient[s.accent],
            )}
          >
            {s.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1 text-sm text-content-muted">
              <span>{s.flag}</span>
              {s.country} · {s.location}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Stars rating={s.rating} />
              <span className="text-xs text-content-muted">
                {tr({ es: `${s.reviews} reseñas`, en: `${s.reviews} reviews` })}
              </span>
              {s.verified && <Badge variant="gold">{tr({ es: "Verificada", en: "Verified" })}</Badge>}
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-content-muted">{tr(s.highlight)}</p>

        <SpecGrid
          items={[
            { label: tr({ es: "Estudiantes", en: "Students" }), value: s.studentsCount.toLocaleString("es") },
            { label: tr({ es: "Programas", en: "Programs" }), value: String(s.programs.length) },
            { label: tr({ es: "Calificación", en: "Rating" }), value: `${s.rating.toFixed(1)} ★` },
            { label: tr({ es: "Desde", en: "From" }), value: `$${s.priceFrom.toLocaleString("es")}` },
          ]}
        />

        <div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-content-muted">
            {tr({ es: "Programas disponibles", en: "Available programs" })}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {s.programs.map((p, idx) => (
              <Chip key={idx} accent={s.accent}>
                {tr(p)}
              </Chip>
            ))}
          </div>
        </div>

        <ApprovalNote tr={tr} />
      </div>
    );
  }

  // charter
  const c = selected.item;
  const isEmpty = c.kind === "emptyleg";
  return (
    <div className="space-y-4">
      <div className={cn("relative overflow-hidden rounded-xl bg-gradient-to-br p-4", toneGradient[c.accent])}>
        <div className="absolute -right-8 -top-10 size-32 rounded-full bg-white/10 blur-xl" />
        <div className="relative flex items-center justify-between">
          <div className="text-left">
            <p className="font-mono text-lg font-extrabold text-white">{c.fromCode}</p>
            <p className="text-xs text-white/80">{c.from}</p>
          </div>
          <PlaneTakeoff className="size-7 text-white/90" />
          <div className="text-right">
            <p className="font-mono text-lg font-extrabold text-white">{c.toCode}</p>
            <p className="text-xs text-white/80">{c.to}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={isEmpty ? "sky" : "purple"}>
          {isEmpty ? tr({ es: "Empty leg", en: "Empty leg" }) : tr({ es: "Charter", en: "Charter" })}
        </Badge>
        <span className="ml-auto text-base font-extrabold text-content">${c.price.toLocaleString("es")}</span>
      </div>

      <SpecGrid
        items={[
          { label: tr({ es: "Operador", en: "Operator" }), value: c.operator },
          { label: tr({ es: "Aeronave", en: "Aircraft" }), value: c.aircraft },
          { label: tr({ es: "Fecha", en: "Date" }), value: c.date },
          { label: tr({ es: "Asientos", en: "Seats" }), value: String(c.seats) },
        ]}
      />

      {isEmpty && (
        <p className="rounded-xl border border-sky-500/30 bg-sky-500/[0.08] p-3 text-xs text-content-muted">
          {tr({
            es: "Empty leg: tramo de reposicionamiento a precio reducido. Sujeto a disponibilidad y a cambios del operador.",
            en: "Empty leg: a repositioning flight at a reduced price. Subject to availability and operator changes.",
          })}
        </p>
      )}

      <ApprovalNote tr={tr} />
    </div>
  );
}

function SpecGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map((s, idx) => (
        <div key={idx} className="rounded-xl border border-hairline bg-surface-2 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-content-muted">{s.label}</p>
          <p className="mt-0.5 truncate text-sm font-bold text-content">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function ApprovalNote({ tr, mentorship }: { tr: Tr; mentorship?: boolean }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-accent-500/30 bg-accent-500/[0.08] p-3">
      <ShieldCheck className="size-4 shrink-0 text-gold-ink" />
      <p className="text-xs text-content-muted">
        {mentorship
          ? tr({
              es: "La solicitud no es automática: el instructor revisa tu perfil y confirma la mentoría según su agenda.",
              en: "The request is not automatic: the instructor reviews your profile and confirms the mentorship per their schedule.",
            })
          : tr({
              es: "La solicitud no es automática: el dueño o proveedor confirma tu reserva tras revisar tus documentos.",
              en: "The request is not automatic: the owner or provider confirms your booking after reviewing your documents.",
            })}
      </p>
    </div>
  );
}

/* ----- Step 2: request form ----- */

function RequestForm({
  tr,
  isMentorship,
  date,
  notes,
  onDate,
  onNotes,
}: {
  tr: Tr;
  isMentorship: boolean;
  date: string;
  notes: string;
  onDate: (v: string) => void;
  onNotes: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 rounded-xl border border-primary-500/30 bg-primary-600/[0.08] p-3">
        <CalendarCheck className="size-4 shrink-0 text-purple-ink" />
        <p className="text-xs text-content-muted">
          {isMentorship
            ? tr({
                es: "Indicá la fecha preferida y un detalle de tus objetivos. El instructor confirmará la sesión.",
                en: "Pick a preferred date and a note about your goals. The instructor will confirm the session.",
              })
            : tr({
                es: "Indicá la fecha preferida y cualquier nota para el dueño. Él confirmará la reserva.",
                en: "Pick a preferred date and any note for the owner. They will confirm the booking.",
              })}
        </p>
      </div>

      <Input
        type="date"
        label={tr({ es: "Fecha preferida", en: "Preferred date" })}
        value={date}
        onChange={(e) => onDate(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-content">
          {tr({ es: "Notas (opcional)", en: "Notes (optional)" })}
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
          placeholder={tr(
            isMentorship
              ? { es: "Ej: preparación para checkride IR…", en: "E.g. IR checkride prep…" }
              : { es: "Ej: vuelo de time building, 3 horas…", en: "E.g. time-building flight, 3 hours…" },
          )}
          className={cn(
            "w-full rounded-xl border border-hairline bg-surface-2 px-3.5 py-2.5 text-sm text-content",
            "placeholder:text-content-muted/70 outline-none transition-[border-color,box-shadow]",
            "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25",
          )}
        />
      </div>
    </div>
  );
}

/* ----- Step 3: sent confirmation ----- */

function SentState({ tr, isMentorship, date }: { tr: Tr; isMentorship: boolean; date: string }) {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-success-500/15 text-success-500">
        <Check className="size-8" />
      </span>
      <h3 className="mt-4 text-lg font-extrabold tracking-tight text-content">
        {tr({ es: "Solicitud enviada", en: "Request sent" })}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-content-muted">
        {isMentorship
          ? tr({
              es: "Tu solicitud de mentoría fue enviada. El instructor debe aprobarla — no es una reserva automática.",
              en: "Your mentorship request was sent. The instructor must approve it — this is not an automatic booking.",
            })
          : tr({
              es: "Tu solicitud de reserva fue enviada. El dueño/proveedor debe confirmarla — no es automática.",
              en: "Your booking request was sent. The owner/provider must confirm it — it is not automatic.",
            })}
      </p>

      {date && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-3 py-1 text-xs font-semibold text-content">
          <CalendarCheck className="size-3.5 text-purple-ink" />
          {tr({ es: "Fecha solicitada:", en: "Requested date:" })} {date}
        </p>
      )}

      <div className="mt-4 w-full rounded-xl border border-accent-500/30 bg-accent-500/[0.08] p-3 text-left">
        <p className="flex items-center gap-1.5 text-xs font-bold text-gold-ink">
          <ShieldCheck className="size-4" />
          {tr({ es: "Próximo paso", en: "Next step" })}
        </p>
        <p className="mt-1 text-xs text-content-muted">
          {tr({
            es: "Asegurate de tener Photo ID, licencia FAA y certificado médico validados para acelerar la aprobación.",
            en: "Make sure your Photo ID, FAA license and medical certificate are validated to speed up approval.",
          })}{" "}
          <Link href="/documents" className="font-bold text-gold-ink underline-offset-2 hover:underline">
            {tr({ es: "Ir a documentos", en: "Go to documents" })}
          </Link>
        </p>
      </div>
    </div>
  );
}
