import { Container } from "./styles";
import { useState, useRef, useEffect } from "react";
import swal from "sweetalert";
import imageCompression from 'browser-image-compression';
import { uploadPicture } from "../../../../utils/UploadPicture";
import { FaSpinner } from "react-icons/fa";

import pathImageDefaultUser from "../../../../assets/svg/user-circle.svg";

import {
  FormActions,
  useDriverDatasContext,
} from "../../../../contexts/DriverDatasContext";

import { useTranslation } from "react-i18next";

interface PhotoPerfilProps {
  step: number;
  setStep: (data: number) => void;
}

interface ProfileDataProps {
  data: File;
  name: string;
}

const PhotoPerfil = ({ setStep, step }: PhotoPerfilProps) => {
  const refInputFile = useRef<HTMLInputElement>(null);
  const [photoUser, setPhotoUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<ProfileDataProps>();
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useDriverDatasContext();

  const { t } = useTranslation();

  const handleChooseImage = async () => {
    if (refInputFile.current?.files) {
      const file = refInputFile.current.files[0];

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
      };

      try {
        const compressedBlob = await imageCompression(file, options);

        // 👇 Garante que será um File real com tipo suportado
        const compressedFile = new window.File(
          [compressedBlob],
          file.name || "upload.jpg",
          {
            type: compressedBlob.type || "image/jpeg",
            lastModified: Date.now(),
          }
        );

        const reader = new FileReader();
        reader.onload = function () {
          const dataUrl = reader.result;
          setPhotoUser(dataUrl);
          const profileImageObject = {
            data: compressedFile,
            name: compressedFile.name,
          };
          setProfileData(profileImageObject);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.log(error);
        swal({
          title: "Imagem excede o tamanho permitido, selecione outra imagem.",
          icon: "error",
        });
      }
    }
  };


  const handleNextStep = async () => {
    if (photoUser === null || !profileData?.data) {
      swal({
        title: "Escolha uma foto",
        icon: "warning",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await uploadPicture(profileData.data, "driver-profile");
      console.log(response);
      if (!response.status) {
        swal({
          title: "Erro ao enviar a imagem",
          text: "A resposta não retornou um ID.",
          icon: "error",
        });
        return;
      }

      dispatch({
        type: FormActions.setPhotoPerfil,
        payload: {
          profile: {
            id: response.data.id,
          },
        },
      });
      console.log(state);
      setStep(step + 1);

    } catch (error) {
      swal({
        title: "Falha no upload",
        text: "Não foi possível enviar a imagem.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleBackStep = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    /*eslint-disable*/
    if (state.stepPhotoPerfil.photo) {
      setPhotoUser(state.stepPhotoPerfil.photo);
    }
  }, []);

  return (
    <Container>
      <h1>{t("register-driver-step-3-title-card")}</h1>

      <div className="content-photo-perfil">
        <div className="input-file">
          <label
            htmlFor="photo-perfil"
            style={{
              background: `url(${photoUser !== null ? photoUser : pathImageDefaultUser
                })`,
            }}
          ></label>
          <input
            ref={refInputFile}
            id="photo-perfil"
            type="file"
            onChange={handleChooseImage}
            accept=".png, .jpg, .jpeg"
          />
        </div>

        <div className="content-button">
          <button type="button" onClick={handleBackStep}>
            {t("register-driver-steps-buttons-back")}
          </button>
          <button type="button" onClick={handleNextStep} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
              </span>
            ) : (
              t("register-driver-steps-buttons-next")
            )}
          </button>
        </div>
      </div>
    </Container>
  );
};

export default PhotoPerfil;
