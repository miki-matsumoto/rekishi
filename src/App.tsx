import { RouterProvider } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ClientProvider } from "src/lib/trpc";
import { router } from "src/routes/router";
import { LoaderClientProvider } from "@tanstack/react-loaders";

function App() {
  return (
    <div className="font-inter text-slate-900 antialiased">
      <ClientProvider>
        {/* <LoaderClientProvider loaderClient={loaderClient}> */}
        <ReactQueryDevtools />
        <RouterProvider router={router} />
        {/* </LoaderClientProvider> */}
      </ClientProvider>
    </div>
  );
}

export default App;
