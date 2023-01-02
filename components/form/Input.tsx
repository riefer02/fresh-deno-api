import { forwardRef, useImperativeHandle, useState } from "preact/compat";

interface InputProps {
  name: string;
  ref: any;
  label: string;
  type: string;
  placeholder: string;
  readOnly: boolean;
  initialValue: string | boolean | number;
  disabled: boolean;
  className: string;
}

const Input = forwardRef((props: InputProps, ref) => {
  const {
    name,
    label,
    type = "text",
    placeholder,
    readOnly = false,
    initialValue,
    disabled = false,
    className = "",
  } = props;
  const [{ value }, set] = useState({ value: initialValue || "" });

  useImperativeHandle(
    ref,
    () => ({
      getValue: () => value,
      clearValue: () => set({ value: "" }),
    }),
    [value]
  );

  const handleInputChange = (event: Event) => {
    event.preventDefault();
    set({ value: event.target?.value });
  };

  return (
    <>
      {label && (
        <label class="" for={name}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        class={`rounded-lg mb-4 py-1 px-2 ${className}`}
        ref={ref}
        value={value}
        onInput={(event) => handleInputChange(event)}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
      />
    </>
  );
});

export default Input;
