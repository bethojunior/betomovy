import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "./styles";
import { getPathImageDefault, LogoMovyDefault } from "../../config/configApp";
import api from "../../api/apiAxios";
import swal from "sweetalert";

const DRIVER_CODE_REGEX = /^[A-Z]{2}[0-9]{5}[A-Z]$/;

const validateDriverCode = (value: string): boolean => {
  return DRIVER_CODE_REGEX.test(value.toUpperCase());
};

const parseDriverIdFromCode = (code: string): number => {
  return parseInt(code.replace(/[^0-9]/g, ""), 10);
};

const DriverExemptionRequest = () => {
  const { whoIndicatedId } = useParams<{ whoIndicatedId: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedCode = code.trim();
    if (trimmedCode.length <= 0) {
      swal("", "Informe o seu código de motorista", "warning");
      return;
    }
    const upperCode = trimmedCode.toUpperCase();
    if (!validateDriverCode(upperCode)) {
      swal("", "Código inválido", "warning");
      return;
    }
    if (!whoIndicatedId) {
      swal("", "Link de indicação inválido", "warning");
      return;
    }
    setLoading(true);
    try {
      const driverId = parseDriverIdFromCode(upperCode);
      const response = await api.post("Driver/Indication", {
        driverId,
        whoIndicatedId,
      });
      const { status, message } = response.data;
      if (status) {
        swal("", message, "success");
      } else {
        swal("", message || "Erro ao solicitar isenção", "error");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Erro ao solicitar isenção";
      swal("", message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Container>
      <div className="content-box">
        <img
          src={getPathImageDefault()}
          alt="Logo"
          onError={(e) => {
            e.currentTarget.src = LogoMovyDefault;
          }}
        />
        <h4 className="title-exemption">
          <span className="title-exemption-line">Solicitar isenção de</span>
          <span className="title-exemption-line">taxa por</span>
        </h4>
        <h2>30 DIAS</h2>
        <div className="field-code">
          <label htmlFor="code">Seu código</label>
          <input
            id="code"
            type="text"
            maxLength={8}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Ex: AB12345C"
            disabled={loading}
            aria-label="Código do motorista"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          aria-label="Solicitar isenção"
        >
          {loading ? "Aguarde..." : "SOLICITAR"}
        </button>
      </div>
    </Container>
  );
};

export default DriverExemptionRequest;
