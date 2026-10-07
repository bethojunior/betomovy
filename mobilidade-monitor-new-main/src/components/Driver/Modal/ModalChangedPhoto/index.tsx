import { ImagePerfil, ContentImage } from "./styles";
import { Modal, Button } from "antd";
import api from "../../../../services/api";
import { useState } from "react";
import swal from "sweetalert";

import { EditDriverData } from "../Edit/types";
import { Constants } from "../../../../utils/constants";

interface ModalChangedPhotoProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  driverSelected: EditDriverData;
  handlePrepareEditModal: (idDriver: number) => void;
}

export const ModalChangedPhoto = ({
  visible,
  setVisible,
  driverSelected,
  handlePrepareEditModal,
}: ModalChangedPhotoProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleAcceptPhoto = async () => {
    setLoading(true);
    try {
      const responseAcceptPhoto = await api.post(
        `driver/${driverSelected.idDriver}/profileImage/authorize`
      );

      if (responseAcceptPhoto.status) {
        swal({
          title: "Autorizado com sucesso",
          icon: "success",
        });
        handlePrepareEditModal(driverSelected.idDriver);
      }
    } catch (error) {
      console.log(error);
      swal({
        title: "Erro ao autorizar foto",
        icon: "error",
      });
    } finally {
      setVisible(false);
    }
    setLoading(false);
  };

  const handleRecusePhoto = async () => {
    setLoading(true);
    try {
      const responseRecusePhoto = await api.post(
        `driver/${driverSelected.idDriver}/profileImage/deny`
      );

      if (responseRecusePhoto.status) {
        swal({
          title: "Autorização negada",
          icon: "success",
        });
        handlePrepareEditModal(driverSelected.idDriver);
      }
    } catch (error) {
      swal({
        title: "Erro ao autorizar foto",
        icon: "error",
      });
      console.log(error);
    } finally {
      setVisible(false);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        title="Mudança de imagem de perfil"
        footer={[
          <Button color="danger" onClick={handleRecusePhoto} loading={loading}>
            Recusar
          </Button>,
          <Button
            type="primary"
            color="primary"
            onClick={handleAcceptPhoto}
            loading={loading}
          >
            Aceitar
          </Button>,
        ]}
      >
        <ContentImage>
          <ImagePerfil
            src={`${Constants.url_photo_driver?.replace(
              "compressed",
              "temp"
            )}${driverSelected?.profileImageTemp}`}
          />
        </ContentImage>
      </Modal>
    </>
  );
};
