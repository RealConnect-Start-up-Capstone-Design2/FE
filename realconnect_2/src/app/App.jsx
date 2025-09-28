import React from "react";
import { AppRouter } from "./router/AppRouter";
import { Providers } from "./providers/Providers";
import "@shared/assets/global.css";

function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

export default App;
