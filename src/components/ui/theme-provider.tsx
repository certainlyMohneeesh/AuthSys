"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

type ThemeProviderProps = {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
};

export function ThemeProvider({
                                  children,
                                  attribute = "class",
                                  defaultTheme = "system",
                                  enableSystem = true,
                                  disableTransitionOnChange = false,
                                  ...props
                              }: ThemeProviderProps) {
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so we use it to set mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    // If not mounted, render a fallback. This prevents hydration mismatch
    if (!mounted) {
        return (
            <ThemeContext.Provider value={{ theme: defaultTheme, setTheme: () => {} }}>
                {children}
            </ThemeContext.Provider>
        );
    }

    return (
        <NextThemesProvider
            attribute={attribute}
            defaultTheme={defaultTheme}
            enableSystem={enableSystem}
            disableTransitionOnChange={disableTransitionOnChange}
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}

const ThemeContext = createContext({ theme: "", setTheme: (theme: string) => {} });

function NextThemesProvider({
                                children,
                                ...props
                            }: ThemeProviderProps) {
    const { theme, setTheme } = useNextTheme();

    return (
        <ThemeContext.Provider value={{ theme: theme || "", setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};