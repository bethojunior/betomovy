import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert";

import { useEffect, useState } from "react";
import { Container } from "./styles";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import MerchantDownload from "../../components/MerchantDownload";
import LoadingBackdrop from "../../components/LoadingBackdrop";

import pathBanner from "../../assets/img/Banner_1366x688.png";

import {
  getPathImageDefault,
  getNameApplication,
  LogoMovyDefault,
} from "../../config/configApp";
import api from "../../api/apiAxios";

import { useTranslation } from "react-i18next";

interface IFormInputsDoubtsProps {
  name: string;
  contact: string;
  subject: string;
}

const schema = yup.object({
  name: yup.string().required("Este campo é obrigatório"),
  contact: yup.string().required("Este campo é obrigatório"),
  subject: yup.string().required("Este campo é obrigatório"),
});

const Home = () => {
  const { control, handleSubmit, setValue } = useForm<IFormInputsDoubtsProps>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 200);
        }
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const query = window.location.search;
  const urlParams = new URLSearchParams(query);

  const nameAppPartner = urlParams.get("name_app");

  const TranslationErrors = (message: string) => {
    let value;

    switch (message) {
      case "Este campo é obrigatório":
        value = t("message-error-form-input-mandatory");
        break;
      case "Este campo é do tipo email":
        value = t("message-error-form-input-type-email");
        break;
      case "O mínimo é 14 caracteres":
        value = t("message-error-form-minimun-char14");
        break;
      case "O máximo é 18 caracteres":
        value = t("message-error-form-maximun-char18");
        break;
    }

    return value;
  };

  const handleSendMessage = async (data: IFormInputsDoubtsProps) => {
    setLoading(true);
    try {
      const responseSendMessage = await api.post(
        "Site/SendContactEmail",
        JSON.stringify(data)
      );

      if (responseSendMessage.data.status) {
        swal({
          text: responseSendMessage.data.message,
          icon: "success",
        });

        setValue("name", "");
        setValue("contact", "");
        setValue("subject", "");
      } else {
        swal({
          text: responseSendMessage.data.message,
          icon: "warning",
        });
      }
    } catch (error) {
      swal({
        title: t("message-error-api-doubt") as string,
        icon: "error",
      });
      console.log(error);
    }
    setLoading(false);
  };

  const handleSendDoubts = (data: IFormInputsDoubtsProps) => {
    handleSendMessage(data);
  };

  const handleRedirectPagePassenger = () => {
    if (nameAppPartner) {
      navigate(`passageiro?name_app=${nameAppPartner}`);
      return;
    }
    navigate("/passageiro");
  };

  const handleRedirectPageDriver = () => {
    if (nameAppPartner) {
      navigate(`/motorista?name_app=${nameAppPartner}`);
      return;
    }
    navigate("/motorista");
  };

  document.title = "Home";

  return (
    <Container>
      <Header />
      <LoadingBackdrop loading={loading} />
      <section
        className="content-banner"
        style={{ backgroundImage: `url(${pathBanner})` }}
      >
        <div className="content">
          <h1>{t("banner-text")}</h1>
          <p>{t("banner-app-description")}</p>

          <div className="content-buttons">
            <Button
              onClick={handleRedirectPagePassenger}
              nameButton={t("banner-app-button-passenger")}
            />
            <Button
              onClick={handleRedirectPageDriver}
              nameButton={t("banner-app-button-driver")}
            />
          </div>
        </div>
      </section>
      <section id="sobre-nos" className="content-description-website">
        <div className="content-img">
          <img
            src={getPathImageDefault()}
            alt="logo-app"
            onError={(e) => {
              e.currentTarget.src = LogoMovyDefault;
            }}
          />
        </div>
        <div className="description">
          <p>{`${getNameApplication()} ${t("paragraph-one-merchant")}`}</p>
          <p>{`${getNameApplication()} ${t("paragraph-two-merchant")}`}</p>
          <p>{`${t("paragraph-three-merchant")}`}</p>
        </div>
      </section>

      <MerchantDownload />

      <section id="contato" className="content-doubts">
        <div className="content-column-1">
          <h1>
            {" "}
            {t("text-doubt")} <br /> {t("text-doubt-2")}
          </h1>
          <span>{t("description-doubt")}</span>
        </div>
        <div className="content-column-2">
          <form onSubmit={handleSubmit(handleSendDoubts)}>
            <div className="content-inputs">
              <Controller
                control={control}
                name="name"
                render={({
                  field: { onChange, value = "", name },
                  fieldState: { error },
                }) => (
                  <>
                    <div>
                      <input
                        name={name}
                        value={value}
                        onChange={onChange}
                        type="text"
                        placeholder={
                          t("placeholder-name-input-doubt") as string
                        }
                      />
                      {error && (
                        <span className="errors-texts">
                          {TranslationErrors(error.message as string)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              />

              <Controller
                control={control}
                name="contact"
                render={({
                  field: { onChange, value = "", name },
                  fieldState: { error },
                }) => (
                  <div>
                    <input
                      name={name}
                      value={value}
                      onChange={onChange}
                      type="text"
                      placeholder={t("placeholder-email-input-doubt") as string}
                    />
                    {error && (
                      <span className="errors-texts">
                        {TranslationErrors(error.message as string)}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="content-textarea">
              <Controller
                control={control}
                name="subject"
                render={({
                  field: { onChange, value = "", name },
                  fieldState: { error },
                }) => (
                  <div>
                    <textarea
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={
                        t("placeholder-message-input-doubt") as string
                      }
                    ></textarea>
                    {error && (
                      <span className="errors-texts">
                        {TranslationErrors(error.message as string)}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
            <Button typeButton="submit" nameButton={t("button-send-doubt")} />
          </form>
        </div>
      </section>

      <Footer />
    </Container>
  );
};

export default Home;
