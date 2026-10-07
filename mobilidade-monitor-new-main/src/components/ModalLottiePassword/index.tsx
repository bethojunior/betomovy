import { Button, Modal } from "antd";
import Lottie from "lottie-react";

import { forwardRef, useImperativeHandle, useState } from "react";

import { Container, ContentAnimationRouteMaps } from "./styles";

const ModalLottie = forwardRef<ModalRefProps, any>((props, ref) => {
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
      onCancel={() => ref}
      footer={
        props.footer
          ? props.footer
          : [
              <Button
                key={1}
                onClick={() => {
                  if (props.noDismissAutoClose) {
                    return;
                  }
                  setIsVisible(false);
                }}
              >
                Fechar
              </Button>,
            ]
      }
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
                animationData={props.useLottie?.animationData}
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
