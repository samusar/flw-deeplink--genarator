import { ChangeEvent, useState, useEffect } from "react";

type RadioButtonGroupProps<T> = React.InputHTMLAttributes<HTMLInputElement> & {
  options: { display: string; value: T }[];
  onChangeValue?: (value: T) => void;
  defaultValue?: T;
};

export default function RadioButtonGroup<T>({
  options,
  onChangeValue,
  defaultValue,
  onChange,
  ...rest
}: RadioButtonGroupProps<T>) {
  const [selected, setSelected] = useState<T | undefined>(defaultValue);

  // Atualiza o valor selecionado caso o defaultValue seja alterado
  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  const handleChange = (value: T, event: ChangeEvent<HTMLInputElement>) => {
    setSelected(value);
    if (onChangeValue) onChangeValue(value);
    if (onChange) onChange(event);
  };

  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <label
          key={String(option.value)}
          className={`cursor-pointer px-4 py-2 border rounded-lg transition-all ${
            selected === option.value
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          <input
            {...rest}
            type="radio"
            value={String(option.value)}
            checked={selected === option.value}
            onChange={(e) => handleChange(option.value, e)}
            className="hidden"
          />
          {option.display}
        </label>
      ))}
    </div>
  );
}
