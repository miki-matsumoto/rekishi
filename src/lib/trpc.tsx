import { createTRPCReact, createTRPCProxyClient } from "@trpc/react-query";
import { AppRouter } from "src/server/routers";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;

export const trpc = createTRPCReact<
  AppRouter,
  unknown,
  "ExperimentalSuspense"
>();

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: () => true,
    }),
    httpBatchLink({
      url: "/trpc",
    }),
  ],
  transformer: superjson,
});

export const fetchQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            cacheTime: Infinity,
            staleTime: Infinity,
          },
        },
      })

export function ClientProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => fetchQueryClient
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url: "/trpc",
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/*  <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
