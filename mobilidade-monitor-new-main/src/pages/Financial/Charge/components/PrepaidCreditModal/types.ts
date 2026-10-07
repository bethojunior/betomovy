import { FormInstance } from "antd";

import { CitiesType, CreditPrepaidProps, PaymentFormType } from "../../types";

export interface PrepaidCreditModalProps {
  open: boolean;
  editingPrepaid: CreditPrepaidProps | null;
  form: FormInstance;
  loading: boolean;
  typePrePaid: string;
  cities: CitiesType[];
  paymentForm: PaymentFormType[];
  onCancel: () => void;
  onFinish: (values: any) => void;
  onChangeType: (type: string) => void;
}
