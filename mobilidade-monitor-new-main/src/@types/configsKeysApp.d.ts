declare type ConfigsKeyAppsProps = {
  description: string;
  key: string;
  value: string;
  inputTypePro: string;
}

declare type KeysAppProps = {
    config: ConfigsKeyAppsProps[];
    type: string;
};
