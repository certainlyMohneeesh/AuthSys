"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { SessionProvider } from "next-auth/react";
export function Providers({ children }) {
    return _jsx(SessionProvider, { children: children });
}
