import Mask from "../../../utils/Masks";
import { Container } from "./styles";

export const DriverTypeCard = ({
  item,
  setTypeSelected,
  typeSelected,
}: any) => {
  return (
    <Container>
      <div
        className="card"
        onClick={() => setTypeSelected(item)}
        style={{
          border:
            typeSelected === item
              ? "1.5px solid #000"
              : "1.5px solid transparent",
        }}
      >
        <img alt="trip-type" src={item.picture} width={60} height={60} />
        <div className="info-container">
          <div className="type-info">
            <span className="type-name">{item?.tag}</span>
            <span className="description">
              {item?.tripType?.description ?? ""}
            </span>
          </div>
          <span className="price">R$ {Mask.setMoneyMask(item.price)}</span>
        </div>
      </div>
    </Container>
  );
};
