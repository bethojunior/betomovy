import { Container } from "./styles";

interface ButtonProps {
    nameButton: string;
    typeButton?: 'button' | 'submit';
    onClick?: () => void;
}

const Button = ({ nameButton, typeButton, onClick }: ButtonProps ) => {

    return(
        <Container>
            <button onClick={onClick} type={typeButton}>{nameButton}</button>
        </Container>
    )
}

export default Button;