"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type UIValue = {
  assistantOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  tourOpen: boolean;
  startTour: () => void;
  endTour: () => void;
  trailerMode: boolean;
  startTrailer: () => void;
  endTrailer: () => void;
};

const UIContext = createContext<UIValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [trailerMode, setTrailerMode] = useState(false);

  const openAssistant = useCallback(() => setAssistantOpen(true), []);
  const closeAssistant = useCallback(() => setAssistantOpen(false), []);
  const toggleAssistant = useCallback(() => setAssistantOpen((v) => !v), []);
  const startTour = useCallback(() => setTourOpen(true), []);
  const endTour = useCallback(() => setTourOpen(false), []);
  const startTrailer = useCallback(() => setTrailerMode(true), []);
  const endTrailer = useCallback(() => setTrailerMode(false), []);

  const value = useMemo<UIValue>(
    () => ({
      assistantOpen,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      tourOpen,
      startTour,
      endTour,
      trailerMode,
      startTrailer,
      endTrailer,
    }),
    [
      assistantOpen,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      tourOpen,
      startTour,
      endTour,
      trailerMode,
      startTrailer,
      endTrailer,
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
