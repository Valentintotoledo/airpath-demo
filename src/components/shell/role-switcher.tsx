"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { useT } from "@/lib/i18n";
import { ROLES, ROLE_ORDER, type RoleId } from "@/lib/roles";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";

export function RoleSwitcher() {
  const { roleId, role, setRole } = useRole();
  const t = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const RoleIcon = role.icon;

  const principal = ROLE_ORDER.filter((id) => !ROLES[id].isBonus);
  const bonus = ROLE_ORDER.filter((id) => ROLES[id].isBonus);

  function choose(id: RoleId) {
    setRole(id);
    setOpen(false);
    // Always land on each role's "Inicio" after switching.
    router.push("/dashboard");
  }

  return (
    <>
      <button
        type="button"
        data-tour="role-switcher"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-hairline bg-surface px-2 pr-2.5 text-sm font-semibold text-content transition hover:border-primary-500/45 sm:px-2.5"
      >
        <span className="grid size-6 place-items-center rounded-md bg-primary-600/20 text-purple-ink">
          <RoleIcon className="size-3.5" />
        </span>
        <span className="hidden max-w-[150px] truncate sm:inline">{t.roles[roleId].name}</span>
        <ChevronDown className="size-4 text-content-muted" />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.toggles.role}
        description={t.toggles.roleHint}
      >
        <RoleGrid ids={principal} current={roleId} onChoose={choose} t={t} />
        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-hairline" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-accent-300">
            {t.roles.bonusTag}
          </span>
          <span className="h-px flex-1 bg-hairline" />
        </div>
        <RoleGrid ids={bonus} current={roleId} onChoose={choose} t={t} />
      </Modal>
    </>
  );
}

function RoleGrid({
  ids,
  current,
  onChoose,
  t,
}: {
  ids: RoleId[];
  current: RoleId;
  onChoose: (id: RoleId) => void;
  t: ReturnType<typeof useT>;
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {ids.map((id) => {
        const def = ROLES[id];
        const Icon = def.icon;
        const selected = id === current;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChoose(id)}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-3.5 text-left transition",
              selected
                ? "border-primary-500/60 bg-primary-600/12"
                : "border-hairline bg-surface-2 hover:border-primary-500/40",
            )}
          >
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-lg",
                selected ? "bg-primary-600 text-white" : "bg-surface text-content-muted",
              )}
            >
              <Icon className="size-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold text-content">{t.roles[id].name}</span>
                {selected && <Check className="size-4 shrink-0 text-purple-ink" />}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-content-muted">
                {t.roles[id].desc}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
