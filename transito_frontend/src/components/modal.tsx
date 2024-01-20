import '@/styles/modal.css'
import { useEffect, useRef } from 'react';

interface ModalProps {
  children: React.ReactNode;
  setIsOpen: (e: boolean) => void;
  isOpen: boolean;
}

function Modal({
  children,
  setIsOpen,
  isOpen,
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(ref);

  return (
    <div>
      {
        isOpen && (
          <div style={{ display: isOpen ? "block" : "none" }} className='modal'>
            <div ref={ref} className="modal-content">
              <div className="close">
                <div className='closeButton' onClick={() => setIsOpen(false)}><i className="bi bi-x-lg"></i></div>
              </div>
              <div>
                {children}
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Modal;
