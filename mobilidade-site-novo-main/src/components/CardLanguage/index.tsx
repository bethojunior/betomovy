import { Container } from "./styles";

interface CardLanguageProps{
    nameLanguage: string;
    codeLanguage: string;
}

export default function CardLanguage({ nameLanguage, codeLanguage }: CardLanguageProps){

    const handleSetLanguageApp = () => {
        localStorage.setItem('languageApplication', codeLanguage);
        window.location.reload();
    }

    return(
        <Container onClick={handleSetLanguageApp}>
            <h3>{nameLanguage}</h3>
        </Container>
    )
}