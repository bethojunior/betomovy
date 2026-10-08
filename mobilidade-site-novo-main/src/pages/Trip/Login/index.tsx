import { useState } from "react";
import { Container } from "./styles";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";
import api from "../../../api/apiAxios";
import { AxiosError } from "axios";
import pathBackgroundImage from "../../../assets/img/Banner2_1366x768.png";
import { getPathImageDefault, LogoMovyDefault } from "../../../config/configApp";

import { schema } from "./schema_validations";
import { Controller, useForm } from "react-hook-form";
import { FormDataProp } from "./types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthStore } from "../../../store/authStore";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import swal from "sweetalert";
import { useStorage } from "../../../utils/Storage";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setItem } = useStorage();

  const { setAuthenticated } = useAuthStore();

  const { control, handleSubmit, setValue } = useForm<FormDataProp>({
    resolver: yupResolver(schema),
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await api.post("Customer/login", {
        email,
        password,
        deviceToken: "1234",
        generateToken: false,
      });
      if (!data.status) throw new Error(JSON.stringify(data));

      return data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.message.includes("JSON")) {
        return swal({
          title: JSON.parse(axiosError?.message)?.message,
          icon: "warning",
        });
      }
      swal({
        title: axiosError?.message,
        icon: "warning",
      });
      return false;
    }
  };

  const sigIn = async ({ email, password }: FormDataProp) => {
    setLoading(true);
    const result = await handleLogin(email, password);
    setLoading(false);
    if (!result.status) return;
    const { data } = result;
    setAuthenticated(true);

    setItem("user", JSON.stringify(data));

    api.defaults.headers.common.token = data.api_token;
    api.defaults.headers.common.userid = data.idUser;
  };

  return (
    <Container
      style={{
        backgroundImage: `url(${pathBackgroundImage})`,
      }}
    >
      <LoadingBackdrop loading={loading} />
      <div className="login-container">
        <img
          src={getPathImageDefault()}
          alt="logo"
          className="logo"
          onError={(e) => {
            e.currentTarget.src = LogoMovyDefault;
          }}
        />
        <div>
          <form onSubmit={handleSubmit(sigIn)}>
            <Controller
              control={control}
              name="email"
              render={({ field: { value = "" }, fieldState: { error } }) => (
                <div className="form-group">
                  <input
                    value={value}
                    placeholder="Email"
                    name="email"
                    type="email"
                    onChange={(event) => {
                      const { value } = event.target;
                      setValue("email", value);
                    }}
                  />
                  {error && <p className="erros-input">{error.message}</p>}
                </div>
              )}
            />

            <div className="form-group">
              <Controller
                control={control}
                name="password"
                render={({ field: { value = "" }, fieldState: { error } }) => (
                  <div className="password-input-container">
                    <input
                      value={value}
                      placeholder="Senha"
                      type={showPassword ? "text" : "password"}
                      onChange={(event) => {
                        const { value } = event.target;
                        setValue("password", value);
                      }}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <IoIosEyeOff fontSize={16} />
                      ) : (
                        <IoMdEye fontSize={16} />
                      )}
                    </button>
                    {error && <p className="erros-input">{error.message}</p>}
                  </div>
                )}
              />
            </div>
            <button className="btn" type="submit">
              Login
            </button>
          </form>
          <p className="register-link">
            Não tem uma conta? <a href="/Passageiro">Cadastre-se</a>
          </p>
        </div>
      </div>
    </Container>
  );
};
