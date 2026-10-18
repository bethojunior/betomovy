import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import swal from "sweetalert";

import { useEffect, useState } from "react";
import { Container, ContainerButton } from "./styles";

import Button from "../../components/Button";
import Header from "../../components/Header";
import MerchantDownload from "../../components/MerchantDownload";
import Footer from "../../components/Footer";
import ScreenSuccess from "../../components/ScreenSuccess";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import pathBackgroundImage from "../../assets/img/Banner2_1366x768.png";

import {
  getPathImageDefault,
  getNameApplication,
  LogoMovyDefault,
} from "../../config/configApp";
import api from "../../api/apiAxios";

import { useTranslation } from "react-i18next";
import SkeletonForm from "../../components/SkeletonForm";

import { schema } from "./schema_validations";
import { color } from "@mui/system";
import { validatorEmail } from "../../utils/CheckEmail";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { formatCityName } from "../../utils/CityFormatter";
import { decodeBase64 } from "../../utils/decodeBase64";
import { usePhoneCountryField } from "../../hooks/usePhoneCountryField";
import CountryCodeSelect from "../../components/CountryCodeSelect";
import Mask from "../../utils/Masks";
import { validatorCpf } from "../../utils/CheckCpfValid";
import { isValidDateOfBirth, toIsoDateOfBirth } from "../../utils/CheckDateOfBirth";
import { isLanguageEnabled } from "../../utils/languageConfig";

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void };
  }
}

interface FormDataProps {
  name: string;
  document: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  gender: string;
  cityId: string;
}

