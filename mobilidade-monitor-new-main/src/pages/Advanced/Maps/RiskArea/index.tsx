import { Table, Tag, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { BiMap } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import swal from "sweetalert";

import { Container, ContentTable, ContentButton } from "./styles";

import { useState, useEffect, useContext } from "react";

import { RiskAreaProps } from "./types";

import api from "../../../../services/api";

import Preload from "../../../../components/Utils/Preload";
import { ModalSetAreaRisk } from "../../../../components/Advanced/Maps/RiskArea/ModalSetAreaRisk";
import AuthContext from "../../../../contexts/auth";
import { theme_colors } from "../../../../theme/theme";
import { MAPA } from "../../../../constants/permissions";

export const RiskArea = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);

  const [listRiskArea, setListRiskArea] = useState<RiskAreaProps[]>();
  const [riskAreaSelected, setRiskAreaSelected] =
    useState<RiskAreaProps | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  const { hasPermission } = useContext(AuthContext);

  const getRiskAreaAndWebMapKey = () => {
    setLoadingTable(true);
    const responseRiskArea = api.get("riskArea?page=1");
    const responseWebMapKey = api.get("webMapKey");

    Promise.all([responseRiskArea, responseWebMapKey])
      .then((response) => {
        if (response[0].status) {
          setListRiskArea(response[0].data.response.data);
        }
        if (response[1].status) {
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  const switchStatus = (status: string) => {
    switch (status) {
      case "pending":
        return { status: "PENDENTE", color: "yellow" };
      case "confirmed":
        return { status: "CONFIRMADO", color: "green" };
      case "refused":
        return { status: "RECUSADO", color: "red" };
      default:
        return { status: "Não definido", color: "gray" };
    }
  };

  const handleOpenEditModalRiskArea = (valueSelected: RiskAreaProps) => {
    setRiskAreaSelected(valueSelected);
    setShowModal(true);
  };

  const handleRejectRiskArea = (idRiskArea: number) => {
    swal({
      title: "Deseja rejeitar essa área de risco?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoadingTable(true);
        api
          .delete(`riskArea/${idRiskArea}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Área de risco deletada com sucesso!",
                icon: "success",
              });
              getRiskAreaAndWebMapKey();
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao deletar área de risco!",
              icon: "error",
            });
          })
          .finally(() => {
            setLoadingTable(false);
          });
      }
    });
  };

  const columns: ColumnsType<RiskAreaProps> = [
    {
      title: "Data de Criação",
      key: "date",
      width: 200,
      ellipsis: true,
      render: (_, data) => new Date(data.created_at).toLocaleString(),
    },
    {
      title: "Usuário",
      key: "user",
      width: 150,
      render: (_, data) => data.user.name,
    },
    {
      title: "Endereço",
      dataIndex: "address",
      key: "address",
      width: 300,
      render: (_, data) => {
        return (
          <a
            href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
            target="_blank"
          >
            {data.address}
          </a>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 150,
      render: (_, data) => {
        return (
          <Tag color={switchStatus(data.status).color}>
            {switchStatus(data.status).status}
          </Tag>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 200,
      align: "right",
      render: (_, data) => {
        return (
          <ContentButton>
            {hasPermission(MAPA, "areas_riscos_visualizar") && (
              <Button
                style={{
                  color: theme_colors.primary_antd,
                }}
                onClick={() => handleOpenEditModalRiskArea(data)}
                icon={<BiMap />}
              />
            )}

            {hasPermission(MAPA, "areas_riscos_rejeitar") && (
              <Button
                style={{
                  color: theme_colors.red_crismon,
                }}
                onClick={() => handleRejectRiskArea(data.id)}
                icon={<AiOutlineClose />}
              />
            )}

            {hasPermission(MAPA, "areas_riscos_compartilhar") && (
              <Button
                style={{
                  color: theme_colors.green,
                }}
                type="link"
                href={`https://api.whatsapp.com/send?phone=55${data.user.phone}`}
                target="_blank"
                icon={<BsFillChatLeftTextFill />}
              />
            )}
          </ContentButton>
        );
      },
    },
  ];

  useEffect(() => {
    getRiskAreaAndWebMapKey();
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      <ContentTable>
        <Table dataSource={listRiskArea} columns={columns} loading={loadingTable}/>
      </ContentTable>

      <ModalSetAreaRisk
        getRiskAreaAndWebMapKey={getRiskAreaAndWebMapKey}
        riskAreaSelected={riskAreaSelected}
        setRiskAreaSelected={setRiskAreaSelected}
        setLoading={setLoading}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </Container>
  );
};
