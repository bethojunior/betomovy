import { Modal } from "@mui/material";
import { Container } from "./styles";
import { RegisterCreditCard } from "../RegisterCreditCard";
import { IoClose } from "react-icons/io5";
import { ListPayments } from "../ListPayments";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

export const ListCreditCard = ({ open, close }: any) => {
  const [registerCard, setRegisterCard] = useState(false);

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container>
        <div className="comp">
          {registerCard ? (
            <>
              <FaArrowLeft
                onClick={() => setRegisterCard(false)}
                fontSize={20}
                className="close"
              />
              <RegisterCreditCard setRegisterCard={setRegisterCard} />
              <IoClose fontSize={20} onClick={close} className="close" />
            </>
          ) : (
            <ListPayments close={close} setRegisterCard={setRegisterCard} />
          )}
        </div>
      </Container>
    </Modal>
  );
};
