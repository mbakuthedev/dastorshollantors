import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RoomProvider } from "./room-context.jsx";
import App from "./App.jsx";
import "../css/styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <RoomProvider>
        <App />
      </RoomProvider>
    </BrowserRouter>
  </StrictMode>,
);
