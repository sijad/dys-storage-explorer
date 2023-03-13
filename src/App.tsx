/* eslint-disable react/jsx-no-undef */
import { Fragment, useEffect, useState } from "react";
import EditModal, { Values } from "./components/EditModal";
import Item from "./components/Item";
import Spinner from "./components/Spinner";
import { tryDispatch } from "./dys";
import { useAccount, useInfiniteStoragePrefix } from "./dys/hooks";
import { StorageItem } from "./dys/types";
import useDebounce from "./hooks/useDebounce";
import { queryClient } from "./queries";

const params = new URLSearchParams(window.location.search);

function App(): JSX.Element {
  const account = useAccount();
  const [prefix, setPrefix] = useState(() => params.get("prefix") || "");
  const [reversed, setReversed] = useState(
    () => params.get("reversed") === "true"
  );
  const [editing, setEditing] = useState<StorageItem>();

  const handleChangePrefix = (path: string): void => {
    setPrefix(path);
  };

  const debouncedPrefix = useDebounce(prefix, 300);

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteStoragePrefix(debouncedPrefix, reversed);

  useEffect(() => {
    window.history.replaceState(
      {},
      "",
      `?${new URLSearchParams({
        prefix,
        reversed: reversed ? "true" : "false",
      })}`
    );
  }, [prefix, reversed]);

  const handleNew = () => {
    const address = account?.bech32Address || "";

    setEditing({
      creator: address,
      index: prefix || `${address}/`,
      data: "",
    });
  };

  const handleEdit = (s: StorageItem) => {
    setEditing(s);
  };

  const handleDelete = async (s: StorageItem) => {
    await tryDispatch("dyson/sendMsgDeleteStorage", {
      creator: s.creator,
      index: s.index,
    });

    await queryClient.invalidateQueries("storage-prefix");
  };

  const handleClose = () => {
    setEditing(undefined);
  };

  const handleSubmit = async (values: Values) => {
    await tryDispatch(
      `dyson/sendMsg${editing?.data ? "Update" : "Create"}Storage`,
      values
    );

    await queryClient.invalidateQueries("storage-prefix");
  };

  return (
    <div>
      <div className={`relative mt-14`}>
        <div className={`py-6 mx-auto w-full max-w-2xl bg-base-200`}>
          <div className={`bg-base-200 px-4 flex mb-8 sticky inset-0 z-10`}>
            <div className="flex py-1 space-x-2 w-full">
              <div className="w-full">
                <div className="w-full form-control">
                  <label className={`w-full`}>
                    <span className={`sr-only`}>Prefix</span>
                    <input
                      className="w-full input input-bordered"
                      placeholder="Prefix..."
                      onChange={(e) => handleChangePrefix(e.target.value)}
                      value={prefix}
                    />
                  </label>
                </div>
              </div>
              <button
                className="btn btn-circle"
                type="button"
                title="Up One Level"
                onClick={() => {
                  setPrefix((prefix) => {
                    const p = prefix
                      .replace(/\/$/, "")
                      .split("/")
                      .map((i) => i + "/");
                    p.pop();
                    return p.join("");
                  });
                }}
              >
                <i className="text-lg icon-corner-right-up" />
              </button>
              <button
                className="btn btn-circle"
                type="button"
                title="Toggle Reversed"
                onClick={() => {
                  setReversed((r) => !r);
                }}
              >
                <i
                  className={`text-lg icon-sort-${reversed ? "asc" : "desc"}`}
                />
              </button>
              {account ? (
                <button
                  className="btn btn-primary btn-circle"
                  type="button"
                  title="Add new storage"
                  onClick={handleNew}
                >
                  <i className="text-lg icon-file-plus-2" />
                </button>
              ) : null}
            </div>
          </div>
          <div className="px-4">
            {status === "loading" || status === "idle" ? (
              <div className={`flex w-full justify-center`}>
                <span className={`sr-only`}>Loading...</span>
                <Spinner />
              </div>
            ) : null}
            {data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page.storage.map((storage) => (
                  <Item
                    key={storage.index}
                    item={storage}
                    prefix={prefix}
                    onPathClick={handleChangePrefix}
                    onEdit={
                      account
                        ? () => {
                            handleEdit(storage);
                          }
                        : undefined
                    }
                    onDelete={
                      account
                        ? () => {
                            return handleDelete(storage);
                          }
                        : undefined
                    }
                  />
                ))}
              </Fragment>
            ))}
          </div>
          {hasNextPage ? (
            <div className={`flex w-full justify-center mt-2`}>
              <button
                type="button"
                disabled={isFetchingNextPage}
                className={`btn`}
                onClick={() => {
                  fetchNextPage();
                }}
              >
                {isFetchingNextPage ? "Loading more..." : "Load More"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <EditModal
        isOpen={!!editing}
        values={editing}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
