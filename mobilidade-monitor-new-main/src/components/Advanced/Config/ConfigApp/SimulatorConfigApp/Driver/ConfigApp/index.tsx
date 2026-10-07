import {
  Container,
  ButtonItem,
  ContentCard,
  ContentItem,
  HeaderCard,
  HeaderConfig,
  ContentIconHeader,
  BodyCard,
  ContentIcon,
  TitleHeaderItem,
  BeadgeBell,
} from "./styles";

import { Switch } from "antd";

import { AiOutlineArrowLeft } from "react-icons/ai";
import { BiSolidBell } from "react-icons/bi";
import { BsGear } from "react-icons/bs";

import { ScreenColorsSimulatorsProps } from "../../../../../../../pages/Advanced/Configs/ConfigApp/types";

import { useColorInverse } from "../../../../../../../utils/Helpers";

export const ConfigApp = ({
  colorPrimary,
  colorSecondary,
  colorTextPrimary,
}: ScreenColorsSimulatorsProps) => {
  return (
    <Container backgroundApp={colorSecondary} colorSwitch={colorPrimary}>
      <HeaderConfig>
        <ContentIconHeader>
          <AiOutlineArrowLeft />
        </ContentIconHeader>
        <h3>Configurações</h3>
        <ContentIconHeader>
          <BeadgeBell />
          <BiSolidBell />
        </ContentIconHeader>
      </HeaderConfig>
      <BodyCard>
        <ContentCard colorBorder={colorPrimary}>
          <HeaderCard backgrounButton={colorPrimary}>
            <ContentIcon
              colorIcon={colorPrimary && useColorInverse(colorPrimary)}
            >
              <BsGear />
            </ContentIcon>
            <TitleHeaderItem
              colorTitle={colorPrimary && useColorInverse(colorPrimary)}
            >
              Configurações de chamado
            </TitleHeaderItem>
          </HeaderCard>
          <ContentItem colorItem={colorTextPrimary} colorBorder={colorPrimary}>
            Habilita clique para aceitar viagem
            <Switch size="small" />
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Habilita arraste para aceitar viagem
            <Switch size="small" />
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Ligar lanterna ao sinalizar chegada
            <Switch size="small" />
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Mapa para Navegação externa
            <ButtonItem backgrounButton={colorPrimary}>Escolher</ButtonItem>
          </ContentItem>
        </ContentCard>

        <ContentCard colorBorder={colorPrimary}>
          <HeaderCard backgrounButton={colorPrimary}>
            <ContentIcon
              colorIcon={colorPrimary && useColorInverse(colorPrimary)}
            >
              <BsGear />
            </ContentIcon>
            <TitleHeaderItem
              colorTitle={colorPrimary && useColorInverse(colorPrimary)}
            >
              Permissões do app
            </TitleHeaderItem>
          </HeaderCard>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Acesso a localização
            <ButtonItem
              backgrounButton={colorPrimary}
              style={{
                border: `1px solid ${colorPrimary}`,
                background: "none",
              }}
            >
              Ativo
            </ButtonItem>
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Acesso a localização em segundo plano
            <ButtonItem
              backgrounButton={colorPrimary}
              style={{
                border: `1px solid ${colorPrimary}`,
                background: "none",
              }}
            >
              Ativo
            </ButtonItem>
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Acesso a mídia do dispositivo
            <ButtonItem
              backgrounButton={colorPrimary}
              style={{
                border: `1px solid ${colorPrimary}`,
                background: "none",
              }}
            >
              Ativo
            </ButtonItem>
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Acesso a câmera
            <ButtonItem
              backgrounButton={colorPrimary}
              style={{
                border: `1px solid ${colorPrimary}`,
                background: "none",
              }}
            >
              Ativo
            </ButtonItem>
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Acesso a reproduzir e gravar áudio
            <ButtonItem
              backgrounButton={colorPrimary}
              style={{
                border: `1px solid ${colorPrimary}`,
                background: "none",
              }}
            >
              Ativo
            </ButtonItem>
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Acesso para envio de notificação
            <ButtonItem
              backgrounButton={colorPrimary}
              style={{
                border: `1px solid ${colorPrimary}`,
                background: "none",
              }}
            >
              Ativo
            </ButtonItem>
          </ContentItem>
        </ContentCard>

        <ContentCard colorBorder={colorPrimary}>
          <HeaderCard backgrounButton={colorPrimary}>
            <ContentIcon
              colorIcon={colorPrimary && useColorInverse(colorPrimary)}
            >
              <BsGear />
            </ContentIcon>
            <TitleHeaderItem
              colorTitle={colorPrimary && useColorInverse(colorPrimary)}
            >
              Filtrar busca de viagem por apenas formas de pagamento
              selecionadas
            </TitleHeaderItem>
          </HeaderCard>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Cartão de Crédito
            <Switch size="small" />
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Voucher Central
            <Switch size="small" />
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Money JR
            <Switch size="small" />
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Dinheiro
            <Switch size="small" />
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            PIX via aplicativo
            <Switch size="small" />
          </ContentItem>
          <ContentItem colorBorder={colorPrimary} colorItem={colorTextPrimary}>
            Voucher
            <Switch size="small" />
          </ContentItem>
        </ContentCard>
      </BodyCard>
    </Container>
  );
};
