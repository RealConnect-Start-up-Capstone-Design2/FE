import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/shared/components/AppProviders";
import { usePreventDevToolsShortcuts } from "@/shared/hooks/usePreventDevToolsShortcuts";
import { routes } from "./routes";

function App() {
  usePreventDevToolsShortcuts();

  return (
    <AppProviders>
      <RouterProvider router={routes} />
    </AppProviders>
  );
}

export default App;