const Passenger = () => {
  const { t, i18n } = useTranslation();
  const isBrazil = (i18n.language || "en").startsWith("pt") && isLanguageEnabled("pt");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === "#sobre-nos" || window.location.hash === "#contato") {
      const hash = window.location.hash;
      const search = window.location.search;
      navigate(`/${search}${hash}`);
    }
  }, [navigate]);

  const { userId: userIdParam } = useParams<{ userId?: string }>();
  const isPreRegister = location.pathname.includes("/preregister");
  const userId = userIdParam ? decodeBase64(userIdParam) : null;

  const { control, handleSubmit, setValue, getValues } = useForm<FormDataProps>(
    {
      resolver: yupResolver(schema),
    }
  );

  const { country, selectCountry, maskPhone, isValidPhone, toDialablePhone } = usePhoneCountryField();

  const [activeCities, setActiveCities] = useState<ActiveCitiesProps[]>([]);
  const [filteredCities, setFilteredCities] = useState<ActiveCitiesProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [preRegisterSuccess, setPreRegisterSuccess] = useState(false);
  const [preRegisterForm, setPreRegisterForm] = useState({
    name: "",
    document: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    gender: "",
    cityId: "",
    password: "",
  });

  const [errorDocument, setErrorDocument] = useState<boolean>(false);
  const [nameErrorDocument, setNameErrorDocument] = useState<string>("");

  const [errorDate, setErrorDate] = useState<boolean>(false);
  const [nameErrorDate, setNameErrorDate] = useState<string>("");

  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [nameErrorEmail, setNameErrorEmail] = useState<string>("");

  const [errorPhone, setErrorPhone] = useState<boolean>(false);
  const [nameErrorPhone, setNameErrorPhone] = useState<string>("");

  const [errorPassword, setErrorPassword] = useState<boolean>(false);
  const [nameErrorPassword, setNameErrorPassword] = useState<string>("");

  const TranslationErrors = (message: string) => {
    switch (message) {
      case "Digite o nome completo":
        return t("message-error-form-full-name");

      case "Este campo é obrigatório":
        return t("message-error-form-input-mandatory");

      case "Este campo é do tipo email":
        return t("message-error-form-input-type-email");

      case "Data de nascimento inválida":
        return t("register-passenger-dateofbirth-error");

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

  const query = window.location.search;
  const urlParams = new URLSearchParams(query);

  const nameAppPartner = urlParams.get("name_app");
  const userInfo = urlParams.get("user");
  const isApp =
    urlParams.get("app") === "1" ||
    typeof (window as any).ReactNativeWebView !== "undefined" ||
    window.location.search.includes("app=1") ||
    (typeof navigator !== "undefined" && (
      navigator.userAgent.includes("wv") ||
      navigator.userAgent.includes("ReactNativeWebView")
    ));

  const handleRegisterPassenger = (data: FormDataProps) => {
    setLoading(true);
    const payload = {
      ...data,
      document: "",
      phone: toDialablePhone(data.phone),
      dateOfBirth: toIsoDateOfBirth(data.dateOfBirth),
      nickname: data.name.split(" ")[0] ? data.name.split(" ")[0] : null,
      appPartner: nameAppPartner ?? null,
      userId: userInfo ? atob(userInfo) : null,
    };
    api
      .post("customer/register", JSON.stringify({ stdObject: [payload] }))
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
          setIsRegistered(true);

          setValue("name", "");
          setValue("document", "");
          setValue("dateOfBirth", "");
          setValue("gender", "");
          setValue("cityId", "");
          setValue("phone", "");
          setValue("password", "");
          setValue("confirmPassword", "");
          setValue("email", "");

          if (
            window.ReactNativeWebView &&
            window.ReactNativeWebView.postMessage
          ) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify("redirect-login-new-site")
            );
          } else {
            const searchParams = new URLSearchParams(window.location.search);
            const whatsappNumber = searchParams.get("whatsapp");

            if (whatsappNumber) {
              const fullNumber = `55${whatsappNumber.replace(/\D/g, "")}`;
              const whatsappUrl = `https://api.whatsapp.com/send/?phone=${fullNumber}&text=Ol%C3%A1,%20finalizei%20o%20cadastro`;
              window.location.href = whatsappUrl;
            } else {
              console.warn("Parâmetro 'whatsapp' não encontrado na URL.");
            }
          }
        } else {
          swal({
            title: response.data.message,
            icon: "warning",
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
        swal({
          title: t("message-error-api-register-passenger") as string,
          icon: "error",
        });
      });
  };

  // customer/checkemail: status true = e-mail já cadastrado; false = disponível
  const handleCheckEmail = async () => {
    if (getValues("email")) {
      setLoading(true);
      try {
        const response = await api.post("customer/checkemail", {
          stdObject: [
            {
              email: getValues("email"),
            },
          ],
        });

        if (response.data.status) {
          swal({
            title: response.data.message,
            icon: "warning",
          });
          setErrorEmail(true);
          setNameErrorEmail(t("message-error-form-email"));
        } else {
          setErrorEmail(false);
          setNameErrorEmail("");
        }
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? t("message-error-form-email");

        swal({
          title: message,
          icon: "warning",
        });
        setErrorEmail(true);
        setNameErrorEmail(t("message-error-form-email"));
      }
      setLoading(false);
    }
  };

  const handleCheckDocument = async () => {
    if (!isBrazil) return;
    const document = getValues("document");
    if (document) {
      setLoading(true);
      try {
        const response = await api.post("customer/checkdocument", {
          document,
        });

        if (response.data.status) {
          swal({
            title: t("document-exists"),
            icon: "warning",
          });
          setErrorDocument(true);
          setNameErrorDocument(t("document-exists"));
        } else {
          setErrorDocument(false);
          setNameErrorDocument("");
        }
      } catch (error: unknown) {
        console.log("error", error);
      }
      setLoading(false);
    }
  };

  const handleCheckPhone = async () => {
    if (getValues("phone")) {
      setLoading(true);
      try {
        const response = await api.post("customer/checkphone", {
          stdObject: [
            {
              phone: toDialablePhone(getValues("phone")),
            },
          ],
        });

        if (response.data.status) {
          setErrorPhone(false);
          setNameErrorPhone("");
        } else {
          swal({
            title: response.data.message,
            icon: "warning",
          });
          setErrorPhone(true);
          setNameErrorPhone(t("message-error-form-phone"));
        }
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? t("message-error-form-phone");

        swal({
          title: message,
          icon: "warning",
        });
        setErrorPhone(true);
        setNameErrorPhone(t("message-error-form-phone"));
      }
      setLoading(false);
    }
  };

  const handleCheckPasswordMatch = () => {
    const password = getValues("password");
    const confirmPassword = getValues("confirmPassword");

    if (confirmPassword && password !== confirmPassword) {
      setErrorPassword(true);
      setNameErrorPassword("As senhas não coincidem");
    } else {
      setErrorPassword(false);
      setNameErrorPassword("");
    }
  };

  const validateData = () => {
    if (
      errorDate ||
      nameErrorDate.length > 0 ||
      errorEmail ||
      nameErrorEmail.length > 0 ||
      errorPhone ||
      nameErrorPhone.length > 0 ||
      errorPassword ||
      nameErrorPassword.length > 0
    ) {
      return true;
    }
    return false;
  };

  const handlePreRegisterChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    if (field === "phone") value = maskPhone(value);
    if (field === "document") value = Mask.setMaskCpf(value);
    if (field === "dateOfBirth") value = Mask.setMaskDate(value);
    setPreRegisterForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreRegisterDocumentBlur = () => {
    if (!isBrazil || !preRegisterForm.document) return;
    if (!validatorCpf(preRegisterForm.document)) {
      setErrorDocument(true);
      setNameErrorDocument(t("register-passenger-document-error"));
      return;
    }
    setErrorDocument(false);
    setNameErrorDocument("");
  };

  const handlePreRegisterDateOfBirthBlur = () => {
    if (!preRegisterForm.dateOfBirth) return;
    if (!isValidDateOfBirth(preRegisterForm.dateOfBirth)) {
      setErrorDate(true);
      setNameErrorDate(t("register-passenger-dateofbirth-error"));
      return;
    }
    setErrorDate(false);
    setNameErrorDate("");
  };

  const handlePreRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !preRegisterForm.name.trim() ||
      !preRegisterForm.dateOfBirth.trim() ||
      !preRegisterForm.email.trim() ||
      !preRegisterForm.phone.trim()
    ) {
      swal("", "Preencha todos os campos!", "info");
      return;
    }
    if (!isValidDateOfBirth(preRegisterForm.dateOfBirth)) {
      setErrorDate(true);
      setNameErrorDate(t("register-passenger-dateofbirth-error"));
      return;
    }
    if (preRegisterForm.password.length < 6) {
      swal("", "Senha precisa ter no mínimo 6 caracteres", "info");
      return;
    }
    if (!preRegisterForm.gender || !preRegisterForm.cityId) {
      swal("", "Selecione gênero e cidade!", "info");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: preRegisterForm.name.trim(),
        nickname: preRegisterForm.name.trim().split(" ")[0],
        document: "",
        dateOfBirth: toIsoDateOfBirth(preRegisterForm.dateOfBirth),
        email: preRegisterForm.email.trim(),
        password: preRegisterForm.password.trim(),
        phone: toDialablePhone(preRegisterForm.phone),
        gender: preRegisterForm.gender,
        cityId: parseInt(preRegisterForm.cityId, 10),
        registered_in: "mobilidade",
        ...(userId ? { userId } : {}),
      };
      const response = await api.post("customer/register", JSON.stringify({ stdObject: [payload] }));
      if (response.data.status) {
        setPreRegisterSuccess(true);
        swal("", response.data.message || "Cadastro realizado com sucesso", "success");
      } else {
        swal("", response.data.message || "Erro ao cadastrar", "error");
      }
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      swal("", ax.response?.data?.message || "Erro ao cadastrar", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const list = Array.isArray(activeCities) ? activeCities : [];
    setFilteredCities(
      list
        .filter((city) =>
          city?.nome?.toLowerCase()?.includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    );
  }, [searchQuery, activeCities]);

  useEffect(() => {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "PAGE_LOADED" }));
    }
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(safetyTimer);
  }, []);

  useEffect(() => {
    const handleGetActiveCities = async () => {
      try {
        const responseActiveCities = await api.get("City/getActives");
        const rawCities = responseActiveCities?.data?.data ?? responseActiveCities?.data?.response;
        if (Array.isArray(rawCities)) {
          const uniqueCities = Array.from(
            new Map(rawCities.map((c: any) => [c.id || c.cityId, c])).values()
          ).sort((a: any, b: any) =>
            (a.nome || a.name || "").localeCompare(b.nome || b.name || "", "pt", { sensitivity: "base" })
          );
          setActiveCities(uniqueCities as ActiveCitiesProps[]);
        } else {
          setActiveCities([]);
        }
      } catch (error) {
        setActiveCities([]);
        console.log("Erro ao buscar cidades ativas:", error);
      }
    };

    handleGetActiveCities();
  }, []);

  document.title = isPreRegister ? `Cadastre-se | ${getNameApplication()}` : `Cadastro Passageiro | ${getNameApplication()}`;

  if (isPreRegister) {
    return (
      <Container>
        {!isApp && <Header />}
        <LoadingBackdrop loading={loading} />
        <div
          className="content-passenger"
          style={{ backgroundImage: `url(${pathBackgroundImage})` }}
        >
          <div className="column-1">
            <Link
              to={nameAppPartner ? `/?name_app=${nameAppPartner}` : "/"}
              className={`brand-header-link ${isApp ? "is-app" : ""}`}
            >
              <img
                src={getPathImageDefault()}
                alt={`logo-${getNameApplication()}`}
                onError={(e) => {
                  e.currentTarget.src = LogoMovyDefault;
                }}
              />
              {!isApp && <span className="brand-name">{getNameApplication()}</span>}
            </Link>
            <h1 className="passenger-title">{t("register-passenger-text")}</h1>
            <span className="passenger-description">{t("register-passenger-description")}</span>
          </div>
          <div className="column-2">
            {preRegisterSuccess ? (
              <ScreenSuccess
                isDriver={false}
                title={t("message-success-title")}
                text={t("message-success-description")}
              />
            ) : (
              <form onSubmit={handlePreRegisterSubmit}>
                <h1>{t("register-passenger-title-card")}</h1>
                <div>
                  <input
                    type="text"
                    placeholder={t("register-passenger-placeholder-name") as string}
                    value={preRegisterForm.name}
                    onChange={handlePreRegisterChange("name")}
                  />
                </div>
                <div className="cpf-container">
                  <div className="container-input">
                    <input
                      type="text"
                      placeholder={t("register-passenger-placeholder-dateofbirth") as string}
                      inputMode="numeric"
                      value={preRegisterForm.dateOfBirth}
                      onChange={handlePreRegisterChange("dateOfBirth")}
                      onBlur={handlePreRegisterDateOfBirthBlur}
                      maxLength={10}
                    />
                    {errorDate && (
                      <span className="cpf-icon">
                        <FaTimesCircle color="red" />
                      </span>
                    )}
                    {!errorDate && isValidDateOfBirth(preRegisterForm.dateOfBirth) && (
                      <span className="cpf-icon">
                        <FaCheckCircle color="green" />
                      </span>
                    )}
                  </div>
                  {errorDate && nameErrorDate && (
                    <span className="errors-input">{nameErrorDate}</span>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder={t("register-passenger-placeholder-email") as string}
                    value={preRegisterForm.email}
                    onChange={handlePreRegisterChange("email")}
                  />
                </div>
                <div className="phone-input-row">
                  <CountryCodeSelect value={country} onChange={selectCountry} />
                  <input
                    type="tel"
                    placeholder={t("register-passenger-placeholder-phone") as string}
                    value={preRegisterForm.phone}
                    onChange={handlePreRegisterChange("phone")}
                    maxLength={15}
                  />
                </div>
                <div>
                  <select
                    value={preRegisterForm.gender}
                    onChange={handlePreRegisterChange("gender")}
                    className={preRegisterForm.gender ? "select-value" : "select-placeholder"}
                  >
                    <option value="">{t("register-passenger-select-gender-default")}</option>
                    <option value="masculino">{t("register-passenger-select-gender-man")}</option>
                    <option value="feminino">{t("register-passenger-select-gender-woman")}</option>
                    <option value="outro">{t("register-passenger-select-gender-other")}</option>
                  </select>
                </div>
                <div>
                  <select
                    value={preRegisterForm.cityId}
                    onChange={handlePreRegisterChange("cityId")}
                    className={preRegisterForm.cityId ? "select-value" : "select-placeholder"}
                  >
                    <option value="">{t("register-passenger-select-city-default")}</option>
                    {(Array.isArray(activeCities) ? activeCities : []).map((city) => (
                      <option key={city.id} value={city.id}>
                        {formatCityName(city)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="password"
                    placeholder={t("register-passenger-placeholder-password") as string}
                    value={preRegisterForm.password}
                    onChange={handlePreRegisterChange("password")}
                  />
                </div>
                <div className="content-button-submit">
                  <ContainerButton>
                    <button type="submit" className="main-button" disabled={loading}>
                      {loading ? "Aguarde..." : t("register-passenger-button")}
                    </button>
                  </ContainerButton>
                </div>
              </form>
            )}
          </div>
        </div>
        {!isApp && <MerchantDownload />}
        {!isApp && <Footer />}
      </Container>
    );
  }

  return (
    <Container>
      {!isApp && <Header />}
      <LoadingBackdrop loading={loading} />
      <div
        className="content-passenger"
        style={{ backgroundImage: `url(${pathBackgroundImage})` }}
      >
        <div className="column-1">
          <Link
            to={nameAppPartner ? `/?name_app=${nameAppPartner}` : "/"}
            className={`brand-header-link ${isApp ? "is-app" : ""}`}
          >
            <img
              src={getPathImageDefault()}
              alt={`logo-${getNameApplication()}`}
              onError={(e) => {
                e.currentTarget.src = LogoMovyDefault;
              }}
            />
            {!isApp && <span className="brand-name">{getNameApplication()}</span>}
          </Link>
          <h1 className="passenger-title">{t("register-passenger-text")}</h1>
          <span className="passenger-description">{t("register-passenger-description")}</span>
        </div>
        <div className="column-2">
          <form onSubmit={handleSubmit(handleRegisterPassenger)}>
            {isRegistered && !window.location.href.includes("whatsapp") ? (
              <ScreenSuccess
                isDriver={false}
                title={t("message-success-title")}
                text={t("message-success-description")}
              />
            ) : (
              <>
                <>
                  <h1>{t("register-passenger-title-card")}</h1>
                  <Controller
                    control={control}
                    name="name"
                    render={({
                      field: { onChange, onBlur, value = "", name },
                      fieldState: { error },
                    }) => (
                      <div>
                        <input
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value}
                          name={name}
                          type="text"
                          placeholder={
                            t("register-passenger-placeholder-name") as string
                          }
                        />
                        {error && (
                          <p className="erros-input">
                            {" "}
                            {TranslationErrors(error.message as string)}{" "}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({
                      field: { value = "", name },
                      fieldState: { error },
                    }) => (
                      <div className="cpf-container">
                        <div className="container-input">
                          <input
                            type="text"
                            placeholder={
                              t(
                                "register-passenger-placeholder-dateofbirth"
                              ) as string
                            }
                            inputMode="numeric"
                            maxLength={10}
                            onChange={(event) => {
                              const masked = Mask.setMaskDate(event.target.value);
                              setValue("dateOfBirth", masked, { shouldValidate: true });
                            }}
                            value={value}
                            onBlur={() => {
                              const dateOfBirth = getValues("dateOfBirth") || "";
                              if (!isValidDateOfBirth(dateOfBirth)) {
                                setErrorDate(true);
                                setNameErrorDate(
                                  t("register-passenger-dateofbirth-error")
                                );
                                return;
                              }
                              setErrorDate(false);
                              setNameErrorDate("");
                            }}
                            name={name}
                          />
                          {errorDate && (
                            <span className="cpf-icon">
                              <FaTimesCircle color="red" />
                            </span>
                          )}
                          {!errorDate && isValidDateOfBirth(value) && (
                            <span className="cpf-icon">
                              <FaCheckCircle color="green" />
                            </span>
                          )}
                        </div>
                        {errorDate && nameErrorDate && (
                          <span className="errors-input">{nameErrorDate}</span>
                        )}
                        {error && (
                          <p className="erros-input">
                            {" "}
                            {TranslationErrors(error.message as string)}{" "}
                          </p>
                        )}
                      </div>
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
                            placeholder={
                              t(
                                "register-passenger-placeholder-email"
                              ) as string
                            }
                            onChange={(event) => {
                              setValue("email", event.target.value);
                            }}
                            value={value}
                            onBlur={() => {
                              const email = getValues("email");
                              if (!validatorEmail(email)) {
                                setErrorEmail(true);
                                setNameErrorEmail(
                                  t("register-user-step-1-email-error")
                                );
                                return;
                              }
                              setErrorEmail(false);
                              setNameErrorEmail("");
                              handleCheckEmail();
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
                          <span className="errors-input">{nameErrorEmail}</span>
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
                              placeholder={
                                t(
                                  "register-passenger-placeholder-phone"
                                ) as string
                              }
                              maxLength={15}
                              onChange={(event) => {
                                const masked = maskPhone(event.target.value);
                                setValue("phone", masked);
                              }}
                              value={value}
                              onBlur={() => {
                                if (!isValidPhone(value)) {
                                  setErrorPhone(true);
                                  setNameErrorPhone(
                                    t("register-driver-step-1-phone-error")
                                  );
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
                          <span className="errors-input">{nameErrorPhone}</span>
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
                      <div>
                        <select
                          onChange={onChange}
                          onBlur={onBlur}
                          name={name}
                          value={value}
                          className={value ? 'select-value' : 'select-placeholder'}
                          id="gender"
                        >
                          <option value="" disabled>
                            {t("register-passenger-select-gender-default")}
                          </option>
                          <option value="masculino">
                            {t("register-passenger-select-gender-man")}
                          </option>
                          <option value="feminino">
                            {t("register-passenger-select-gender-woman")}
                          </option>
                          <option value="não informado">
                            {t("register-passenger-select-gender-not-informed")}
                          </option>
                          <option value="outro">
                            {t("register-passenger-select-gender-other")}
                          </option>
                        </select>
                        {error && (
                          <p className="erros-input">
                            {" "}
                            {TranslationErrors(error.message as string)}{" "}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="cityId"
                    render={({
                      field: { onChange, value, name },
                      fieldState: { error },
                    }) => (
                      <div>
                        <select
                          onChange={(event) => onChange(event.target.value)}
                          value={value || ""}
                          name={name}
                          className={value ? 'select-value' : 'select-placeholder'}
                          id="city"
                        >
                          <option value="" disabled>
                            {t("register-passenger-select-city-default")}
                          </option>
                          {(Array.isArray(activeCities) ? activeCities : []).map((city) => (
                            <option key={city.id} value={city.id}>
                              {formatCityName(city)}
                            </option>
                          ))}
                        </select>
                        {error && (
                          <p className="erros-input">
                            {TranslationErrors(error.message as string)}
                          </p>
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
                            onChange={(event) => {
                              onChange(event);
                              setTimeout(handleCheckPasswordMatch, 0);
                            }}
                            onBlur={onBlur}
                            value={value}
                            name={name}
                            type="password"
                            placeholder={
                              t(
                                "register-passenger-placeholder-password"
                              ) as string
                            }
                          />
                          {!errorPassword &&
                            value &&
                            getValues("confirmPassword") &&
                            value === getValues("confirmPassword") && (
                              <span className="cpf-icon">
                                <FaCheckCircle color="green" />
                              </span>
                            )}
                        </div>
                        {error && (
                          <p className="erros-input">
                            {" "}
                            {TranslationErrors(error.message as string)}{" "}
                          </p>
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
                            placeholder={
                              (t("register-driver-step-1-confirm-password") as string) ||
                              "Confirm password"
                            }
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

                  <div className="content-button-submit">
                    <ContainerButton>
                      <button
                        type="submit"
                        className="main-button"
                        disabled={validateData()}
                      >
                        {t("register-passenger-button")}
                      </button>
                    </ContainerButton>
                  </div>
                </>
              </>
            )}
          </form>
        </div>
      </div>
      {!isApp && <MerchantDownload />}
      {!isApp && <Footer />}
    </Container>
  );
};

export default Passenger;
