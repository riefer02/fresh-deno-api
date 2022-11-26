import { forwardRef } from "preact/compat";

interface InputProps {
  name: string;
  ref: any;
  label: string;
  type: string;
}

const Input = forwardRef((props: InputProps, ref) => {
  const { name, label, type } = props;

  const handleInputChange = (event: Event) => {
    event.preventDefault();
    // ref.current.value = event.target.value;
  };

  return (
    <>
      <label for={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        class="bg-gray-300 mb-4"
        ref={ref}
        onInput={(e) => handleInputChange(e)}
      />
    </>
  );
});

export default Input;
