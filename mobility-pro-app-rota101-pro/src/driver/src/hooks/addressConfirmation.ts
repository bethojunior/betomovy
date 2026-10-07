import {useRef, useState} from 'react';

export const useAddressConfirmation = () => {
  const resolverRef = useRef<null | (() => void)>(null);

  const confirmAddress = () => {
    if (resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
    } else {
      console.log('Nenhum resolver ativo');
    }
  };

  const waitForAddressConfirmation = () => {
    return new Promise<void>(resolve => {
      resolverRef.current = resolve;
    });
  };

  return { confirmAddress, waitForAddressConfirmation };
};


export const usePixConfirmation = () => {
  // O estado que será resolvido quando a confirmação do endereço for concluída
  const [pixConfirmationResolver, setPixConfirmationResolver] = useState(null);

  // A função que o usuário chamará para confirmar o endereço
  const confirmPix = () => {
    if (pixConfirmationResolver) {
      pixConfirmationResolver();
      setPixConfirmationResolver(null);
    }
  };

  // A função que aguardará a confirmação do endereço
  const waitForPixConfirmation = () => {
    return new Promise(resolve => {
      setPixConfirmationResolver(() => resolve);
    });
  };

  return {confirmPix, waitForPixConfirmation};
};

export const useFavoriteConfirmation = () => {
  const [favoriteConfirmationResolver, setFavoriteConfirmationResolver] =
    useState(null);

  const confirmFavorite = () => {
    if (favoriteConfirmationResolver) {
      favoriteConfirmationResolver();
      setFavoriteConfirmationResolver(null);
    }
  };

  const waitFavoriteConfirmation = () => {
    return new Promise(resolve => {
      setFavoriteConfirmationResolver(() => resolve);
    });
  };

  return {confirmFavorite, waitFavoriteConfirmation};
};
