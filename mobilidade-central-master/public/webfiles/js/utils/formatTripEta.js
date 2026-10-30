/**
 * Formata duração e distância para o card de busca/confirmação.
 * Evita valores crus como "1 - 0.565".
 */
function formatTripEta(durationRaw, distanceRaw) {
  const parts = [];

  if (durationRaw !== null && durationRaw !== undefined && durationRaw !== "") {
    const durStr = String(durationRaw).trim().replace(",", ".");
    if (!durStr.toLowerCase().includes("nan")) {
      if (durStr.toLowerCase().includes("min")) {
        parts.push(durStr);
      } else {
        let minutes = parseFloat(durStr);
        if (!isNaN(minutes) && minutes > 0) {
          // API/Maps às vezes devolve segundos
          if (minutes >= 180) {
            minutes = minutes / 60;
          }
          parts.push(`${Math.max(1, Math.round(minutes))} min`);
        }
      }
    }
  }

  if (distanceRaw !== null && distanceRaw !== undefined && distanceRaw !== "") {
    const distStr = String(distanceRaw).trim().replace(",", ".");
    if (!distStr.toLowerCase().includes("nan")) {
      if (distStr.toLowerCase().includes("km") || distStr.toLowerCase().includes("mi")) {
        parts.push(distStr);
      } else {
        let km = parseFloat(distStr);
        if (!isNaN(km) && km >= 0) {
          // metros quando o valor parece grande demais para km urbanos
          if (km >= 100) {
            km = km / 1000;
          }
          parts.push(`${km.toFixed(2)} km`);
        }
      }
    }
  }

  return parts.length > 0 ? parts.join(" • ") : "";
}

if (typeof window !== "undefined") {
  window.formatTripEta = formatTripEta;
}
