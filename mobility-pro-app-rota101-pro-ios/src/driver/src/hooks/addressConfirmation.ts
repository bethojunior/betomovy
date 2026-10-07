import {useState} from 'react';

export const useAddressConfirmation = () => {
  // O estado que será resolvido quando a confirmação do endereço for concluída
  const [addressConfirmationResolver, setAddressConfirmationResolver] =
    useState(null);

  // A função que o usuário chamará para confirmar o endereço
  const confirmAddress = () => {
    if (addressConfirmationResolver) {
      addressConfirmationResolver();
      setAddressConfirmationResolver(null);
    }
  };

  // A função que aguardará a confirmação do endereço
  const waitForAddressConfirmation = () => {
    return new Promise(resolve => {
      setAddressConfirmationResolver(() => resolve);
    });
  };

  return {confirmAddress, waitForAddressConfirmation};
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
