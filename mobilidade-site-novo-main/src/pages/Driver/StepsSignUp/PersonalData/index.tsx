import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import swal from "sweetalert";
import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import { Container } from "./styles";
import Mask from "../../../../utils/Masks";

import {
  FormActions,
  useDriverDatasContext,
} from "../../../../contexts/DriverDatasContext";

import LoadingBackdrop from "../../../../components/LoadingBackdrop";
import api from "../../../../api/apiAxios";

import { schema } from "./schemas_validations";
import { AxiosError } from "axios";
import { validatorCpf } from "../../../../utils/CheckCpfValid";
import { validatorEmail } from "../../../../utils/CheckEmail";
import { usePhoneCountryField } from "../../../../hooks/usePhoneCountryField";
import { findCountryByIso2 } from "../../../../utils/countryCodes";
import CountryCodeSelect from "../../../../components/CountryCodeSelect";

interface PersonalDataProps {
  step: number;
  setStep: (data: number) => void;
  setIdCategory: (data: string | null) => void;
}

interface IFormInputs {
  nameDriver: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  confirmPassword: string;
  cpfandcnpj: string;
}

interface DocumentProps {
  id: number;
  field: string;
  alias: string;
  description: string;
  userTypeId: number;
  compelField: boolean;
  required: boolean;
}

const userTypeId = {
  finalClient: 5,
};
const documentApp = {
  driver: 4,
  client: 90,
};

