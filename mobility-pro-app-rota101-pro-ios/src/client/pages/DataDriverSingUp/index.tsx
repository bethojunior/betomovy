import React, {useState} from 'react';
import {Categories} from './Steps/Categories';

import {Container} from './styles';

export function DataDriverSingUp() {
  const [step, setStep] = useState(1);

  return (
    <Container>
      {(() => {
        switch (step) {
          case 1:
            return <Categories />;
          case 2:
            return <Categories />;
          default:
            return null;
        }
      })()}
    </Container>
  );
}
