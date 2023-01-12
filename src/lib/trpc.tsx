import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "src/server/routers";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { useRouter } from "@tanstack/react-router";

export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;

export const trpc = createTRPCReact<AppRouter>();

export function ClientProvider(props: { children: React.ReactNode }) {
  //  const { navigate } = useRouter();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: false },
        },
        queryCache: new QueryCache({
          onError(error) {
            // @ts-ignore
            // if (error.message === "UNAUTHORIZED") {
            //   console.log("from config");
            //   navigate({ to: "/not-found" });
            // }
          },
        }),
      })
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
