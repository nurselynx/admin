import React from 'react';
import Image from 'next/image';

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  register: any;
  errors: any;
  validationKey: string;
  toggleVisibility?: any;  // Optional toggle function
  showInput?: boolean;  // Track password visibility
  isEyeShow?: boolean; 
  handleSpaceKeyPress?: any;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = 'text',
  placeholder,
  register,
  errors,
  validationKey,
  toggleVisibility,
  showInput = false, // Default to false for visibility control
  isEyeShow = false,
  handleSpaceKeyPress
}) => {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-[15px] font-semibold text-lynx-blue-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          autoComplete="off" 
          id={id}
          className={`placeholder-lynx-grey-900 w-full border h-[46px] ${
            errors[validationKey] ? 'border-red-600' : 'border-lynx-grey-1000'
          } rounded-lg px-3 py-2 focus:outline-none `}
          placeholder={placeholder}
          {...register(validationKey)}
          onKeyPress={handleSpaceKeyPress}
        />
        {isEyeShow && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={toggleVisibility}
          >
            {/* Eye icon for showing/hiding password */}
            {showInput ? (
                <Image src="/assets/image/eye.png" alt="eye" width={20} height={20} />
            ) : (
              <Image src="/assets/image/eye-hide.png" alt="eye-hide" width={20} height={20} />
            )}
          </button>
        )}
      </div>
      {errors[validationKey] && (
        <p className="mt-1 text-sm text-red-600">{errors[validationKey]?.message}</p>
      )}
    </div>
  );
};

export default InputField;
