import { RouterProvider } from "@tanstack/react-router";
import { ClientProvider } from "src/lib/trpc";
import { router } from "src/routes/router";

function App() {
  return (
    <div className="font-inter">
      <ClientProvider>
        <RouterProvider router={router} />
      </ClientProvider>
    </div>
  );
}

export default App;
