import api from '../services/api';

const findTripSharingLinkInKeys = (keys: any[]): string | undefined => {
  const tripSharingConfig = keys
    .flatMap((group: any) => group.config || [])
    .find((config: any) => config.key === "trip_sharing_link");
  return tripSharingConfig?.value;
};

export const openTripSharingLink = async (tripReference: string) => {
  const defaultLink = `https://appgov.prod.speedmob.com.br/trip/${tripReference}/share`;
  let sharingLink: string | null = null;

  try {
    const keysApp = localStorage.getItem("keysApp");
    if (keysApp && keysApp !== "undefined" && keysApp !== "null") {
      const keys = JSON.parse(keysApp);
      const linkTemplate = findTripSharingLinkInKeys(keys);
      if (linkTemplate) {
        sharingLink = linkTemplate.replace("{tripReference}", tripReference);
      }
    }

    if (!sharingLink) {
      const responseConfigs = await api.get("config");
      if (responseConfigs.status) {
        const keys = responseConfigs.data.response;
        const linkTemplate = findTripSharingLinkInKeys(keys);
        if (linkTemplate) {
          sharingLink = linkTemplate.replace("{tripReference}", tripReference);
        }
      }
    }
    
    window.open(sharingLink || defaultLink, "_blank");
  } catch (error) {
    console.error("Erro ao obter o link de compartilhamento da viagem:", error);
    window.open(defaultLink, "_blank");
  }
};

