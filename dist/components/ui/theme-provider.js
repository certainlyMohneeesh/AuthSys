"use client";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";
export function ThemeProvider(_a) {
    var { children, attribute = "class", defaultTheme = "system", enableSystem = true, disableTransitionOnChange = false } = _a, props = __rest(_a, ["children", "attribute", "defaultTheme", "enableSystem", "disableTransitionOnChange"]);
    const [mounted, setMounted] = useState(false);
    // useEffect only runs on the client, so we use it to set mounted
    useEffect(() => {
        setMounted(true);
    }, []);
    // If not mounted, render a fallback. This prevents hydration mismatch
    if (!mounted) {
        return (_jsx(ThemeContext.Provider, { value: { theme: defaultTheme, setTheme: () => { } }, children: children }));
    }
    return (_jsx(NextThemesProvider, Object.assign({ attribute: attribute, defaultTheme: defaultTheme, enableSystem: enableSystem, disableTransitionOnChange: disableTransitionOnChange }, props, { children: children })));
}
const ThemeContext = createContext({ theme: "", setTheme: (theme) => { } });
function NextThemesProvider(_a) {
    var { children } = _a, props = __rest(_a, ["children"]);
    const { theme, setTheme } = useNextTheme();
    return (_jsx(ThemeContext.Provider, { value: { theme: theme || "", setTheme }, children: children }));
}
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
