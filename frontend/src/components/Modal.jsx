import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div className="fixed inset-0 bg-opacity-50"></div>

          {/* Modal container */}
          <div className="modal modal-open">
            <div className="modal-box relative bg-gray-700 p-6 rounded-lg mt-4 w-[300px]"> {/* Reduced width */}
              {/* Close button */}
              <button
                className="btn btn-sm btn-square absolute right-2 top-2 mb-5"
                onClick={onClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
