export const getStatusColors = (status: string) => {
  switch (status) {
    case "disponivel":
      return {
        primary: "#18b532",
        secondary: "#22c55e",
        accent: "#16a34a",
      };
    case "accepted":
    case "boarding":
      return {
        primary: "#f59e0b",
        secondary: "#fbbf24",
        accent: "#d97706",
      };
    case "corrida":
    case "in_progress":
      return {
        primary: "#ef4444",
        secondary: "#f87171",
        accent: "#dc2626",
      };
    case "desligado":
      return {
        primary: "#6b7280",
        secondary: "#9ca3af",
        accent: "#4b5563",
      };
    default:
      return {
        primary: "#6b7280",
        secondary: "#9ca3af",
        accent: "#4b5563",
      };
  }
};
