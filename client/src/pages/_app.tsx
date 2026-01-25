import '@/styles/globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createTrpcClient, trpc } from '@/utils/trpc';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => createTrpcClient());

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <Component {...pageProps} />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </GoogleOAuthProvider>
  );
}
