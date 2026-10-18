import api from "../../api/apiAxios";
import swal from "sweetalert";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "./styles";
import { useState, useEffect, ReactNode } from "react";

import Header from "../../components/Header";
import MerchantDownload from "../../components/MerchantDownload";
import Footer from "../../components/Footer";
import LinearLoading from "../../components/LinearLoading";
import ScreenSuccess from "../../components/ScreenSuccess";

import pathBackgroundImage from "../../assets/img/Banner4_1366x768.png";
import pathIconArrowRight from "../../assets/svg/right.svg";

import PersonalData from "./StepsSignUp/PersonalData";
import SelectCity from "./StepsSignUp/SelectCity";
import PhotoPerfil from "./StepsSignUp/PhotoPerfil";
import DataVehicle from "./StepsSignUp/DataVehicle";
import DocumentsRequisited from "./StepsSignUp/DocumentsRequisited";

import {
  getNameApplication,
  getPathImageDefault,
  LogoMovyDefault,
} from "../../config/configApp";

import { useTranslation } from "react-i18next";

interface CategoryDriverProps {
  description: string | null;
  iconMapDriverId: string | null;
  idUserType: string;
  isActive: string;
  isDeliveryMan: string;
  isDriver: string;
  name: string;
  picture: string;
  statusId: string;
  acceptedText?: string | null;
  boardingText?: string | null;
  inProgressText?: string | null;
  id?: string | null;
  userTypeId?: string | null;
  config_apps_partners_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  key?: string | null;
  name_app?: string | null;
  logo_app?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  text_color?: string | null;
}

interface StepDocumentsProps {
  description: string | null;
  docId: string;
  docUserTypeId: string;
  image: string;
  label: string;
  link: string | null;
  pdf: string;
  text: string;
}

interface StepComponentProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setIdCategory?: (data: string | null) => void;
}


interface CategoriesDriverProps {
  setIdCategory: (data: string) => void;
  setLoading: (data: boolean) => void;
}