const PersonalData = ({ setStep, step, setIdCategory }: PersonalDataProps) => {
  const { t } = useTranslation();

  const { control, handleSubmit, setValue, getValues } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const { state, dispatch } = useDriverDatasContext();

  const { country, selectCountry, maskPhone, isValidPhone, toDialablePhone } = usePhoneCountryField();

  const [loading, setLoading] = useState<boolean>(false);
  const [documentVal, setDocumentVal] = useState<DocumentProps>();

  const [errorCpf, setErrorCpf] = useState<boolean>(false);
  const [nameErrorCpf, setNameErrorCpf] = useState<string>("");

  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [nameErrorEmail, setNameErrorEmail] = useState<string>("");

  const [errorPhone, setErrorPhone] = useState<boolean>(false);
  const [nameErrorPhone, setNameErrorPhone] = useState<string>("");

  const [errorPassword, setErrorPassword] = useState<boolean>(false);
  const [nameErrorPassword, setNameErrorPassword] = useState<string>("");

  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const query = window.location.search;
  const urlParams = new URLSearchParams(query);

  const nameAppPartner = urlParams.get("name_app");

  const TranslationErrors = (message: string) => {
    switch (message) {
      case "Digite o nome completo":
        return t("message-error-form-full-name");

      case "Este campo é obrigatório":
        return t("message-error-form-input-mandatory");

      case "Este campo é do tipo email":
        return t("message-error-form-input-type-email");

      case "O mínimo é 6 caracteres":
        return t("message-error-form-minimun-char6");

      case "O mínimo é 14 caracteres":
        return t("message-error-form-minimun-char14");

      case "O mínimo é 15 caracteres":
        return t("message-error-form-minimun-char15");

      case "O máximo é 18 caracteres":
        return t("message-error-form-maximun-char18");
    }
  };

  const handleSubmitDatas = (data: IFormInputs) => {
    if (errorEmail || errorCpf || errorPhone || errorPassword) {
      swal({
        title: t("validation-error-title"),
        text: t("validation-error-message"),
        icon: "error",
      });
      return;
    }

    if (
      (documentVal?.required && data?.cpfandcnpj?.length === 0) ||
      (documentVal?.required && data?.cpfandcnpj === undefined)
    ) {
      swal({
        title: "Error",
        text: `${documentVal?.alias} ${t("message-required")}`,
        icon: "error",
      });
      return;
    }

    const datasSend = {
      cpfAndCnpjDriver: data.cpfandcnpj,
      email: data.email,
      genderDriver: data.gender,
      nameDriver: data.nameDriver,
      password: data.password,
      phone: data.phone,
      phoneCountryIso2: country.iso2,
    };

    dispatch({
      type: FormActions.setPersonalData,
      payload: datasSend,
    });

    setStep(step + 1);
  };

  const handleBackCategories = () => {
    setIdCategory(null);
  };

  const getRequiredField = async () => {
    try {
      const response = await api.get(
        `requiredfield/get?userTypeId=${userTypeId.finalClient}&fullFields=${1}`
      );
      const { data } = response;
      if (!data.status) return;
      const document = data?.data?.find((item: DocumentProps) => {
        return Number(item.id) === Number(documentApp.driver);
      });

      setDocumentVal(document);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
    }
  };

  const handleCheckEmail = useCallback(async (email: string) => {
    if (email) {
      setLoading(true);
      try {
        const response = await api.post("Driver/CheckEmail", {
          stdObject: [
            {
              email: email,
            },
          ],
        });

        if (response.data.status) {
          swal({
            title: t("email-already-registered-title"),
            text: t("email-already-registered-message"),
            icon: "warning",
          });
          setErrorEmail(true);
          setNameErrorEmail(t("email-already-registered-title"));
        } else {
          setErrorEmail(false);
          setNameErrorEmail("");
        }
      } catch (error) {
        swal({
          title: t("request-error-title"),
          icon: "error",
        });
        console.log(error);
      }
      setLoading(false);
    }
  }, [t]);

  const handleCheckPhone = async () => {
    if (getValues("phone")) {
      setLoading(true);
      try {
        const response = await api.post("Driver/CheckPhone", {
          stdObject: [
            {
              phone: toDialablePhone(getValues("phone")),
            },
          ],
        });

        if (response.data.status) {
          swal({
            title: t("phone-already-registered-title"),
            text: t("phone-already-registered-message"),
            icon: "warning",
          });
          setErrorPhone(true);
          setNameErrorPhone(t("phone-already-registered-title"));
        } else {
          setErrorPhone(false);
          setNameErrorPhone("");
        }
      } catch (error) {
        swal({
          title: t("request-error-title"),
          icon: "error",
        });
        console.log(error);
      }
      setLoading(false);
    }
  };

  const handleCheckEmailAppPartner = useCallback(async (email: string) => {
    if (email) {
      setLoading(true);
      try {
        const response = await api.post("Driver/CheckEmailAppPartner", {
          stdObject: [
            {
              email: email,
              keyAppPartner: nameAppPartner
            },
          ],
        });

        if (response.data.status) {
          swal({
            title: t("email-already-registered-title"),
            text: t("email-already-registered-app-message"),
            icon: "warning",
          });
          setErrorEmail(true);
          setNameErrorEmail(t("email-already-registered-title"));
        } else {
          setErrorEmail(false);
          setNameErrorEmail("");
        }
      } catch (error) {
        swal({
          title: t("request-error-title"),
          icon: "error",
        });
        console.log(error);
      }
      setLoading(false);
    }
  }, [nameAppPartner, t]);

  const debouncedEmailCheck = useCallback((email: string) => {
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }

    const timeout = setTimeout(() => {
      if (email && validatorEmail(email)) {
        if (nameAppPartner) {
          handleCheckEmailAppPartner(email);
        } else {
          handleCheckEmail(email);
        }
      }
    }, 1000);

    emailCheckTimeoutRef.current = timeout;
  }, [nameAppPartner, handleCheckEmail, handleCheckEmailAppPartner]);

  const handleCheckDocument = async () => {
    if (documentVal?.required && getValues("cpfandcnpj")) {
      setLoading(true);
      const cpfCnpj = getValues("cpfandcnpj");
      try {
        const response = await api.post("Driver/CheckDocument", {
          document: cpfCnpj,
        });

        if (response.data.status) {
          swal({
            title: t("document-exists"),
            icon: "warning",
          });
          setErrorCpf(true);
          setNameErrorCpf(t("document-exists"));
        } else {
          setErrorCpf(false);
          setNameErrorCpf("");
        }
      } catch (error) {
        swal({
          title: "Erro na requisição!",
          icon: "error",
        });
        console.log(error);
      }
      setLoading(false);
    }
  };

  const handleCheckDocumentAppPartner = async () => {
    if (documentVal?.required && getValues("cpfandcnpj")) {
      setLoading(true);
      const cpfCnpj = getValues("cpfandcnpj");
      try {
        const response = await api.post("Driver/CheckDocumentAppPartner", {
          document: cpfCnpj,
          keyAppPartner: nameAppPartner
        });

        if (response.data.status) {
          swal({
            title: t("document-exists"),
            icon: "warning",
          });
          setErrorCpf(true);
          setNameErrorCpf(t("document-exists"));
        } else {
          setErrorCpf(false);
          setNameErrorCpf("");
        }
      } catch (error) {
        swal({
          title: "Erro na requisição!",
          icon: "error",
        });
        console.log(error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state.stepPersonalData.cpfAndCnpjDriver) {
      setValue("cpfandcnpj", state.stepPersonalData.cpfAndCnpjDriver);
    }
    if (state.stepPersonalData.email) {
      setValue("email", state.stepPersonalData.email);
    }
    if (state.stepPersonalData.genderDriver) {
      setValue("gender", state.stepPersonalData.genderDriver);
    }
    if (state.stepPersonalData.password) {
      setValue("password", state.stepPersonalData.password);
    }
    if (state.stepPersonalData.nameDriver) {
      setValue("nameDriver", state.stepPersonalData.nameDriver);
    }
    if (state.stepPersonalData.phone) {
      setValue("phone", state.stepPersonalData.phone);
      selectCountry(findCountryByIso2(state.stepPersonalData.phoneCountryIso2));
    }
    getRequiredField();

    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
    };
    /*eslint-disable-next-line*/
  }, []);

  const handleCheckPasswordMatch = () => {
    const password = getValues("password");
    const confirmPassword = getValues("confirmPassword");
    
    if (confirmPassword && password !== confirmPassword) {
      setErrorPassword(true);
      setNameErrorPassword(t("password-mismatch"));
    } else {
      setErrorPassword(false);
      setNameErrorPassword("");
    }
  };

  const validateData = () => {
    if (errorCpf || nameErrorCpf.length > 0 || errorEmail || nameErrorEmail.length > 0 || errorPhone || nameErrorPhone.length > 0 || errorPassword || nameErrorPassword.length > 0) {
      return true;
    }
    return false;
  };

  return (
    <Container>
      <LoadingBackdrop loading={loading} />
      <h1>{t("register-driver-step-1-title-card")}</h1>
      <form
        onSubmit={handleSubmit(handleSubmitDatas)}
        className="content-personal-data"
      >
        <Controller
          control={control}
          name="nameDriver"
          render={({
            field: { onChange, onBlur, value = "", name },
            fieldState: { error },
          }) => (
            <div>
              <input
                type="text"
                placeholder={t("register-driver-step-1-name")}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                name={name}
              />
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="cpfandcnpj"
          render={({ field: { value = "", name }, fieldState: { error } }) => (
            <div className="cpf-container">
              <div className="container-input">
                <input
                  style={{
                    display: Boolean(documentVal?.compelField) ? "" : "none",
                  }}
                  type="text"
                  placeholder={
                    !documentVal?.alias
                      ? t("register-driver-step-1-cpfcnpj")
                      : documentVal.alias
                  }
                  onChange={(event) => {
                    const masked = Mask.setMaskCPFCNPJ(event.target.value);
                    setValue("cpfandcnpj", masked);
                  }}
                  value={value}
                  onBlur={() => {
                    const cpf = getValues("cpfandcnpj") || ""; 
                    if (!validatorCpf(cpf)) {
                      setErrorCpf(true);
                      setNameErrorCpf(t("register-driver-step-1-cpfcnpj-error"));
                      return;
                    }
                    setErrorCpf(false);
                    setNameErrorCpf("");
                    if (nameAppPartner) {
                      handleCheckDocumentAppPartner();
                    } else {
                      handleCheckDocument();
                    }
                  }}
                  name={name}
                />
                {errorCpf && (
                  <span className="cpf-icon">
                    <FaTimesCircle color="red" />
                  </span>
                )}
                {!errorCpf && value && (
                  <span className="cpf-icon">
                    <FaCheckCircle color="green" />
                  </span>
                )}
              </div>
              {errorCpf && nameErrorCpf && (
                <span className="errors-input">
                  {nameErrorCpf}
                </span>
              )}
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="gender"
          render={({
            field: { onChange, onBlur, value = "", name },
            fieldState: { error },
          }) => (
            <>
              <select
                onChange={onChange}
                value={value}
                name={name}
                onBlur={onBlur}
                className={value ? 'select-value' : 'select-placeholder'}
              >
                <option value="" disabled>
                  {t("register-driver-step-1-select-gender-default")}
                </option>
                <option value="masculino">
                  {t("register-driver-select-step-1-gender-man")}
                </option>
                <option value="feminino">
                  {t("register-driver-select-step-1-gender-woman")}
                </option>
                <option value="não informado">
                  {t("register-driver-select-step-1-gender-not-informed")}
                </option>
                <option value="outro">
                  {t("register-driver-select-step-1-gender-other")}
                </option>
              </select>
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({
            field: { value = "", name },
            fieldState: { error },
          }) => (
            <div className="cpf-container">
              <div className="container-input">
                <input
                  type="email"
                  placeholder={t("register-driver-step-1-email") as string}
                  onChange={(event) => {
                    const emailValue = event.target.value;
                    setValue("email", emailValue);
                    
                    if (emailValue && !validatorEmail(emailValue)) {
                      setErrorEmail(true);
                      setNameErrorEmail(t("register-driver-step-1-email-error"));
                    } else if (emailValue && validatorEmail(emailValue)) {
                      setErrorEmail(false);
                      setNameErrorEmail("");
                      debouncedEmailCheck(emailValue);
                    } else {
                      setErrorEmail(false);
                      setNameErrorEmail("");
                    }
                  }}
                  value={value}
                  onBlur={() => {
                    const email = getValues("email");
                    
                    // Cancela o debounce pendente
                    if (emailCheckTimeoutRef.current) {
                      clearTimeout(emailCheckTimeoutRef.current);
                      emailCheckTimeoutRef.current = null;
                    }
                    
                    // Valida formato
                    if (email && !validatorEmail(email)) {
                      setErrorEmail(true);
                      setNameErrorEmail(t("register-driver-step-1-email-error"));
                      return;
                    }
                    
                    // Valida se email já existe (imediatamente, sem debounce)
                    if (email && validatorEmail(email)) {
                      if (nameAppPartner) {
                        handleCheckEmailAppPartner(email);
                      } else {
                        handleCheckEmail(email);
                      }
                    }
                  }}
                  name={name}
                />
                {errorEmail && (
                   <span className="cpf-icon">
                    <FaTimesCircle color="red" />
                  </span>
                )}
                {!errorEmail && value && (
                   <span className="cpf-icon">
                    <FaCheckCircle color="green" />
                  </span>
                )}
              </div>
              {errorEmail && nameErrorEmail && (
                <span className="errors-input">
                  {nameErrorEmail}
                </span>
              )}
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({
            field: { value = "", name },
            fieldState: { error },
          }) => (
            <div className="cpf-container">
              <div className="phone-input-row">
                <CountryCodeSelect value={country} onChange={selectCountry} />
                <div className="container-input">
                  <input
                    type="tel"
                    placeholder={t("register-driver-step-1-phone") as string}
                    maxLength={15}
                    onChange={(event) => {
                      const masked = maskPhone(event.target.value);
                      setValue("phone", masked);
                    }}
                    value={value}
                    onBlur={() => {
                      if (!isValidPhone(value)) {
                        setErrorPhone(true);
                        setNameErrorPhone(t("register-driver-step-1-phone-error"));
                        return;
                      }
                      setErrorPhone(false);
                      setNameErrorPhone("");
                      handleCheckPhone();
                    }}
                    name={name}
                  />
                  {errorPhone && (
                    <span className="cpf-icon">
                      <FaTimesCircle color="red" />
                    </span>
                  )}
                  {!errorPhone && value && (
                    <span className="cpf-icon">
                      <FaCheckCircle color="green" />
                    </span>
                  )}
                </div>
              </div>
              {errorPhone && nameErrorPhone && (
                <span className="errors-input">
                  {nameErrorPhone}
                </span>
              )}
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({
            field: { onChange, onBlur, value = "", name },
            fieldState: { error },
          }) => (
            <div className="cpf-container">
              <div className="container-input">
                <input
                  type="password"
                  placeholder={t("register-driver-step-1-password") as string}
                  onChange={(event) => {
                    onChange(event);
                    setTimeout(handleCheckPasswordMatch, 0);
                  }}
                  value={value}
                  onBlur={onBlur}
                  name={name}
                />
                {!errorPassword && value && getValues("confirmPassword") && value === getValues("confirmPassword") && (
                  <span className="cpf-icon">
                    <FaCheckCircle color="green" />
                  </span>
                )}
              </div>
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({
            field: { value = "", name },
            fieldState: { error },
          }) => (
            <div className="cpf-container">
              <div className="container-input">
                <input
                  type="password"
                  placeholder={t("register-driver-step-1-confirm-password") as string}
                  onChange={(event) => {
                    setValue("confirmPassword", event.target.value);
                    handleCheckPasswordMatch();
                  }}
                  onBlur={handleCheckPasswordMatch}
                  value={value}
                  name={name}
                />
                {errorPassword && (
                  <span className="cpf-icon">
                    <FaTimesCircle color="red" />
                  </span>
                )}
                {!errorPassword && value && getValues("password") && (
                  <span className="cpf-icon">
                    <FaCheckCircle color="green" />
                  </span>
                )}
              </div>
              {errorPassword && nameErrorPassword && (
                <span className="errors-input">
                  {nameErrorPassword}
                </span>
              )}
            </div>
          )}
        />
        <div className="content-button">
          <button type="button" onClick={handleBackCategories}>
            {t("register-driver-steps-buttons-back")}
          </button>
          <button
            type="submit"
            className="main-button"
            disabled={validateData()}
            style={{
              opacity: validateData() ? 0.6 : 1,
              cursor: validateData() ? 'not-allowed' : 'pointer'
            }}
          >
            {t("register-driver-steps-buttons-next")}
          </button>
        </div>
      </form>
    </Container>
  );
};

export default PersonalData;
