import { RouterProvider } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ClientProvider } from "src/lib/trpc";
import { router } from "src/routes/router";

function App() {
  return (
    <div className="font-inter text-slate-900 antialiased">
      <ClientProvider>
        <ReactQueryDevtools />
        <RouterProvider router={router} />
      </ClientProvider>
    </div>
  );
}

export default App;
