import { useEffect } from 'react';

export const useClickOutside = (
  isOpen: boolean,
  onClose: () => void,
  selector: string = '[data-dropdown]'
) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(selector)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, selector]);
};

