import React, { FC, useState, useRef, useEffect } from "react";
import {
  Container,
  Content,
  ContentText,
  LoginCardContainer,
  HeaderCard,
  FormContainer,
  InputGroup,
  CaptchaContainer,
  ButtonLogin,
  ForgotPasswordLink,
  ImportantFooter,
} from "./styles";

import { RecoveryPassword } from "../../components/Login/RecoveryPassword";
import ModalFranshises from "../../components/Login/modalFranchises";
import { useContextAuth } from "../../contexts/auth";
import apiSpeedmob from "../../services/apiSpeedmob";

import pathUrl from "../../assets/background-login.webp";
import pathLogo from "../../assets/logo-movy-transparent.png";

const Login: FC = () => {
  const refInputPassword = useRef<HTMLInputElement | null>(null);
  const refInputCaptcha = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [openModalFranchises, setOpenModalFranchises] = useState(false);

  const [geolocationsCoordinates, setGeolocationCoordinates] = useState<GeolocationCoordinatesProps | null>(null);
  const [firstNumberCheck, setFirstNumberCheck] = useState<number>(0);
  const [secondNumberCheck, setSecondNumberCheck] = useState<number>(0);
  const [showBtnLogin, setShowBtnLogin] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const { signIn, speedmobLogin, loading } = useContextAuth();
  const [franchises, setFranchises] = useState<any[]>([]);
  const [loginValues, setLoginValues] = useState<{ email: string; password: string }>({ email: "", password: "" });

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((position: any) => {
      if (position && position.coords) {
        setGeolocationCoordinates(position.coords);
      }
    });

    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setFirstNumberCheck(Math.floor(Math.random() * 9) + 1);
    setSecondNumberCheck(Math.floor(Math.random() * 9) + 1);
    setCaptchaError(false);
    if (refInputCaptcha.current) refInputCaptcha.current.value = "";
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      checkCaptcha();
    }
  };

  const checkCaptcha = () => {
    const sum = firstNumberCheck + secondNumberCheck;
    const userVal = Number(refInputCaptcha.current?.value);

    if (sum !== userVal || !refInputCaptcha.current?.value) {
      setCaptchaError(true);
      setShowBtnLogin(false);
      generateCaptcha();
      return;
    }

    setCaptchaError(false);
    setShowBtnLogin(true);
    refInputPassword.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (import.meta.env.ISSPEEDMOB === "true") {
      const isSupport = await speedmobLogin(email, password);
      if (isSupport === "support") {
        apiSpeedmob.get("franchise/getAll").then(({ data }: any) => {
          setFranchises(
            data.response.map((item: any) => ({
              label: item.project_name,
              id: item.id,
            }))
          );
        });
        setLoginValues({ email, password });
        setOpenModalFranchises(true);
        return;
      }
    }

    await signIn(email, password);
  };

  return (
    <Container
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(7, 10, 26, 0.78) 0%, rgba(0, 52, 154, 0.65) 100%), url(${pathUrl})`,
        backgroundColor: '#070A1A',
      }}
    >
      <Content>
        {/* Lado Esquerdo: Banner Tecnológico MOVY */}
        <ContentText>
          <div className="text-wrapper">
            <div className="badge-monitor">
              <span className="dot-pulse"></span>
              <span>MONITOR PRO &bull; GESTÃO GLOBAL</span>
            </div>

            <h1>
              Plataforma de Despacho & <span className="highlight">Telemetria de Frota</span>
            </h1>

            <p>
              Sistema operacional completo para frotas de alta performance. Monitoramento via satélite em tempo real, despacho com SLA &lt; 1s, faturamento multimoeda (USD / BRL) e compliance fiscal nos EUA e Brasil.
            </p>

            <div className="features-grid">
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <div>
                  <strong>Telemetria 60 FPS</strong>
                  <small>Rastreamento contínuo em alta precisão</small>
                </div>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <div>
                  <strong>Zelle & Pix Nativos</strong>
                  <small>Saques automáticos em Dólar e Real</small>
                </div>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <div>
                  <strong>MOVY Negocia</strong>
                  <small>Contrapropostas dinâmicas de corrida</small>
                </div>
              </div>
            </div>
          </div>
        </ContentText>

        {/* Lado Direito: Formulário com FUNDO BRANCO PURO conforme exigido */}
        <LoginCardContainer>
          <HeaderCard>
            <div className="card-logo-container">
              <img src={pathLogo} alt="MOVY" />
            </div>
            <h2>Acesse sua conta</h2>
            <p>Insira suas credenciais de gestor de frota</p>
          </HeaderCard>

          <FormContainer onSubmit={handleSubmit}>
            <InputGroup>
              <label htmlFor="inputEmail">E-mail de acesso</label>
              <input
                id="inputEmail"
                type="email"
                placeholder="nome@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <label htmlFor="inputPassword">Senha</label>
              <input
                id="inputPassword"
                type="password"
                ref={refInputPassword}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>

            {!showBtnLogin ? (
              <CaptchaContainer className={captchaError ? "has-error" : ""}>
                <label>
                  Segurança: Calcule <strong>{firstNumberCheck} + {secondNumberCheck}</strong>
                </label>
                <div className="captcha-actions">
                  <input
                    type="number"
                    ref={refInputCaptcha}
                    placeholder="Resultado"
                    onKeyPress={handleKeyPress}
                  />
                  <button type="button" onClick={checkCaptcha}>
                    CONFIRMAR
                  </button>
                </div>
                {captchaError && <span className="error-msg">Resultado incorreto, tente novamente</span>}
              </CaptchaContainer>
            ) : (
              <ButtonLogin type="submit" disabled={loading}>
                {loading ? "AUTENTICANDO..." : "ENTRAR NO PAINEL"}
              </ButtonLogin>
            )}

            <ForgotPasswordLink type="button" onClick={() => setShowPasswordModal(true)}>
              Esqueceu sua senha de acesso?
            </ForgotPasswordLink>

            <ImportantFooter>
              <div className="security-notice">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Conexão Segura &bull; Auditoria de IP e Localização</span>
              </div>
              {geolocationsCoordinates && (
                <div className="coords">
                  Localização: {geolocationsCoordinates.latitude.toFixed(4)}, {geolocationsCoordinates.longitude.toFixed(4)}
                </div>
              )}
            </ImportantFooter>
          </FormContainer>
        </LoginCardContainer>
      </Content>

      <RecoveryPassword
        setShowPassword={setShowPasswordModal}
        showPassword={showPasswordModal}
      />

      <ModalFranshises
        open={openModalFranchises}
        setOpen={setOpenModalFranchises}
        franchises={franchises}
        loginValues={loginValues}
      />
    </Container>
  );
};

export default Login;
