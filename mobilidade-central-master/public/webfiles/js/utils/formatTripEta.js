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
          // Só trata como segundos quando o valor é claramente em segundos (>= 1h)
          if (minutes >= 3600) {
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
      if (distStr.toLowerCase().includes("mi") || distStr.toLowerCase().includes("milha")) {
        parts.push(distStr);
      } else if (distStr.toLowerCase().includes("km")) {
        const num = parseFloat(distStr);
        if (!isNaN(num) && num >= 0) {
          const miles = num * 0.621371;
          parts.push(`${miles.toFixed(2)} mi`);
        } else {
          parts.push(distStr);
        }
      } else {
        let km = parseFloat(distStr);
        if (!isNaN(km) && km >= 0) {
          // Metros quando o valor parece grande demais para km urbanos
          if (km >= 100) {
            km = km / 1000;
          }
          const miles = km * 0.621371;
          parts.push(`${miles.toFixed(2)} mi`);
        }
      }
    }
  }

  return parts.length > 0 ? parts.join(" • ") : "";
}

if (typeof window !== "undefined") {
  window.formatTripEta = formatTripEta;
}
