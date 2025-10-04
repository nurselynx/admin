import React from 'react';
import Image from 'next/image';

interface InputFieldProps {
  label?: any;
  id: string;
  type?: string;
  placeholder?: string;
  register: any;
  errors: any;
  validationKey: string;
  toggleVisibility?: any;  // Optional toggle function
  showInput?: boolean;  // Track password visibility
  isEyeShow?: boolean; 
  onChange?: () => void;  // Optional onChange handler to clear errors
  className?: any;
  onFocus?: any;
  onBlur?: any;
  handleSpaceKeyPress?: any,
  disable?: boolean
}

const FacilityInputField: React.FC<InputFieldProps> = ({
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
  onChange,
  className,
  onFocus,
  onBlur,
  handleSpaceKeyPress,
  disable = false
}) => {
  return (
    <div className="relative w-full">
      {label && <label htmlFor={id} className="block text-base font-medium text-lynx-blue-300 mb-1">
        {label}
      </label>}
      <div className="relative">
        <input
          type={type}
          autoComplete="off" 
          id={id}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`${className} placeholder-lynx-grey-900 w-full border h-[46px] ${
            errors[validationKey] ? 'border-red-600' : 'border-lynx-grey-1000'
          } rounded-lg px-3 py-2 focus:outline-none `}
          placeholder={placeholder}
          {...register(validationKey)}
          onChange={(e) => {
            if (onChange) onChange(); // Clear the error if onChange is passed
          }}
          onKeyPress={handleSpaceKeyPress}
          disabled={disable}
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

export default FacilityInputField;
