// Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // Add this line
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div>
      <div>
        {children}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Modal;

