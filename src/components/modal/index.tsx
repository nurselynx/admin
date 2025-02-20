import React, { ReactNode } from "react";
import Image from "next/image";
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: any;
  isHeightAuto?: boolean
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  isHeightAuto
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rounded-2xl bg-black bg-opacity-50 ">
      <div
        className={`relative w-full ${className} p-6 bg-white md:rounded-lg shadow-lg  ${isHeightAuto ? 'xl:h-auto' : 'xl:h-full'} overflow-y-auto`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <Image
            src="/assets/image/cross.png"
            alt="cross"
            width={24}
            height={24}
          />
        </button>

        {/* Modal Title */}
        {title && (
          <h2 className="text-base text-center font-semibold">{title}</h2>
        )}

        {/* Modal Content */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
