export type CountryCode = 'US' | 'BR';

export interface TranslationDictionary {
  appName: string;
  loginTitle: string;
  emailLabel: string;
  passwordLabel: string;
  phoneLabel: string;
  loginButton: string;
  loginWithPhone: string;
  registerTitle: string;
  nameLabel: string;
  cpfLabel?: string;
  zipCodeLabel: string;
  whereTo: string;
  requestRide: string;
  negociaTitle: string;
  yourOffer: string;
  driverCounterOffer: string;
  acceptOffer: string;
  pinSecurityNote: string;
  cashoutTitle: string;
  instantCashoutButton: string;
  currencySymbol: string;
}

export const TRANSLATIONS: Record<CountryCode, TranslationDictionary> = {
  US: {
    appName: 'MOVY',
    loginTitle: 'Sign In to your Account',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    phoneLabel: 'Phone Number (+1)',
    loginButton: 'Sign In',
    loginWithPhone: 'Sign In with Phone SMS',
    registerTitle: 'Create your MOVY Account',
    nameLabel: 'Full Name',
    zipCodeLabel: 'ZIP Code',
    whereTo: 'Where to?',
    requestRide: 'Request MOVY',
    negociaTitle: 'MOVY Negotiate',
    yourOffer: 'Your Offer ($ USD)',
    driverCounterOffer: 'Driver Counter-Offer',
    acceptOffer: 'Accept Driver Offer',
    pinSecurityNote: 'Share this 4-digit PIN with driver to start ride:',
    cashoutTitle: 'Driver Earnings & Cashout',
    instantCashoutButton: 'Instant Cash Out via Zelle',
    currencySymbol: '$',
  },
  BR: {
    appName: 'MOVY',
    loginTitle: 'Entre na sua Conta',
    emailLabel: 'Endereço de E-mail',
    passwordLabel: 'Senha',
    phoneLabel: 'Telefone Celular (+55)',
    loginButton: 'Entrar',
    loginWithPhone: 'Entrar com SMS',
    registerTitle: 'Criar Conta MOVY',
    nameLabel: 'Nome Completo',
    cpfLabel: 'CPF (apenas números)',
    zipCodeLabel: 'CEP',
    whereTo: 'Para onde vamos?',
    requestRide: 'Solicitar MOVY',
    negociaTitle: 'MOVY Negocia',
    yourOffer: 'Sua Oferta (R$ BRL)',
    driverCounterOffer: 'Contraproposta do Motorista',
    acceptOffer: 'Aceitar Proposta do Motorista',
    pinSecurityNote: 'Informe este PIN de 4 dígitos ao motorista para iniciar:',
    cashoutTitle: 'Extrato e Saques do Motorista',
    instantCashoutButton: 'Saque Instantâneo via Pix',
    currencySymbol: 'R$',
  },
};

export class I18nManager {
  private currentCountry: CountryCode = 'US'; // Padrão: Estados Unidos

  setCountry(country: CountryCode) {
    this.currentCountry = country;
  }

  getCountry(): CountryCode {
    return this.currentCountry;
  }

  t(): TranslationDictionary {
    return TRANSLATIONS[this.currentCountry];
  }
}

export const i18n = new I18nManager();
