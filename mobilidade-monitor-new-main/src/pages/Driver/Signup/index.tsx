import { FC } from "react";
import { Container, Iframe } from "./style";
// import { AiOutlineArrowRight } from "react-icons/ai";
// import { Link, useLocation } from "react-router-dom";
// import api from "../../../services/api";
// import Preload from "../../../components/Utils/Preload";
// import FormRegisterDriver from "./FormRegisterDriver";
// import Alert from "../../../components/Utils/Alert";

// interface categoriesProps {
//   description: string;
//   iconMapDriverId: number;
//   idUserType: number;
//   isActive: number;
//   isDeliveryMan: number;
//   isDriver: number;
//   name: string;
//   picture: string;
// }

// type TypeMessageAlertProps = "success" | "info" | "warning" | "error";

// const useQuerySearch = () => {
//   const { search } = useLocation();

//   return useMemo(() => new URLSearchParams(search), [search]);
// };

const SignupDriver: FC = () => {
  const getDriverUrl = (): string => {
    let siteUrl = (import.meta.env.LINK_SITE_WEB || "").trim();
    if (!siteUrl || siteUrl.includes("xxxx") || siteUrl.includes("localhost")) {
      siteUrl = "https://movymob.com/";
    }
    if (!siteUrl.endsWith("/")) {
      siteUrl += "/";
    }
    return `${siteUrl}motorista`;
  };

  return (
    <Container>
      <Iframe src={getDriverUrl()} title="Cadastro de Motorista" />
    </Container>
  );
};

export default SignupDriver;
