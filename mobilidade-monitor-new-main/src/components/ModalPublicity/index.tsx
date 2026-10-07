import { Button, Modal } from "antd";

import { useState } from "react";

import {
  Container,
  Banner,
  DescriptionPublicity,
  Label,
  Link,
  TitlePublicity,
  Carousel,
  ContentBanner,
  Footer,
  ContentVideos,
} from "./styles";

interface ModalPublicityProps {
  publicityInformations: PublicityProps[] | null;
}

export const ModalPublicity = ({
  publicityInformations,
}: ModalPublicityProps) => {
  const [visibleModal, setVisibleModal] = useState<boolean>(true);

  return (
    <Modal
      width={650}
      title=""
      open={visibleModal}
      onCancel={() => setVisibleModal(false)}
      footer={[
        <Button key={1} onClick={() => setVisibleModal(false)}>
          Fechar
        </Button>,
      ]}
    >
      <Carousel autoplay>
        {publicityInformations?.map((value, index) => {
          return (
            <Container key={index}>
              <div>
                <TitlePublicity>Evento - {value?.title}</TitlePublicity>

                <ContentBanner>
                  <Banner src={value?.banner_link} alt={value?.title} />
                </ContentBanner>

                <DescriptionPublicity>
                  {value?.description}
                </DescriptionPublicity>

                <Footer>
                  <Label>Veja mais sobre o assunto:</Label>

                  <div>
                    <span>
                      Link: <Link>{value.link}</Link>
                    </span>
                  </div>

                  <ContentVideos>
                    <h4>Videos:</h4>
                    {value.advertising_videos.length > 0 &&
                      value.advertising_videos.map((value, index) => {
                        return (
                          <div key={index}>
                            <Link>{value.link}</Link>
                          </div>
                        );
                      })}
                  </ContentVideos>
                </Footer>
              </div>
            </Container>
          );
        })}
      </Carousel>
    </Modal>
  );
};
