import { FaTrash } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { useState, useEffect } from "react";
import swal from "sweetalert";
import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";

import { Container, ContentTable } from "./styles";

      

import api from "../../../../services/api";

import { PublicityAppProps } from "./types";
import { ModalListPublictyApp } from "../../../../components/Advanced/Publicity/ModalListPublicityApp";

let locale = {
  emptyText: "Sem dados",
};

export const PublicityAppList = () => {
  const [publicities, setPublicities] = useState<PublicityAppProps[]>([]);
   
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [publicityDetails, setPublicityDetais] = useState<PublicityAppProps>();

  const getPublicitesApp = async () => {
    setLoadingTable(true);
    try {
      const responsePublicites = await api.get(
        `publicitiesApp`
      );
      if (responsePublicites.status) {
        setPublicities(responsePublicites.data.response);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar dados de publicidade",
        icon: "error",
      });
    }
    setLoadingTable(false);
  };

  const handleGetDetailsPublicity = (id: number) => {
    const responsePublicityDetails = publicities.filter(
      (data) => data.id === id
    );

    if (responsePublicityDetails) {
      setPublicityDetais(responsePublicityDetails[0]);
      setVisibleModal(true);
    }
  };

  const handleDeleteItems = (id: number) => {
    swal({
      title: "Você deseja apagar essa publicidade?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoadingTable(true);
        api
          .delete(`publicitiesApp/${id}`)
          .then((response) => {
            setLoadingTable(false);
            if (response.status) {
              swal({
                title: "Deletado com sucesso",
                icon: "success",
              });
              setPublicities((prevPublicities) =>
                prevPublicities.filter((item) => item.id !== id)
              );
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao salvar dados",
              icon: "error",
            });
          })
          .finally(() => {
            setLoadingTable(false);
          });
      }
    });
  };

  useEffect(() => {
    getPublicitesApp();
  }, []);

  const columns: ColumnsType<PublicityAppProps> = [
    {
      title: "Empresa",
      dataIndex: "company_name",
      key: "company_name",
      width: 200,
    },
    {
      title: "Email da empresa",
      key: "company_email",
      render: (_, datas) => datas.company_email,
      width: 200,
    },
    {
        title: "Telefone da empresa",
        key: "company_phone",
        render: (_, datas) => datas.company_phone,
        width: 200,
      },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      ellipsis: true,
      align: "right",
      render: (_, datas) => {
        return (
          <div
            style={{
              display: "flex",
              gap: 5,
            }}
          >
            <Button
              style={{
                color: "#1677ff",
              }}
              onClick={() => handleGetDetailsPublicity(datas.id)}
              title="Ver detalhe"
              icon={<CgDetailsMore />}
            />

            <Button
              style={{
                color: "#DC143C",
              }}
              onClick={() => handleDeleteItems(datas.id)}
              title="Excluir"
              icon={<FaTrash />}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Container>
       
      <ContentTable>
        <Table
          locale={locale}
          columns={columns}
          dataSource={publicities}
          pagination={false}
          loading={loadingTable}
        />
      </ContentTable>

      <ModalListPublictyApp
        publicityDetails={publicityDetails}
        setVisible={setVisibleModal}
        visible={visibleModal}
      />
    </Container>
  );
};