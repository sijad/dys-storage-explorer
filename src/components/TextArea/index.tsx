import { ChangeEvent, useId } from "react";

interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  rows?: number;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextArea({
  label,
  onChange,
  value,
  rows,
  name,
}: TextAreaProps) {
  const id = useId();

  return (
    <>
      <label className="label" htmlFor={id}>
        <span className="label-text">{label}</span>
      </label>
      <textarea
        className="textarea textarea-bordered"
        name={name}
        onChange={onChange}
        value={value}
        id={id}
        rows={rows}
      />
    </>
  );
}
