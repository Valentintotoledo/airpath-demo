"use client";

import { useState } from "react";
import { Download, Award, ShieldCheck, ExternalLink } from "lucide-react";
import { CERTIFICATES, type EarnedCertificate } from "@/data/platform";
import { useTr } from "@/lib/i18n";
import { PageHeading } from "@/components/page-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { CertificateCard, CertificateDiploma } from "@/components/certificates/diploma";

export default function CertificatesPage() {
  const tr = useTr();
  const [active, setActive] = useState<EarnedCertificate | null>(null);

  return (
    <div className="space-y-7">
      <PageHeading
        title={tr({ es: "Mis certificados", en: "My certificates" })}
        subtitle={tr({
          es: "Tus logros académicos con verificación pública. Cada certificado lleva un código único auditable.",
          en: "Your academic achievements with public verification. Each certificate carries a unique auditable code.",
        })}
        action={
          <Badge variant="gold" dot pulse>
            {tr({
              es: `${CERTIFICATES.length} emitidos`,
              en: `${CERTIFICATES.length} issued`,
            })}
          </Badge>
        }
      />

      {/* Certificate grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATES.map((cert) => (
          <CertificateCard key={cert.id} cert={cert} onOpen={() => setActive(cert)} />
        ))}
      </div>

      {/* Public verification info */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-accent-500/[0.1] via-surface to-surface p-5 sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 size-56 glow-gold opacity-30"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-500/15 text-gold-ink ring-1 ring-accent-500/30">
            <ShieldCheck className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-extrabold tracking-tight text-content">
              {tr({
                es: "Verificación pública de autenticidad",
                en: "Public authenticity verification",
              })}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-content-muted">
              {tr({
                es: "Cualquier empleador, escuela o tercero puede confirmar que un certificado es auténtico ingresando su código único en la página pública de verificación de AirPath.",
                en: "Any employer, school or third party can confirm a certificate is authentic by entering its unique code on AirPath's public verification page.",
              })}
            </p>
          </div>
          <Button
            href="/verify"
            variant="gold"
            size="sm"
            rightIcon={ExternalLink}
            className="shrink-0"
          >
            {tr({ es: "Abrir verificador", en: "Open verifier" })}
          </Button>
        </div>
      </Card>

      {/* Certificate detail modal */}
      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        size="lg"
        title={
          <span className="flex items-center gap-2">
            <Award className="size-5 text-gold-ink" />
            {tr({ es: "Certificado AirPath", en: "AirPath certificate" })}
          </span>
        }
        description={tr({
          es: "Vista previa oficial del diploma emitido.",
          en: "Official preview of the issued diploma.",
        })}
        footer={
          <>
            <Button variant="outline" size="sm" leftIcon={Download}>
              {tr({ es: "Descargar PDF", en: "Download PDF" })}
            </Button>
            <Button href="/verify" variant="gold" size="sm" rightIcon={ShieldCheck}>
              {tr({ es: "Verificar públicamente", en: "Verify publicly" })}
            </Button>
          </>
        }
      >
        {active && <CertificateDiploma cert={active} />}
      </Modal>
    </div>
  );
}
