import { forwardRef, useImperativeHandle, useState } from "preact/compat";
import { inputStyles } from "../../lib/styles.ts";

interface InputProps {
  name: string;
  ref: any;
  label: string;
  type: string;
  placeholder: string;
  readOnly: boolean;
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
    disabled = false,
    className = "",
  } = props;
  const [{ value }, set] = useState({ value: "" });

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
        class={`${inputStyles} ${className}`}
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
