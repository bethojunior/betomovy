export interface NetworkPropsContext {
  itsNetwork: boolean | null;
  setItsNetwork: (network: boolean | null) => void;
  betaEnd: boolean | null;
  needUpdate: boolean | null;
  versionApp: string | null;
}
