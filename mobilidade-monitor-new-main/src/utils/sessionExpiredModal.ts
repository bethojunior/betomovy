import swal from 'sweetalert';
import { breadCrumble } from './translation/breadCrumble';

interface SessionExpiredModalOptions {
  onRedirect?: () => void;
}

export const showSessionExpiredModal = (options: SessionExpiredModalOptions = {}): void => {
  const { onRedirect } = options;

  const redirectToLogin = () => {
    if (onRedirect) {
      onRedirect();
    }
    localStorage.clear();
    window.location.href = '/';
  };

  const existingModal = document.querySelector('.swal-overlay');
  if (existingModal) {
    if (typeof (swal as any).close === 'function') {
      (swal as any).close();
    } else {
      existingModal.remove();
    }
  }

  setTimeout(() => {
    swal({
      title: breadCrumble('session.expired.title'),
      text: breadCrumble('session.expired.text'),
      icon: "warning",
      buttons: {
        confirm: {
          text: breadCrumble('session.expired.button'),
          value: true,
          visible: true,
          className: "swal-button--confirm",
          closeModal: true
        }
      },
      dangerMode: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
      className: "swal-centered-text"
    }).then(() => {
      redirectToLogin();
    }).catch(() => {
      redirectToLogin();
    });

    setupModalInterceptors(redirectToLogin);
  }, 100);
};

// Nota: Esta função depende de classes CSS internas do sweetalert e pode quebrar
// se a biblioteca for atualizada. setTimeout é necessário pois o modal renderiza assincronamente.
const setupModalInterceptors = (redirectToLogin: () => void): void => {
  setTimeout(() => {
    const confirmButton = document.querySelector('.swal-button--confirm') as HTMLButtonElement;
    const titleElement = document.querySelector('.swal-title');
    const textElement = document.querySelector('.swal-text');
    
    const expiredTitle = breadCrumble('session.expired.title');
    const expiredText = breadCrumble('session.expired.text');
    const expiredButton = breadCrumble('session.expired.button');
    
    if (titleElement && titleElement.textContent !== expiredTitle) {
      titleElement.textContent = expiredTitle;
    }
    if (textElement && textElement.textContent !== expiredText) {
      textElement.textContent = expiredText;
    }
    
    if (confirmButton) {
      confirmButton.style.backgroundColor = '#3085d6';
      confirmButton.style.color = 'white';
      confirmButton.style.border = 'none';
      confirmButton.style.borderRadius = '4px';
      confirmButton.style.padding = '10px 20px';
      confirmButton.style.cursor = 'pointer';
      confirmButton.style.fontSize = '14px';
      
      if (confirmButton.textContent !== expiredButton) {
        confirmButton.textContent = expiredButton;
      }
    }
  }, 100);

  setTimeout(() => {
    const modal = document.querySelector('.swal-overlay');
    
    if (modal) {
      const handleOverlayClick = (e: Event) => {
        if (e.target === modal) {
          e.preventDefault();
          e.stopPropagation();
          redirectToLogin();
        }
      };
      
      modal.addEventListener('click', handleOverlayClick as EventListener, true);
      
      const handleEscapeKey = (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          redirectToLogin();
        }
      };
      
      document.addEventListener('keydown', handleEscapeKey as EventListener, true);
      
      const observer = new MutationObserver(() => {
        if (!document.querySelector('.swal-overlay')) {
          modal.removeEventListener('click', handleOverlayClick as EventListener, true);
          document.removeEventListener('keydown', handleEscapeKey as EventListener, true);
          observer.disconnect();
        }
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }, 100);
};

