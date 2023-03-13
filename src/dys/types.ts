import { Key } from "@keplr-wallet/types";
import type { Store } from "vuex";

export interface StorageItem {
  creator: string;
  index: string;
  data: string;
}

export interface StoragePrefixResponse {
  storage: StorageItem[];
  pagination: {
    next_key: "";
    total: "";
  };
}

export interface Window {
  dysonUseKeplr?: (onAccountChange?: (params: Key) => void) => Promise<Key>;
  dysonVueStore?: Store<unknown>;
}
