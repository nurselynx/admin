// components/ConfirmationModal.tsx
import { FC } from 'react';
import Modal from "@/components/modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading: boolean;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, loading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[400px]"
      isHeightAuto={true}
    >
      <p>Are you sure you want to {title} the user?</p>
      <div className="mt-6 flex justify-between">
        <button
          onClick={onClose}
          className="text-lynx-blue-100 border border-lynx-blue-100 px-4 py-2 rounded-md max-w-[200px]"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="bg-lynx-blue-100 text-white px-4 py-2 rounded-md max-w-[200px] capitalize"
        >
          Yes, {title}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
