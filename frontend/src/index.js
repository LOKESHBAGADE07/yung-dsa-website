import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const container = document.getElementById("root");
document.documentElement.dataset.js = "true";
const application = (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

if (container.dataset.prerendered === "true") {
  ReactDOM.hydrateRoot(container, application);
} else {
  ReactDOM.createRoot(container).render(application);
}

