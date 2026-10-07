import { useState } from "react";
import Card from "react-credit-cards-2";

export const RegisterCreditCard = ({ setRegisterCard }: any) => {
  const [state, setState] = useState<any>({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const handleInputChange = (evt: any) => {
    const { name, value } = evt.target;

    setState((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt: any) => {
    setState((prev: any) => ({ ...prev, focus: evt.target.name }));
  };
  return (
    <div className="card">
      <Card
        number={state.number}
        expiry={state.expiry}
        cvc={state.cvc}
        name={state.name}
        focused={state.focus}
        placeholders={{ name: "Seu nome aqui" }}
        locale={{ valid: "Validade" }}
      />
      <form className="form">
        <div>
          <div className="row">
            <div className="medium">
              <input
                type="tel"
                name="number"
                className="form-control input"
                placeholder="Numero do cartão"
                pattern="[\d| ]{16,22}"
                required
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="small">
              <input
                type="tel"
                name="expiry"
                className="form-control input"
                placeholder="Validade"
                pattern="\d\d/\d\d"
                required
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
          </div>
          <div className="row">
            <div className="medium">
              <input
                type="text"
                name="name"
                className="form-control input"
                placeholder="Nome"
                required
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="small">
              <input
                type="tel"
                name="cvc"
                className="form-control input "
                placeholder="CVC"
                pattern="\d{3,4}"
                required
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
          </div>
          <div className="row">
            <div style={{ width: "50%" }}>
              <input
                type="tel"
                name="number"
                className="form-control input"
                placeholder="Documento"
                pattern="[\d| ]{16,22}"
                required
              />
            </div>
            <div style={{ width: "45%" }}>
              <input
                type="tel"
                name="expiry"
                className="form-control input"
                placeholder="Data de nascimento"
                pattern="\d\d/\d\d"
                required
              />
            </div>
          </div>
        </div>
        <input type="hidden" name="issuer" />
        <div className="form-actions btn-container ">
          <button className="btn" onClick={() => setRegisterCard(false)}>
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};
