import { FC } from "react";
import {
  Container,
  Content,
  ContainerSimulationLogin,
  ContentText,
  Ball,
  Line,
  ContentLogo,
} from "./styles";

import { SimulatorScreenInitial } from "../../components/Advanced/Config/ModulesActives/SimulatorScreenInitial";

import pathUrl from "../../assets/background-login.webp";
import pathLogo from "../../assets/logo_704apps.png";

const Login: FC = () => {
  return (
    <Container
      style={{
        backgroundImage: `url(${pathUrl})`,
      }}
    >
      <ContentLogo>
        <img src={pathLogo} alt={`logo 704apps`} />
      </ContentLogo>
      <Content>
        <ContentText>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Ball />
            <Line />
            <Ball
              style={{
                position: "relative",
                top: "-20px",
              }}
            />
          </div>

          <div>
            <h1>
              <span>Pilares da</span> <br /> Mobilidade <br /> Moderna
            </h1>

            <h2>
              Segurança <br /> Inteligência Artificial <br /> Guiados por dados
            </h2>
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
