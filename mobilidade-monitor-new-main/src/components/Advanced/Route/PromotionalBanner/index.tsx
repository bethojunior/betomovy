import { FC, useEffect, useState, useCallback } from "react";
import api from "../../../../services/api";
import { Button, Upload, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import swal from "sweetalert";
import {
  Container,
  BannerList,
  BannerItem,
  BannerImage,
  DeleteButton,
  UploadText,
} from "./styles";
import { BannerData } from "./types";
import Preload from "../../../../components/Utils/Preload";
import Alert from "../../../../components/Utils/Alert";

const PromotionalBanner: FC = () => {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert] = useState("");
  const [typeAlert] = useState<"success" | "info" | "warning" | "error">(
    "success"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/routePromotionalBanner");
      setBanners(response.data.response);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("picture", file);

    try {
      await api.post("/routePromotionalBanner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      swal("Sucesso", "Banner criado com sucesso", "success");
      fetchBanners();
    } catch (error) {
      console.error(error);
      swal("Erro", "Não foi possível criar o banner", "error");
    }
    setLoading(false);
  };

  const handleDeleteBanner = async (id: number) => {
    swal({
      title: "Deseja excluir esse banner?",
      text: "Essa ação não pode ser desfeita",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await api.delete(`/routePromotionalBanner/${id}`);
          swal("Sucesso", "Banner removido com sucesso", "success");
          fetchBanners();
        } catch (error) {
          console.error(error);
          swal("Erro", "Não foi possível remover o banner", "error");
        }
      }
    });
  };

  const handleImageClick = (path: string) => {
    setSelectedImage(path);
    setModalVisible(true);
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        swal("Erro", "Por favor, selecione um arquivo de imagem", "error");
        return false;
      }
      handleUpload(file);
      return false;
    },
    showUploadList: false,
  };

  return (
    <Container>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <UploadText>Selecione uma imagem</UploadText>
      <Upload {...uploadProps} accept="image/*">
        <Button icon={<UploadOutlined />}>Escolher arquivo</Button>
      </Upload>
      {loading ? (
        <p></p>
      ) : banners.length === 0 ? (
        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#555",
            marginTop: "20px",
          }}
        >
          Não há banners cadastrados
        </p>
      ) : (
        <BannerList>
          {banners.map((banner) => (
            <BannerItem key={banner.id}>
              <BannerImage
                src={banner.path}
                alt="Banner"
                onClick={() => handleImageClick(banner.path)}
              />
              <DeleteButton onClick={() => handleDeleteBanner(banner.id)}>
                Excluir
              </DeleteButton>
            </BannerItem>
          ))}
        </BannerList>
      )}
      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        {selectedImage && (
          <img src={selectedImage} alt="Banner" style={{ width: "100%" }} />
        )}
      </Modal>
    </Container>
  );
};

export default PromotionalBanner;
