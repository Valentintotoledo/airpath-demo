"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  FileWarning,
  Lock,
  ShieldCheck,
  Sparkles,
  Upload,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";
import { useTr } from "@/lib/i18n";
import { STUDENT_DOCUMENTS, type AppDocument, type DocStatus } from "@/data/platform";
import { PageHeading } from "@/components/page-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

type StatusMeta = {
  badge: "green" | "warning" | "danger" | "neutral";
  icon: LucideIcon;
  es: string;
  en: string;
};

const STATUS_META: Record<DocStatus, StatusMeta> = {
  verified: { badge: "green", icon: CheckCircle2, es: "Verificado", en: "Verified" },
  pending: { badge: "warning", icon: Clock, es: "En revisión", en: "Under review" },
  rejected: { badge: "danger", icon: FileWarning, es: "Rechazado", en: "Rejected" },
  missing: { badge: "neutral", icon: FileText, es: "Falta cargar", en: "Not uploaded" },
};

export default function DocumentsPage() {
  const tr = useTr();

  const [docs, setDocs] = useState<AppDocument[]>(STUDENT_DOCUMENTS);
  const [uploadId, setUploadId] = useState<string | null>(null);

  const verified = useMemo(() => docs.filter((d) => d.status === "verified").length, [docs]);
  const total = docs.length;
  const pct = Math.round((verified / total) * 100);

  const uploadDoc = docs.find((d) => d.id === uploadId) ?? null;

  const submitUpload = (id: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: "pending", updatedAt: "2026-05-22" } : d,
      ),
    );
    setUploadId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeading
        title={tr({ es: "Validación documental", en: "Document validation" })}
        subtitle={tr({
          es: "Verificá tu identidad y credenciales para operar en el marketplace AirPath.",
          en: "Verify your identity and credentials to operate in the AirPath marketplace.",
        })}
      />

      {/* Intro card */}
      <Card className="overflow-hidden bg-gradient-to-br from-accent-500/[0.09] via-surface to-surface">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-500/15 text-gold-ink">
            <ShieldCheck className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold tracking-tight text-content">
                {tr({
                  es: "Verificación obligatoria para pilotos",
                  en: "Mandatory verification for pilots",
                })}
              </h2>
              <Badge variant="gold" dot>
                {tr({ es: "Incluido", en: "Included" })}
              </Badge>
            </div>
            <p className="mt-1.5 text-sm text-content-muted">
              {tr({
                es: "Antes de reservar aeronaves o servicios, todo piloto debe subir su documento de identidad con foto, su licencia de piloto FAA y su certificado médico. El equipo de AirPath valida cada archivo para mantener un marketplace seguro y confiable.",
                en: "Before booking aircraft or services, every pilot must upload a government photo ID, FAA pilot license and medical certificate. The AirPath team validates each file to keep a safe, trusted marketplace.",
              })}
            </p>
          </div>
        </div>
      </Card>

      {/* Progress summary */}
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-content">
              {tr({
                es: `${verified} de ${total} documentos verificados`,
                en: `${verified} of ${total} documents verified`,
              })}
            </p>
            <p className="mt-0.5 text-xs text-content-muted">
              {pct === 100
                ? tr({
                    es: "Tu perfil está completamente verificado.",
                    en: "Your profile is fully verified.",
                  })
                : tr({
                    es: "Completá tu verificación para desbloquear todas las reservas.",
                    en: "Complete your verification to unlock all bookings.",
                  })}
            </p>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-gold-ink tabular-nums">
            {pct}%
          </span>
        </div>
        <Progress value={pct} tone="gold" className="mt-3" />
      </Card>

      {/* Document cards */}
      <div className="space-y-3">
        {docs.map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            tr={tr}
            onUpload={() => setUploadId(doc.id)}
          />
        ))}
      </div>

      {/* Privacy & validation reassurance */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-600/15 text-purple-ink">
            <Lock className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-extrabold tracking-tight text-content">
              {tr({
                es: "Tus documentos están protegidos",
                en: "Your documents are protected",
              })}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-content-muted">
              {tr({
                es: "Cada archivo se almacena cifrado y solo lo revisa el equipo de validación de AirPath bajo estándares de grado aeronáutico. Nunca compartimos tus documentos con terceros sin tu consentimiento.",
                en: "Every file is stored encrypted and reviewed only by the AirPath validation team under aviation-grade standards. We never share your documents with third parties without your consent.",
              })}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-content-muted">
                <ShieldCheck className="size-3.5 text-success-500" />
                {tr({ es: "Cifrado de extremo a extremo", en: "End-to-end encryption" })}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-content-muted">
                <BadgeCheck className="size-3.5 text-success-500" />
                {tr({ es: "Revisión manual experta", en: "Expert manual review" })}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Phase 2 teaser */}
      <Card className="overflow-hidden border-dashed">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-surface-2 text-content-muted">
            <Sparkles className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-content">
                {tr({
                  es: "Validación documental Pro",
                  en: "Pro document validation",
                })}
              </h3>
              <Badge variant="purple">
                {tr({ es: "Fase 2 · Próximamente", en: "Phase 2 · Coming soon" })}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-content-muted">
              {tr({
                es: "Verificación automatizada con estándares ARROW + AVIATES, alertas de vencimiento y sincronización con la autoridad aeronáutica.",
                en: "Automated verification with ARROW + AVIATES standards, expiry alerts and aviation-authority sync.",
              })}
            </p>
          </div>
        </div>
      </Card>

      <UploadModal doc={uploadDoc} tr={tr} onClose={() => setUploadId(null)} onConfirm={submitUpload} />
    </div>
  );
}

