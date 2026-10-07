import { useCallback, useEffect, useState } from 'react';
import { translate } from '../../../../client/locales';
import { useBank } from '../../context/bank';
import { AccountInfo, BankProps } from '../../context/bank/types';

export interface BankFormattedProps {
  id: string;
  name: string;
}

export type BankAccountFormMode = 'loading' | 'empty' | 'read' | 'edit';

export type FieldErrors = Partial<Record<keyof AccountInfo, string>>;

/**
 * Só titular/documento/pix são obrigatórios pra receber transferências — o resto (banco,
 * números da conta, endereço) é só pra confirmação, sem bloquear o cadastro.
 */
const REQUIRED_FIELDS: { key: keyof AccountInfo; errorKey: string }[] = [
  { key: 'holderName', errorKey: 'account_driver_modal.alert_error_name' },
  { key: 'document', errorKey: 'account_driver_modal.alert_error_document' },
  { key: 'pix', errorKey: 'bank_account_screen.alert_error_pix' },
];

/** Estado, validação e submit da tela de conta bancária (leitura/cadastro/edição). */
export function useBankAccountForm(initialMode?: 'edit') {
  const { getAccount, getBanksList, editAccount, createAccount } = useBank();

  const [mode, setMode] = useState<BankAccountFormMode>('loading');
  const [account, setAccount] = useState<AccountInfo>({} as AccountInfo);
  const [form, setForm] = useState<AccountInfo>({} as AccountInfo);
  const [banks, setBanks] = useState<BankFormattedProps[]>([]);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // Erro que não é de um campo específico (ex: falha da API no submit) — mostrado à parte.
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasAccount = !!account && Object.keys(account).length > 0;

  // applyInitialMode só vale na carga inicial (via route params) — um reload
  // após salvar não pode reabrir o formulário em modo edição de novo.
  const loadAccount = useCallback(async (applyInitialMode = false) => {
    setMode('loading');
    const response = await getAccount();
    const startsInEdit = applyInitialMode && initialMode === 'edit';

    if (!response) {
      setAccount({} as AccountInfo);
      setForm({} as AccountInfo);
      setMode(startsInEdit ? 'edit' : 'empty');
      return;
    }

    setAccount(response);
    setForm(response);
    setMode(startsInEdit ? 'edit' : 'read');
  }, [getAccount, initialMode]);

  const loadBanks = useCallback(async () => {
    const response = await getBanksList();
    if (!response) return;

    setBanks(
      response.map((bank: BankProps) => ({
        id: bank?.idBank,
        name: bank?.bankName,
      })),
    );
  }, [getBanksList]);

  useEffect(() => {
    loadAccount(true);
    loadBanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = useCallback((key: keyof AccountInfo, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
    // some o erro do campo assim que o motorista começa a corrigir
    setFieldErrors(current => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }, []);

  const setBank = useCallback((id: string, name: string) => {
    setForm(current => ({ ...current, bankId: id, bankName: name }));
    setFieldErrors(current => {
      if (!current.bankName) return current;
      const next = { ...current };
      delete next.bankName;
      return next;
    });
  }, []);

  const startEdit = useCallback(() => {
    setFieldErrors({});
    setSubmitError(null);
    setForm(account);
    setMode('edit');
  }, [account]);

  const cancelEdit = useCallback(() => {
    setFieldErrors({});
    setSubmitError(null);
    setForm(account);
    setMode(hasAccount ? 'read' : 'empty');
  }, [account, hasAccount]);

  const fetchAddressByZipCode = useCallback(async (zipCode?: string) => {
    if (!zipCode || zipCode.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
      const data = await response.json();
      if (data?.erro) return;

      setForm(current => ({
        ...current,
        street: data?.logradouro ?? current.street,
        city: data?.localidade ?? current.city,
        complement: data?.complemento ?? current.complement,
        state: data?.uf ?? current.state,
        neighborhood: data?.bairro ?? current.neighborhood,
      }));
    } catch (err) {
      // CEP inválido ou ViaCEP fora do ar — motorista preenche o endereço na mão
    }
  }, []);

  const buildErrors = useCallback((): FieldErrors => {
    return REQUIRED_FIELDS.reduce<FieldErrors>((errors, field) => {
      if (!form[field.key]?.trim?.()) {
        errors[field.key] = translate(field.errorKey);
      }
      return errors;
    }, {});
  }, [form]);

  const submit = useCallback(async (): Promise<boolean> => {
    const errors = buildErrors();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }

    setSaving(true);
    setSubmitError(null);

    const success = hasAccount
      ? await editAccount(form, account.idBankAccount)
      : await createAccount(form);

    setSaving(false);

    if (!success) {
      setSubmitError(translate('account_driver_modal.text_error'));
      return false;
    }

    await loadAccount();
    return true;
  }, [buildErrors, hasAccount, form, account, editAccount, createAccount, loadAccount]);

  return {
    mode,
    form,
    banks,
    saving,
    fieldErrors,
    submitError,
    hasAccount,
    setField,
    setBank,
    startEdit,
    cancelEdit,
    fetchAddressByZipCode,
    submit,
  };
}
