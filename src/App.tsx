import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/components/common/AppProviders";
import { routes } from "./routes";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={routes} />
    </AppProviders>
  );
}

export default App;
