import { useState, useEffect } from "react";

import {
  Content,
  Section1,
  Section2,
  Squad1,
  Squad2,
  Squad3,
  Squad4,
  Container,
} from "./styles";

interface PreloadProps {
  visible: boolean;
}

function Preload({ visible }: PreloadProps) {
  const [change] = useState(0);
  const removePreload = false

  useEffect(() => {
    console.log(visible)
    // setTimeout(() => {
    //   if (change === 4) {
    //     return setChange(0);
    //   }
    //   return setChange(change + 1);
    // }, 300);
  }, []);

  return (
    <>
      {removePreload && (
        <Container>
          <Content>
            <Section1>
              <Squad1 change={change} />
              <Squad2 change={change} />
            </Section1>
            <Section2>
              <Squad3 change={change} />
              <Squad4 change={change} />
            </Section2>
          </Content>
        </Container>
      )}
    </>
  );
}

export default Preload;
