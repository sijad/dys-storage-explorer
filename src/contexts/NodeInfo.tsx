import { useState, useEffect, useContext, createContext } from "react";

interface NodeInfo {
  VITE_API_COSMOS: string;
  VITE_WS_TENDERMINT: string;
  VITE_API_TENDERMIN: string;
  CLEAR_DOMAIN: string;
  DYS_DOMAIN: string;
}

const nodeInfoContext = createContext<NodeInfo | null>(null);

interface NodeInfoProviderProps {
  children: JSX.Element;
}

export default function NodeInfoProvider({ children }: NodeInfoProviderProps) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/_/node_info")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <nodeInfoContext.Provider value={data}>{children}</nodeInfoContext.Provider>
  );
}

export function useNodeInfo(): NodeInfo | null {
  return useContext(nodeInfoContext);
}
