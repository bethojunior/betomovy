import swal from "sweetalert";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { Button, Image, Table, TableProps } from "antd";
import { ModalAddAndEditCallGroup } from "../../../../../components/Advanced/Config/CallGroup/ModalAddAndEditCallGroup";
import { ModalLinkedDrivers } from "../../../../../components/Advanced/Config/CallGroup/ModalLinkedDrivers";

import {
  Container,
  ContentBtnAddCallGroup,
  ContentTable,
  ContentActions,
} from "./styles";
import { theme_colors } from "../../../../../theme/theme";
import { useContext, useEffect, useState } from "react";
import { ICallGroupProps } from "./types";
import api from "../../../../../services/api";
import { AxiosError } from "axios";
import AuthContext from "../../../../../contexts/auth";
import { CONFIGURACAO } from "../../../../../constants/permissions";
import { useHistory } from "react-router-dom";

export function ListCallGroups() {
  const [visibleCallGroup, setVisibleCallGroup] = useState<boolean>(false);
  const [visibleLinkedDrivers, setVisibleLinkedDrivers] =
    useState<boolean>(false);
  const [callGroupSelected, setCallGroupSelected] =
    useState<ICallGroupProps | null>(null);

  const [listCallGroups, setListCallGroups] = useState<ICallGroupProps[]>([]);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);

  const { hasPermission } = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    if (!hasPermission(CONFIGURACAO, "grupo_chamado")) {
      history.push("/");
    }
  }, []);

  const getCallGroups = async () => {
    try {
      setLoadingTable(true);
      const responseCallGroup = await api.get("callGroup");

      if (responseCallGroup?.status) {
        setListCallGroups(responseCallGroup?.data?.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Erro",
        icon: "error",
        text: responseError.response?.data.response[0],
      });
    } finally {
      setLoadingTable(false);
    }
  };

  const handleAddCallGroup = async () => {
    setVisibleCallGroup(true);
  };

  const handleOpenLinkedDrivers = async (callGroup: ICallGroupProps | null) => {
    setCallGroupSelected(callGroup);
    setVisibleLinkedDrivers(true);
  };

  const handleEditCallGroup = (callGroup: ICallGroupProps | null) => {
    setCallGroupSelected(callGroup);
    setVisibleCallGroup(true);
  };

  const handleDeleteCallGroup = async (callGroup: ICallGroupProps | null) => {
    swal({
      title: "Você tem certeza que deseja deletar esse item?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((success) => {
      if (success) {
        api
          .delete(`callGroup/${callGroup?.id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso",
                icon: "success",
                text: "Grupo de chamado deletado com sucesso",
              });
            }

            getCallGroups();
          })
          .catch((error) => {
            const responseError = error as AxiosError;
            swal({
              title: "Erro",
              icon: "error",
              text: responseError.response?.data.response[0],
            });
          });
      }
    });
  };

  const columns: TableProps<ICallGroupProps>["columns"] = [
    {
      key: "id",
      title: "Id",
      dataIndex: "id",
      render: (_, callGroup) => <h3>{callGroup.id}</h3>,
    },
    {
      key: "image",
      title: "Imagem",
      dataIndex: "image",
      render: (_, callGroup) => {
        return (
          <Image
            width={80}
            src={callGroup?.image}
            alt={`imagem-grupo-chamado-${callGroup?.image}`}
          />
        );
      },
    },
    {
      key: "name",
      title: "Nome",
      dataIndex: "name",
    },
    {
      key: "weight",
      title: "Peso",
      dataIndex: "weight",
    },
    {
      key: "actions",
      title: "Ações",
      width: 150,
      align: "end",
      render: (_, callGroup) => (
        <ContentActions>
          <Button
            title="Vincular Motorista"
            onClick={() => handleOpenLinkedDrivers(callGroup)}
            icon={<FaLink style={{ color: theme_colors.primary_antd }} />}
          />
          <Button
            title="Editar Grupo de chamado"
            onClick={() => handleEditCallGroup(callGroup)}
            icon={<MdEdit style={{ color: theme_colors.primary_antd }} />}
          />
          <Button
            title="Deletar grupo de chamado"
            onClick={() => handleDeleteCallGroup(callGroup)}
            icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
          />
        </ContentActions>
      ),
    },
  ];

  useEffect(() => {
    getCallGroups();
  }, []);

  return (
    <Container>
      <ContentBtnAddCallGroup>
        <Button onClick={handleAddCallGroup} type="primary">
          ADICIONAR GRUPO DE CHAMADO
        </Button>
      </ContentBtnAddCallGroup>

      <ContentTable>
        <Table
          columns={columns}
          dataSource={listCallGroups}
          pagination={false}
          loading={loadingTable}
        />
      </ContentTable>

      <ModalAddAndEditCallGroup
        getCallGroups={getCallGroups}
        setCallGroupSelected={setCallGroupSelected}
        callGroupSelected={callGroupSelected}
        setVisible={setVisibleCallGroup}
        visible={visibleCallGroup}
      />

      <ModalLinkedDrivers
        setVisible={setVisibleLinkedDrivers}
        visible={visibleLinkedDrivers}
        callGroupSelected={callGroupSelected}
        getCallGroups={getCallGroups}
      />
    </Container>
  );
}
