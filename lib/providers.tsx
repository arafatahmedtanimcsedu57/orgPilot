"use client"

import type { ReactNode } from "react"
import { Provider } from "react-redux"
import { ThemeProvider } from "@/components/theme-provider"
import { store } from "@/lib/redux/store"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </Provider>
  )
}

