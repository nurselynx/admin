import React from "react";

export interface Option {
  value: string | number;
  label: string;
}

export interface SelectDropdownProps {
  options: Option[];
  selectedValue: string | number;
  handleSelectChange: any;
  className?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  selectedValue,
  handleSelectChange,
}) => {
  return (
    <select
      className={`drop-hide placeholder-lynx-grey-900 bg-transparent text-sm tablet:w-full w-[251px] border h-[46px] ${
        selectedValue ? "text-lynx-blue-400" : "text-lynx-blue-400"
      } ${"border-lynx-grey-1000"} rounded-lg px-3 py-2 focus:outline-none`}
      value={selectedValue}
      onChange={handleSelectChange}
    >
      {options.map((option: any, index: number) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
