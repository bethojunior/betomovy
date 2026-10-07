export interface FormsStepsProps {
  description: string;
  id: number;
  manageable: number;
  showable: number;
  step: string;
}

export interface StepsSelectedProps {
  created_at: string;
  formStepId: number;
  form_step: {
    description: string;
    id: number;
    manageable: number;
    showable: number;
    step: string;
  };
  id: number;
  updated_at: string;
  userTypeId: number;
}