type Tr = ReturnType<typeof useTr>;

/* ------------------------------------------------------------------ */
/*  Document card                                                       */
/* ------------------------------------------------------------------ */

function DocumentCard({
  doc,
  tr,
  onUpload,
}: {
  doc: AppDocument;
  tr: Tr;
  onUpload: () => void;
}) {
  const meta = STATUS_META[doc.status];
  const StatusIcon = meta.icon;
  const hasFile = doc.status !== "missing";

  return (
    <motion.div layout transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}>
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
          <span
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-xl",
              doc.status === "verified"
                ? "bg-success-500/15 text-success-500"
                : "bg-primary-600/15 text-purple-ink",
            )}
          >
            {doc.status === "verified" ? (
              <BadgeCheck className="size-[22px]" />
            ) : (
              <FileText className="size-[22px]" />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-content">{tr(doc.name)}</p>
              <Badge variant={meta.badge}>
                <StatusIcon className="size-3" />
                {tr({ es: meta.es, en: meta.en })}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-content-muted">{tr(doc.hint)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-content-muted">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {tr({ es: "Actualizado", en: "Updated" })} {doc.updatedAt}
              </span>
              {doc.expiry && (
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="size-3.5" />
                  {tr({ es: "Vence", en: "Expires" })} {doc.expiry}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-hairline pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
            <Button
              variant={hasFile ? "outline" : "primary"}
              size="sm"
              leftIcon={Upload}
              fullWidth
              onClick={onUpload}
            >
              {hasFile
                ? tr({ es: "Reemplazar", en: "Replace" })
                : tr({ es: "Subir documento", en: "Upload document" })}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Upload modal (simulated)                                            */
/* ------------------------------------------------------------------ */

function UploadModal({
  doc,
  tr,
  onClose,
  onConfirm,
}: {
  doc: AppDocument | null;
  tr: Tr;
  onClose: () => void;
  onConfirm: (id: string) => void;
}) {
  const [picked, setPicked] = useState(false);

  if (!doc) return <Modal open={false} onClose={onClose} />;

  const close = () => {
    setPicked(false);
    onClose();
  };

  return (
    <Modal
      open={!!doc}
      onClose={close}
      size="md"
      title={tr({ es: "Subir documento", en: "Upload document" })}
      description={tr(doc.name)}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={close}>
            {tr({ es: "Cancelar", en: "Cancel" })}
          </Button>
          <Button
            size="sm"
            leftIcon={UploadCloud}
            disabled={!picked}
            onClick={() => {
              onConfirm(doc.id);
              setPicked(false);
            }}
          >
            {tr({ es: "Enviar a revisión", en: "Submit for review" })}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Drop zone */}
        <button
          type="button"
          onClick={() => setPicked(true)}
          className={cn(
            "flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition",
            picked
              ? "border-success-500/50 bg-success-500/[0.07]"
              : "border-hairline bg-surface-2 hover:border-primary-500/50",
          )}
        >
          <span
            className={cn(
              "grid size-14 place-items-center rounded-2xl",
              picked
                ? "bg-success-500/15 text-success-500"
                : "bg-primary-600/15 text-purple-ink",
            )}
          >
            {picked ? <CheckCircle2 className="size-7" /> : <UploadCloud className="size-7" />}
          </span>
          <p className="mt-3 text-sm font-bold text-content">
            {picked
              ? tr({ es: "documento-seleccionado.pdf", en: "selected-document.pdf" })
              : tr({
                  es: "Arrastrá tu archivo aquí",
                  en: "Drag your file here",
                })}
          </p>
          <p className="mt-1 text-xs text-content-muted">
            {picked
              ? tr({ es: "Listo para enviar · 2,4 MB", en: "Ready to submit · 2.4 MB" })
              : tr({ es: "PDF, JPG o PNG · máx. 10 MB", en: "PDF, JPG or PNG · max 10 MB" })}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-content">
            <FileText className="size-3.5" />
            {picked
              ? tr({ es: "Elegir otro archivo", en: "Choose another file" })
              : tr({ es: "Seleccionar archivo", en: "Select file" })}
          </span>
        </button>

        <p className="rounded-xl border border-hairline bg-surface-2 p-3 text-xs text-content-muted">
          {tr({
            es: "Demo: ningún archivo real se sube. Al confirmar, el documento pasa a estado “En revisión” y el equipo de AirPath simula la validación.",
            en: "Demo: no real file is uploaded. On confirm, the document moves to “Under review” and the AirPath team simulates validation.",
          })}
        </p>
      </div>
    </Modal>
  );
}
