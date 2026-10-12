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
        const data = result?.data;
        if (data && (data.status === true || data.status === "true" || data.status === 200 || data.code === 200)) {
          const raw = data.response ?? data.data;
          return setListUsers(Array.isArray(raw) ? raw : []);
        }
        if (Array.isArray(data)) {
          return setListUsers(data);
        }
        if (data?.response && Array.isArray(data.response)) {
          return setListUsers(data.response);
        }
        if (data?.data && Array.isArray(data.data)) {
          return setListUsers(data.data);
        }
        setMessageAlert(
          data?.message || "Não foi possível carregar os usuários, tente novamente"
        );
        setTypeAlert("error");
        return setShowAlert(true);
      })
      .catch((error) => {
        console.error("Erro ao carregar usuarios:", error);
        setListUsers([]);
        setLoadingTable(false);
        setMessageAlert(
          error?.response?.data?.message || "Erro de conexão ao carregar usuários"
        );
        setTypeAlert("error");
        setShowAlert(true);
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
      render: (text: string, record: any) => text || record?.name || "-",
    },
    {
      title: "Apelido",
      dataIndex: "nickname",
      key: "nickname",
      width: 200,
      render: (text: string, record: any) => text || record?.nickname || "-",
    },
    {
      title: "Telefone",
      dataIndex: "phone",
      key: "phone",
      width: 200,
      render: (text: string, record: any) => text || record?.phone || "-",
    },
    {
      title: "Perfil",
      dataIndex: "roleName",
      key: "role",
      width: 200,
      render: (text: string, record: any) =>
        text ||
        record?.roleName ||
        record?.role?.name ||
        (record?.roleId === 1 ? "Administrador" : record?.roleId === 2 ? "Gestor" : record?.roleId === 3 ? "Suporte" : "Administrador"),
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (text: string, record: any) => text || record?.email || "-",
    },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      render: (_: any, item: ListUsers) => {
        const isRoot = responseDataUser?.roleId === 1;
        const targetUserId = item?.idUser ?? (item as any)?.id;
        
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            {isRoot && (
              <Button
                type="text"
                icon={<FaEdit style={{ color: "blue" }} />}
                onClick={() => handleEditUser(targetUserId)}
                title="Editar usuário"
              />
            )}
            <Button
              type="text"
              icon={<FaTrash style={{ color: "red" }} />}
              onClick={() => handleDeleteUser(targetUserId)}
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
          rowKey={(record: any) => record?.idUser || record?.id || Math.random()}
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
