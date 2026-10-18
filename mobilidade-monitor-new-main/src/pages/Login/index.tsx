import { FC } from "react";
import {
  Container,
  Content,
  ContainerSimulationLogin,
  ContentText,
  ContentLogo,
} from "./styles";

import { SimulatorScreenInitial } from "../../components/Advanced/Config/ModulesActives/SimulatorScreenInitial";

import pathUrl from "../../assets/background-login.webp";
import pathLogo from "../../assets/logo-movy.png";

const Login: FC = () => {
  return (
    <Container
      style={{
        backgroundImage: `linear-gradient(rgba(7, 10, 26, 0.88), rgba(7, 10, 26, 0.95)), url(${pathUrl})`,
        backgroundColor: '#070A1A',
      }}
    >
      <ContentLogo>
        <img src={pathLogo} alt="MOVY" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
      </ContentLogo>
      <Content>
        <ContentText>
          <div style={{ maxWidth: '620px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ backgroundColor: '#00349A', color: '#04F3FA', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, letterSpacing: '1px' }}>
                MONITOR PRO
              </span>
              <span style={{ color: '#94A3B8', fontSize: '13px' }}>
                EUA 🇺🇸 & Brasil 🇧🇷
              </span>
            </div>

            <h1 style={{ color: '#FFF', fontSize: '48px', fontWeight: 900, lineHeight: '1.1', letterSpacing: '1px', marginBottom: '16px' }}>
              Gestão de Frotas & <span style={{ color: '#04F3FA' }}>Mobilidade Global</span>
            </h1>

            <p style={{ color: '#CBD5E1', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
              Painel administrativo para controle em tempo real de motoristas, despacho inteligente, faturamento em Dólar ($) e Real (R$) e monitoramento via satélite.
            </p>

            <div style={{ display: 'flex', gap: '20px', color: '#94A3B8', fontSize: '13px' }}>
              <div>✓ Telemetria 60 FPS</div>
              <div>✓ Zelle & Pix Nativos</div>
              <div>✓ MOVY Negocia</div>
            </div>
          </div>
        </ContentText>
        <ContainerSimulationLogin>
          <SimulatorScreenInitial
            colorPrimary={undefined}
            colorSecond={undefined}
            colorText={undefined}
            nameScreen="login"
            notShowMoldureMobile
          />
        </ContainerSimulationLogin>
      </Content>
    </Container>
  );
};

export default Login;
