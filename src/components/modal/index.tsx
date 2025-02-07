import React from "react";

interface ModalProps {
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void; // Close function
}

const Modal: React.FC<ModalProps> = ({ visible, children, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent clicks inside the modal from triggering the backdrop click
    onClose(); // Close the modal
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent propagation to the backdrop
  };

  return (
    <div>
      {visible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={handleBackdropClick} // Handle backdrop clicks
        >
          <div
            className="lg:w-[50%] sm:full bg-white p-4 rounded-lg shadow-lg"
            onClick={handleContentClick} // Prevent content clicks from propagating
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
