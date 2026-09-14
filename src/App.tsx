import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/shared/components/AppProviders";
import { routes } from "./routes";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={routes} />
    </AppProviders>
  );
}

export default App;