interface FormStep {
  id: string;
  formStepId: string;
  userTypeId: string;
  statusId: string;
  step: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

const Driver = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === "#sobre-nos" || window.location.hash === "#contato") {
      const hash = window.location.hash;
      const search = window.location.search;
      navigate(`/${search}${hash}`);
    }
  }, [navigate]);

  const [idCategory, setIdCategory] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [stepRendered, setStepRendered] = useState<ReactNode | null>(null);
  const [stepDocuments, setStepDocuments] = useState<StepDocumentsProps[]>([]);
  const [indexDocuments, setIndexDocuments] = useState<number>(0);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dynamicSteps, setDynamicSteps] = useState<FormStep[]>([]);
  const [descriptionRegistration, setDescriptionRegistration] = useState<string>("");

  const { t } = useTranslation();

  const getAcceptAttribute = (doc: {
    image: string;
    text: string;
    pdf: string;
  }) => {
    let accept = "";
    if (doc.image === "1") accept += ".png, .jpg, .jpeg";
    if (doc.text === "1") accept += (accept ? ", " : "") + ".txt";
    if (doc.pdf === "1") accept += (accept ? ", " : "") + ".pdf";

    return accept;
  };
  
  const STEP_MAPPING: {
    [key: string]: {
      component: React.FC<any>;
      order: number;
    };
  } = {
    PERSONAL_DATA: {
      //@ts-ignore
      component: (props) => <PersonalData {...props} />,
      order: 1
    },
    CITY: {
      component: (props) => <SelectCity {...props} />,
      order: 2
    },
    PROFILE_IMAGE: {
      component: (props) => <PhotoPerfil {...props} />,
      order: 3
    },
    CAR_DATA: {
      component: (props) => <DataVehicle {...props} />,
      order: 4
    },
    CNH: {
      //@ts-ignore
      component: (props) => <DocumentsRequisited {...props} />,
      order: 5
    }
  };
  
  useEffect(() => {
    const fetchStepsByUserType = async () => {
      if (!idCategory) return;
  
      try {
        setLoading(true);
        const response = await api.get(`formstep/getbyusertype?userTypeId=${idCategory}`);
        const stepsFromAPI: FormStep[] = response.data.data || [];
  
        const cnhStep: FormStep = {
          id: "999",
          formStepId: "static-cnh",
          userTypeId: idCategory,
          statusId: "1",
          step: "CNH",
          description: "Documento de CNH obrigatório"
        };
  
        const mergedSteps = [...stepsFromAPI, cnhStep].sort((a, b) => {
          const aOrder = STEP_MAPPING[a.step]?.order ?? 999;
          const bOrder = STEP_MAPPING[b.step]?.order ?? 999;
          return aOrder - bOrder;
        });
  
        setDynamicSteps(mergedSteps);
      } catch (error) {
        swal({
          title: t("message-error-api-getFormSteps") as string,
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchStepsByUserType();
  }, [idCategory, t]);

  useEffect(() => {
    const fetchDescriptionRegistration = async () => {
      try {
        const response = await api.get("config/general");
        const configs = response.data.data || [];

        const descriptionConfig = configs.find(
          (item: any) => item.key === "description_registration"
        );

        const description = descriptionConfig?.value || 
        "Cadastre-se e faça parte da melhor rede de serviços de transporte por aplicativo";

        setDescriptionRegistration(description);

      } catch (error) {
        setDescriptionRegistration("Cadastre-se e faça parte da melhor rede de serviços de transporte por aplicativo");
      }
    };

    fetchDescriptionRegistration();
  }, []);

  useEffect(() => {
    if (dynamicSteps.length === 0) return;
  
    const currentStep = dynamicSteps[step - 1];
  
    if (currentStep) {
      const StepComponent = STEP_MAPPING[currentStep.step]?.component;
  
      const isDocumentsStep = currentStep.step === "CNH";
  
      if (isDocumentsStep) {
        setStepRendered(
          <DocumentsRequisited
            step={step}
            setStep={setStep}
            setIsRegistered={setIsRegistered}
            loading={loading}
            setLoading={setLoading}
            userTypeId={idCategory as string}
            docId={stepDocuments[indexDocuments]?.docId ?? ""}
            indexDocuments={indexDocuments}
            setIndexDocuments={setIndexDocuments}
            titlePage={stepDocuments[indexDocuments]?.label ?? ""}
            lastIndex={stepDocuments.length}
            showInputDescription={stepDocuments[indexDocuments]?.text ?? ""}
            acceptedDocument={getAcceptAttribute(stepDocuments[indexDocuments] || { image: "", text: "", pdf: "" })}
            noDocuments={stepDocuments.length === 0}
          />
        );
      } else if (StepComponent) {
        setStepRendered(
          <StepComponent
            step={step}
            setStep={setStep}
            {...(currentStep.step === "PERSONAL_DATA" && { setIdCategory })}
          />
        );
      }
    } else if (step > dynamicSteps.length) {
      if (stepDocuments.length > 0) {
        setStepRendered(
          <DocumentsRequisited
            step={step}
            setStep={setStep}
            setIsRegistered={setIsRegistered}
            loading={loading}
            setLoading={setLoading}
            userTypeId={idCategory as string}
            docId={stepDocuments[indexDocuments].docId}
            indexDocuments={indexDocuments}
            setIndexDocuments={setIndexDocuments}
            titlePage={stepDocuments[indexDocuments].label}
            lastIndex={stepDocuments.length}
            showInputDescription={stepDocuments[indexDocuments].text}
            acceptedDocument={getAcceptAttribute(stepDocuments[indexDocuments])}
            noDocuments={false}
          />
        );
      } else {
        setStepRendered(
          <DocumentsRequisited
            step={step}
            setStep={setStep}
            setIsRegistered={setIsRegistered}
            loading={loading}
            setLoading={setLoading}
            userTypeId={idCategory as string}
            docId={""}
            indexDocuments={0}
            setIndexDocuments={setIndexDocuments}
            titlePage={""}
            lastIndex={0}
            showInputDescription={""}
            acceptedDocument={""}
            noDocuments={true}
          />
        );
      }
    }
  }, [step, dynamicSteps, indexDocuments, stepDocuments, loading, idCategory, t]);
  
  useEffect(() => {
    setStep(1);
  }, []);

  useEffect(() => {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "PAGE_LOADED" }));
    }
  }, []);

  useEffect(() => {
    const handleGetDocumentsCategories = async () => {
      if (!idCategory) {
        setStepDocuments([]);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(
          `DocUserType/FindByUserType?userTypeId=${idCategory}`
        );
        setStepDocuments(response.data.data || []);
      } catch (error) {
        console.log("Erro ao buscar documentos da categoria:", error);
      } finally {
        setLoading(false);
      }
    };

    handleGetDocumentsCategories();
  }, [idCategory]);

  document.title = `Cadastro Motorista | ${getNameApplication()}`;

  const query = window.location.search;
  const urlParams = new URLSearchParams(query);

  const nameAppPartner = urlParams.get("name_app");
  const isApp =
    urlParams.get("app") === "1" ||
    typeof (window as any).ReactNativeWebView !== "undefined" ||
    window.location.search.includes("app=1") ||
    (typeof navigator !== "undefined" && (
      navigator.userAgent.includes("wv") ||
      navigator.userAgent.includes("ReactNativeWebView")
    ));

  return (
    <Container>
      {!isApp && <Header />}
      <div
        className="content-driver"
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
          <h1 className="driver-title">{t("register-driver-text")}</h1>
          <span>{descriptionRegistration}</span>
        </div>
        <div className="column-2">
          <LinearLoading loading={loading} />
          <div>
            {isRegistered ? (
              <ScreenSuccess
                isDriver
                title={t("message-account-created")}
                text={t("message-description-account-created")}
              />
            ) : idCategory ? (
              stepRendered
            ) : (
              <CategoriesDriver
                setLoading={setLoading}
                setIdCategory={setIdCategory}
              />
            )}
          </div>
        </div>
      </div>
      {!isApp && <MerchantDownload />}
      {!isApp && <Footer />}
    </Container>
  );
};

