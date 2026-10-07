// @ts-nocheck
import PDFReader from '@hashiprobr/expo-pdf-reader';

import {Container, PdfView} from './styles';

export function TermsOfUse() {
  return (
    <Container>
      <PdfView>
        <PDFReader
          source={{
            uri: `https://www.4devs.com.br/gerador_de_cpf`,
          }}
        />
      </PdfView>
    </Container>
  );
}
