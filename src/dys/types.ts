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
