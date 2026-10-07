import { useState, useRef, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import swal from "sweetalert";

import api from "../../../../services/api";
import Session from "../../../../utils/Session";
import Utils from "../../../../utils/Utils";
import { resizeImageCanvas } from "../../../../utils/Hook/resizeImageCanvas";
import { schema, TypeSchema } from "./schema_validations";
import { filterSupportedAdvertisingApps } from "../../../../constants/monitorApps";
import {
  CompaniesProps,
  GenderProps,
  AppProps,
  AdvertisingAppSiteProps,
} from "./types";

interface UseModalEditPublicityProps {
  visible: boolean;
  publicityId: number | null;
  setVisible: (visible: boolean) => void;
  onSuccess: () => void;
}

export const useModalEditPublicity = ({
  visible,
  publicityId,
  setVisible,
  onSuccess,
}: UseModalEditPublicityProps) => {
  const { control, handleSubmit, setValue, reset } = useForm<TypeSchema>({
    // yupResolver infers Date (non-nullable) for nullable().required() fields, but TypeSchema
    // uses Date | null to allow clearing date pickers. Cast to align the types.
    resolver: yupResolver(schema) as unknown as Resolver<TypeSchema>,
  });

  const [listCompanies, setListCompanies] = useState<CompaniesProps[]>([]);
  const [listGender, setListGender] = useState<GenderProps[]>([]);
  const [listApps, setListApps] = useState<AppProps[]>([]);
  const [listAdvertising, setListAdvertising] = useState<AdvertisingAppSiteProps[]>([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [urlImgBanner, setUrlImgBanner] = useState("");
  const [urlImgModal, setUrlImgModal] = useState("");
  const [dataImgBanner, setDataImgBanner] = useState<File | null>(null);
  const [dataImgModal, setDataImgModal] = useState<File | null>(null);

  const cityId = Session.getLocal("citySelected")?.cityId;
  const refImgBanner = useRef(null);
  const refImgModal = useRef(null);

  // ─── Fetches ────────────────────────────────────────────────────────────────

  const getPublicityData = async () => {
    if (!publicityId) return;
    try {
      const response = await api.get(`advertising/${publicityId}/show`);
      if (response?.status && response?.data?.response) {
        const data = response.data.response;

        setValue("description", data?.description || "");
        setValue("amountOfTime", data?.amountOfTime != null ? String(data.amountOfTime) : "");
        setValue("link", data?.link || "");
        setValue("emailInformation", data?.emailInformation || "");
        setValue("emailRedirect", data?.emailRedirect || "");

        if (data?.companyId) setValue("company", data.companyId);
        if (data?.genderId) setValue("genderId", data.genderId);
        if (data?.appId) setValue("appId", data.appId);
        if (data?.advertisingAppSiteId) setValue("advertisingId", data.advertisingAppSiteId);

        if (data?.dateStart) {
          const dateStart = new Date(data.dateStart);
          if (!isNaN(dateStart.getTime())) setValue("dateInit", dateStart);
        }
        if (data?.dateEnd) {
          const dateEnd = new Date(data.dateEnd);
          if (!isNaN(dateEnd.getTime())) setValue("dateFinal", dateEnd);
        }

        if (data?.banner) setUrlImgBanner(data.banner);
        if (data?.thumbnail) setUrlImgModal(data.thumbnail);
      } else {
        swal({ title: "Erro", text: "Não foi possível carregar os dados da publicidade.", icon: "error" });
      }
    } catch {
      swal({ title: "Erro ao carregar dados da publicidade", text: "Não foi possível carregar as informações. Tente novamente.", icon: "error" });
    }
  };

  const getCompanies = async () => {
    if (!cityId) return;
    try {
      const response = await api.get(`company?cityId=${cityId}`);
      if (response?.status && response?.data?.response) {
        setListCompanies(Array.isArray(response.data.response) ? response.data.response : []);
      } else {
        setListCompanies([]);
      }
    } catch {
      swal({ title: "Erro ao carregar empresas", text: "Não foi possível carregar a lista de empresas.", icon: "error" });
      setListCompanies([]);
    }
  };

  const getGenders = async () => {
    try {
      const response = await api.get("gender");
      if (response?.status && response?.data?.response) {
        setListGender(Array.isArray(response.data.response) ? response.data.response : []);
      } else {
        setListGender([]);
      }
    } catch {
      swal({ title: "Erro ao carregar gêneros", text: "Não foi possível carregar a lista de gêneros.", icon: "error" });
      setListGender([]);
    }
  };

  const getApps = async () => {
    try {
      const response = await api.get("app");
      if (response?.status && response?.data?.response) {
        const apps = Array.isArray(response.data.response)
          ? filterSupportedAdvertisingApps<AppProps>(response.data.response)
          : [];
        setListApps(apps);
      } else {
        setListApps([]);
      }
    } catch {
      swal({ title: "Erro ao carregar aplicativos", text: "Não foi possível carregar a lista de aplicativos.", icon: "error" });
      setListApps([]);
    }
  };

  const getAdvertisingAppSite = async () => {
    try {
      const response = await api.get("advertisingAppSite");
      if (response?.status && response?.data?.response) {
        setListAdvertising(Array.isArray(response.data.response) ? response.data.response : []);
      } else {
        setListAdvertising([]);
      }
    } catch {
      swal({ title: "Erro ao carregar locais de publicidade", text: "Não foi possível carregar a lista de locais.", icon: "error" });
      setListAdvertising([]);
    }
  };

  // ─── Imagens ─────────────────────────────────────────────────────────────────

  const dataUrlToFile = (dataUrl: string, filename: string, mimeType: string, callback: (file: File) => void) => {
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => callback(new File([blob], filename, { type: mimeType })));
  };

  const onChangeImgBanner = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5242880) {
      swal({ title: "Erro", text: "O arquivo não pode exceder 5 MB.", icon: "error" });
      return;
    }
    resizeImageCanvas(file, 324, 108, (dataUrl) => {
      setUrlImgBanner(dataUrl);
      dataUrlToFile(dataUrl, "banner.jpg", "image/jpeg", setDataImgBanner);
    });
  };

  const onChangeImgModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5242880) {
      swal({ title: "Erro", text: "O arquivo não pode exceder 5 MB.", icon: "error" });
      return;
    }
    resizeImageCanvas(file, 288, 180, (dataUrl) => {
      setUrlImgModal(dataUrl);
      dataUrlToFile(dataUrl, "modal.jpg", "image/jpeg", setDataImgModal);
    });
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────

  const onSubmitDatas = async (data: TypeSchema) => {
    if (!publicityId) {
      swal({ title: "Erro", text: "ID da publicidade não encontrado.", icon: "error" });
      return;
    }
    if (!cityId) {
      swal({ title: "Erro", text: "Cidade não selecionada. Por favor, selecione uma cidade.", icon: "error" });
      return;
    }

    const dateInitFormated = data.dateInit ? Utils.dateConvertToISO8601(data.dateInit) : null;
    const dateFinalFormated = data.dateFinal ? Utils.dateConvertToISO8601(data.dateFinal) : null;

    if (!dateInitFormated || !dateFinalFormated) {
      swal({ title: "Erro", text: "Datas inválidas. Por favor, verifique as datas selecionadas.", icon: "error" });
      return;
    }
    if (dateInitFormated > dateFinalFormated) {
      swal({ title: "A data inicial não pode ser maior que a data final", icon: "warning" });
      return;
    }

    setLoadingButton(true);
    try {
      // Imagem só é enviada quando o usuário seleciona um arquivo novo.
      // O backend mantém a imagem atual quando o campo não é enviado.
      const formData = new FormData();
      if (dataImgModal) formData.append("thumbnail", dataImgModal);
      if (dataImgBanner) formData.append("banner", dataImgBanner);

      formData.append("description", data.description || "");
      formData.append("amountOfTime", data.amountOfTime || "");
      formData.append("companyId", String(data.company || ""));
      formData.append("dateStart", dateInitFormated as string);
      formData.append("dateEnd", dateFinalFormated as string);
      formData.append("link", data.link || "");
      formData.append("emailInformation", data.emailInformation || "");
      formData.append("emailRedirect", data.emailRedirect || "");
      formData.append("appId", String(data.appId || ""));
      formData.append("advertisingAppSiteId", String(data.advertisingId || ""));
      formData.append("genderId", String(data.genderId || ""));
      formData.append("cityId", String(cityId));

      const response = await api.post(`advertising/${publicityId}/update`, formData);
      if (response?.status) {
        swal({ title: "Publicidade atualizada com sucesso", icon: "success" });
        handleClose();
        onSuccess();
      } else {
        throw new Error("Resposta inválida da API");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ response?: string[]; message?: string }>;
      const errorMessage =
        (axiosError.response?.data?.response?.length ?? 0) > 0
          ? axiosError.response?.data?.response?.[0]
          : axiosError.response?.data?.message || "Erro ao atualizar publicidade";
      swal({ title: "Erro", text: errorMessage, icon: "error" });
    } finally {
      setLoadingButton(false);
    }
  };

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  const handleClose = () => {
    reset();
    setUrlImgBanner("");
    setUrlImgModal("");
    setDataImgBanner(null);
    setDataImgModal(null);
    setVisible(false);
  };

  useEffect(() => {
    if (!visible || !publicityId) return;
    const loadData = async () => {
      setLoadingData(true);
      try {
        await Promise.all([
          getCompanies(),
          getGenders(),
          getApps(),
          getAdvertisingAppSite(),
          getPublicityData(),
        ]);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, publicityId]);

  return {
    control,
    handleSubmit,
    setValue,
    loadingButton,
    loadingData,
    listCompanies,
    listGender,
    listApps,
    listAdvertising,
    urlImgBanner,
    urlImgModal,
    refImgBanner,
    refImgModal,
    onChangeImgBanner,
    onChangeImgModal,
    onSubmitDatas,
    handleClose,
  };
};
