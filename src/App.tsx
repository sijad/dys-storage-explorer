/* eslint-disable react/jsx-no-undef */
import { tx } from "@twind/core";
import { Fragment, useEffect, useState } from "react";
import Item from "./components/Item";
import Spinner from "./components/Spinner";
import useInfiniteStoragePrefix from "./dys/hooks";
import useDebounce from "./hooks/useDebounce";
import ArrowsUpDownIcon from "./icons/ArrowsUpDown";
import HomeIcon from "./icons/Home";

const params = new URLSearchParams(window.location.search);

function App(): JSX.Element {
  const [prefix, setPrefix] = useState(() => params.get("prefix") || "");
  const [reversed, setReversed] = useState(
    () => params.get("reversed") === "true"
  );

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

  return (
    <div>
      <div className={tx`relative mt-14`}>
        <div className={tx`p-6 px-4 mx-auto w-full max-w-2xl bg-brand-1`}>
          <div className={tx`flex mb-8`}>
            <div>
              <button
                type="button"
                title="Go to Root"
                className={tx`h-full w-10 flex items-center justify-center p-2 bg-brand-9 hover:bg-brand-10 text-white`}
                onClick={() => {
                  setPrefix("");
                }}
              >
                <HomeIcon size={4} />
              </button>
            </div>
            <label className={tx`text-brand-11 w-full`}>
              <span className={tx`sr-only`}>Prefix</span>
              <input
                className={tx`bg-brand-3 text-brand-12 p-2 block w-full text-base`}
                onChange={(e) => handleChangePrefix(e.target.value)}
                value={prefix}
              />
            </label>
            <div>
              <button
                type="button"
                title="Toggle Reversed Results"
                className={tx`h-full w-10 flex items-center justify-center p-2 bg-brand-9 hover:bg-brand-10 text-white ${
                  !reversed && "opacity-50"
                }`}
                onClick={() => {
                  setReversed((r) => !r);
                }}
              >
                <ArrowsUpDownIcon size={4} />
              </button>
            </div>
          </div>
          <div>
            {status === "loading" || status === "idle" ? (
              <div className={tx`flex w-full justify-center`}>
                <span className={tx`sr-only`}>Loading...</span>
                <Spinner size={8} />
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
                  />
                ))}
              </Fragment>
            ))}
          </div>
          {hasNextPage ? (
            <div className={tx`flex w-full justify-center mt-2`}>
              <button
                type="button"
                disabled={isFetchingNextPage}
                className={tx`flex items-center justify-center px-4 py-2 bg-brand-9 hover:bg-brand-10 text-white`}
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
    </div>
  );
}

export default App;