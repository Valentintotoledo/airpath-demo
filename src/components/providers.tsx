"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/i18n";
import { RoleProvider } from "@/lib/role-context";
import { UIProvider } from "@/lib/ui-context";
import { Trailer } from "@/components/trailer/trailer";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <LanguageProvider>
        <RoleProvider>
          <UIProvider>
            {children}
            <Trailer />
          </UIProvider>
        </RoleProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
