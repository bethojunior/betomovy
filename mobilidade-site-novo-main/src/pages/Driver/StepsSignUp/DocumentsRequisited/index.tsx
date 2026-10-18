import swal from "sweetalert";

import { Container } from "./styles";
import { useState, useRef, useEffect } from "react";

import PathIconsFile from "../../../../assets/svg/File.svg";
import imageCompression from "browser-image-compression";
import { MdPictureAsPdf } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import {
  FormActions,
  useDriverDatasContext,
} from "../../../../contexts/DriverDatasContext";

import api from "../../../../api/apiAxios";

import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { uploadPicture } from "../../../../utils/UploadPicture";
import { FaSpinner } from "react-icons/fa";
import { buildDialablePhone } from "../../../../utils/UtilsPhone";
import { findCountryByIso2 } from "../../../../utils/countryCodes";

interface DocumentsRequisitedProps {
  titlePage: string;
  indexDocuments: number;
  lastIndex: number;
  docId: string;
  userTypeId: string;
  setIndexDocuments: (data: number) => void;
  loading: boolean;
  setLoading: (data: boolean) => void;
  setIsRegistered: (data: boolean) => void;
  step: number;
  setStep: (data: number) => void;
  showInputDescription: string;
  acceptedDocument: string;
  noDocuments?: boolean;
}

interface ListDocsProps {
  docId: string;
  id: string;
  image: {
    data: File;
  };
  inArray: boolean;
}

interface ListDocsDriverProps {
  docId: string;
  text: string;
}

