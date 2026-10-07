import { Container } from "./styles";
import { SmileyXEyes } from "phosphor-react";
const NotFound = () => {

    return(
        <Container>
            <h1>Página não encontrada</h1>
            <div className="content-icon">
                <SmileyXEyes size={250} />
            </div>
        </Container>
    )
}

export default NotFound;