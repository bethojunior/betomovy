import { useEffect, useRef, useState } from "react";

/** Duração da animação de movimento entre coordenadas (ms). */
const MOVEMENT_ANIM_MS = 1500;

/** Tempo máximo aguardando o socket antes de exibir posição REST como fallback (ms). */
const SOCKET_SYNC_TIMEOUT_MS = 2000;

/** Calcula o azimute (bearing) entre dois pontos geográficos, em graus [0–360]. */
const calcCompassBearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};

/** Retorna o menor delta de rotação entre dois ângulos, no intervalo [-180, +180]. */
const calcShortestRotation = (from: number, to: number): number =>
  ((to - from + 540) % 360) - 180;

export interface MarkerAnimationResult {
  animPos: { lat: number; lng: number };
  heading: number;
  /** Falso até a primeira posição real (socket) ser confirmada. */
  isVisible: boolean;
}

/**
 * Gerencia a animação suave de posição e rotação do marker no mapa.
 * - A primeira mudança de posição (REST → socket) é aplicada sem animação (teleporte).
 * - Atualizações subsequentes são interpoladas com ease-out cúbico.
 * - Se o socket não enviar update em SOCKET_SYNC_TIMEOUT_MS, exibe posição REST como fallback.
 */
export const useMarkerAnimation = (lat: number, lng: number): MarkerAnimationResult => {
  const [animPos, setAnimPos] = useState({ lat, lng });
  const [heading, setHeading] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const animPosRef = useRef({ lat, lng });
  const headingRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const prevPosRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const awaitingFirstSyncRef = useRef(true);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Cancela o frame de animação em andamento, se houver. */
  const cancelAnimation = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  /** Cancela o timer de fallback de visibilidade, se ainda estiver pendente. */
  const cancelFallbackTimer = () => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  };

  /** Posiciona o marker diretamente na coordenada, sem animação (usado na primeira sync). */
  const teleportToPosition = (newLat: number, newLng: number) => {
    cancelFallbackTimer();
    prevPosRef.current = { latitude: newLat, longitude: newLng };
    animPosRef.current = { lat: newLat, lng: newLng };
    setAnimPos({ lat: newLat, lng: newLng });
    setIsVisible(true);
  };

  /** Calcula o heading de destino com base no vetor de movimento atual. */
  const calcTargetHeading = (fromRot: number, newLat: number, newLng: number): number => {
    if (!prevPosRef.current) return fromRot;
    const { latitude: prevLat, longitude: prevLng } = prevPosRef.current;
    const bearing = calcCompassBearing(prevLat, prevLng, newLat, newLng);
    return fromRot + calcShortestRotation(fromRot, bearing);
  };

  /** Inicia a animação de posição e heading entre dois pontos com ease-out cúbico. */
  const startAnimation = (
    fromLat: number,
    fromLng: number,
    newLat: number,
    newLng: number,
    fromRot: number,
    toRot: number
  ) => {
    const startTime = performance.now();

    const tick = (ts: number) => {
      const t = Math.min((ts - startTime) / MOVEMENT_ANIM_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      const curLat = fromLat + (newLat - fromLat) * eased;
      const curLng = fromLng + (newLng - fromLng) * eased;
      const curRot = fromRot + (toRot - fromRot) * eased;

      animPosRef.current = { lat: curLat, lng: curLng };
      headingRef.current = curRot;
      setAnimPos({ lat: curLat, lng: curLng });
      setHeading(curRot);

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  /** Ativa o fallback de visibilidade caso o socket demore a responder. */
  useEffect(() => {
    fallbackTimerRef.current = setTimeout(() => setIsVisible(true), SOCKET_SYNC_TIMEOUT_MS);
    return cancelFallbackTimer;
  }, []);

  /** Reage a mudanças de coordenada: teleporta na primeira sync, anima nas seguintes. */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const newLat = Number(lat);
    const newLng = Number(lng);

    if (isNaN(newLat) || isNaN(newLng)) return;

    cancelAnimation();

    const fromLat = animPosRef.current.lat;
    const fromLng = animPosRef.current.lng;

    if (fromLat === newLat && fromLng === newLng) return;

    if (awaitingFirstSyncRef.current) {
      awaitingFirstSyncRef.current = false;
      teleportToPosition(newLat, newLng);
      return;
    }

    const fromRot = headingRef.current;
    const toRot = calcTargetHeading(fromRot, newLat, newLng);
    prevPosRef.current = { latitude: newLat, longitude: newLng };

    startAnimation(fromLat, fromLng, newLat, newLng, fromRot, toRot);

    return cancelAnimation;
  }, [lat, lng]);

  return { animPos, heading, isVisible };
};
