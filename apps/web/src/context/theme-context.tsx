import { createContext, useContext } from "react";

// 1. Definimos los TIPOS aquí
export type Theme = "dark" | "light" | "system";

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// 2. Creamos el CONTEXTO aquí
export const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

// 3. Exportamos el HOOK aquí
// Al no haber ningún "Componente" (función que devuelve JSX) en este archivo,
// el Fast Refresh funciona perfecto con los módulos que lo importen.
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
