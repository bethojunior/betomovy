import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import swal from "sweetalert";

import api from "../../../../services/api";
import Session from "../../../../utils/Session";
import Utils from "../../../../utils/Utils";
import { resizeImageCanvas } from "../../../../utils/Hook/resizeImageCanvas";
import { schema, TypeSchema } from "./schema_validations";
import { CompaniesProps, GenderProps, AppProps, AdvertsingAppSiteProps } from "./types";
import { filterSupportedAdvertisingApps } from "../../../../constants/monitorApps";

export const useInsertPublicity = () => {
  const { control, handleSubmit, setValue, reset } = useForm<TypeSchema>({
    resolver: yupResolver(schema),
  });

  const [listCompanies, setListCompanies] = useState<CompaniesProps[]>([]);
  const [listGender, setListGender] = useState<GenderProps[]>([]);
  const [listApps, setListApps] = useState<AppProps[]>([]);
  const [listAdvertising, setListAdvertising] = useState<AdvertsingAppSiteProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [urlImgBanner, setUrlImgBanner] = useState("");
  const [urlImgModal, setUrlImgModal] = useState("");
  const [dataImgBanner, setDataImgBanner] = useState<File | null>(null);
  const [dataImgModal, setDataImgModal] = useState<File | null>(null);

  const cityId = Session.getLocal("citySelected")?.cityId;
  const refImgBanner = useRef(null);
  const refImgModal = useRef(null);

  const getCompanies = async () => {
    if (!cityId) return;
    try {
      const response = await api.get(`company?cityId=${cityId}`);
      if (response.status) {
        setListCompanies(Array.isArray(response.data.response) ? response.data.response : []);
      }
    } catch {
      swal({ title: "Erro ao pegar dados das empresas", icon: "error" });
    }
  };

  const getGenders = async () => {
    try {
      const response = await api.get("gender");
      if (response.status) {
        setListGender(Array.isArray(response.data.response) ? response.data.response : []);
      }
    } catch {
      swal({ title: "Erro ao pegar dados de gêneros", icon: "error" });
    }
  };

  const getApps = async () => {
    try {
      const response = await api.get("app");
      if (response.status) {
        const apps = Array.isArray(response.data.response) ? response.data.response : [];
        setListApps(filterSupportedAdvertisingApps<AppProps>(apps));
      }
    } catch {
      swal({ title: "Erro ao pegar dados de apps", icon: "error" });
    }
  };

  const getAdvertisingAppSite = async () => {
    try {
      const response = await api.get("advertisingAppSite");
      if (response.status) {
        setListAdvertising(Array.isArray(response.data.response) ? response.data.response : []);
      }
    } catch {
      swal({ title: "Erro ao pegar dados de locais", icon: "error" });
    }
  };

  const dataUrlToFile = (
    dataUrl: string,
    filename: string,
    mimeType: string,
    callback: (file: File) => void
  ) => {
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => callback(new File([blob], filename, { type: mimeType })));
  };

  const onChangeImgBanner = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.[0]) return;
    if (files[0].size > 5242880) {
      swal({ title: "Erro", text: "O arquivo não pode exceder 5 MB.", icon: "error" });
      return;
    }
    resizeImageCanvas(files[0], 324, 108, (dataUrl) => {
      setUrlImgBanner(dataUrl);
      dataUrlToFile(dataUrl, "banner.jpg", "image/jpeg", setDataImgBanner);
    });
  };

  const onChangeImgModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.[0]) return;
    if (files[0].size > 5242880) {
      swal({ title: "Erro", text: "O arquivo não pode exceder 5 MB.", icon: "error" });
      return;
    }
    resizeImageCanvas(files[0], 288, 180, (dataUrl) => {
      setUrlImgModal(dataUrl);
      dataUrlToFile(dataUrl, "modal.jpg", "image/jpeg", setDataImgModal);
    });
  };

  const resetForm = () => {
    setDataImgBanner(null);
    setDataImgModal(null);
    setUrlImgBanner("");
    setUrlImgModal("");
    reset();
  };

  const onSubmitDatas = (data: TypeSchema) => {
    if (!cityId) {
      swal({ title: "Erro", text: "Cidade não selecionada. Por favor, selecione uma cidade.", icon: "error" });
      return;
    }
    if (!dataImgModal) {
      swal({ title: "Alerta", text: "Imagem para modal precisa ser escolhida.", icon: "warning" });
      return;
    }
    if (!dataImgBanner) {
      swal({ title: "Alerta", text: "Banner precisa ser escolhido.", icon: "warning" });
      return;
    }
    if (!data.dateInit || !data.dateFinal) {
      swal({ title: "Erro", text: "Datas inválidas. Por favor, verifique as datas selecionadas.", icon: "error" });
      return;
    }

    const dateInitFormated = Utils.dateConvertToISO8601(data.dateInit);
    const dateFinalFormated = Utils.dateConvertToISO8601(data.dateFinal);

    if (dateInitFormated > dateFinalFormated) {
      swal({ title: "A data inicial não pode ser maior que a data final", icon: "warning" });
      return;
    }

    const normalizedLink = /^(https?:\/\/)/.test(data.link) ? data.link : `https://${data.link}`;

    const formData = new FormData();
    formData.append("thumbnail", dataImgModal);
    formData.append("banner", dataImgBanner);
    formData.append("genderId", String(data.genderId));
    formData.append("appId", String(data.appId));
    formData.append("amountOfTime", data.amountOfTime);
    formData.append("link", normalizedLink);
    formData.append("emailInformation", data.emailInformation);
    formData.append("emailRedirect", data.emailRedirect);
    formData.append("description", data.description);
    formData.append("companyId", String(data.company));
    formData.append("cityId", String(cityId));
    formData.append("advertisingAppSiteId", String(data.advertsingId));
    formData.set("dateStart", dateInitFormated);
    formData.set("dateEnd", dateFinalFormated);

    setLoadingButton(true);
    api
      .post("advertising", formData)
      .then((response) => {
        if (response.status) {
          swal({ title: "Publicidade criada com sucesso", icon: "success" });
          resetForm();
        } else {
          let fallbackText = "Não foi possível salvar. Verifique os campos e tente novamente.";
          const responseData = response.data;
          fallbackText = responseData?.response?.[0] || responseData?.message || fallbackText;
          swal({ title: "Atenção", text: fallbackText, icon: "warning" });
        }
      })
      .catch((error: AxiosError) => {
        const responseData = error.response?.data as { response?: string[]; message?: string } | undefined;
        const text =
          responseData?.response?.[0] ||
          responseData?.message ||
          error.message ||
          "Ocorreu um erro ao enviar os dados. Tente novamente.";
        swal({ title: "Erro", text, icon: "error" });
      })
      .finally(() => setLoadingButton(false));
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getCompanies(),
          getGenders(),
          getApps(),
          getAdvertisingAppSite(),
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return {
    control,
    handleSubmit,
    setValue,
    loading,
    loadingButton,
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
  };
};
