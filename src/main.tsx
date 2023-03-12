import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./twind";
import { QueryClient, QueryClientProvider } from "react-query";
import NodeInfoProvider from "./contexts/NodeInfo";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NodeInfoProvider>
        <App />
      </NodeInfoProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
