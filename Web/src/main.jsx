import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

//import Navbar from "./components/navbar/Navbar";
import App from "./App.jsx";
//import AddPage from "./pages/addpursaches";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
