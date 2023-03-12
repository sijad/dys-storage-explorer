import { useEffect, useState } from "react";
import { StorageItem } from "../../dys/types";
import formatHighlight from "json-format-highlight";
import { tx } from "@twind/core";
import Path from "../Path";

interface ItemProps {
  item: StorageItem;
  onPathClick: (path: string) => void;
  prefix: string;
}

export default function Item({
  item,
  onPathClick,
  prefix,
}: ItemProps): JSX.Element {
  const _data = item.data;
  const [jsonHTML, setJsonHTML] = useState<string | undefined>();

  useEffect(() => {
    try {
      setJsonHTML(formatHighlight(JSON.parse(_data), { keyColor: "gray" }));
    } catch {
      // do nothing
    }
  }, [_data]);

  return (
    <div className={tx`my-6`}>
      <Path prefix={prefix} path={item.index} onClick={onPathClick} />
      <div
        className={tx`my-2 bg-brand-2 border-1 border-brand-6 max-w-full overflow-x-auto`}
      >
        {jsonHTML ? (
          <pre
            className={tx`w-max min-w-full`}
            style={{
              lineHeight: 1.5,
              backgroundImage:
                "linear-gradient(transparent 50%, rgba(0,0,0,0.2) 50%)",
              backgroundSize: "3em 3em",
            }}
            dangerouslySetInnerHTML={{ __html: jsonHTML }}
          />
        ) : (
          <pre>{_data}</pre>
        )}
      </div>
    </div>
  );
}
