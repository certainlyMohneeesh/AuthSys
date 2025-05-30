type ThemeProviderProps = {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
};
export declare function ThemeProvider({ children, attribute, defaultTheme, enableSystem, disableTransitionOnChange, ...props }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export declare const useTheme: () => {
    theme: string;
    setTheme: (theme: string) => void;
};
export {};