const DocumentsRequisited = ({
  titlePage,
  indexDocuments,
  setIndexDocuments,
  lastIndex,
  docId,
  userTypeId,
  setLoading,
  setIsRegistered,
  step,
  setStep,
  loading,
  showInputDescription,
  acceptedDocument,
  noDocuments = false,
}: DocumentsRequisitedProps) => {
  const [descriptionDocument, setDescriptionDocument] = useState<string>("");
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [fileDocument, setFileDocument] = useState<any>();
  const [listDocs, setListDocs] = useState<ListDocsProps[]>([]);
  const [listDocsDriver, setListDocsDriver] = useState<ListDocsDriverProps[]>(
    []
  );
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const refInputFile = useRef<HTMLInputElement>(null);

  const [renderedScreenReadySend, setRenderedScreenReadySend] = useState<
    "send" | null
  >(null);

  const { state, dispatch } = useDriverDatasContext();

  const { t } = useTranslation();
  const params = useParams<{ whoIndicatedId?: string }>();
  const [searchParams] = useSearchParams();
  const appPartnerKey = searchParams.get("name_app");
  const whoIndicatedId =
    params.whoIndicatedId ?? searchParams.get("who_indicated") ?? "";

  const isLastIndex = indexDocuments === lastIndex - 1;

  const handleChooseImage = async () => {
    try {
      if (!refInputFile.current?.files || refInputFile.current.files.length === 0) {

        return;
      }

      const file = refInputFile.current.files[0];

      if (!file) {
        return;
      }

      if (file.type === "application/pdf") {
        const validFile = new File([file], file.name, {
          type: file.type,
          lastModified: file.lastModified,
        });

        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          setIsPdf(true);
          setDocumentImage(base64Data);
          setFileDocument(validFile);
        };
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
        };
        reader.readAsDataURL(validFile);
        return;
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
      };

      const compressedBlob = await imageCompression(file, options);

      const compressedFile = new File([compressedBlob], file.name || "upload.jpg", {
        type: compressedBlob.type || "image/jpeg",
        lastModified: Date.now(),
      });

      const reader = new FileReader();
      reader.onload = function () {
        const dataUrl = reader.result as string;
        setDocumentImage(dataUrl);
        setFileDocument(compressedFile);
        setIsPdf(false);
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Erro no upload de arquivo:", error);
      swal({
        title: "Erro ao processar o arquivo. Por favor, tente novamente.",
        icon: "error",
      });
    }
  };


  const handleNextStep = async () => {
    if (!descriptionDocument && showInputDescription === "1") {
      swal({
        title: t("register-driver-step-documents-description-notfound") as string,
        icon: "warning",
      });
      return;
    }

    if (!documentImage || !fileDocument) {
      swal({
        title: t("register-driver-step-documents-image-notfound") as string,
        icon: "warning",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await uploadPicture(fileDocument);

      if (!response.status) {
        swal({
          title: "Erro ao enviar a imagem",
          icon: "error",
        });
        return;
      }

      const documentSelected: ListDocsProps = {
        docId: docId,
        id: response.data.id,
        image: {
          data: fileDocument,
        },
        inArray: true,
      };

      const docDriverObject = {
        docId: docId,
        text: descriptionDocument,
      };

      setListDocs((prev) => {
        const indexFound = prev.findIndex((doc) => doc.docId === docId);
        if (indexFound >= 0) {
          const newArray = [...prev];
          newArray[indexFound] = documentSelected;
          return newArray;
        } else {
          return [...prev, documentSelected];
        }
      });

      setListDocsDriver((prev) => {
        const indexFound = prev.findIndex((doc) => doc.docId === docId);
        if (indexFound >= 0) {
          const newArray = [...prev];
          newArray[indexFound] = docDriverObject;
          return newArray;
        } else {
          return [...prev, docDriverObject];
        }
      });

      setDocumentImage(null);
      setDescriptionDocument("");

      if (isLastIndex) {
        setRenderedScreenReadySend("send");
      } else {
        setIndexDocuments(indexDocuments + 1);
      }

    } catch (error) {
      console.error("Erro ao enviar documento:", error);
      swal({
        title: "Falha no upload",
        text: "Não foi possível enviar o documento. Tente novamente.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackStepsDocuments = () => {
    if (renderedScreenReadySend === "send") {
      setRenderedScreenReadySend(null);
    }
  };

  const handleBackStep = () => {
    if (indexDocuments > 0) {
      setIndexDocuments(indexDocuments - 1);
    } else {
      setStep(step - 1);
    }
  };

  const handleRegisterDriver = async () => {
    try {
      const datasDriver = {
        whoIndicatedId,
        driver: {
          userTypeId: userTypeId,
          name: state.stepPersonalData.nameDriver || null,
          nickname: state.stepPersonalData.nameDriver.split(" ")[0] || null,
          phone: state.stepPersonalData.phone
            ? buildDialablePhone(
                state.stepPersonalData.phone,
                findCountryByIso2(state.stepPersonalData.phoneCountryIso2)
              )
            : null,
          password: state.stepPersonalData.password || null,
          document: state.stepPersonalData.cpfAndCnpjDriver || "",
          gender: state.stepPersonalData.genderDriver || null,
          email: state.stepPersonalData.email || null,
          stationId: "",
          cityId: state.stepSelectCity.city || null,
          estateId: "",
          cooperativeId: "",
          militaryUser: null,
          cnh: "",
          created_at: "",
          hasCardReader: false,
          numberCNH: null,
          numberCRLV: state.stepDataVehicle.numberDocument || null,
          numberAlvara: null,
          numberCriminalRecord: null,
          docs: listDocsDriver || null,
          rentalCar: !!state.stepDataVehicle.cnpjCompany,
          rentalCompanyDocument: state.stepDataVehicle.cnpjCompany || "",
          registered_in: "mobilidade",
        },
        image: {
          CNH: null,
          CRLV: null,
          ALVARA: null,
          PROFILE: state.stepPhotoPerfil.profile.id,
          CRIMINAL_RECORD: null,
          PROOF_OF_RESIDENCE: null,
          RG_FRONT: null,
          RG_BACK: null,
          DOCUMENTS: listDocs,
        },
        car: {
          licensePlate: state.stepDataVehicle.plateCar || null,
          renavam: state.stepDataVehicle.numberRenavam || null,
          markCar: state.stepDataVehicle.brandCar || null,
          modelCar: state.stepDataVehicle.modelCar || null,
          colorCar: state.stepDataVehicle.colorCar || null,
          numberSeatingCar: state.stepDataVehicle.numberSeats || null,
          year: state.stepDataVehicle.yearCar,
        },
        appPartner: appPartnerKey ?? null,
      };

      const formData = new FormData();
      formData.append("stdObject", JSON.stringify(datasDriver));

      datasDriver.image.DOCUMENTS.forEach((item) => {
        const isPdfFile = item.image.data.type === "application/pdf";
        const fieldName = isPdfFile ? `PDF_${item.docId}` : `DOC_${item.docId}`;
        formData.append(fieldName, item.id);
      });

      setLoading(true);
      const response = await api.post("Driver/RegisterV2", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);

      if (response.data.status) {
        setIsRegistered(true);
        dispatch({ type: FormActions.setReset });
        if (
          (window as any).ReactNativeWebView &&
          (window as any).ReactNativeWebView.postMessage
        ) {
          (window as any).ReactNativeWebView.postMessage(
            JSON.stringify("redirect-login-new-site")
          );
        }
      } else {
        swal({
          title: t("message-error-api-register-driver") as string,
          icon: "warning",
        });
      }
    } catch (error: any) {
      setLoading(false);
      
      const errorMessage = error.response?.data?.message || "";
      
      if (errorMessage.toLowerCase().includes("email") || errorMessage.toLowerCase().includes("e-mail")) {
        swal({
          title: "E-mail já cadastrado",
          text: "Este e-mail já está sendo usado por outro motorista. Por favor, volte ao primeiro passo e use um e-mail diferente.",
          icon: "error",
        });
      } else if (errorMessage.toLowerCase().includes("telefone") || errorMessage.toLowerCase().includes("phone")) {
        swal({
          title: "Telefone já cadastrado",
          text: "Este telefone já está sendo usado por outro motorista. Por favor, volte ao primeiro passo e use um telefone diferente.",
          icon: "error",
        });
      } else if (errorMessage.toLowerCase().includes("documento") || errorMessage.toLowerCase().includes("cpf") || errorMessage.toLowerCase().includes("cnpj")) {
        swal({
          title: "Documento já cadastrado",
          text: "Este documento já está sendo usado por outro motorista. Por favor, volte ao primeiro passo e verifique os dados.",
          icon: "error",
        });
      } else {
        swal({
          title: t("message-error-api-register-driver") as string,
          text: errorMessage || "Erro inesperado durante o cadastro. Tente novamente.",
          icon: "error",
        });
      }
    }
  };


  useEffect(() => {
    const foundDoc = listDocs.find((doc) => doc.docId === docId);

    if (foundDoc) {
      const isPdfFile = foundDoc.image?.data?.type === "application/pdf";

      setDocumentImage(
        isPdfFile
          ? URL.createObjectURL(foundDoc.image.data)
          : foundDoc.image.data
          ? URL.createObjectURL(foundDoc.image.data)
          : null
      );
      setFileDocument(foundDoc.image.data || null);
      setIsPdf(isPdfFile);
    } else {
      setDocumentImage(null);
      setFileDocument(null);
      setIsPdf(false);
    }

    const foundDocDriver = listDocsDriver.find((doc) => doc.docId === docId);
    if (foundDocDriver) {
      setDescriptionDocument(foundDocDriver.text);
    } else {
      setDescriptionDocument("");
    }
  }, [docId, listDocs, listDocsDriver]);

  useEffect(() => {
    if (!documentImage) {
      if (refInputFile.current) {
        // @ts-ignore
        refInputFile.current.value = null;
      }
    }
  }, [documentImage]);

  useEffect(() => {
    if (noDocuments) {
      setRenderedScreenReadySend("send");
    }
  }, [noDocuments]);

  return (
    <Container>
      {renderedScreenReadySend && (
        <>
          <h1>{t("register-driver-step-documents-send-title")}</h1>
          <div className="content-button">
            <button disabled={loading} onClick={handleBackStepsDocuments}>
              {t("register-driver-steps-buttons-back")}
            </button>
            <button
              disabled={loading}
              onClick={handleRegisterDriver}
            >
              {t("register-driver-steps-buttons-send")}
            </button>
          </div>
        </>
      )}

      {!renderedScreenReadySend && (
        <>
          <h1>{titlePage}</h1>

          <div className="content-documents-requisited">
            {showInputDescription === "1" && (
              <input
                type="text"
                placeholder={
                  t("register-driver-step-documents-description") as string
                }
                value={descriptionDocument}
                onChange={(event) => setDescriptionDocument(event.target.value)}
              />
            )}

            <div className="content-input-file">
              <label htmlFor="file-document">
                {t("register-driver-step-documents-add-document")}
                <img src={PathIconsFile} alt="icon-file" />
              </label>
              <input
                ref={refInputFile}
                id="file-document"
                type="file"
                onChange={handleChooseImage}
                accept={acceptedDocument}
              />
            </div>
          </div>

          {documentImage && isPdf && (
            <div className="content-document-choosed pdf-container">
              <div className="pdf-preview">
                <div className="pdf-card">
                  <MdPictureAsPdf size={40} color="#e74c3c" />
                  <div className="pdf-name-container">
                    <p className="pdf-name">{fileDocument?.name}</p>
                    <IoMdCheckmarkCircleOutline color="#219D01" size={16} />
                  </div>
                </div>
                <div className="pdf-viewer">
                  <object
                    data={documentImage}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                  >
                    <div className="pdf-not-supported">
                      <MdPictureAsPdf size={60} color="#e74c3c" />
                      <p>PDF selecionado com sucesso!</p>
                      <div className="pdf-name-container">
                        <p className="pdf-name">{fileDocument?.name}</p>
                        <IoMdCheckmarkCircleOutline color="#219D01" size={16} />
                      </div>
                    </div>
                  </object>
                </div>
              </div>
            </div>
          )}

          {documentImage && !isPdf && (
            <div className="content-document-choosed">
              <img src={documentImage} alt="document-choosed" />
            </div>
          )}

          <div className="content-button">
            <button onClick={handleBackStep}>
              {t("register-driver-steps-buttons-back")}
            </button>
            <button onClick={handleNextStep} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                   <FaSpinner className="animate-spin" />
                </span>
              ) : (
                t("register-driver-steps-buttons-next")
              )}
            </button>
          </div>
        </>
      )}
    </Container>
  );
};

export default DocumentsRequisited;
