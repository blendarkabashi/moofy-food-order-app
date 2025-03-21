import React from "react";

const CheckboxInput = ({ checked, onChange, className }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={className}
    />
  );
};

export default CheckboxInput;
