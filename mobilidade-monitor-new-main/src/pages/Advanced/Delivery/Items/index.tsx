import { FC, useEffect, useState } from "react";
import swal from "sweetalert";
import { AiFillDelete } from "react-icons/ai";
import Alert from "../../../../components/Utils/Alert";
import Preload from "../../../../components/Utils/Preload";
import api from "../../../../services/api";
import {
  ButtonNewVoucher,
  DeleteButton,
  TableProduct,
  TextEmpty,
  ItemImage,
  Loader,
} from "./styles";
import { ItensData } from "./types";
import LinkModal from "../../../../components/Advanced/DeliveryModal/ItemRegistrationModal";

interface ItensDataProps extends Array<ItensData> {}

type MessageProps = "success" | "info" | "warning" | "error";

export const Items: FC = () => {
  const [notificationList, setNotificationList] = useState<ItensDataProps>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<MessageProps>("success");

  const [deletingId, setDeletingId] = useState<number | null>(null);


const itemInformation = async () => {
  setLoading(true);
  try {
    const result = await api.get(`deliveryInfoSuggestion`);
    const items = Array.isArray(result?.data?.response?.tripItemType)
      ? result.data.response.tripItemType
      : (Array.isArray(result?.data?.response) ? result.data.response : []);
    setNotificationList(items);
  } catch (error) {
    setNotificationList([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    itemInformation();
  }, []);

  const showMessageAlert = (type: MessageProps, message: string) => {
    setTypeAlert(type);
    setMessageAlert(message);
    setShowAlert(true);
  };

  const deleteMessage = (id: number) => {
  swal({
    title: "Deseja remover este item?",
    icon: "info",
    buttons: ["Cancelar", "Confirmar"],
    dangerMode: true,
  }).then(async (res) => {
    if (res) {
      setLoading(true);
      setDeletingId(id);
      try {
        const result = await api.delete(`tripItemType/${id}`);
        if (result.status === 200) {
          await itemInformation(); 
          showMessageAlert("success", "Item excluído com sucesso");
        } else {
          showMessageAlert("error", "Erro ao excluir item");
          setLoading(false); 
        }
      } catch (error) {
        showMessageAlert("error", "Erro ao excluir item");
        setLoading(false);
      } finally {
        setDeletingId(null);
      }
    }
  });
};

  const columns = [
    {
      title: "Ícone",
      src: "picture",
      key: "image",
      width: 500,
      render: (item: ItensData) => <ItemImage src={item.picture} />,
    },
    {
      title: "Descrição",
      dataIndex: "name",
      key: "description",
      width: 500,
    },
    {
      title: "",
      key: "delete",
      width: 200,
      render: (item: ItensData) => (
        <DeleteButton
          type="primary"
          danger
          loading={deletingId === item.id}
          disabled={deletingId === item.id}
          onClick={() => deleteMessage(item.id)}
        >
          <AiFillDelete />
        </DeleteButton>
      ),
    },
  ];
 
  return (
    <>
    
      <Preload visible={loading} />
      <LinkModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setLoading={setLoading}
        itemInformation={itemInformation}
      />
      <ButtonNewVoucher
        type="primary"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        Adicionar Item
      </ButtonNewVoucher>

      {notificationList?.length === 0 ? (
        loading ? (
            <Loader spinning={loading} />
        ) : (
          <TextEmpty>
            Você ainda não possui itens para visualização
          </TextEmpty>
        )
      ) : (
        <>
          <Alert
            visibility={showAlert}
            setVisibility={setShowAlert}
            message={messageAlert}
            typeAlert={typeAlert}
          />
          <TableProduct
            scroll={{ x: 300 }}
            rowKey="id"
            columns={columns}
            dataSource={notificationList}
            pagination={false}
          />
        </>
      )}
    </>
  );
};






