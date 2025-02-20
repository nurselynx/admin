import React, { useState } from "react";
import Image from "next/image";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface FileUploadFieldProps {
  label: string;
  id: string;
  register: UseFormRegister<any>; // Hook form register function
  errors: any;
  validationKey: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Handle file input changes
  className?: string;
  setValue: UseFormSetValue<any>; // Function to set value in form
  values?: any;
  placeholder?: string;
  setFileUploadCheck?: any;
  setFileUploadCheck1?: any
  setFileUploadCheck2?: any
  isProfileUpload?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  id,
  register,
  errors,
  validationKey,
  onChange,
  className,
  setValue,
  values,
  placeholder,
  setFileUploadCheck,
  setFileUploadCheck1,
  setFileUploadCheck2,
  isProfileUpload,
}) => {
  const [fileName, setFileName] = useState<string>(""); // State to store the selected file name

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFileName(file.name); // Set the file name
      setValue(validationKey, file); 
      const icon = validationKey === "icon";
      const icon1 = validationKey === "icon1";
      const icon2 = validationKey === "icon2";
      (isProfileUpload && validationKey === "icon") && setFileUploadCheck(icon);
      (isProfileUpload && validationKey === "icon1") &&   setFileUploadCheck1(icon1);
      (isProfileUpload && validationKey === "icon2") && setFileUploadCheck2(icon2);

    } else {
      setFileName(""); // Clear the file name if no file is selected
      setValue(validationKey, null); // Remove the file from the form state
      setFileUploadCheck(validationKey, null);
      setFileUploadCheck(false);
      setFileUploadCheck1(false);
      setFileUploadCheck2(false);
    }

    if (onChange) onChange(e); // Trigger the parent onChange handler if provided
  };

  const truncateString = (str: any, limit = 40) => {
    if (!str) return "";
    return str.length > limit ? str.slice(0, limit) + "..." : str;
  };

  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className="block text-base font-medium text-lynx-blue-300 mb-1"
      >
        {label}
      </label>
      <div
        className={`relative w-full h-[46px] border rounded-lg flex items-center justify-between px-3 py-2 cursor-pointer ${
          errors[validationKey] ? "border-red-600" : "border-lynx-grey-1000"
        } ${className}`}
        onClick={() => document.getElementById(id)?.click()} // Trigger file input click on container click
      >
        <span
          className={`text-sm truncate ${
            fileName || values ? "text-lynx-blue-300" : "text-lynx-grey-900"
          }`}
        >
          {truncateString(fileName, 80) ||
            truncateString(values, 80) ||
            placeholder ||
            "Upload Icon"}{" "}
          {/* Show file name or placeholder */}
        </span>
        <button type="button" className="flex items-center">
          <Image
            src="/assets/image/upload.png"
            alt="upload"
            className=" w-[20px] h-[20px]"
            width={20}
            height={20}
          />
        </button>
      </div>
      <input
        type="file"
        id={id}
        accept="image/png, image/jpeg"
        className="hidden"
        {...register(validationKey, { required: "This field is required" })} // Add required validation
        onChange={handleFileChange} // Use the handler to capture file name and update form value
      />
      {errors[validationKey] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[validationKey]?.message}
        </p>
      )}
    </div>
  );
};

export default FileUploadField;
