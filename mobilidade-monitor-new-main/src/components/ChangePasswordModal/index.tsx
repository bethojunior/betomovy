import { FC, useContext, useEffect, useState } from "react";
import { Modal, Button, Input, Form } from "antd";
import { IoEyeOutline } from "react-icons/io5";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import swal from "sweetalert";
import { ModalBody, Label, ItemForm, ButtonContainer } from "./styles";
import AuthContext from "../../contexts/auth";
import api from "../../services/api";
import Preload from "../Utils/Preload";

interface ChangePasswordData {
  isModalVisible: boolean;
  setIsModalVisible: (res: boolean) => void;
}

interface PasswordValuesProps {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
}

const ChangePassword: FC<ChangePasswordData> = ({
  isModalVisible,
  setIsModalVisible,
}) => {
  const [loading, setLoading] = useState(false);
  const { responseDataUser } = useContext(AuthContext);

  const [userId, setUserId] = useState<number>();

  const [error, setError] = useState(false);
  const [text, setText] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [diferentPassword, setDiferentPassword] = useState("");

  useEffect(() => {
    setUserId(responseDataUser?.idUser);
  }, [isModalVisible]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values: PasswordValuesProps) => {
    setError(false);
    setConfirmPasswordError(false);
    if (values.currentPassword !== localStorage.getItem("@App:password")) {
      setError(true);
      setText("A senha informada não coincide com sua senha atual");
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      setConfirmPasswordError(true);
      setDiferentPassword(
        "A senha de confimação não coincide com a sua nova senha"
      );
      return;
    }
    setLoading(true);
    api
      .put(`user/${userId}/password`, { password: values.newPassword, updatePasswordByConfig: true})
      .then((resul) => {
        setLoading(false);
        if (resul.status === 200) {
          swal({
            title: "Senha alterada com sucesso",
            icon: "success",
          }).then(() => {
            handleCancel();
          });
          return;
        }
        swal({
          title: "Erro ao tentar alterar a senha",
          icon: "error",
        });
      });
  };

  return (
    <>
      <Modal
        destroyOnClose
        width={400}
        title="Alterar senha"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <ModalBody>
          <Preload visible={loading} />
          <Form onFinish={onFinish} autoComplete="off">
            <Label>Senha atual</Label>
            <ItemForm
              name="currentPassword"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: "Campo obrigatório!",
                },
              ]}
            >
              <Input.Password
                iconRender={(visible) =>
                  visible ? <IoEyeOutline /> : <AiOutlineEyeInvisible />
                }
              />
            </ItemForm>
            {error && <p style={{ color: "red" }}>{text}</p>}
            <Label>Nova senha</Label>
            <ItemForm
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Campo obrigatório!",
                },
              ]}
            >
              <Input.Password
                iconRender={(visible) =>
                  visible ? <IoEyeOutline /> : <AiOutlineEyeInvisible />
                }
              />
            </ItemForm>
            <Label>Confirme sua nova senha</Label>
            <ItemForm
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Campo obrigatório!",
                },
              ]}
            >
              <Input.Password
                iconRender={(visible) =>
                  visible ? <IoEyeOutline /> : <AiOutlineEyeInvisible />
                }
              />
            </ItemForm>
            {confirmPasswordError && (
              <p style={{ color: "red" }}>{diferentPassword}</p>
            )}
            <ButtonContainer>
              <Button onClick={handleCancel}>Fechar</Button>
              <Button
                style={{ marginLeft: "15px" }}
                type="primary"
                htmlType="submit"
              >
                Salvar
              </Button>
            </ButtonContainer>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ChangePassword;
