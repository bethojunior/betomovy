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
  // const [allCategories, setAllCategories] = useState<categoriesProps[]>();
  // const [loading, setLoading] = useState<boolean>(false);
  // const [messageAlert, setMessageAlert] = useState<string>("");
  // const [showMessageAlert, setShowMessageAlert] = useState<boolean>(false);
  // const [typeAlert, setTypeAlert] = useState<TypeMessageAlertProps>("success");

  // const query = useQuerySearch();
  // const searchQuery = query.get("form");

  // const handleCallMessageAlert = (
  //   message: string,
  //   type: TypeMessageAlertProps
  // ) => {
  //   setMessageAlert(message);
  //   setTypeAlert(type);
  //   setShowMessageAlert(true);
  // };

  // const getAllCategories = async () => {
  //   setLoading(true);
  //   api
  //     .get(`userType/drivers`)
  //     .then((response) => {
  //       setLoading(false);
  //       setAllCategories(response.data.response);
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       handleCallMessageAlert("Erro na requisição", "error");
  //       console.log(error);
  //     });
  // };

  // useEffect(() => {
  //   getAllCategories();
  // }, []);

  return (
    <Container>
      <Iframe src={`${import.meta.env.LINK_SITE_WEB}motorista`} />
    </Container>
  );
};

export default SignupDriver;
