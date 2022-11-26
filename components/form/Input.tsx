import { forwardRef, useImperativeHandle, useState } from "preact/compat";

interface InputProps {
  name: string;
  ref: any;
  label: string;
  type: string;
  placeholder: string;
}

const Input = forwardRef((props: InputProps, ref) => {
  const { name, label, type, placeholder } = props;
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
      <label class="" for={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        class="rounded-lg mb-4 py-1 px-2"
        ref={ref}
        value={value}
        onInput={(event) => handleInputChange(event)}
        placeholder={placeholder}
      />
    </>
  );
});

export default Input;
