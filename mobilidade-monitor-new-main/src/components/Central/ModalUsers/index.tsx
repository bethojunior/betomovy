import { FC } from "react";
import { Button, Modal } from "antd";
import { UserType } from "../../../pages/Central/List";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  data: UserType[];
  deleteUsers: (idCentral: number, idUser: number) => void;
  getUsers: (id: number) => void;
  setShowIncludesUsersModal: (showIncludesUsersModal: boolean) => void;
}

export const UsersModal: FC<Props> = ({
  visible,
  setVisible,
  deleteUsers,
  data,
  setShowIncludesUsersModal
}) => {
  return (
    <Modal
      title="Usuários"
      open={visible}
      footer={null}
      onCancel={() => {
        setVisible(false);
      }}
      destroyOnClose
    >
      <div
        style={{
          display: "flex",
          alignSelf: "center",
          flexDirection: "column",
        }}
      >
        {data?.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #000",
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              borderRadius: 5,
              marginBottom: 10,
            }}
          >
            <Button
              onClick={() => deleteUsers(item.centralId, item.idUser)}
              type="text"
              style={{ position: "absolute", right: 25 }}
              icon={<AiOutlineClose size={20} />}
            />
            <p>{item.name}</p>
            <p>{item.email}</p>
          </div>
        ))}

        <Button
          type="primary"
          onClick={() => {
            setVisible(false);
            setShowIncludesUsersModal(true);
          }}
          style={{ marginTop: 15 }}
        >
          Adicionar usuário
        </Button>
      </div>
    </Modal>
  );
};
