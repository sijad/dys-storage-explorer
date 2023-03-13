import { ChangeEvent, useId } from "react";

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({
  label,
  name,
  onChange,
  value,
}: TextInputProps) {
  const id = useId();

  return (
    <>
      <label className="label" htmlFor={id}>
        <span className="label-text">{label}</span>
      </label>
      <input
        type="text"
        name={name}
        className="input input-bordered"
        onChange={onChange}
        value={value}
        id={id}
      />
    </>
  );
}
