import { useEffect, useState } from "react";
import {
  fetchUrlRedirects,
  getLinkAppClient,
  getLinkAppClientIos,
} from "../../config/configApp";

const ALLOWED_STORE_ORIGINS = [
  "play.google.com",
  "apps.apple.com",
  "itunes.apple.com",
];

const APP_OPEN_FALLBACK_DELAY_MS = 1500;

// RFC 3986 (scheme): letra seguida de letras/dígitos/+/-/.
const SCHEME_QUERY_PARAM = "scheme";
const VALID_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*$/i;

const isIos = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

const isAndroid = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
};

const isMobileDevice = (): boolean => isIos() || isAndroid();

const getAppCustomSchemeUrl = (): string => {
  if (typeof window === "undefined") return "";

  const scheme = new URLSearchParams(window.location.search)
    .get(SCHEME_QUERY_PARAM)
    ?.trim();

  return scheme && VALID_SCHEME_PATTERN.test(scheme) ? `${scheme}://` : "";
};

const canAttemptAppOpen = (): boolean =>
  isMobileDevice() && Boolean(getAppCustomSchemeUrl());

const isAllowedStoreUrl = (url: string | null | undefined): boolean => {
  try {
    const parsed = new URL((url ?? "").trim());
    return (
      parsed.protocol === "https:" &&
      ALLOWED_STORE_ORIGINS.some(
        (origin) => parsed.hostname === origin || parsed.hostname.endsWith("." + origin)
      )
    );
  } catch {
    return false;
  }
};

const getStoreUrlFromCache = (): string =>
  (isIos() ? getLinkAppClientIos() : getLinkAppClient())?.trim() ?? "";

type ShareStatus = "opening-app" | "redirecting-store" | "store-unavailable";

const Share = () => {
  const [status, setStatus] = useState<ShareStatus>(
    canAttemptAppOpen() ? "opening-app" : "redirecting-store"
  );

  useEffect(() => {
    let isMounted = true;
    let fallbackTimer: number | undefined;

    const goToStore = async () => {
      const cachedUrl = getStoreUrlFromCache();
      if (isAllowedStoreUrl(cachedUrl)) {
        if (!isMounted) return;
        setStatus("redirecting-store");
        window.location.replace(cachedUrl);
        return;
      }

      // Cache ainda vazio (ex.: acesso direto ao /share, sem visita prévia ao site) —
      // busca a config na hora em vez de depender do useEffect de outro componente.
      try {
        await fetchUrlRedirects();
      } catch (error) {
        console.error(error);
      }

      if (!isMounted) return;

      const freshUrl = getStoreUrlFromCache();
      if (isAllowedStoreUrl(freshUrl)) {
        setStatus("redirecting-store");
        window.location.replace(freshUrl);
      } else {
        setStatus("store-unavailable");
      }
    };

    const cancelFallbackIfAppOpened = () => {
      if (document.visibilityState === "hidden" && fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }
    };

    if (canAttemptAppOpen()) {
      document.addEventListener("visibilitychange", cancelFallbackIfAppOpened);
      fallbackTimer = window.setTimeout(goToStore, APP_OPEN_FALLBACK_DELAY_MS);
      window.location.href = getAppCustomSchemeUrl();
    } else {
      goToStore();
    }

    return () => {
      isMounted = false;
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", cancelFallbackIfAppOpened);
    };
  }, []);

  if (status === "store-unavailable") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "1rem",
          color: "#374151",
          padding: "1rem",
          textAlign: "center",
        }}
        role="alert"
      >
        <p>Link da loja não disponível ou inválido.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1rem",
        color: "#374151",
      }}
      aria-live="polite"
      aria-label="Abrindo o aplicativo ou redirecionando para a loja de aplicativos"
    >
      <p>
        {status === "opening-app"
          ? "Abrindo o app..."
          : "Redirecionando para a loja..."}
      </p>
    </div>
  );
};

export default Share;
