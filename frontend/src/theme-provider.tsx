import * as React from 'react';
const { createContext, useContext, useEffect, useState } = React;

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      return storedTheme || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark');
    
    // Determine the theme to apply
    let themeToApply = theme;
    if (theme === 'system') {
      themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply the theme
    root.classList.add(themeToApply);
    
    // Save to localStorage
    if (theme !== 'system') {
      localStorage.setItem(storageKey, theme);
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
