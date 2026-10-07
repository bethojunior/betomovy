import { FaRegMoneyBillAlt } from "react-icons/fa";
import { Container } from "./styles";
import { IoClose } from "react-icons/io5";

export const ListPayments = ({ setRegisterCard, close }: any) => {
  return (
    <Container>
      <div>
        <div className="header">
          <span>Formas de pagamentos</span>
          <IoClose fontSize={20} onClick={close} className="close" />
        </div>
        <div className="payments-container">
          <div className="payments">
            <FaRegMoneyBillAlt fontSize={20} color="green" />
            <span className="payment-item">Dinheiro</span>
          </div>
          <div className="btn-container">
            <button
              onClick={() => setRegisterCard(true)}
              type="button"
              className="add-card"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
      <div>
        <span>Cupons</span>
        <div className="payments-container">
          <div className="payments">
            <span className="payment-item">Você não possui cupons</span>
          </div>
          <div className="btn-container">
            <button
              onClick={() => setRegisterCard(true)}
              type="button"
              className="add-card"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
      <div>
        <span>Vouchers</span>
        <div>
          <div className="balance-container">
            <span className="balance-label">Saldo atual</span>
            <span className="balance-value">R$ 0,00</span>
          </div>
          <div className="voucher-card">
            <div className="percent">
              <span>-10%</span>
            </div>
            <div className="values-container">
              <div className="values">
                <span className="small nowrap">R$200,00</span>
                <span className="small nowrap">Pague R$180,00</span>
                <span className="small nowrap">ganhe R$200,00</span>
              </div>
              <div>
                <span>Comprar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
