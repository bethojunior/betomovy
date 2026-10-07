import { Button, Modal } from "antd";
import Lottie from "lottie-react";

import { forwardRef, useImperativeHandle, useState } from "react";

import pathAnimationRouteMaps from "../../assets/animations/route-map-animation.json";

import { Container, ContentAnimationRouteMaps } from "./styles";

const ModalLottie = forwardRef<ModalRefProps, ModalProps>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      openModal() {
        setIsVisible(true);
      },
      closeModal() {
        setIsVisible(false);
      },
    }),
    []
  );

  return (
    <Modal
      open={isVisible}
      onCancel={() => setIsVisible(false)}
      footer={
        props.footer
          ? props.footer
          : [
              <Button key={1} onClick={() => setIsVisible(false)}>
                Fechar
              </Button>,
            ]
      }
      width={props.width || undefined}
    >
      <Container>
        <div>
          <h2>{props.title}</h2>
        </div>

        {props.useLottie && (
          <div>
            <ContentAnimationRouteMaps>
              <Lottie
                loop
                animationData={
                  props.useLottie?.animationData || pathAnimationRouteMaps
                }
                style={{
                  width: props?.useLottie?.width || "300px",
                }}
              />
            </ContentAnimationRouteMaps>
          </div>
        )}
        {props.description && (
          <div>
            <p>{props.description}</p>
          </div>
        )}
        {props?.children}
      </Container>
    </Modal>
  );
});

export default ModalLottie;
