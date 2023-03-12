import { useInfiniteQuery } from "react-query";
import { useNodeInfo } from "../contexts/NodeInfo";
import { StoragePrefixResponse } from "./types";

function formatQuery(obj: Record<string, string>) {
  return new URLSearchParams(obj);
}

export default function useInfiniteStoragePrefix(
  prefix: string,
  reversed = false
) {
  const info = useNodeInfo();

  return useInfiniteQuery<StoragePrefixResponse>(
    ["storage-prefix", prefix, reversed],
    async ({ pageParam = "" }) => {
      return (
        await fetch(
          `${info?.VITE_API_COSMOS}/dyson/storageprefix?${formatQuery({
            prefix,
            "pagination.key": pageParam,
            "pagination.reverse": reversed ? "true" : "false",
          })}`
        )
      ).json();
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination.next_key,
      enabled: !!info,
    }
  );
}
