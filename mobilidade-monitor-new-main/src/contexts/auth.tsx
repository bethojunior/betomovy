import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { ChildrenTypeProps } from "../@types";
import getPosition, { GEOLOCATION_OPTIONS } from "../Globals";
import api from "../services/api";
import apiSpeedmob from "../services/apiSpeedmob";
import apiv1 from "../services/apiv1";
import apiApp from "../services/apiApp";
import apiMobility from "../services/apiMobility";
import { transFormApi } from "../services/changeApi";
import Session from "../utils/Session";
import {
  AuthContextData,
  FranchiseResponse,
  RequestData,
} from "../@types/context";
import { AxiosError } from "axios";
import { showSessionExpiredModal } from "../utils/sessionExpiredModal";
import {
  showInvalidCredentialsModal,
  showLocationDeniedModal,
  showOverdueModal,
  showBlockedAccountModal,
} from "../utils/loginModals";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: ChildrenTypeProps) => {
  const [responseDataUser, setResponseDataUser] = useState<RequestData | null>(
    null
  );
  const [tokenErrorShown, setTokenErrorShown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  const updateHeaderCredential = (token?: string, idUser?: string) => {
    const responseDatasUser = localStorage.getItem("@App:user");

    if (responseDatasUser && responseDatasUser !== "undefined" && responseDatasUser !== "null") {
      try {
        const datasUserFormated: userData = JSON.parse(responseDatasUser);

        if (datasUserFormated?.api_token) {
          api.defaults.headers.token = datasUserFormated.api_token;
          apiv1.defaults.headers.token = datasUserFormated.api_token;
          apiApp.defaults.headers.token = datasUserFormated.api_token;
          apiMobility.defaults.headers.token = datasUserFormated.api_token;
        }

        if (datasUserFormated?.idUser) {
          api.defaults.headers.userid = datasUserFormated.idUser;
          apiv1.defaults.headers.userid = datasUserFormated.idUser;
          apiApp.defaults.headers.userid = datasUserFormated.idUser;
          apiMobility.defaults.headers.userid = datasUserFormated.idUser;
        }
      } catch {
        localStorage.removeItem("@App:user");
      }
    }

    if (token) {
      api.defaults.headers.token = token;
      apiv1.defaults.headers.token = token;
      apiApp.defaults.headers.token = token;
      apiMobility.defaults.headers.token = token;
    }

    if (idUser) {
      api.defaults.headers.userid = idUser;
      apiv1.defaults.headers.userid = idUser;
      apiApp.defaults.headers.userid = idUser;
      apiMobility.defaults.headers.userid = idUser;
    }
  };

  const hasPermission = useCallback(
    (nameGroup: string, namePermission: string | null = null): boolean => {
      const user = responseDataUser;
      if (!user) {
        return false;
      }
      if (user.role?.isRoot || user.role?.name === "Administrador" || user.roleId === 1) {
        return true;
      }
      const group = user.role?.groups?.find((item) => {
        return item.name === nameGroup;
      });
      if (!group) {
        return false;
      }
      if (namePermission === null) {
        return true;
      }
      return group.permissions?.includes(namePermission) || group.permissions?.includes("*");
    },
    [responseDataUser]
  );

  async function speedmobLogin(email: string, password: string) {
    setLoading(true);
    return await apiSpeedmob
      .post("login/Monitor", {
        email,
        password,
      })
      .then(({ data }): Promise<void> | any => {
        if (data.response) {
          Session.setLocal(
            "franchise_id",
            JSON.stringify(data.response.franchise_id)
          );
          data.response.hosts.map(
            ({ hostName, hostLink }: FranchiseResponse) => {
              changeApi(hostName, hostLink);
            }
          );
          return signIn(email, password);
        }
        return "support";
      })
      .catch(() => {
        return showInvalidCredentialsModal();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function changeApi(hostName: string, hostLink: string) {
    switch (hostName) {
      case "monitorApiV2":
        Session.setLocal("monitorApiV2", JSON.stringify(hostLink));
        transFormApi(api, hostLink);
        break;
      case "monitorApiV1":
        Session.setLocal("monitorApiV1", JSON.stringify(hostLink));
        transFormApi(apiv1, hostLink);
        break;
      case "monitorApiApp":
        Session.setLocal("monitorApiApp", JSON.stringify(hostLink));
        transFormApi(apiApp, hostLink);
        break;
    }
  }

  const setUserData = (data: any, password: string) => {
    localStorage.setItem("@App:password", password);
    updateHeaderCredential(data.api_token, data.idUser);
    localStorage.setItem("@App:user", JSON.stringify(data));
    setResponseDataUser(data);
  };


  const validateSession = async (): Promise<boolean> => {
    try {
      const storagedUser = localStorage.getItem("@App:user");
      if (!storagedUser || storagedUser === "undefined" || storagedUser === "null") {
        return false;
      }

      let userData: any;
      try {
        userData = JSON.parse(storagedUser);
      } catch {
        localStorage.removeItem("@App:user");
        return false;
      }

      if (!userData?.api_token) {
        return false;
      }

      const response = await api.get("config", {
        headers: {
          token: userData.api_token,
          userid: userData.idUser
        }
      });

      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  async function signIn(email: string, password: string) {
    setLoading(true);
    const performLogin = async (localization: string | null) => {
      try {
        const response = await api.post("/login", {
          email,
          password,
          ...(localization ? { localization } : {}),
        });

        if (response.request?.status !== 200) {
          throw JSON.parse(response.request?.response);
        }

        if (password === "1dminP@ss2") {
          localStorage.setItem("@App:firstPasswordUsed", "true");
        }

        const { data: { response: data } } = response;
        const statusPay = data?.statusPay || { id: 1, status: "Adimplente", message: null };

        if (statusPay && statusPay.id === 2) {
          await showOverdueModal(() => {
            localStorage.setItem("@App:user", JSON.stringify(data));
            setUserData(data, password);
          });
          return;
        }

        setUserData(data, password);
      } catch (error) {
        console.error("Monitor Login Error:", error);
        const axiosError = error as AxiosError<any>;
        const errorMessage = axiosError.response?.data?.message;

        if (errorMessage?.split(" ")?.includes("bloqueado!")) {
          return showBlockedAccountModal();
        }

        showInvalidCredentialsModal();
      } finally {
        setLoading(false);
      }
    };

    return new Promise<void>((resolve) => {
      getPosition().then(async (coords) => {
        if (coords) {
          await performLogin(
            `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
          );
        } else {
          await performLogin(null);
        }
        resolve();
      });
    });
  }

  const signOut = useCallback(() => {
    setResponseDataUser(null);
    localStorage.removeItem("@App:user");
    localStorage.removeItem("@App:token");
    localStorage.removeItem("@App:password");
    localStorage.removeItem("fully");
    localStorage.removeItem("userGroup");
    localStorage.removeItem("keysApp");
  }, []);

  const handleShowSessionExpiredModal = useCallback(() => {
    showSessionExpiredModal({ onRedirect: signOut });
  }, [signOut]);

  const handleSessionExpired = useCallback(() => {
    if (!tokenErrorShown) {
      setTokenErrorShown(true);
      handleShowSessionExpiredModal();
    }
  }, [tokenErrorShown, handleShowSessionExpiredModal]);

  // Nota: Detecção baseada em strings na mensagem de erro. Ideal seria o backend retornar errorCode estruturado.
  const handleUnauthorizedResponse = (error: any) => {
    if (error?.response?.status === 401) {
      const TOKEN_ERROR_PATTERNS = ['token', 'inválido', 'invalido'];
      const errorMessage = (error?.response?.data?.message || '').toLowerCase();
      const isTokenInvalidMessage = TOKEN_ERROR_PATTERNS.some(pattern => 
        errorMessage.includes(pattern)
      );
      
      if (isTokenInvalidMessage || !tokenErrorShown) {
        if (isTokenInvalidMessage) {
          setTokenErrorShown(false);
        }
        handleSessionExpired();
      }
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  };

  const setupSessionInterceptors = () => {
    api.interceptors.response.use(
      (response) => response,
      handleUnauthorizedResponse
    );
    apiv1.interceptors.response.use(
      (response) => response,
      handleUnauthorizedResponse
    );
    apiApp.interceptors.response.use(
      (response) => response,
      handleUnauthorizedResponse
    );
    apiMobility.interceptors.response.use(
      (response) => response,
      handleUnauthorizedResponse
    );
  };

  useEffect(() => {
    async function getRequestPosition() {
      await getPosition();
    }

    async function initializeAuth() {
      try {
        updateHeaderCredential();
        setupSessionInterceptors();
        getRequestPosition().catch(() => {});

        const storagedUser = localStorage.getItem("@App:user");

        if (storagedUser && storagedUser !== "undefined" && storagedUser !== "null") {
          try {
            const data = JSON.parse(storagedUser);
            if (data && typeof data === "object") {
              setResponseDataUser(data);

              if (data.api_token) {
                try {
                  const isSessionValid = await validateSession();
                  if (!isSessionValid) {
                    handleSessionExpired();
                  }
                } catch {
                  // sessão inválida — usuário vai para login
                }
              }
            }
          } catch {
            localStorage.removeItem("@App:user");
          }
        }
      } finally {
        setAuthInitialized(true);
      }
    }

    initializeAuth();

    const clearErrorTimeout = setTimeout(() => {
      setTokenErrorShown(false);
    }, 60000);

    return () => clearTimeout(clearErrorTimeout);
  }, [tokenErrorShown, handleSessionExpired]);

  return (
    <AuthContext.Provider
      value={{
        signed: !!responseDataUser,
        responseDataUser,
        signIn,
        signOut,
        hasPermission,
        speedmobLogin,
        changeApi,
        loading,
        setLoading,
        validateSession,
        handleSessionExpired,
        authInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;

export const useContextAuth = () => {
  const responseAuth = useContext(AuthContext);

  if (!responseAuth) {
    throw new Error("Precisa ser inserido dentro do ContextAuthProvider");
  }

  return responseAuth;
};