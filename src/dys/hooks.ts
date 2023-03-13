import { Key } from "@keplr-wallet/types";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { get, initKeplr } from ".";
import { StoragePrefixResponse } from "./types";

function formatQuery(obj: Record<string, string>) {
  return new URLSearchParams(obj);
}

export function useInfiniteStoragePrefix(prefix: string, reversed = false) {
  const api = get("common/env/apiCosmos");

  return useInfiniteQuery<StoragePrefixResponse>(
    ["storage-prefix", prefix, reversed],
    async ({ pageParam = "" }) => {
      return (
        await fetch(
          `${api}/dyson/storageprefix?${formatQuery({
            prefix,
            "pagination.key": pageParam,
            "pagination.reverse": reversed ? "true" : "false",
          })}`
        )
      ).json();
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination.next_key,
      enabled: !!api,
    }
  );
}

export function useAccount(): Key | null {
  const [key, setKey] = useState<Key | null>(null);

  useEffect(() => {
    initKeplr((key: Key) => {
      setKey(key);
    });
  }, []);

  return key;
}
