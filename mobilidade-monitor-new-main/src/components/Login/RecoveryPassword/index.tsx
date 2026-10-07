import { AxiosError } from "axios";
import swal from "sweetalert";
import { useState } from "react";
import { Modal, Input, Button } from "antd";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../../../services/api";
import { breadCrumble } from "../../../utils/translation/breadCrumble";

import {
  ErrorTitle,
  PasswordLabel,
  AlertSuccess,
  InputCodeVerification,
} from "./styles";

interface sendEmailToRecoveryData {
  message: string;
  response: {
    code: string;
    userId: number;
  };
  status: boolean;
}

interface updatePasswordData {
  status: boolean;
}

interface RecoveryPasswordProps {
  showPassword: boolean;
  setShowPassword: (data: boolean) => void;
}

export const RecoveryPassword = ({
  showPassword,
  setShowPassword,
}: RecoveryPasswordProps) => {
  const [emailtoForgotPassword, setEmailtoForgotPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [codeValidation, setCodeValidation] = useState("");
  const [inputClientCodeVerification, setInputClientCodeVerification] =
    useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [userId, setUserId] = useState(null);
  
  // Número do WhatsApp do suporte mockado
  const supportWhatsapp = "8520280633";

  const sendRecoveryEmail = async () => {
    if (emailtoForgotPassword === "") {
      setMessageError("Informe seu e-mail");
      setShowError(true);
      return;
    }
    try {
      setLoading(true);
      const responseRecoveryEmail = await api.post<sendEmailToRecoveryData>(
        "user/forgetPassword",
        {
          email: emailtoForgotPassword,
        }
      );

      if (responseRecoveryEmail.status) {
        const resultValue = JSON.parse(responseRecoveryEmail.request?.response);
        if (!resultValue.status) {
          setMessageError("O e-mail informado não consta em nossos registros");
          setShowError(true);
          return;
        }

        setShowError(false);
        setCodeValidation(resultValue.response.code);
        setUserId(resultValue.response.userId);
        setShowAlert(false);
        setEmailtoForgotPassword("");
        setStep(2);
      }
    } catch (error) {
      const responseError = error as AxiosError<any>;
      const errorMessage = responseError.response?.data?.response?.[0] || 
                          responseError.response?.data?.message || 
                          breadCrumble('recovery.error.send_email');
      swal({
        title: breadCrumble('recovery.error.title'),
        text: errorMessage,
        icon: "error",
        className: "swal-centered-text",
      });
    } finally {
      setLoading(false);
    }
  };

  const CodeVerify = () => {
    if (atob(codeValidation) !== inputClientCodeVerification) {
      setMessageError("O código informado é inválido");
      return setShowError(true);
    }

    setShowError(false);
    return setStep(3);
  };

  const ChangePassword = async () => {
    if (confirmNewPassword !== newPassword) {
      setMessageError(
        "As senhas não coincidem, por favor, revise-as e tente novamente."
      );
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      const responseChangePassword = await api.put<updatePasswordData>(
        `user/${userId}/password`,
        {
          code: atob(codeValidation),
          password: newPassword,
        }
      );

      if (responseChangePassword.status) {
        const resultValue = JSON.parse(
          responseChangePassword.request?.response
        );

        if (!resultValue.status) {
          setMessageError(
            "Ocorreu um erro interno não foi possível alterar sua senha, tente novamente."
          );
          setShowError(true);
          return;
        }

        setShowError(false);
        setInputClientCodeVerification("");
        setConfirmNewPassword("");
        setNewPassword("");
        setShowPassword(false);
        setStep(1);
        setShowAlert(true);
      }
    } catch (error) {
      const responseError = error as AxiosError<any>;
      const errorMessage = responseError.response?.data?.response?.[0] || 
                          responseError.response?.data?.message || 
                          breadCrumble('recovery.error.change_password');
      swal({
        title: breadCrumble('recovery.error.title'),
        text: errorMessage,
        icon: "error",
        className: "swal-centered-text",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    switch (step) {
      case 1:
        sendRecoveryEmail();
        break;

      case 2:
        CodeVerify();
        break;

      case 3:
        ChangePassword();
        break;

      default:
        break;
    }
  };

  const handleCloseModal = () => {
    setStep(1);
    setShowError(false);
    setEmailtoForgotPassword("");
    setInputClientCodeVerification("");
    setConfirmNewPassword("");
    setNewPassword("");
    setShowPassword(false);
  };

  return (
    <>
      {showAlert && (
        <AlertSuccess
          message="Senha alterada com sucesso!"
          description="Você já pode efetuar o login com sua nova senha"
          type="success"
          showIcon
          closable
        />
      )}
      <Modal
        title="Não consegue acessar?"
        open={showPassword}
        onOk={nextStep}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key={1}
            type="link"
            href={`https://wa.me/55${supportWhatsapp}`}
            target="_blank"
          >
            Falar com suporte
          </Button>,
          <Button type="primary" onClick={nextStep} loading={loading}>
            Confirmar
          </Button>,
        ]}
      >
        {step === 1 && (
          <>
            <p>Insira seu e-mail</p>
            <Input
              value={emailtoForgotPassword}
              placeholder="E-mail"
              type="email"
              onChange={({ target }) => {
                setEmailtoForgotPassword(target.value);
              }}
            />
          </>
        )}
        {step === 2 && (
          <>
            <p>
              Digite o código de recuperação que foi enviado para seu e-mail
            </p>
            <InputCodeVerification
              placeholder="####"
              value={inputClientCodeVerification}
              size="large"
              maxLength={4}
              onChange={({ target }) => {
                setInputClientCodeVerification(target.value);
              }}
            />
          </>
        )}
        {step === 3 && (
          <>
            <PasswordLabel>Digite sua nova senha</PasswordLabel>
            <Input.Password
              size="large"
              value={newPassword}
              iconRender={(visible) =>
                visible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />
              }
              onChange={({ target }) => setNewPassword(target.value)}
            />

            <PasswordLabel>Confirme sua nova senha</PasswordLabel>
            <Input.Password
              size="large"
              value={confirmNewPassword}
              iconRender={(visible) =>
                visible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />
              }
              onChange={({ target }) => setConfirmNewPassword(target.value)}
            />
          </>
        )}
        {showError && <ErrorTitle>{messageError}</ErrorTitle>}
      </Modal>
    </>
  );
};
