// Importing necessary modules
import React from 'react';

// Defining the type for the props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // This prop is used to pass in the content of the modal
}

// The Modal component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  // Render the modal with the passed in children and a close button
  return (
    <div>
      <div>
        {children}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

// Exporting the component
export default Modal;

