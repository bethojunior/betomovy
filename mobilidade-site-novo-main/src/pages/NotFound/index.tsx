import { Container } from "./styles";
import { SmileyXEyes } from "phosphor-react";

const NotFound = () => {
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const isAdminPath =
        path === "/monitor" ||
        path.startsWith("/monitor/") ||
        path === "/central" ||
        path.startsWith("/central/");

    return (
        <Container>
            <h1>
                {isAdminPath
                    ? "Monitor/Central temporariamente indisponível"
                    : "Página não encontrada"}
            </h1>
            {isAdminPath ? (
                <p style={{ color: "#ccc", maxWidth: 480, textAlign: "center", margin: "16px auto" }}>
                    O tráfego de {path} está caindo no site em vez do painel.
                    Aguarde o redeploy dos serviços monitor-web/central-web ou acesse
                    pelo domínio dedicado quando estiver no ar.
                </p>
            ) : null}
            <div className="content-icon">
                <SmileyXEyes size={250} />
            </div>
        </Container>
    );
};

export default NotFound;