"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ROLES, type RoleDef, type RoleId } from "./roles";

type RoleValue = {
  roleId: RoleId;
  role: RoleDef;
  setRole: (id: RoleId) => void;
};

const RoleContext = createContext<RoleValue | null>(null);
const STORAGE_KEY = "airpath.role";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [roleId, setRoleId] = useState<RoleId>("student");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as RoleId | null;
    if (stored && stored in ROLES) setRoleId(stored);
  }, []);

  const setRole = useCallback((id: RoleId) => {
    setRoleId(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const value = useMemo<RoleValue>(
    () => ({ roleId, role: ROLES[roleId], setRole }),
    [roleId, setRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