export default Driver;

const DEFAULT_CATEGORIES: CategoryDriverProps[] = [
  {
    idUserType: "3",
    name: "Movy Carro",
    description: "Transporte particular de passageiros",
    picture: "https://s3-sa-east-1.amazonaws.com/nodes-voutehomologar-dev/default.jpg",
    isActive: "1",
    isDriver: "1",
    isDeliveryMan: "0",
    statusId: "1",
    iconMapDriverId: null,
  },
  {
    idUserType: "5",
    name: "Movy Moto",
    description: "Transporte rápido e entregas por moto",
    picture: "https://s3-sa-east-1.amazonaws.com/nodes-voutehomologar-dev/default.jpg",
    isActive: "1",
    isDriver: "1",
    isDeliveryMan: "1",
    statusId: "1",
    iconMapDriverId: null,
  },
];

const CategoriesDriver = ({
  setIdCategory,
  setLoading,
}: CategoriesDriverProps) => {
  const [categoryDriver, setCategoryDriver] = useState<CategoryDriverProps[]>(
    DEFAULT_CATEGORIES
  );
  const { t } = useTranslation();

  const handleChangeIdCategory = (idCategory: string) => {
    setIdCategory(idCategory);
  };

  const query = window.location.search;
  const urlParams = new URLSearchParams(query);
  const appPartnerKey = urlParams.get("name_app");

  const handleGetCategoryDriversPartners = async () => {
    try {
      setLoading(true);
      const responseCategoriesDriverPartners = await api.get(
        `usertype/driversbyapppartners?app_partner=${appPartnerKey}`
      );
      const cats = responseCategoriesDriverPartners?.data?.data;
      if (Array.isArray(cats) && cats.length > 0) {
        setCategoryDriver(cats);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCategoryDrivers = async () => {
    setLoading(true);
    try {
      const responseCategoriesDriver = await api.get("usertype/drivers");
      const cats = responseCategoriesDriver?.data?.data;
      if (Array.isArray(cats) && cats.length > 0) {
        setCategoryDriver(cats);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appPartnerKey) {
      handleGetCategoryDriversPartners();
      return;
    }
    
    handleGetCategoryDrivers();
  }, [appPartnerKey]);

  return (
    <div className="content-category">
      <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem", textAlign: "center", width: "100%" }}>
        Selecione sua Categoria
      </h2>
      {categoryDriver?.map((value, index) => {
        return (
          <div
            key={value.idUserType || index}
            onClick={() => handleChangeIdCategory(value.idUserType)}
          >
            <div className="content-description-category">
              <img
                src={value.picture || LogoMovyDefault}
                alt={value.name}
                onError={(e) => {
                  e.currentTarget.src = LogoMovyDefault;
                }}
              />
              <div>
                <h3>{value.name}</h3>
                {value.description && (
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>{value.description}</p>
                )}
              </div>
            </div>

            <div className="content-icon-arrow">
              <img src={pathIconArrowRight} alt="Icon Arrow Right" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
