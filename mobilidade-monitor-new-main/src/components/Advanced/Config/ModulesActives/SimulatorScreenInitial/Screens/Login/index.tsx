import { useEffect, useState, useRef, KeyboardEvent } from "react";

import { RecoveryPassword } from "../../../../../../Login/RecoveryPassword";
import ModalFranshises from "../../../../../../Login/modalFranchises";
import { useContextAuth } from "../../../../../../../contexts/auth";
import apiSpeedmob from "../../../../../../../services/apiSpeedmob";

import { FranchiseProps, LoginValues } from "./types";

import {
  Container,
  TitleScreen,
  Button,
  Input,
  InputPassword,
  TextForgotPassword,
  Form,
  ContentLogo,
  ImgLogo,
  FooterLogin,
  ContentCheckRobot,
} from "./styles";

export const LoginScreenSimulator = () => {
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      checkCaptcha();
    }
  };
  const refInputPassword = useRef<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openModalFranchises, setOpenModalFranchises] =
    useState<boolean>(false);

  const [geolocationsCoordinates, setGeolocationCoordinates] =
    useState<GeolocationCoordinatesProps | null>(null);

  const [loginValues, setLoginValues] = useState<LoginValues>(
    {} as LoginValues
  );

  const [firstNumberCheck, setFirstNumberCheck] = useState<number | null>(null);
  const [secondNumberCheck, setSecondNumberCheck] = useState<number | null>(
    null
  );

  const [showBtnLogin, setShowBtnLogin] = useState<boolean>(false);

  const { signIn, speedmobLogin, loading } = useContextAuth();
  const [franchises, setFranchises] = useState<FranchiseProps[]>([]);

  const refInputCaptcha = useRef<HTMLInputElement | null>(null);

  const checkCaptcha = () => {
    const resultSumCaptcha =
      (firstNumberCheck as number) + (secondNumberCheck as number);

    const valueInputCaptcha = refInputCaptcha.current?.value;

    if (resultSumCaptcha !== Number(valueInputCaptcha)) {
      setShowBtnLogin(false);
      const firstNumberRandom = Math.floor(Math.random() * 11);
      const secondNumberRandom = Math.floor(Math.random() * 11);

      setFirstNumberCheck(firstNumberRandom);
      setSecondNumberCheck(secondNumberRandom);
      return;
    }

    refInputPassword.current?.focus();
    setShowBtnLogin(true);
  };

  async function handleLogin(values: any) {
    if (import.meta.env.ISSPEEDMOB === "true") {
      const isSupport = await speedmobLogin(values.email, values.password);
      if (isSupport == "support") {
        apiSpeedmob.get("franchise/getAll").then(({ data }) => {
          setFranchises(
            data.response.map((item: FranchiseProps) => {
              return { label: item.project_name, id: item.id };
            })
          );
        });
        setLoginValues(values);
        setOpenModalFranchises(true);
      }
    }

    await signIn(values.email, values.password);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (position) {
        setGeolocationCoordinates(position.coords);
      }
    });
  }, []);

  useEffect(() => {
    const firstNumberRandom = Math.floor(Math.random() * 11);
    const secondNumberRandom = Math.floor(Math.random() * 11);

    setFirstNumberCheck(firstNumberRandom);
    setSecondNumberCheck(secondNumberRandom);
  }, []);

  return (
    <Container>
      <TitleScreen>Bem-Vindo!</TitleScreen>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item<LoginValues>
          name="email"
          initialValue=""
          rules={[{ required: true, message: "Por favor insira seu email!" }]}
          style={{
            margin: 0,
          }}
        >
          <Input variant="outlined" placeholder="Email" size="small" />
        </Form.Item>

        <Form.Item<LoginValues>
          name="password"
          initialValue=""
          rules={[{ required: true, message: "Por favor insira sua senha!" }]}
          style={{
            margin: 0,
          }}
        >
          <InputPassword
            ref={refInputPassword}
            size="small"
            placeholder="Senha"
          />
        </Form.Item>

        {showBtnLogin ? (
          <Button data-test="button-login" type="primary" loading={loading} htmlType="submit">
            Login
          </Button>
        ) : (
          <ContentCheckRobot>
            <label htmlFor="check-robot-sum" data-test="text-numbers-captcha">
              Soma {firstNumberCheck} + {secondNumberCheck}
            </label>
            <div>
              <input
                data-test="input-sum-captcha"
                id="check-robot-sum"
                type="number"
                ref={refInputCaptcha}
                inputMode="numeric"
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={checkCaptcha}
                type="button"
                data-test="button-check-captcha"
              >
                VERIFICAR
              </button>
            </div>
          </ContentCheckRobot>
        )}

        <TextForgotPassword onClick={() => setShowPassword(true)}>
          Esqueci minha senha
        </TextForgotPassword>
      </Form>

      <RecoveryPassword
        setShowPassword={setShowPassword}
        showPassword={showPassword}
      />

      <ModalFranshises
        open={openModalFranchises}
        setOpen={setOpenModalFranchises}
        franchises={franchises}
        loginValues={loginValues}
      />

      <ContentLogo>
        <ImgLogo src={import.meta.env.LOGO_APP} alt="" />
      </ContentLogo>

      <FooterLogin>
        <h6>Importante:</h6>
        <p>
          Este painel requer permissão de localização, e registra esta
          informação e outros dados:
        </p>
        <p>
          Sua localização:{" "}
          {`${geolocationsCoordinates?.latitude}, ${geolocationsCoordinates?.longitude}`}
        </p>
      </FooterLogin>
    </Container>
  );
};
