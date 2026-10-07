import { Container, TitleModule, ContentIcon } from "./styles";

interface CardModuleProps {
  nameModule: string;
  iconModule: string | null;
  primaryColor: string;
  textColor: string;
}

export const CardModule = ({
  nameModule,
  iconModule,
  primaryColor,
  textColor,
}: CardModuleProps) => {
  return (
    <Container backgroundColor={primaryColor}>
      <TitleModule colorText={textColor}>{nameModule}</TitleModule>
      <ContentIcon>
        {iconModule && (
          <img
            src={`${iconModule}?v=${new Date().getTime()}`}
            alt={`ícone do módulo ${nameModule}`}
          />
        )}
      </ContentIcon>
    </Container>
  );
};
