import { Button } from "antd";
import { FC, useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import swal from "sweetalert";

import { TableUsers, ContentTable, Container } from "./styles";

import Alert from "../../../../../../components/Utils/Alert";
    
import NewUserModal from "../Modal";
import EditUserModal from "../EditModal";

import api from "../../../../../../services/api";
import { useContextAuth } from "../../../../../../contexts/auth";

interface ListUsersArray extends Array<ListUsers> {}

interface ListUsers {
  blocked: boolean;
  email: string;
  idUser: number;
  isRoot: boolean;
  name: string;
  nickname: string;
  phone: string;
  document: string;
  roleId: number;
}

const UserRegistration: FC = () => {
  const { responseDataUser } = useContextAuth();
       
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [listUsers, setListUsers] = useState<ListUsersArray>([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [editModalVisibility, setEditModalVisibility] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ListUsers | null>(null);

  const loadUsers = () => {
    setLoadingTable(true);
    api
      .get("admin")
      .then((result) => {
        setLoadingTable(false);
        if (!result.data.status) {
          setMessageAlert(
            "Não foi possível carregar os perfis, tente novamente"
          );
          setTypeAlert("error");
          return setShowAlert(true);
        }
        const raw = result?.data?.response;
        return setListUsers(Array.isArray(raw) ? raw : []);
      })
      .catch((error) => {
        console.log(error);
        setListUsers([]);
        setLoadingTable(false);
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = (userId: number) => {
    swal({
      title: "Você realmente deseja excluir esse usuário?",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancelar", "Confirmar"],
    })
      .then((answer) => {
        if (!answer) {
          return "";
        }
        setLoadingTable(true);
        api.delete(`user/${userId}`).then((result) => {
          if (!result.data.status) {
            setMessageAlert(
              "Não foi possível excluir esse usuário. Tente novamente"
            );
            setTypeAlert("error");
            return setShowAlert(true);
          }

          setMessageAlert("Usuário excluído com sucesso!");
          setTypeAlert("success");
          setShowAlert(true);
          return loadUsers();
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  const handleEditUser = async (userId: number) => {
    setSelectedUser(null);
    setEditModalVisibility(true);
    
    try {
      const response = await api.get(`admin/${userId}`);
      if (response.data.status) {
        setSelectedUser(response.data.response);
      } else {
        setMessageAlert("Não foi possível carregar os dados do usuário");
        setTypeAlert("error");
        setShowAlert(true);
        setEditModalVisibility(false);
      }
    } catch (error) {
      console.log(error);
      setMessageAlert("Erro ao carregar dados do usuário");
      setTypeAlert("error");
      setShowAlert(true);
      setEditModalVisibility(false);
    }
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Apelido",
      dataIndex: "nickname",
      key: "nickname",
      width: 200,
    },
    {
      title: "Telefone",
      dataIndex: "phone",
      key: "phone",
      width: 200,
    },
    {
      title: "Perfil",
      dataIndex: "roleName",
      key: "role",
      width: 200,
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      render: (item: ListUsers) => {
        const isRoot = responseDataUser?.roleId === 1;
        
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            {isRoot && (
              <Button
                type="text"
                icon={<FaEdit style={{ color: "blue" }} />}
                onClick={() => handleEditUser(item.idUser)}
                title="Editar usuário"
              />
            )}
            <Button
              type="text"
              icon={<FaTrash style={{ color: "red" }} />}
              onClick={() => handleDeleteUser(item.idUser)}
              title="Excluir usuário"
            />
          </div>
        );
      },
    },
  ];

  return (
    <Container>
      {/*<Preload visible={loading} />*/}
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Button
        style={{
          marginBottom: 10,
        }}
        type="primary"
        onClick={() => setModalVisibility(true)}
      >
        Adicionar usuário
      </Button>

      <ContentTable>
        <TableUsers
          pagination={{ pageSize: 9 }}
          dataSource={Array.isArray(listUsers) ? listUsers : []}
          columns={columns}
          loading={loadingTable}

        />
      </ContentTable>

      <NewUserModal
        visible={modalVisibility}
        setVisible={setModalVisibility}
        loadUsers={loadUsers}
      />

      <EditUserModal
        visible={editModalVisibility}
        setVisible={setEditModalVisibility}
        loadUsers={loadUsers}
        userData={selectedUser}
      />
    </Container>
  );
};

export default UserRegistration;
