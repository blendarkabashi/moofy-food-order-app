import React from "react";

const TextInput = ({
  type,
  value,
  onChange,
  className,
  placeholder,
  onInput,
  min,
  max,
}) => {
  return (
    <input
      type={type ? type : "text"}
      value={value}
      onInput={onInput}
      onChange={onChange}
      className={`${className} w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
      placeholder={placeholder}
    />
  );
};

export default TextInput;
