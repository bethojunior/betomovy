import { useEffect, useState } from "react";

export interface ZafiraFieldValues {
  name: string;
  phone: string;
  document: string;
  email: string;
}

export interface UseZafiraValidationResetParams {
  initialValidated: number;
  original: ZafiraFieldValues;
  current: ZafiraFieldValues;
}

export const useZafiraValidationReset = ({
  initialValidated,
}: UseZafiraValidationResetParams) => {
  const [zafiraValidated, setZafiraValidated] = useState<number>(initialValidated);

  useEffect(() => {
    setZafiraValidated(initialValidated);
  }, [initialValidated]);

  return { zafiraValidated, setZafiraValidated };
};
