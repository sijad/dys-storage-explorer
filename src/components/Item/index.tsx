import { useEffect, useState } from "react";
import { StorageItem } from "../../dys/types";
import formatHighlight from "json-format-highlight";
import Path from "../Path";

interface ItemProps {
  item: StorageItem;
  onPathClick: (path: string) => void;
  prefix: string;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}

const colors = {
  keyColor: "#9876AA",
  numberColor: "#6897BB",
  stringColor: "#6A8759",
  trueColor: "#CC7832",
  falseColor: "#CC7832",
  nullColor: "#CC7832",
};

export default function Item({
  item,
  onPathClick,
  prefix,
  onEdit,
  onDelete,
}: ItemProps): JSX.Element {
  const _data = item.data;
  const [jsonHTML, setJsonHTML] = useState<string | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    try {
      setJsonHTML(formatHighlight(JSON.parse(_data), colors));
    } catch {
      setJsonHTML(undefined);
    }
  }, [_data]);

  const handleDelete = () => {
    setIsDeleting(true);

    onDelete?.().finally(() => {
      setIsDeleting(false);
    });
  };

  return (
    <div className="p-4 my-6 shadow-sm card bg-base-100">
      <Path prefix={prefix} path={item.index} onClick={onPathClick} />
      <div
        className={`my-2 bg-base-200 border-1 border-base-300 max-w-full overflow-x-auto text-[lightgray]`}
      >
        {jsonHTML ? (
          <pre
            className={`w-max min-w-full`}
            style={{
              lineHeight: 1.5,
              backgroundImage:
                "linear-gradient(transparent 50%, rgba(0,0,0,0.1) 50%)",
              backgroundSize: "3em 3em",
            }}
            dangerouslySetInnerHTML={{ __html: jsonHTML }}
          />
        ) : (
          <pre>{_data}</pre>
        )}
      </div>
      <div className={`flex mt-2 justify-end space-x-1`}>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className={`btn btn-ghost btn-xs`}
          >
            Edit
          </button>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            onClick={handleDelete}
            className={`btn btn-ghost btn-xs  ${isDeleting ? "loading" : ""}`}
          >
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}
