import {
  Container,
  ContentInstructions,
  ContentTable,
  ContentInputGlobalLogo,
  ContentBtnActions,
} from "./styles";

import swal from "sweetalert";
import { Button, Table as TableAntd } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useState, useEffect, ChangeEvent, useRef } from "react";

import Preload from "../../../../components/Utils/Preload";
import { ModalEdit } from "../../../../components/Advanced/Config/ConfigApp/ModalEdit";

import { ConfigAppsProps } from "./types";

import { resizeLogo } from "../../../../hooks/resizeLogo";

import api from "../../../../services/api";
import { AiFillDelete, AiFillEye } from "react-icons/ai";
import logoMovy from "../../../../assets/logo-movy.png";

const locale = {
  emptyText: "Sem dados",
};

export const ConfigApp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [configsApps, setConfigsApps] = useState<ConfigAppsProps[]>([]);
  const [confiAppSelected, setConfigAppSelected] =
    useState<ConfigAppsProps | null>(null);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<"driver" | "client">("driver");

  const refInputLogo = useRef<HTMLInputElement | null>(null);

  const getAppConfig = async () => {
    try {
      setLoading(true);
      const responseAppConfig = await api.get("appConfig");

      if (responseAppConfig.status) {
        const raw = responseAppConfig.data?.response;
        setConfigsApps(Array.isArray(raw) ? raw : []);
      }
    } catch (error) {
      setConfigsApps([]);
      console.error(error);
      swal({
        title: "Erro ao pegar configurações de aplicações",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhoto = (data: ChangeEvent<HTMLInputElement>) => {
    swal({
      title: "Deseja realmente alterar essa logo",
      icon: "warning",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        if (data.target.files) {
          const files = data.target.files[0];
          resizeLogo(files as File, 100, 100, "PNG", "blob")
            .then((file) => {
              const formData = new FormData();
              formData.append("logo", file as any);

              setLoading(true);
              api
                .post("appConfig/defaultLogo", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then((response) => {
                  if (response.status) {
                    swal({
                      title: "Logo atualizada com sucesso!",
                      icon: "success",
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  }
                })
                .catch((error) => {
                  console.error(error);
                  swal({
                    title: "Erro ao atualizar logo",
                    icon: "error",
                  });
                });
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      } else {
        if (refInputLogo.current) {
          refInputLogo.current.value = "";
        }
      }
    });
  };

  const deleteConfig = async (id: string) => {
    try {
      setLoading(true);
      const responseConfigApp = await api.delete(`appConfig/${id}`);

      if (responseConfigApp?.status) {
        getAppConfig();
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao deletar configuração de aplicativo",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppConfig();
  }, []);

  const handleEditConfigApp = (value: ConfigAppsProps) => {
    setTypeModal(value.appId === 2 ? "driver" : "client");
    setConfigAppSelected(value);
    setShowModalEdit(true);
  };

  const handleDeleteConfigApp = async (value: ConfigAppsProps) => {
    swal({
      title: "Alerta!",
      text: "Deseja realmente deletar essa configuração?",
      buttons: ["Não", "Sim"],
      icon: "warning",
    }).then((isAccept) => {
      if (isAccept) {
        deleteConfig(String(value?.id));
      }
    });
  };

  const columns: ColumnsType<ConfigAppsProps> = [
    {
      title: "Aplicativo",
      key: "app",
      width: 200,
      ellipsis: true,
      render: (_, value) => {
        return (
          <span>
            {value.appId === 2
              ? "Aplicativo Motorista"
              : "Aplicativo Passageiro"}
          </span>
        );
      },
    },
    {
      title: "Cor Principal",
      key: "color-primary",
      width: 200,
      ellipsis: true,
      render: (_, value) => {
        return (
          <>
            <input type="color" defaultValue={value.mainColor} disabled />
          </>
        );
      },
    },
    {
      title: "Cor Secundária",
      key: "color-secondary",
      width: 200,
      ellipsis: true,
      render: (_, value) => {
        return (
          <>
            <input type="color" defaultValue={value.secondaryColor} disabled />
          </>
        );
      },
    },
    {
      title: "Cor Texto Principal",
      key: "color-text",
      width: 200,
      ellipsis: true,
      render: (_, value) => {
        return (
          <>
            <input type="color" defaultValue={value.mainColorText} disabled />
          </>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      ellipsis: true,
      align: "right",
      render: (_, value) => {
        return (
          <ContentBtnActions>
            <Button
              type="link"
              onClick={() => handleEditConfigApp(value)}
              icon={<AiFillEye style={{ fontSize: 20 }} />}
            />
            <Button
              type="link"
              onClick={() => handleDeleteConfigApp(value)}
              icon={<AiFillDelete style={{ color: "red", fontSize: 20 }} />}
            />
          </ContentBtnActions>
        );
      },
    },
  ];

  return (
    <Container>
      <Preload visible={loading} />
      <h3>CONFIGURAÇÃO DE CORES E LOGO DE APPS</h3>
      <ContentTable>
        {(configsApps?.length || 0) <= 1 && (
          <Button
            style={{
              marginBottom: "15px",
            }}
            type="primary"
            onClick={() => setShowModalEdit(true)}
          >
            Adicionar Configurações
          </Button>
        )}
        <TableAntd locale={locale} columns={columns} dataSource={Array.isArray(configsApps) ? configsApps : []} />
      </ContentTable>

      <div
        style={{
          marginTop: 100,
        }}
      >
        <ContentInputGlobalLogo>
          <div className="content-label-global-input">
            <label
              htmlFor="input-logo-global"
              style={{
                backgroundImage: `url('${logoMovy}')`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></label>
            <p
              style={{
                color: "blue",
              }}
            >
              Alterar imagem
            </p>
          </div>
          <input
            type="file"
            name="input-logo-global"
            id="input-logo-global"
            ref={refInputLogo}
            onChange={handleChangePhoto}
          />

          <div>
            <h3>Logo Marca Global</h3>
            <p>
              Esta logo deve ter um tamanho de 512 x 512 em png com fundo branco
              ou sem fundo, ela será usado em diversos locais como:
            </p>
            <div>
              <span>- Seu monitor para identificação.</span>
              <span>- Abertura de seus Apps (tela Splash).</span>
              <span>- Esta ação é necessário atualizar o aplicativo.</span>
            </div>
          </div>
        </ContentInputGlobalLogo>
        <ContentInstructions>
          <hr
            style={{
              marginTop: 20,
              marginBottom: 20,
            }}
          />
          <h1>IMPORTANTE:</h1>
          <ul>
            <li>
              As alterações feitas aqui só entraram em vigor após a reiniciação
              do aplicativo.
            </li>
            <li>Algumas cores não são possíveis de alteração, são elas:</li>
            <ul
              style={{
                marginLeft: 20,
              }}
            >
              <li>Tela de finalização de chamado, sempre será verde.</li>
              <li>Alguns botões de atenção.</li>
              <li>Aviso de primeira viagem, sempre vermelha.</li>
              <li>Endereços já gravados, sempre serão verdes.</li>
              <li>Fundo dos quadros minhas viagens, sempre serão verdes.</li>
            </ul>
            <li>
              As Configurações do app cliente/passageiro são estendidas aos
              demais apps
            </li>
            <li>Só é possível configurar 3 cores básicas</li>
            <li>Telas iniciais de configurações e permissões</li>
          </ul>
        </ContentInstructions>
      </div>

      <ModalEdit
        listConfigSelected={configsApps}
        getAppConfig={getAppConfig}
        typeModal={typeModal}
        setLoading={setLoading}
        showModal={showModalEdit}
        setShowModal={setShowModalEdit}
        configSelected={confiAppSelected}
        setConfigSelected={setConfigAppSelected}
      />
    </Container>
  );
};
