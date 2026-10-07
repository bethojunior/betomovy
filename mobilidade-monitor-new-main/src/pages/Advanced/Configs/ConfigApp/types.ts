export interface ConfigAppsProps {
  appId: number;
  cityId: null | number | string;
  created_at: string | Date | null;
  deleted_at: string | Date | null;
  id: number;
  logo: string;
  mainColor: string;
  mainColorText: string;
  name: string;
  secondaryColor: string;
  secondaryColorText: string;
  updated_at: string | Date | null;
}

export interface ScreenColorsSimulatorsProps {
  colorPrimary: string | undefined;
  colorTextPrimary: string | undefined;
  colorSecondary: string | undefined;
}
