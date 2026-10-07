import { Button, Modal } from "antd";
import Lottie from "lottie-react";

import { useState } from "react";

import pathAnimationRouteMaps from "../../assets/animations/route-map-animation.json";

import pathAnimationFailedIcon from "../../assets/animations/failed-animation.json";

import {
  Container,
  ContentAnimationFailed,
  ContentAnimationRouteMaps,
  Link,
} from "./styles";

export default function ModalAlertKeysMaps() {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      width={850}
      footer={[
        <Button onClick={() => setVisible(false)} key={1}>
          Fechar
        </Button>,
      ]}
    >
      <Container>
        <div>
          <h1>Atenção!</h1>

          <p>Verifique as chaves dos seus mapas</p>

          <h2>
            Este erro pode deixar seu app inoperante, requer ação imediata!
          </h2>

          <Link>
            Clique{" "}
            <a
              href={`${window.location.origin}/mapSetting/tests`}
              target="_blank"
            >
              aqui
            </a>
            {""} para teste das chaves
          </Link>
        </div>

        <div>
          <ContentAnimationRouteMaps>
            <Lottie
              loop
              animationData={pathAnimationRouteMaps}
              style={{
                width: "300px",
              }}
            />
          </ContentAnimationRouteMaps>

          <ContentAnimationFailed>
            <Lottie
              loop
              animationData={pathAnimationFailedIcon}
              style={{
                width: "100px",
              }}
            />
          </ContentAnimationFailed>
        </div>
      </Container>
    </Modal>
  );
}
