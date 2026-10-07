import { Image } from "antd";
import styled, { keyframes } from "styled-components";

type Status = "disponivel" | "desligado" | "corrida" | "going_to_passenger" | "default";

const getColorByStatus = (status: Status) => {
  const statusColors = {
    disponivel: "hue-rotate(80deg)", // Verde
    desligado: "grayscale(95%)", // Cinza
    corrida: "hue-rotate(-50deg) saturate(4.0)", // Vermelho
    going_to_passenger: "hue-rotate(30deg) saturate(2.0)", // Amarelo
    default: "hue-rotate(80deg)", // Verde padrão
  };

  return status ? statusColors[status] : statusColors["default"];
};

const getPingColor = (status: Status) => {
  const colors: Record<string, string> = {
    disponivel: "rgba(34, 197, 94, 0.5)",
    corrida: "rgba(239, 68, 68, 0.5)",
    going_to_passenger: "rgba(234, 179, 8, 0.5)",
    desligado: "rgba(150, 150, 150, 0.3)",
    default: "rgba(34, 197, 94, 0.5)",
  };
  return colors[status] ?? colors.default;
};

const ping = keyframes`
  0% { transform: scale(0.8); opacity: 0.8; }
  70% { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(2.2); opacity: 0; }
`;

interface IconDriverProps {
  status: Status;
  rotation: number;
}

export const MarkerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PingRing = styled.div<{ status: Status }>`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ status }) => getPingColor(status)};
  animation: ${ping} 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  pointer-events: none;
`;

export const IconDriverWrapper = styled.div<IconDriverProps>`
  width: 32px;
  height: 32px;
  cursor: pointer;
  transform-origin: center center;
  transform: ${({ rotation }) => `rotate(${rotation}deg)`};
  transition: transform 0.3s ease-in-out;
  filter: ${({ status }) => getColorByStatus(status)};

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const ImageDriver = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;


export const Avatar = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 100%;
`;

export const DriverImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 100%;
  margin-top: 10px;
`;

export const DriverInfo = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  margin-top: 10px;
`;

export const DriverTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0;
`;

export const DriverName = styled.p`
  font-size: 14px;
  margin-bottom: 0;
  color: black;
`;