import { Col } from 'antd';
import {
  Content,
  MockupButton,
  MockupContainer,
  MockupContent,
  MockupImage,
  MockupList,
  MockupListItem,
  MockupSectionTitle,
  MockupSubtitleContainer,
  MockupText,
  MockupTitle,
  StyledImage,
} from './styles';
import Cellphone from "../../../src/assets/cellphone.png";
import PostoShell from "../../../src/assets/posto-shell.jpeg";
import { FormData } from '../../pages/Advanced/Publicity/PublicityApp/types';

const MockupCellphoneCompanyPartner = ({ formData }: { formData: FormData }) => {
  return (
    <Col span={8}>
      <MockupContainer>
        <>
          <MockupImage src={Cellphone} alt="Cellphone" />
          <MockupContent>
            <StyledImage src={PostoShell} alt="Posto Shell" />
            <Content>
            <MockupTitle>
              {formData.title || "POSTO CASARÃO LTDA."} 
            </MockupTitle>
            <MockupSubtitleContainer>
                <MockupText>
                  {formData.subtitle ||
                    "Experimente economizar ainda mais com a gente! Abasteça no nosso posto e ganhe descontos exclusivos através do app Repmove. É rápido, fácil e economiza seu tempo e dinheiro. Venha conferir!"}
                </MockupText>
              </MockupSubtitleContainer>
              <MockupSectionTitle>Horários:</MockupSectionTitle>
              <MockupList>
                <MockupListItem>
                  {formData.opening_hours ||
                    "Segunda a Sábado: 06:00 às 22:00"}
                </MockupListItem>
                <MockupListItem>
                  {formData.opening_hours2 ||
                    "Domingos e Feriados: 08:00 às 22:00"}
                </MockupListItem>
              </MockupList>
              <MockupSectionTitle>Benefícios:</MockupSectionTitle>
              <MockupList>
                <MockupListItem>
                  {formData.benefit1 ||
                    "Descontos Exclusivos: Usuários do app Repmove ganham descontos especiais ao abastecer em nosso posto."}
                </MockupListItem>
                <MockupListItem>
                  {formData.benefit2 ||
                    "Segurança: Sistema de pagamento 100% seguro e protegido."}
                </MockupListItem>
                <MockupListItem>
                  {formData.benefit3 ||
                    "Segurança: Sistema de pagamento 100% seguro e protegido."}
                </MockupListItem>
              </MockupList>
            </Content>
            <MockupButton>
              {formData.text_button_cta || "Visite Site"}
            </MockupButton>
          </MockupContent>
        </>
      </MockupContainer>
    </Col>
  );
};

export default MockupCellphoneCompanyPartner;
