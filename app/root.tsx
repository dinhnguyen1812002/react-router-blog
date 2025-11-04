import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuthInit } from '~/hooks/useAuthInit';
import { Toaster, toast } from 'sonner';
import { useThemeStore } from '~/store/themeStore';




import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import theme from "./styles/theme.css?url";

import LoadingSpinner from "./components/Loading";


export const links: Route.LinksFunction = () => [

  { rel: "preconnect", href: "https://fonts.googleapis.com" },

  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
  },
  // { rel: "stylesheet", href: theme },
  { rel: "stylesheet", href: stylesheet },
  // {rel: "stylesheet", href: animations}

  // { rel: "stylesheet", href: animations },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        // Prevent hydration mismatches by ensuring consistent behavior
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  }));

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta title="blog platform"></meta>
        <Meta />
        <Links />
      </head>
      <body >
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" theme={useThemeStore(state => state.actualTheme) as any} />
          <ThemeInitializer />
          {children}
          {/* <AuthDebug /> */}
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Component to initialize theme on mount
function ThemeInitializer() {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme class to html element
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return null;
}

export default function App() {
  // Initialize authentication state
  const { isInitialized } = useAuthInit();

  // Show loading while initializing auth
  if (!isInitialized) {
    return (
      //  <h1>Loading...</h1>
      <LoadingSpinner />
    );
  }

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>a
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}