import { tx } from "@twind/core";
import { useEffect, useState } from "react";

interface PathProps {
  path: string;
  prefix: string;
  onClick: (path: string) => void;
}

export default function Path({ path, onClick }: PathProps): JSX.Element {
  const [paths, setPaths] = useState<{ path: string; name: string }[]>(
    () => []
  );

  useEffect(() => {
    let p = "";
    const newPaths = path.split("/").map((s) => {
      p += `${s}/`;
      return {
        path: p,
        name: s,
      };
    });

    // newPaths.unshift({ path: "", name: "ROOT" });

    setPaths(newPaths);
  }, []);

  return (
    <ul
      className={tx`flex space-x-1 overflow-x-auto text-sm text-brand-11 whitespace-nowrap`}
    >
      {paths.map(({ path, name }, i) => {
        return (
          <li key={i} className={tx`flex`}>
            <button
              className={tx`inline font-medium hover:underline`}
              type="button"
              onClick={() => {
                onClick(path);
              }}
            >
              <span className={tx`sr-only`}>Go to Root</span>
              {name}
            </button>
            {i < paths.length - 1 ? (
              <span className={tx`ml-1 opacity-75`}>/</span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
