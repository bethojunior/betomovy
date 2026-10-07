import { useEffect, useState } from "react";
import swal from "sweetalert";
import axios from "axios";

import api from "../../../../services/api";
import { createVersion, updateVersion } from "./api";
import { validateVersionForm } from "./validation";
import { AppOption, AppProps, VersionFormModalProps, VersionFormValues } from "./types";

const EMPTY_VALUES: VersionFormValues = {
  idApp: null,
  platform: null,
  linkApp: "",
  versionApp: "",
};

type UseVersionFormParams = Pick<
  VersionFormModalProps,
  | "mode"
  | "initialValues"
  | "listVersions"
  | "getAllVersions"
  | "setShowModal"
  | "setLoading"
  | "showModal"
>;

export const useVersionForm = ({
  mode,
  initialValues,
  listVersions,
  getAllVersions,
  setShowModal,
  setLoading,
  showModal,
}: UseVersionFormParams) => {
  const [values, setValues] = useState<VersionFormValues>(EMPTY_VALUES);
  const [listApps, setListApps] = useState<AppOption[]>([]);

  const setField = (field: "platform" | "linkApp" | "versionApp", value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleAppChange = (idApp: string) => {
    setValues((current) => ({ ...current, idApp, platform: null }));
  };

  const getApps = async () => {
    try {
      setLoading(true);
      const responseApps = await api.get("app");

      if (responseApps.status) {
        const listAppsFormated = responseApps.data.response.map((app: AppProps) => ({
          label: app.name,
          value: app.idApp,
        }));

        setListApps(listAppsFormated);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar dados dos aplicativos",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showModal) {
      return;
    }

    if (mode === "edit" && initialValues) {
      setValues({
        idApp: String(initialValues.appId),
        platform: initialValues.platform,
        linkApp: initialValues.link,
        versionApp: initialValues.version,
      });
      return;
    }

    setValues(EMPTY_VALUES);
  }, [showModal, mode, initialValues]);

  const handleSubmit = () => {
    const validationError = validateVersionForm(
      values,
      listVersions,
      mode === "edit" ? initialValues?.id : undefined
    );

    if (validationError) {
      swal({ title: validationError, icon: "warning" });
      return;
    }

    const confirmationText =
      mode === "create"
        ? "É recomendado que teste sua versão antes de salvar a versão"
        : "Confirma a edição desta versão?";

    swal({
      title: "Atenção!",
      text: confirmationText,
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (!isAccept) {
        return;
      }

      const payload = {
        appId: values.idApp as string,
        platform: values.platform as string,
        link: values.linkApp,
        version: values.versionApp,
      };

      const persist = initialValues
        ? () => updateVersion(initialValues.id, payload)
        : () => createVersion(payload);

      setLoading(true);
      persist()
        .then((response) => {
          if (response.status) {
            swal({
              title:
                mode === "create" ? "Versão salva com sucesso" : "Versão atualizada com sucesso",
              icon: "success",
            });
            getAllVersions();
            setShowModal(false);
          }
        })
        .catch((error) => {
          console.error(error);

          const responseMessage = error.response?.data?.response;
          const errorMessage =
            axios.isAxiosError(error) && responseMessage
              ? Array.isArray(responseMessage)
                ? responseMessage.join(", ")
                : String(responseMessage)
              : mode === "create"
              ? "Erro ao salvar versão"
              : "Erro ao atualizar versão";

          swal({ title: errorMessage, icon: "error" });
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  return { values, setField, handleAppChange, listApps, handleSubmit };
};
