import { Button, List } from "antd";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import swal from "sweetalert";
import Alert from "../../../../../../components/Utils/Alert";
import Preload from "../../../../../../components/Utils/Preload";
import api from "../../../../../../services/api";
import { Content, ListContent, ButtonContent, Loader } from "./styles";
import NewProfileModal from "../Modal";

interface ListProfileArray extends Array<ListProfile> {}

interface ListProfile {
  cities: [Cities];
  created_at: string;
  id: number;
  isRoot: boolean;
  name: string;
  statusId: number;
  support: boolean;
  updated_at: string;
}

interface Cities {
  estado: number;
  id: number;
  laravel_through_key: number;
  nome: string;
  shortName: string;
}

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idModal, setIdModal] = useState(0);

  const [listProfile, setListProfile] = useState<ListProfileArray>([]);

  const handleLoadProfile = () => {
    const userStorage = localStorage.getItem("@App:user");
    const headers: Record<string, string> = {};
    if (userStorage && userStorage !== "undefined" && userStorage !== "null") {
      try {
        const u = JSON.parse(userStorage);
        if (u?.api_token) headers.token = u.api_token;
        if (u?.idUser) {
          headers.userid = String(u.idUser);
          headers.userId = String(u.idUser);
        }
      } catch (e) {}
    }

    api
      .get("role", { headers })
      .then((result) => {
        setLoading(false);
        const raw = result?.data?.response ?? result?.data?.data ?? result?.data;
        if (Array.isArray(raw)) {
          return setListProfile(raw);
        }
        if (Array.isArray(raw?.data)) {
          return setListProfile(raw.data);
        }
        if (!result?.data?.status) {
          setMessageAlert("Não foi possível carregar os perfis. Tente novamente");
          setTypeAlert("error");
          setListProfile([]);
          return setShowAlert(true);
        }
        return setListProfile([]);
      })
      .catch(() => {
        setLoading(false);
        setListProfile([]);
      });
  };

  useEffect(() => {
    setLoading(true);
    handleLoadProfile();
  }, []);

  const handleDeleteProfile = (id: number) => {
    swal({
      title: "Você realmente deseja excluir esse perfil?",
      icon: "info",
      dangerMode: true,
      buttons: ["Cancelar", "Confirmar"],
    }).then((answer) => {
      if (!answer) {
        return "";
      }
      setLoading(true);
      api.delete(`role/${id}`).then((result) => {
        setLoading(false);
        if (!result.data.status) {
          setMessageAlert("Erro ao excluir o perfil. Tente novamente");
          setTypeAlert("error");
          return setShowAlert(true);
        }

        setMessageAlert("Perfil excluído com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
        return handleLoadProfile();
      });
      return "";
    });
  };
  
  if (loading) return <Loader spinning />;

  return (
    <Content>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Button
        type="primary"
        onClick={() => {
          setIsModalVisible(true);
          setIdModal(0);
        }}
        style={{ marginBottom: 10 }}
      >
        Novo perfil
      </Button>
      <ListContent
        bordered
        dataSource={Array.isArray(listProfile) ? listProfile : []}
        renderItem={(item) => (
          <List.Item key={(item as ListProfile).id}>
            <p style={{ marginBottom: 0 }}>{(item as ListProfile).name}</p>
            <ButtonContent>
              <Button
                type="link"
                icon={<FiEdit3 />}
                onClick={() => {
                  setIsModalVisible(true);
                  setIdModal((item as ListProfile).id);
                }}
              />
              <Button
                type="link"
                icon={
                  <FaTrash
                    style={{ color: "red" }}
                    onClick={() =>
                      handleDeleteProfile((item as ListProfile).id)
                    }
                  />
                }
              />
            </ButtonContent>
          </List.Item>
        )}
      />
      <NewProfileModal
        visibility={isModalVisible}
        idModal={idModal}
        setVisibility={setIsModalVisible}
        loadProfiles={handleLoadProfile}
      />
    </Content>
  );
};

export default UserProfile;
