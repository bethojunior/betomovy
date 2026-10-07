import { Container } from "./styles";

interface ModalTripEndedProps {
  linkApp: string;
}

export const ModalTripEnded = ({ linkApp }: ModalTripEndedProps) => {
  return (
    <Container>
      <div className="content-modal-encerred">
        <h3>Viagem Encerrada</h3>

        <span>Use você também, baixe agora e ganhe um desconto exclusivo.</span>

        <div>
          <a href={linkApp} target="_blank" rel="noreferrer">
            BAIXAR
          </a>
        </div>
      </div>
    </Container>
  );
};
