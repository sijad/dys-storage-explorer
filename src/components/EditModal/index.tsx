import { useEffect, useId, useState, FormEvent, useRef } from "react";
import TextArea from "../TextArea";
import TextInput from "../TextInput";

export interface Values {
  creator: string;
  index: string;
  data: string;
  force?: boolean;
}

interface EditModalProps {
  isOpen?: boolean;
  values?: Values;
  onClose: () => void;
  onSubmit: (values: Values) => Promise<void>;
}

export default function EditModal({
  onClose,
  onSubmit,
  isOpen,
  values: _vals,
}: EditModalProps) {
  const id = useId();

  const [creator, setCreator] = useState("");
  const [index, setIndex] = useState("");
  const [data, setData] = useState("");
  const [force, setForce] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        onCloseRef.current();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  useEffect(() => {
    setCreator(_vals?.creator || "");
    setIndex(_vals?.index || "");
    setData(_vals?.data || "");
    setForce(!!_vals?.force);
  }, [isOpen, _vals]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    onSubmit({
      creator,
      index,
      data,
      force,
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <>
      <input
        type="checkbox"
        id={id}
        checked={isOpen}
        className="modal-toggle"
        readOnly
      />
      <div className="modal">
        <div className="space-y-2 modal-box">
          <button
            className="absolute top-2 right-2 btn btn-sm btn-circle"
            onClick={onClose}
          >
            <span className="sr-only">Close Modal</span>✕
          </button>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <TextInput
                label="Creator"
                name="creator"
                value={creator}
                onChange={(e) => {
                  setCreator(e.target.value);
                }}
              />
            </div>
            <div className="form-control">
              <TextInput
                label="Path"
                name="path"
                value={index}
                onChange={(e) => {
                  setIndex(e.target.value);
                }}
              />
            </div>
            <div className="form-control">
              <TextArea
                label="Data"
                name="data"
                rows={5}
                value={data}
                onChange={(e) => {
                  setData(e.target.value);
                }}
              />
            </div>
            <div className="mt-2 form-control">
              <label className="cursor-pointer label">
                <input
                  type="checkbox"
                  checked={force}
                  onChange={(e) => {
                    setForce(e.target.checked);
                  }}
                  className="checkbox checkbox-success"
                />
                <span className="flex-1 ml-2 label-text">Force</span>
              </label>
            </div>
            <div className="modal-action">
              <button
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
