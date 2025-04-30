import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "./components/sidebar";
import { Toaster } from "./components/ui/sonner";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <SidebarProvider>
        <App />
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
