export interface ConfigCitiesData {
  attribute: string;
  cityId: number;
  description: string;
  inputType: string;
  value:
    | string
    | {
        accept: {
          [key: string]: boolean;
        };
      };
}

export interface ConfigCitiesList extends Array<ConfigCitiesData> {}

export type InputTypeProps = {
  [key: string]: string | boolean;
};
