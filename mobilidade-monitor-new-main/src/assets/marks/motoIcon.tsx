import { useId } from "react";
import { getStatusColors } from "./vehicleIconColors";
import { scopeSvgId } from "./svgId";

interface MotoIconProps {
  rotation?: number;
  size?: number;
  status?: string;
}

export const MotoIcon = ({
  rotation = 0,
  size = 30,
  status = "desligado",
}: MotoIconProps) => {
  const colors = getStatusColors(status);
  const scaledSize = size * 1.5;
  const uid = useId();
  const scopedId = (id: string) => scopeSvgId(id, uid);

  return (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 360 456"
    width={scaledSize}
    height={scaledSize}
    style={{
      transform: `rotate(${rotation - 0}deg)`,
      cursor: "pointer",
      pointerEvents: "all",
    }}
  >
    <defs>
      <linearGradient id={scopedId("P")} gradientUnits="userSpaceOnUse" />
      <linearGradient
        id={scopedId("g1")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(41.184 -9.152 20.501 92.257 179.466 305.409)"
      >
        <stop offset={0.25} stopColor="#636466" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g2")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(83.011 -90.348 292.006)scale(16.679 27.516)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.95} stopColor="#636466" />
      </linearGradient>
      <linearGradient
        id={scopedId("g4")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(39.814 -8.848 16.658 74.96 181.179 307.304)"
      >
        <stop offset={0.25} stopColor="#636466" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g5")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(39.925 -8.872 17.03 76.634 179.455 302.272)"
      >
        <stop offset={0.25} stopColor="#636466" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g7")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(49.994 -6.862 46.229 336.812 182.052 222.745)"
      >
        <stop />
        <stop offset={1} stopColor="#5e5e5e" />
      </linearGradient>
      <linearGradient
        id={scopedId("g8")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(53.664 -7.366 53.285 388.22 182.128 222.737)"
      >
        <stop />
        <stop offset={1} stopColor="#5e5e5e" />
      </linearGradient>
      <linearGradient
        id={scopedId("g9")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(21.016 0 0 5.336 210.117 111.279)"
      >
        <stop stopColor={colors.accent} />
        <stop offset={1} stopColor={colors.secondary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g10")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 8.765 -41.554 0 221.128 116.207)"
      >
        <stop />
        <stop offset={1} stopColor="#363636" />
      </linearGradient>
      <linearGradient
        id={scopedId("g11")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(21.016 0 0 5.328 210.117 111.288)"
      >
        <stop stopColor={colors.accent} />
        <stop offset={1} stopColor={colors.secondary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g12")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(-21.015 0 0 -5.336 150.609 111.279)"
      >
        <stop stopColor={colors.accent} />
        <stop offset={1} stopColor={colors.secondary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g13")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 8.765 -41.541 0 139.595 116.207)"
      >
        <stop />
        <stop offset={1} stopColor="#363636" />
      </linearGradient>
      <linearGradient
        id={scopedId("g14")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(-21.014 0 0 -5.328 150.609 111.288)"
      >
        <stop stopColor={colors.accent} />
        <stop offset={1} stopColor={colors.secondary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g15")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 -41.651 14.622 0 117.783 427.761)"
      >
        <stop stopColor="#171717" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g16")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 79.501 -57.684 0 232.983 319.92)"
      >
        <stop />
        <stop offset={1} stopColor="#363636" />
      </linearGradient>
      <linearGradient
        id={scopedId("g17")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(1.936 0 0 15.197 148.583 219.86)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#636466" />
      </linearGradient>
      <linearGradient
        id={scopedId("g18")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(2.878 0 0 6.678 148.739 234.478)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#636466" />
      </linearGradient>
      <linearGradient
        id={scopedId("g19")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 -11.233 28.736 0 137.104 249.759)"
      >
        <stop />
        <stop offset={0.52} stopColor="#212121" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g20")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 -10.089 10.482 0 151.919 250.158)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#636466" />
      </linearGradient>
      <linearGradient
        id={scopedId("g21")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 -12.444 31.824 0 216.619 249.303)"
      >
        <stop />
        <stop offset={0.52} stopColor="#212121" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g22")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 -10.273 10.665 0 197.292 249.788)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#636466" />
      </linearGradient>
      <linearGradient
        id={scopedId("g23")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(-12.877 0 0 -4.157 150.544 220.82)"
      >
        <stop />
        <stop offset={1} stopColor="#212121" />
      </linearGradient>
      <linearGradient
        id={scopedId("g24")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(31.375 0 0 92.684 181.274 189.811)"
      >
        <stop />
        <stop offset={1} stopColor="#212121" />
      </linearGradient>
      <linearGradient
        id={scopedId("g25")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(25.893 0 0 76.49 149.735 189.811)"
      >
        <stop stopColor="#212121" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g26")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(33.802 0 0 95.288 181.274 266.301)"
      >
        <stop stopColor={colors.accent} />
        <stop offset={0.27} stopColor={colors.primary} />
        <stop offset={0.48} stopColor={colors.secondary} />
        <stop offset={0.69} stopColor={colors.primary} />
        <stop offset={0.95} stopColor={colors.accent} />
      </linearGradient>
      <linearGradient
        id={scopedId("g27")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(33.796 0 0 95.288 141.831 266.301)"
      >
        <stop stopColor={colors.accent} />
        <stop offset={0.27} stopColor={colors.primary} />
        <stop offset={0.48} stopColor={colors.secondary} />
        <stop offset={0.69} stopColor={colors.primary} />
        <stop offset={0.95} stopColor={colors.accent} />
      </linearGradient>
      <linearGradient
        id={scopedId("g28")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(78.508 0 0 115.88 141.945 148.144)"
      >
        <stop stopColor={colors.accent} />
        <stop offset={0.27} stopColor={colors.primary} />
        <stop offset={0.48} stopColor={colors.secondary} />
        <stop offset={0.69} stopColor={colors.primary} />
        <stop offset={0.95} stopColor={colors.accent} />
      </linearGradient>
      <linearGradient
        id={scopedId("g29")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(19.227 0 0 19.22 168.455 178.566)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#636466" />
      </linearGradient>
      <linearGradient
        id={scopedId("g31")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 60.083 -19.009 0 277.51 27.751)"
      >
        <stop stopColor="#171717" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g32")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 12.785 -22.814 0 184.429 65.752)"
      >
        <stop stopColor={colors.secondary} />
        <stop offset={1} stopColor={colors.accent} />
      </linearGradient>
      <linearGradient
        id={scopedId("g33")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 12.821 -17.695 0 184.899 65.933)"
      >
        <stop stopColor={colors.secondary} />
        <stop offset={1} stopColor={colors.primary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g34")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 -76.49 79.591 0 145.532 142.289)"
      >
        <stop stopColor={colors.accent} />
        <stop offset={0.55} stopColor={colors.secondary} />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g35")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(10.453 .839 -1.413 17.596 195.64 77.266)"
      >
        <stop stopColor={colors.primary} />
        <stop offset={1} stopColor={colors.primary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g36")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(14.058 0 0 22.098 154.903 78.566)"
      >
        <stop stopColor={colors.primary} />
        <stop offset={1} stopColor={colors.primary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g37")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(185.194 79.131 66.474)scale(14.443 56.778)"
      >
        <stop stopColor={colors.primary} />
        <stop offset={1} stopColor={colors.primary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g38")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(20.817 -3.992 16.329 85.142 193.222 74.489)"
      >
        <stop stopColor={colors.primary} />
        <stop offset={1} stopColor={colors.primary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g39")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(14.408 -6.884 12.307 25.759 134.935 117.812)"
      >
        <stop stopColor={colors.secondary} />
        <stop offset={1} stopColor={colors.accent} />
      </linearGradient>
      <linearGradient
        id={scopedId("g40")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(199.198 119.764 49.931)scale(16.556 24.571)"
      >
        <stop stopColor={colors.secondary} />
        <stop offset={1} stopColor={colors.accent} />
      </linearGradient>
      <linearGradient
        id={scopedId("g41")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(250.169 118.278 29.103)scale(33.31 138.467)"
      >
        <stop offset={0.25} stopColor="#636466" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g42")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(250.169 118.4 28.96)scale(36.284 170.492)"
      >
        <stop offset={0.25} stopColor="#636466" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g43")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(247.151 119.289 23.324)scale(26.562 31.677)"
      >
        <stop />
        <stop offset={1} stopColor="#363636" />
      </linearGradient>
      <linearGradient
        id={scopedId("g44")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(-72.823 210.876 -76.798)scale(33.583 170.55)"
      >
        <stop offset={0.25} stopColor="#636466" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g45")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(-72.823 211.609 -77.345)scale(33.383 180.52)"
      >
        <stop offset={0.25} stopColor="#636466" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g46")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(-72.961 189.524 -65.616)scale(24.83 27.719)"
      >
        <stop />
        <stop offset={1} stopColor="#363636" />
      </linearGradient>
      <linearGradient
        id={scopedId("g47")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(116.35 71.21 133.611)scale(26.8 82.955)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#636466" />
      </linearGradient>
      <linearGradient
        id={scopedId("g48")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(116.35 75.326 130.615)scale(35.202 149.886)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#636466" />
      </linearGradient>
      <linearGradient
        id={scopedId("g49")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(67.75 -17.034 175.348)scale(23.865 69.18)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#636466" />
      </linearGradient>
      <linearGradient
        id={scopedId("g50")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(67.75 -14.595 170.62)scale(29.508 109.285)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#636466" />
      </linearGradient>
      <linearGradient
        id={scopedId("g51")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 9.622 -28.71 0 181.862 136.098)"
      >
        <stop offset={0.23} stopColor="#2b2b2b" />
        <stop offset={0.76} />
      </linearGradient>
      <linearGradient
        id={scopedId("g52")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 30.05 -93.839 0 181.618 130.815)"
      >
        <stop offset={0.09} stopColor="#636466" />
        <stop offset={0.45} stopColor="#a3a5a8" />
        <stop offset={0.71} stopColor="#636466" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g53")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 11.222 -11.231 0 163.899 141.412)"
      >
        <stop offset={0.25} stopColor="#171717" />
        <stop offset={1} stopColor="gray" />
      </linearGradient>
      <linearGradient
        id={scopedId("g54")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 8.308 -8.3 0 163.055 141.051)"
      >
        <stop stopColor="#292929" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g55")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 11.222 -11.231 0 202.546 141.412)"
      >
        <stop offset={0.25} stopColor="#171717" />
        <stop offset={1} stopColor="gray" />
      </linearGradient>
      <linearGradient
        id={scopedId("g56")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 8.308 -8.299 0 201.701 141.051)"
      >
        <stop stopColor="#292929" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g57")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 11.232 -11.24 0 183.127 141.41)"
      >
        <stop offset={0.25} stopColor="#171717" />
        <stop offset={1} stopColor="gray" />
      </linearGradient>
      <linearGradient
        id={scopedId("g58")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 8.308 -8.316 0 182.27 141.055)"
      >
        <stop stopColor="#292929" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g59")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(69.372 -34.441 158.37)scale(29.7 106.71)"
      >
        <stop />
        <stop offset={0.44} stopColor="#5e5e5e" />
        <stop offset={1} stopColor="#141414" />
      </linearGradient>
      <linearGradient
        id={scopedId("g60")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(6.332 17.444 -9.652 3.504 149.457 132.122)"
      >
        <stop stopColor="#141414" />
        <stop offset={0.56} stopColor="#5e5e5e" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g61")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(246.34 116.96 28.499)scale(10.386)"
      >
        <stop stopColor="#1a1a1a" />
        <stop offset={1} stopColor="#212121" />
      </linearGradient>
      <linearGradient
        id={scopedId("g63")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(70.194 -30 172.437)scale(9.29 16.158)"
      >
        <stop stopColor="#1a1a1a" />
        <stop offset={1} stopColor="#212121" />
      </linearGradient>
      <linearGradient
        id={scopedId("g64")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(70.26 -30.5 173.044)scale(7.944 15.053)"
      >
        <stop stopColor="#8c8c8c" />
        <stop offset={1} stopColor="#2e2e2e" />
      </linearGradient>
      <linearGradient
        id={scopedId("g65")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(-67.815 232.878 -84.384)scale(29.707 106.716)"
      >
        <stop />
        <stop offset={0.44} stopColor="#5e5e5e" />
        <stop offset={1} stopColor="#141414" />
      </linearGradient>
      <linearGradient
        id={scopedId("g66")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(7.208 -17.096 9.467 3.991 204.001 149.084)"
      >
        <stop stopColor="#141414" />
        <stop offset={0.56} stopColor="#5e5e5e" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g67")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(3.633 -8.556 14.868 6.314 216.378 145.506)"
      >
        <stop stopColor="#1a1a1a" />
        <stop offset={1} stopColor="#212121" />
      </linearGradient>
      <linearGradient
        id={scopedId("g68")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(3.109 -7.299 13.885 5.915 216.917 144.526)"
      >
        <stop stopColor="#8c8c8c" />
        <stop offset={1} stopColor="#2e2e2e" />
      </linearGradient>
      <linearGradient
        id={scopedId("g69")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(-66.51 220.424 -87.614)scale(8.74 8.09)"
      >
        <stop stopColor="#212121" />
        <stop offset={1} stopColor="#1a1a1a" />
      </linearGradient>
      <linearGradient
        id={scopedId("g70")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(113.79 64.03 145.396)scale(7.822 6.786)"
      >
        <stop stopColor="#8c8c8c" />
        <stop offset={1} stopColor="#2e2e2e" />
      </linearGradient>
      <linearGradient
        id={scopedId("g71")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(31.89 0 0 19.139 164.518 79.092)"
      >
        <stop />
        <stop offset={0.5} stopColor="#363636" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g72")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(43.196 0 0 28.199 157.84 94.013)"
      >
        <stop />
        <stop offset={0.5} stopColor="#363636" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g73")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(50.386 0 0 34.849 153.788 94.163)"
      >
        <stop />
        <stop offset={1} stopColor="#363636" />
      </linearGradient>
      <linearGradient
        id={scopedId("g76")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(8.254 -13.088 6.411 4.044 133.704 105.361)"
      >
        <stop offset={0.01} stopColor="#171717" />
        <stop offset={1} stopColor="#363636" />
      </linearGradient>
      <linearGradient
        id={scopedId("g77")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(-57.323 163.526 -71.242)scale(13.21 6.642)"
      >
        <stop offset={0.01} stopColor="#171717" />
        <stop offset={1} stopColor="#363636" />
      </linearGradient>
      <linearGradient
        id={scopedId("g78")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(22.878 0 0 17.871 127.088 91.492)"
      >
        <stop stopColor={colors.secondary} />
        <stop offset={1} stopColor={colors.primary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g79")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(-29.182 -7.096 4.625 -19.018 130.875 110.075)"
      >
        <stop stopColor={colors.primary} />
        <stop offset={1} stopColor={colors.secondary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g80")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(54.888 -16.11 142.804)scale(40.647 62.442)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g82")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(237.761 142.463 -9.875)scale(15.471 7.577)"
      >
        <stop offset={0.01} stopColor="#171717" />
        <stop offset={1} stopColor="#363636" />
      </linearGradient>
      <linearGradient
        id={scopedId("g83")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(237.324 141.315 -9.147)scale(13.208 6.635)"
      >
        <stop offset={0.01} stopColor="#171717" />
        <stop offset={1} stopColor="#363636" />
      </linearGradient>
      <linearGradient
        id={scopedId("g84")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(-22.877 0 0 -17.871 233.422 91.492)"
      >
        <stop stopColor={colors.secondary} />
        <stop offset={1} stopColor={colors.primary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g85")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(-13.668 574.054 -902.96)scale(30.043 19.57)"
      >
        <stop stopColor={colors.primary} />
        <stop offset={1} stopColor={colors.secondary} />
      </linearGradient>
      <linearGradient
        id={scopedId("g86")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(125.112 106.09 101.977)scale(40.638 62.416)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g87")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(0 -47.655 39.547 0 150.806 365.641)"
      >
        <stop stopColor={colors.secondary} />
        <stop offset={1} stopColor={colors.accent} />
      </linearGradient>
      <linearGradient
        id={scopedId("g88")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(45.301 0 0 4.175 156.865 322.135)"
      >
        <stop stopColor={colors.secondary} />
        <stop offset={1} stopColor={colors.accent} />
      </linearGradient>
      <linearGradient
        id={scopedId("g89")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(69.249 0 0 105.999 145.375 233.656)"
      >
        <stop />
        <stop offset={0.52} stopColor="#212121" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g90")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(69.24 0 0 346.628 145.375 233.66)"
      >
        <stop />
        <stop offset={0.52} stopColor="#212121" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g91")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(69.259 0 0 357.259 145.366 233.66)"
      >
        <stop />
        <stop offset={0.52} stopColor="#212121" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g92")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(69.273 0 0 22.835 145.362 235.063)"
      >
        <stop />
        <stop offset={0.52} stopColor="#212121" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g93")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(69.259 0 0 4.047 145.367 321.011)"
      >
        <stop />
        <stop offset={0.52} stopColor="#212121" />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id={scopedId("g94")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(109.468 76.849 134.34)scale(14.7 43.524)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g95")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="rotate(70.532 -9.595 146.498)scale(14.713 43.566)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id={scopedId("g96")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(-12.862 0 0 -7.955 150.544 220.82)"
      >
        <stop />
        <stop offset={1} stopColor="#212121" />
      </linearGradient>
      <linearGradient
        id={scopedId("g97")}
        x2={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(50.403 .622 -1.35 109.371 146.694 242.473)"
      >
        <stop stopColor="#fff" />
        <stop offset={0.75} stopColor="#fff" />
      </linearGradient>
      <radialGradient
        id={scopedId("g3")}
        cx={0}
        cy={0}
        r={1}
        href={`#${scopedId("P")}`}
        gradientTransform="matrix(4.6 0 0 4.6 208.244 358.787)"
      >
        <stop stopColor="#575757" />
        <stop offset={1} stopColor="#2b2b2b" />
      </radialGradient>
      <radialGradient
        id={scopedId("g6")}
        cx={0}
        cy={0}
        r={1}
        href={`#${scopedId("P")}`}
        gradientTransform="translate(214.427 352.601)scale(9.433)"
      >
        <stop stopColor="#5e5e5e" />
        <stop offset={1} />
      </radialGradient>
      <radialGradient
        id={scopedId("g30")}
        cx={0}
        cy={0}
        r={1}
        href={`#${scopedId("P")}`}
        gradientTransform="translate(178.071 188.173)scale(6.954)"
      >
        <stop stopColor="#575757" />
        <stop offset={1} stopColor="#2b2b2b" />
      </radialGradient>
      <radialGradient
        id={scopedId("g62")}
        cx={0}
        cy={0}
        r={1}
        href={`#${scopedId("P")}`}
        gradientTransform="translate(139.578 142.387)scale(3.65)"
      >
        <stop stopColor="#8c8c8c" />
        <stop offset={1} stopColor="#4a4a4a" />
      </radialGradient>
      <radialGradient
        id={scopedId("g74")}
        cx={0}
        cy={0}
        r={1}
        href={`#${scopedId("P")}`}
        gradientTransform="translate(194.357 110.099)scale(29.252)"
      >
        <stop stopColor="#363636" />
        <stop offset={1} />
      </radialGradient>
      <radialGradient
        id={scopedId("g75")}
        cx={0}
        cy={0}
        r={1}
        href={`#${scopedId("P")}`}
        gradientTransform="translate(151.897 100.346)scale(14.22)"
      >
        <stop stopColor="#171717" />
        <stop offset={1} stopColor="#231f20" />
      </radialGradient>
      <radialGradient
        id={scopedId("g81")}
        cx={0}
        cy={0}
        r={1}
        href={`#${scopedId("P")}`}
        gradientTransform="translate(208.616 100.346)scale(-14.22)"
      >
        <stop stopColor="#171717" />
        <stop offset={1} stopColor="#231f20" />
      </radialGradient>
    </defs>
    <style>
      {
        "\n    .d{fill:#231f20}.q{fill:#434345}.G,.s{opacity:.5}.s{fill:#231f20}.G{mix-blend-mode:multiply;fill:#f7901e}.K{fill:#141414}.L,.M{opacity:.2;fill:#fff}.M{opacity:.3}.R{fill:#f47920}.aC{opacity:.5;mix-blend-mode:multiply;fill:#ffc20e}.aT{fill:#fff}\n  "
      }
    </style>
    <path
      d="m219.8 349.9-.2-2-3.4-3.1-6.4-34.4-17.1 5.3s2 16.6 2.4 21.2c.4 4.5 1.9 17.2 4.2 20.6 1 2.6 4.9 4.6 9.4 4.6 4.8 0 8.2-2.7 9.6-4.9v-.1c1.6-2.3 1.8-4.7 1.5-7.2"
      style={{
        fill: `url(#${scopedId("g1")})`,
      }}
    />
    <path
      fillRule="evenodd"
      d="M208.7 362c-4 0-7.3-2-7.3-4.4s3.3-4.4 7.3-4.4c4.1 0 7.4 2 7.4 4.4s-3.3 4.4-7.4 4.4"
      style={{
        fill: `url(#${scopedId("g2")})`,
      }}
    />
    <path
      fillRule="evenodd"
      d="M208.2 361.8c-3.1 0-5.7-1.3-5.7-3s2.6-3.1 5.7-3.1c3.2 0 5.8 1.4 5.8 3.1s-2.6 3-5.8 3"
      style={{
        fill: `url(#${scopedId("g3")})`,
      }}
    />
    <path
      className="d"
      d="M211.6 358.8c0 .9-1.3 1.6-2.9 1.6s-2.9-.7-2.9-1.6c0-.8 1.3-1.5 2.9-1.5s2.9.7 2.9 1.5"
    />
    <path
      d="M210.6 349.5c3.5-.4 6.8.1 9.3 1.1q0-.3-.1-.7l-.2-2-3.4-3.1-6.4-34.4-17.1 5.3s2 16.6 2.4 21.2c.4 4.1 1.6 15 3.6 19.5 1.3-3.4 6-6.2 11.9-6.9"
      style={{
        opacity: 0.5,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g4")})`,
      }}
    />
    <path
      d="M205.2 340.2c2 4.2 3.9 8.6 4.9 7.8 0-.2 8.3-2.7 8.2-2.9l-.3-2-3.4-3.1-6.3-34.4-17.1 5.3s2 16.6 2.4 21.2c.4 4.1 1.6 15 3.6 19.5 1.6 4.8 5.4-16.7 8-11.4"
      style={{
        opacity: 0.5,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g5")})`,
      }}
    />
    <path
      d="M220 346.6s-4.2-3.5-10.4-1.6l.4 3c7.1-1.9 10.1 1.9 10.1 1.9 2-2-.1-3.3-.1-3.3"
      style={{
        fill: `url(#${scopedId("g6")})`,
      }}
    />
    <path
      d="M220 346.6s-.8-33.4-2.4-44.2c-1.7-10.8-3.2-26.9-4.6-39.6-1.3-12.7-2.1-14.1-7.6-14-5.4.2-7.4 3.2-7.4 3.2l7.9 65.1 3.7 27.9c6.2-1.9 10.4 1.6 10.4 1.6"
      style={{
        fill: `url(#${scopedId("g7")})`,
      }}
    />
    <path
      d="M214.1 328.5c-.7-6.5-3.9-53-6-69.2-.7-4.8.4-7.5 2.3-8.9-1-1.4-2.5-1.6-5-1.6-5.4.2-7.4 3.2-7.4 3.2l7.9 65.1 3.7 27.9c6.2-1.9 10.4 1.6 10.4 1.6v-1.5c-5.1.2-5.2-11.1-5.9-16.6"
      style={{
        opacity: 0.3,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g8")})`,
      }}
    />
    <path
      d="M231.1 116.6v-1c0-.5.2-1.4-2.5-2.3s-5.2-1.7-6.1-1.9-7.1-.1-7.1-.1h-5.3l.1 5.3z"
      style={{
        fill: `url(#${scopedId("g9")})`,
      }}
    />
    <path
      d="M231.1 116.6v3.2c0 .7-.5 1.2-1.2 1.2h-18.5c-.7 0-1.2-.5-1.2-1.2v-3.2z"
      style={{
        fill: `url(#${scopedId("g10")})`,
      }}
    />
    <path
      className="d"
      d="M231.6 116.8c0 .2-.2.4-.5.4h-14.8c-.3 0-.5-.2-.5-.4 0-.3.2-.5.5-.5h14.8c.3 0 .5.2.5.5"
    />
    <path
      d="M218.7 113.2q0-1 .4-1.9h-9l.1 5.3h20.9v-1.5c-3.8 1-12.3.8-12.4-1.9"
      style={{
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g11")})`,
      }}
    />
    <path
      d="M129.6 116.6v-1c0-.5-.2-1.4 2.5-2.3s5.3-1.7 6.1-1.9c.9-.2 7.1-.1 7.1-.1h5.3l-.1 5.3z"
      style={{
        fill: `url(#${scopedId("g12")})`,
      }}
    />
    <path
      d="M129.6 116.6v3.2c0 .7.5 1.2 1.2 1.2h18.5c.7 0 1.2-.5 1.2-1.2v-3.2z"
      style={{
        fill: `url(#${scopedId("g13")})`,
      }}
    />
    <path
      className="d"
      d="M129.1 116.8c0 .2.2.4.5.4h14.9c.2 0 .4-.2.4-.4 0-.3-.2-.5-.4-.5h-14.9c-.3 0-.5.2-.5.5"
    />
    <path
      d="M142 113.2q0-1-.4-1.9h9l-.1 5.3h-20.9v-1.5c3.8 1 12.3.8 12.4-1.9"
      style={{
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g14")})`,
      }}
    />
    <path
      className="d"
      d="M169.7 416.1c0 6 4.2 10.8 9.5 10.8 5.2 0 9.5-4.8 9.5-10.8l-.1-44.9-19-.1z"
    />
    <path
      d="M171.5 418.6c0 4.6 3.4 8.3 7.6 8.3 4.1 0 7.5-3.7 7.5-8.3v-34.7h-15.1z"
      style={{
        fill: `url(#${scopedId("g15")})`,
      }}
    />
    <path
      className="q"
      d="M178.5 425.2q.1-.3.3-.5c.1-.2.2-.3.3-.5l.6-.9.6-1q.3-.4.7-.9.7-.8 1.6-1.6c.5-.4 1.1-.9 1.7-1.3-.1.3-.2.7-.4 1-.2.4-.3.7-.5 1l-1.4 1.8v-.1c-.4.6-.9 1.2-1.5 1.7q-.4.4-.9.8-.3.1-.6.3-.2.1-.5.2m-2.1-1.6q.1-.2.3-.4.2-.3.3-.5l.2-.4q.2-.3.3-.5l.2-.4.3-.5q.2-.5.5-1l.2-.2.2-.2.3-.5q.4-.4.7-.8.4-.4.8-.7.3-.4.7-.8h.1c.1-.1.2-.2.3-.4l.2-.2h.1c.1-.1.1 0 .1 0-.1 0-.1.1-.1.1v.3c-.1.2-.1.3-.2.5q-.1.3-.2.5c-.1.2-.1.4-.2.5-.2.4-.4.7-.6 1q-.3.4-.7.8l-.3.5-.1.2-.2.2c-.4.5-.8 1.1-1.3 1.7q-.4.4-.9.7-.2.2-.5.4-.2.1-.5.1m.8-3.4s-.4-.3-1-.8q-.5-.5-.9-1c-.3-.5-.6-.9-.9-1.4q-.2-.3-.4-.7c-.1-.1-.1-.2-.2-.3q-.1-.2-.1-.3c-.3-.5-.5-.9-.6-1.3q-.1-.3-.1-.6-.1-.2-.1-.4c0-.2 0-.3.1-.3v-.1s0 .1.2.3q.2.3.6.7t.9 1q.1.2.2.3l.2.4.4.6.8 1.4q.3.7.5 1.2c.3.8.4 1.3.4 1.3m2-3.5s-.2-.1-.4-.3-.4-.5-.7-.8l-1-1.2q-.5-.7-1-1.5l-.4-.8q-.3-.4-.4-.7-.2-.5-.4-.8-.1-.4-.2-.7l-.2-.6-.2-.4q-.1-.1-.1-.2l-.1-.1h.1c.1 0 .2.1.3.1.1.1.3.2.4.3l.5.5.4.6q.2.3.5.6c.1.3.3.5.5.8q.2.3.5.7l.8 1.6q.4.7.6 1.4c.2.4.3.8.4 1 0 .3.1.5.1.5m-.3-4.2s.2-.6.7-1.3c.2-.4.5-.8.8-1.2q.5-.6 1.1-1.3c.2-.2.3-.4.5-.6l.6-.6q.3-.2.5-.5c.2-.1.3-.3.5-.4.6-.6 1.1-1 1.1-1s-.1.6-.5 1.4c-.1.2-.1.4-.3.6q-.2.4-.4.7c-.3.4-.6.9-1 1.3q-.6.7-1.2 1.2-.6.6-1.1.9c-.7.5-1.3.8-1.3.8m-1.2-3.2q.4-.8.9-1.6.5-.7.9-1.4l1-1.4 1-1.4h-.1c.1-.1.2-.1.2-.2l.1-.2q.2-.2.3-.4.3-.3.6-.7.3-.3.7-.6l.3-.3.4-.4q0 .1-.1.3 0 .1-.1.2 0 .2-.1.4-.2.5-.4.9c-.1.3-.2.5-.4.8l-.2.4-.1.2c0 .1 0 .2-.1.2v.1q-.4.7-.9 1.4t-1.1 1.4-1.3 1.3q-.7.5-1.5 1m.2-3.5q-.5-.4-.9-.8l-.4-.4-.4-.4c-.3-.3-.5-.6-.7-.9q-.3-.4-.7-.9-.2-.5-.5-1l-.6-1-.9-2.1v-.1l-.1-.1v-.2q-.1-.2-.1-.3v-.1s0-.1.1-.1h.1v.1h-.1c0-.1 0 0 .1 0l.1.2.2.2.1.1.1.1q.8.8 1.5 1.7c.1.1.2.3.3.5l.3.4.6 1q.2.5.5.9c.1.4.3.7.5 1q.1.3.3.6.1.2.2.5.2.5.4 1.1m2.1-3.4q-.8-.5-1.4-1-.3-.4-.6-.7t-.5-.7q-1-1.4-1.7-3v.1c-.1-.2-.2-.5-.4-.7q-.2-.3-.4-.7l-.2-.4q0-.2-.1-.5 0-.1-.1-.2v-.1l-.1-.2v-.2h.1l.1.1h-.1c0-.1 0 0 0 0q.1 0 .2.1l.2.2q0 .1.1.1.1.2.3.3.1.2.3.3c.1.2.3.4.5.6q.3.2.6.6 1 1.5 1.7 3 .4.7.7 1.5.5.7.8 1.5m-.6-3.6q.3-.6.6-1.1t.6-.9c.5-.6 1.1-1.2 1.7-1.7q.9-.8 1.8-1.5t2-1.2v-.1h.1v.1h.1l-.1.1h-.1v-.1h.1s0-.1 0 0q-.1 0 0 .1-.6 1-1.4 2-.7.8-1.6 1.6l-1.8 1.4c-.6.5-1.3.9-2 1.3m-1.5-2 .6-1.2q.3-.6.7-1.1.3-.5.8-1.1.3-.4.8-.9l.8-1q.2-.2.4-.5l.4-.4q.9-1 1.9-1.8c0-.1 0-.1.1-.1l.1-.1.2-.1.2-.1v-.1.1s.1 0 0 0h-.1l.1-.1h.1v.2q-.1.1-.1.2l-.1.2-.1.1v.1q-.6 1.2-1.4 2.2l-.3.5c-.1.2-.3.4-.4.6l-.8 1q-.5.4-.9.9l-1 .8q-.2.2-.5.4c-.1.2-.3.3-.4.5-.4.3-.7.5-1.1.8"
      style={{
        opacity: 0.5,
      }}
    />
    <path
      d="M149.7 319.6s2.6 13.3 6.3 20.6c3.8 7.3 6.3 26.7 9.3 37.3 3 10.7 3.8 21.4 13.1 21.3 9.3.1 10.1-10.6 13.1-21.3 3-10.6 5.5-30 9.3-37.3s6.3-20.6 6.3-20.6z"
      style={{
        fill: `url(#${scopedId("g16")})`,
      }}
    />
    <path
      className="s"
      d="M163.7 346.6c1.9 6.6 3.4 16.9 5.2 23.1 2.2 7.7 2.8 15.5 9.5 15.4 6.8.1 7.3-7.7 9.5-15.4 1.6-5.7 3-14.8 4.7-21.4-9.6-.6-19.3-1.3-28.9-1.7"
    />
    <path
      className="s"
      d="M159.3 336.9c2.5 5.6 4.5 14.4 6.8 19.6 2.8 6.6 3.6 13.2 12.3 13.1h.1c8.8.1 9.5-6.5 12.4-13.1 2.1-4.8 3.9-12.6 6.1-18.1-12.5-.6-25.1-1.1-37.7-1.5m24.4 49.5c-1.2 1.2-3.1 2-4.8 2.1-1.7-.1-3.6-.9-4.9-2.1-1.3-1.3-3.2-2.3-3.1.1s1.5 8.8 7.9 9l.1-.1v.1c6.5-.2 7.8-6.6 7.9-9s-1.8-1.4-3.1-.1"
    />
    <path
      d="M166.9 364.8c-3.8-19-7.6-39.6-8.6-45.2h-8.6s2.6 13.3 6.3 20.6c3.8 7.3 6.3 26.7 9.3 37.3 1 3.4 1.7 6.8 2.5 9.8.9-5.5 1.1-13-.9-22.5m22.9 0c-1.9 9.5-1.7 17-.9 22.6.9-3.1 1.6-6.5 2.6-9.9 3-10.6 5.5-30 9.3-37.3s6.3-20.6 6.3-20.6h-8.6c-1 5.6-4.8 26.2-8.7 45.2"
      style={{
        fill: "#231f20",
        opacity: 0.2,
      }}
    />
    <path
      d="m148.6 219.9.5 14.6c.1.3.3.6.7.6l.1-.1c.4 0 .6-.3.6-.6l-.5-14.5z"
      style={{
        fill: `url(#${scopedId("g17")})`,
      }}
    />
    <path
      d="M148.7 234.5v6.7h2.9v-6.7z"
      style={{
        fill: `url(#${scopedId("g18")})`,
      }}
    />
    <path
      d="M131.2 241c-1.4 0-2.6 1.3-2.6 3v1.8c0 1.7 1.2 3 2.6 3h17.5V241z"
      style={{
        fill: `url(#${scopedId("g19")})`,
      }}
    />
    <path
      d="M157.1 241h-5.5v7.8h5.5c1.5 0 2.7-1.3 2.7-3V244c0-1.7-1.2-3-2.7-3"
      style={{
        fill: `url(#${scopedId("g20")})`,
      }}
    />
    <path className="d" d="M148.7 241v7.8h2.9V241z" />
    <path
      d="M225.5 241c1.5 0 2.8 1.3 2.8 3v1.8c0 1.7-1.3 3-2.8 3h-17.4V241z"
      style={{
        fill: `url(#${scopedId("g21")})`,
      }}
    />
    <path
      d="M199.7 241h5.5v7.8h-5.5c-1.5 0-2.7-1.3-2.7-3V244c0-1.7 1.2-3 2.7-3"
      style={{
        fill: `url(#${scopedId("g22")})`,
      }}
    />
    <path className="d" d="M208.1 241v7.8h-2.9V241z" />
    <path
      d="M150.2 220.2c0 .3-.3.6-.7.6h-10.8c-.4 0-.6-.3-.6-.6v-2.7c0-.3.2-.6.6-.6h10.8c.4 0 .7.3.7.6z"
      style={{
        fill: `url(#${scopedId("g23")})`,
      }}
    />
    <path
      d="M204.6 263.9c-1.6-7.1 2.6-70.4 2.6-70.4l-25.9-3.7v76.5h24q-.5-1.4-.7-2.4"
      style={{
        fill: `url(#${scopedId("g24")})`,
      }}
    />
    <path
      d="M149.7 193.5s4.2 63.3 2.6 70.4q-.2 1-.7 2.4h24v-76.5z"
      style={{
        fill: `url(#${scopedId("g25")})`,
      }}
    />
    <path
      d="M205.3 266.3h-24v95.3c5.1-.6 9.1-5.3 9.1-5.3 25.1-43.9 24.7-56.2 24.7-61.9 0-5.1-7.2-20-9.8-28.1"
      style={{
        fill: `url(#${scopedId("g26")})`,
      }}
    />
    <path
      d="M141.8 294.4c0 5.7-.4 18 24.7 61.9 0 0 4 4.7 9.1 5.3v-95.3h-24c-2.6 8.1-9.8 23-9.8 28.1"
      style={{
        fill: `url(#${scopedId("g27")})`,
      }}
    />
    <path
      d="M206.9 158.6c-5.9-13.6-26.6-10-26.6-10h-2.6s-19.5-3.6-25 10c0 0-7.6 21.2-6.7 32 .7 9.6 12.8 42.2 18.4 49.5 1.8 2.4 4.2 4.7 6.9 6.3 2.5 1.9 5.1 2.6 7.7 2.5 1.3 0 2.7-.2 4-.7 4.5-1.4 8.7-4.7 11.5-8.1 5.9-7.3 18.8-39.9 19.6-49.5.9-10.8-7.2-32-7.2-32"
      style={{
        fill: `url(#${scopedId("g28")})`,
      }}
    />
    <path
      fillRule="evenodd"
      className="G"
      d="M178 199.2c-6.2 0-11.1-5-11.1-11.1 0-6.2 4.9-11.2 11.1-11.2s11.2 5 11.2 11.2c0 6.1-5 11.1-11.2 11.1"
    />
    <path
      fillRule="evenodd"
      d="M178 198.3c-5.6 0-10.1-4.5-10.1-10.1s4.5-10.1 10.1-10.1 10.1 4.5 10.1 10.1-4.5 10.1-10.1 10.1"
      style={{
        mixBlendMode: "multiply",
        fill: "#f7901e",
      }}
    />
    <path
      fillRule="evenodd"
      d="M178.1 197.8c-5.3 0-9.6-4.3-9.6-9.6s4.3-9.6 9.6-9.6 9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6"
      style={{
        fill: `url(#${scopedId("g29")})`,
      }}
    />
    <path
      fillRule="evenodd"
      d="M178.1 195.1c-3.9 0-7-3.1-7-6.9 0-3.9 3.1-7 7-7 3.8 0 6.9 3.1 6.9 7 0 3.8-3.1 6.9-6.9 6.9"
      style={{
        fill: `url(#${scopedId("g30")})`,
      }}
    />
    <path d="M183.5 188.2c0-3-2.4-5.5-5.4-5.5-3.1 0-5.5 2.5-5.5 5.5z" />
    <path
      fillRule="evenodd"
      className="K"
      d="M178.1 194c-3.2 0-5.8-2.6-5.8-5.8q0-.1.1-.2t.2-.1h10.9q.2 0 .3.1v.2c0 3.2-2.6 5.8-5.7 5.8m-5.2-5.5c.2 2.7 2.4 4.9 5.2 4.9 2.7 0 5-2.2 5.1-4.9z"
    />
    <path
      className="L"
      d="M174.3 189.1c0 1.9 1.6 3.5 3.6 3.5 1.9 0 3.5-1.6 3.5-3.5z"
    />
    <path
      className="K"
      d="M181.9 188.3c0-2.1-1.7-3.8-3.9-3.8-2.1 0-3.8 1.7-3.8 3.8z"
    />
    <path
      className="M"
      d="M184 169.7c-3.2-2.1-5.8-2.5-9.2-.5-2.6 1.5-5 3.3-7.2 5.3q-1 .8-1.8 1.7-.7.9-1.3 1.9c-.5.9-.8 2.1-.8 3.1 0 1.9 1.9.9 2.8.4.9-.6 1.8-1.2 2.7-1.9 2.9-2.4 5.8-4 9.5-4.2 2.9-.1 6 1.1 7.8 3.1 1.2 1.2 5.6 5.4 6.2 3.9 1.6-3.7-5.8-10.9-8.7-12.8"
    />
    <path
      className="L"
      d="M194.8 192.4c-1.8.4-3.5 1.8-4.8 3-2.3 2.1-3.8 5-6.5 6.7-3.9 2.5-10.5 2.3-13.7-1.4-2.3-2.8-9.2-12.9-13.6-11.7-2.2.6-3.8 4.2 2.5 22.4 2.5 6.9 7.2 14 13.7 17.9 3.3 2 7.6 2.4 10.9.3 3-1.9 5.2-4.9 7.1-7.8 3.8-5.4 14.4-32.1 4.4-29.4"
    />
    <path
      d="M188.7 39.8c0-6-4.3-10.8-9.6-10.8-5.2 0-9.5 4.8-9.5 10.8l.1 44.9h19z"
      style={{
        fill: "#171717",
      }}
    />
    <path
      d="M186.8 37.3c0-4.6-3.4-8.3-7.6-8.3-4.1 0-7.5 3.7-7.5 8.3 0 .3-.3 29.9-2 41.4-1.5 10.2 21.6 21.6 19.4.5-2.7-21.2-2.3-41.5-2.3-41.9"
      style={{
        fill: `url(#${scopedId("g31")})`,
      }}
    />
    <path
      className="q"
      d="M179.8 30.7q-.1.3-.3.5-.2.3-.3.5l-.6.9-.6 1q-.3.4-.7.9-.7.8-1.6 1.5c-.5.5-1.1 1-1.7 1.4l.4-1c.2-.4.3-.7.6-1q.6-1 1.3-1.8v.1c.4-.6.9-1.2 1.5-1.7q.4-.4.9-.8.3-.1.6-.3.2-.1.5-.2m2.1 1.6q-.1.2-.3.4t-.3.5l-.2.4q-.1.2-.3.5l-.2.4-.3.5q-.2.5-.5 1l-.2.2-.2.2-.3.5q-.3.4-.7.8t-.8.7q-.3.4-.7.8c-.1.1-.3.2-.4.3l-.2.2q0 .1-.1.1c0 .1-.1 0-.1 0 .1 0 .1-.1.1-.2v-.2c.1-.2.1-.3.2-.5q.1-.3.2-.5.1-.3.3-.5.2-.5.5-1 .3-.4.7-.9l.3-.4.1-.2.2-.2c.4-.5.8-1.2 1.3-1.7q.4-.4.9-.8.2-.1.5-.3.2-.1.5-.1m-.8 3.3s.4.4 1 .9q.5.5.9 1 .5.7.9 1.4.2.3.4.7c.1.1.1.2.2.3q.1.2.2.3c.2.5.4.9.5 1.3q.1.3.1.6.1.2.1.4v.3l-.1.1s0-.1-.2-.3c-.1-.2-.3-.4-.6-.7q-.4-.4-.8-1-.2-.2-.3-.4c-.1-.1-.1-.2-.2-.3l-.4-.6-.8-1.4q-.3-.7-.5-1.2c-.3-.8-.4-1.4-.4-1.4m-1.9 3.6.3.3q.3.3.7.8.5.5 1 1.2t1 1.5l.4.8q.3.4.4.7l.4.8q.1.4.2.7t.2.5q.1.3.2.5l.2.2v.1h-.1c-.1 0-.2-.1-.3-.1-.1-.1-.3-.2-.4-.4q-.2-.1-.5-.4l-.4-.6q-.2-.3-.5-.7-.2-.3-.5-.7-.2-.3-.5-.7l-.8-1.6c-.2-.5-.5-1-.6-1.4q-.3-.6-.3-1zm.2 4.2s-.2.6-.7 1.3l-.8 1.2q-.5.6-1.1 1.2-.2.4-.5.7t-.6.5q-.2.3-.5.6-.3.2-.5.4c-.6.6-1.1 1-1.1 1s.1-.6.5-1.4l.3-.6q.2-.4.4-.7c.3-.4.6-.9 1-1.3q.6-.7 1.2-1.2.6-.6 1.1-.9c.7-.5 1.3-.8 1.3-.8m1.2 3.2q-.4.8-.9 1.6-.4.7-.9 1.4l-1 1.4q-.4.7-1 1.4h.1l-.2.2-.1.2-.3.3c-.2.3-.4.5-.6.7q-.3.4-.7.7-.1.2-.3.3c-.1.2-.3.2-.4.4q0-.2.1-.3 0-.1.1-.2 0-.2.1-.4.2-.5.4-.9l.4-.8.2-.4.1-.2c0-.1.1-.2.1-.2v-.1q.4-.7.9-1.4.6-.8 1.1-1.4.6-.7 1.3-1.3.7-.5 1.5-1m-.2 3.5q.5.4.9.8l.4.4.4.4c.3.3.5.5.7.9q.4.4.7.9l.6 1 .5 1c.3.6.6 1.4.9 2.1v.1l.1.1v.2q.1.2.1.3v.1s0 .1-.1.1l-.1-.1h.1-.1l-.1-.2-.2-.2-.1-.1-.1-.1q-.8-.8-1.5-1.7c-.1-.1-.2-.3-.3-.5l-.3-.4-.6-1q-.2-.5-.5-1l-.5-1q-.1-.2-.2-.5c-.1-.1-.2-.3-.3-.5q-.2-.5-.4-1.1m-2 3.3q.7.5 1.3 1.1.3.3.6.7.3.3.5.7 1 1.4 1.7 3v-.1q.2.3.4.7.2.3.4.7l.2.4q.1.2.1.5 0 .1.1.2v.1l.1.2v.1l-.1.1-.1-.1h.1s.1 0 0 0q-.1 0-.2-.1l-.2-.2q0-.1-.1-.1-.1-.2-.3-.3-.1-.2-.3-.3-.2-.3-.5-.6l-.6-.6q-1-1.5-1.7-3-.4-.7-.7-1.5-.4-.7-.7-1.6m.5 3.7c-.2.4-.4.7-.6 1.1q-.3.5-.6.9c-.5.6-1.1 1.2-1.7 1.7q-.8.8-1.8 1.5c-.6.4-1.2.8-2 1.2v.1h-.1v-.1q-.1 0-.1-.1h.2v.1h-.1.1l-.1-.1h.1-.1q.6-1 1.4-2l1.6-1.6 1.8-1.4c.7-.5 1.3-.9 2-1.3m1.5 2-.6 1.2q-.3.6-.7 1.1-.3.5-.7 1l-.8 1q-.4.5-.9 1l-.4.4-.4.5c-.6.6-1.2 1.2-1.9 1.8 0 .1 0 .1-.1.1l-.1.1-.2.1-.2.1v.1-.1h.1l-.1.1h-.1v-.2q.1-.1.1-.2l.2-.2v-.1s.1-.1 0-.1h.1q.5-1.2 1.3-2.2l.3-.5.4-.6q.4-.5.9-1 .4-.4.8-.9l1-.8q.2-.3.5-.5.2-.2.5-.4.4-.4 1-.8"
      style={{
        opacity: 0.5,
      }}
    />
    <path
      d="M166 81.6h28l.1-.1c-.5-1.7-3.2-7.5-8.2-12.9-2-2-3.9-2.8-5.9-2.8-1.9 0-3.9.8-5.8 2.8-5.1 5.4-7.7 11.2-8.2 12.9q-.1 0 0 .1"
      style={{
        fill: `url(#${scopedId("g32")})`,
      }}
    />
    <path
      d="M170.1 80h19.4v-.2c-.3-1.4-2.2-6.6-5.7-11.4-1.3-1.9-2.7-2.6-4-2.5-1.3-.1-2.7.6-4 2.5-3.5 4.8-5.3 10-5.7 11.4z"
      style={{
        fill: `url(#${scopedId("g33")})`,
      }}
    />
    <path
      className="R"
      d="M182.3 66.2q-1.1-.4-2.3-.4-1.4 0-2.8.6c.1 3.7.1 9.1-.8 15.2h6.8c-1-6.4-1.1-11.8-.9-15.4"
    />
    <path
      d="M215.5 98.3c-3.4-7.5-24-22.1-34.6-23.3-.5 0-.9-.1-1.5 0-10.6 1.2-31.1 15.8-34.6 23.3-3.5 7.7-1.7 29.2-1.7 29.2l2.8 2.7s8.8 9 10.6 12.2c3.5 6.2 43.8 6.2 47.3 0 1.5-2.6 10.6-12.2 10.6-12.2l2.8-2.7s1.8-21.5-1.7-29.2"
      style={{
        fill: `url(#${scopedId("g34")})`,
      }}
    />
    <path
      d="M203.6 97.9c-.3-4.3-.1-8.5.2-11.6-3.6-2.6-7.5-5.1-11.2-7.1 1.1 3.2 2.6 6.8 4.3 10.5 4.5 9.6 7.1 16.3 6.7 8.2"
      style={{
        opacity: 0.5,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g35")})`,
      }}
    />
    <path
      d="M164.1 88.3c1.9-3.6 3.6-6.9 4.9-9.7-4 2-8 4.6-11.6 7.3-.6 3.6-1.3 7.8-2.1 11.4-1.9 8.1 3.7.3 8.8-9"
      style={{
        opacity: 0.5,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g36")})`,
      }}
    />
    <path
      d="M154.3 88.1c-4.6 3.7-8.2 7.4-9.5 10.2-3.5 7.7-1.7 29.2-1.7 29.2l2.8 2.7s.9.9 2.1 2.2c1.2-7.7 4.3-16.3 6-24.2 1.5-7.4 1.1-14.7.3-20.1"
      style={{
        opacity: 0.5,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g37")})`,
      }}
    />
    <path
      d="M215.5 98.3c-1.4-3.1-5.6-7.2-10.7-11.2-.4 5.3-.3 12.8 1.3 20.6 1.7 8.5 4.5 18 4.9 26.2 1.9-2.1 3.4-3.7 3.4-3.7l2.8-2.7s1.8-21.5-1.7-29.2"
      style={{
        opacity: 0.5,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g38")})`,
      }}
    />
    <path
      d="M142.7 117.2c0 5.7.4 10.3.4 10.3l2.8 2.7 1.3 1.3h3.5c3.6-8.2-1.4-12.3-8-14.3"
      style={{
        fill: `url(#${scopedId("g39")})`,
      }}
    />
    <path
      d="M217.2 127.5s.4-5 .5-11c-8.1 1.5-15.4 5.5-11.2 15h6.7c.7-.8 1.2-1.3 1.2-1.3z"
      style={{
        fill: `url(#${scopedId("g40")})`,
      }}
    />
    <path
      d="M114.5 141.5c-4.1 0-7.4-1.1-7.6-1.2-1.1-.3-1.7-1.5-1.4-2.6.4-1.2 1.6-1.8 2.7-1.4.1 0 6.5 2.1 11.9-.1 1.9-.7 4.1-1.7 6.5-2.7 5.9-2.6 11.9-5.3 15.9-5.7 1.2-.2 6.7-1.4 10.7.5 1 .5 1.5 1.8 1 2.8-.5 1.1-1.8 1.6-2.8 1-2.4-1.1-6.7-.4-8-.1h-.4c-3.2.3-9.6 3.1-14.7 5.4-2.4 1-4.7 2-6.6 2.8-2.5.9-5 1.3-7.2 1.3"
      style={{
        fill: `url(#${scopedId("g41")})`,
      }}
    />
    <path
      d="M153.3 128.4q0 .4-.2.8c-.5 1.1-1.7 1.5-2.8 1-2.4-1.1-6.7-.4-8-.1h-.3c-3.3.3-9.6 3.1-14.7 5.4-2.5 1-4.7 2.1-6.7 2.8-2.4.9-4.9 1.3-7.2 1.3-4.1 0-7.4-1.1-7.6-1.2q-.2 0-.4-.1c0 .9.6 1.7 1.5 2 .2.1 3.5 1.2 7.6 1.2 2.2 0 4.7-.4 7.2-1.3 1.9-.8 4.2-1.8 6.6-2.8 5.1-2.3 11.5-5.1 14.7-5.4h.4c1.3-.3 5.6-1 8 .1 1 .6 2.3.1 2.8-1 .5-1 .1-2.1-.9-2.7"
      style={{
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g42")})`,
      }}
    />
    <path
      d="m148.2 140.6-2.3-2-2.8-11.1 11-3.8 5.1 3.2 1.1 7.5z"
      style={{
        fill: `url(#${scopedId("g43")})`,
      }}
    />
    <path
      d="M245.7 141.5c4.1 0 7.4-1.1 7.6-1.2 1.1-.3 1.7-1.5 1.3-2.6-.3-1.2-1.5-1.8-2.7-1.4 0 0-6.4 2.1-11.9-.1-1.8-.7-4.1-1.7-6.4-2.7-5.9-2.6-12-5.3-16-5.7-1.1-.2-6.7-1.4-10.6.5-1.1.5-1.5 1.8-1 2.8.5 1.1 1.7 1.6 2.8 1 2.4-1.1 6.7-.4 8-.1h.3c3.3.3 9.6 3.1 14.7 5.4 2.5 1 4.8 2 6.7 2.8 2.4.9 4.9 1.3 7.2 1.3"
      style={{
        fill: `url(#${scopedId("g44")})`,
      }}
    />
    <path
      d="M254.5 137.3c-.3.4-.7.8-1.2 1-.2.1-3.5 1.1-7.6 1.1-2.3 0-4.8-.3-7.2-1.2-1.9-.8-4.2-1.8-6.7-2.9-5.1-2.2-11.4-5.1-14.7-5.3q-.1 0-.3-.1c-1.3-.3-5.6-.9-8 .2-1 .5-2.2.1-2.8-.9-.3.6-.3 1.3 0 1.9.5 1.1 1.7 1.6 2.8 1 2.4-1.1 6.7-.4 8-.1h.3c3.3.3 9.6 3.1 14.7 5.4 2.5 1 4.8 2 6.7 2.8 2.4.9 4.9 1.3 7.2 1.3 4.1 0 7.4-1.1 7.6-1.2 1.1-.3 1.7-1.5 1.3-2.6q0-.2-.1-.4"
      style={{
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g45")})`,
      }}
    />
    <path
      d="m212 140.6 2.2-2 2.8-11.1-11-3.8-5 3.2-1.2 7.5z"
      style={{
        fill: `url(#${scopedId("g46")})`,
      }}
    />
    <path
      d="M216.2 147.6q-.8 0-1.6-.4l-14.7-6.9c-1.8-.9-2.6-3-1.7-4.9.8-1.8 3-2.6 4.8-1.7l14.7 6.9c1.9.9 2.6 3.1 1.8 4.9-.6 1.3-1.9 2.1-3.3 2.1"
      style={{
        fill: `url(#${scopedId("g47")})`,
      }}
    />
    <path
      d="m215.6 144.8-14.7-7c-1.4-.6-2.1-1.9-2.1-3.3q-.4.4-.6.9c-.9 1.9-.1 4 1.7 4.9l14.7 6.9q.8.4 1.6.4c1.4 0 2.7-.8 3.3-2.1q.3-.7.3-1.5c-.7.7-1.6 1.1-2.6 1.1q-.8 0-1.6-.3"
      style={{
        opacity: 0.5,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g48")})`,
      }}
    />
    <path
      d="M143.3 147.6c-1.4 0-2.7-.8-3.3-2.1-.9-1.8-.1-4 1.7-4.9l14.8-6.9c1.8-.9 4-.1 4.8 1.7.9 1.9.1 4-1.7 4.9l-14.8 6.9c-.5.3-1 .4-1.5.4"
      style={{
        fill: `url(#${scopedId("g49")})`,
      }}
    />
    <path
      d="M161.3 135.4c-.2-.5-.6-1-1.1-1.3.2 1.5-.6 3-2.1 3.7l-14.7 6.9q-.8.4-1.6.4c-.7 0-1.5-.3-2.1-.8q0 .6.3 1.2c.6 1.3 1.9 2.1 3.3 2.1.5 0 1-.1 1.5-.4l14.8-6.9c1.8-.9 2.6-3 1.7-4.9"
      style={{
        opacity: 0.5,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g50")})`,
      }}
    />
    <path
      d="M204.2 140.6c-.9-2.3-1.7-3.5-5.6-2.8-4.8 1-9.7 1.1-14.5 1.4-3.3.1-6.4.1-9.6-.1-3.4-.1-6.9-.4-10.3-.7q-2.25-.15-4.5-.6c-4.1-.7-5 .5-5.9 2.8-.8 2.3-.4 9.4 3.3 12.4 3.7 3.1 5 1.5 7-1.3 2.5-3.4 6.4-4.4 9.7-1.7 1.7 1.4 3.5 3.3 5.9 3.2 1.3-.1 2.4-.4 3.5-1.2 1.4-1.1 2.4-2.6 4.1-3.2 1.7-.7 3.4-.4 4.8.7.8.6 1.8 1.4 2.3 2.2 1.9 2.8 3.1 4.4 6.6 1.3 3.6-3 4-10.1 3.2-12.4"
      style={{
        fill: `url(#${scopedId("g51")})`,
      }}
    />
    <path
      d="M205.2 141.9c-.8-2.3-1.7-3.5-5.8-2.8-5 1-10.2 1.1-15.2 1.4-3.4.1-6.6.1-10-.1-3.6-.2-7.2-.4-10.8-.7-1.5-.1-3.1-.3-4.7-.6-4.3-.7-5.2.5-6.1 2.8s-.5 9.3 3.4 12.4 5.2 1.5 7.3-1.3c2.6-3.4 6.7-4.4 10.2-1.7 1.7 1.4 3.6 3.3 6.1 3.2 1.3-.1 2.6-.4 3.6-1.3 1.5-1.1 2.6-2.5 4.4-3.1 1.8-.7 3.5-.4 5 .6.9.6 1.8 1.5 2.4 2.3 2 2.8 3.3 4.4 6.9 1.3 3.7-3.1 4.2-10.1 3.3-12.4"
      style={{
        fill: `url(#${scopedId("g52")})`,
      }}
    />
    <path
      fillRule="evenodd"
      d="M160 148.7c-2.1 0-3.8-1.7-3.8-3.9 0-2.1 1.7-3.8 3.8-3.8 2.2 0 3.9 1.7 3.9 3.8 0 2.2-1.7 3.9-3.9 3.9"
      style={{
        fill: `url(#${scopedId("g53")})`,
      }}
    />
    <path
      d="M163 143.9c0 1.6-1.3 3-3 3-1.6 0-3-1.4-3-3 0-1.7 1.4-3.1 3-3.1 1.7 0 3 1.4 3 3.1"
      style={{
        fill: `url(#${scopedId("g54")})`,
      }}
    />
    <path
      fillRule="evenodd"
      d="M198.7 148.7c-2.2 0-3.9-1.7-3.9-3.9 0-2.1 1.7-3.8 3.9-3.8 2.1 0 3.9 1.7 3.9 3.8 0 2.2-1.8 3.9-3.9 3.9"
      style={{
        fill: `url(#${scopedId("g55")})`,
      }}
    />
    <path
      d="M201.7 143.9c0 1.6-1.4 3-3 3-1.7 0-3-1.4-3-3 0-1.7 1.3-3.1 3-3.1 1.6 0 3 1.4 3 3.1"
      style={{
        fill: `url(#${scopedId("g56")})`,
      }}
    />
    <path
      fillRule="evenodd"
      d="M179.3 149.4c-2.2 0-3.9-1.7-3.9-3.9 0-2.1 1.7-3.8 3.9-3.8 2.1 0 3.8 1.7 3.8 3.8 0 2.2-1.7 3.9-3.8 3.9"
      style={{
        fill: `url(#${scopedId("g57")})`,
      }}
    />
    <path
      d="M182.3 144.6c0 1.6-1.4 3-3 3-1.7 0-3.1-1.4-3.1-3 0-1.7 1.4-3 3.1-3 1.6 0 3 1.3 3 3"
      style={{
        fill: `url(#${scopedId("g58")})`,
      }}
    />
    <path
      d="m139.9 150.5-31.5 12.4-3.2-8.3 31.4-12.4z"
      style={{
        fill: `url(#${scopedId("g59")})`,
      }}
    />
    <path
      className="d"
      d="M134.9 139.8c-1.6.7-2.4 2.4-1.8 4l2.8 7.3c.6 1.5 2.4 2.3 3.9 1.7l8.9-3.4-4.8-13zM108.5 164c-.3 0-.7-.2-.8-.6l-3.4-8.5c-.2-.5 0-1.1.5-1.2.5-.2 1 0 1.2.5l3.4 8.5c.2.5-.1 1-.5 1.2q-.2.1-.4.1"
    />
    <path
      className="d"
      d="M149.3 152.5c-.4 0-.9-.3-1.1-.8l-6.1-16.4c-.3-.7 0-1.4.7-1.6.6-.2 1.3.1 1.5.7l6.2 16.4c.2.7-.1 1.4-.7 1.6q-.2.1-.5.1"
    />
    <path
      d="m146.6 150.2-4.6-13.1-7.1 2.7-.1.1 4.6 13q.2 0 .4-.1z"
      style={{
        fill: `url(#${scopedId("g60")})`,
      }}
    />
    <path
      d="M142.3 142.1c0 1.6-1.2 2.8-2.7 2.8s-2.8-1.2-2.8-2.8c0-1.5 1.3-2.7 2.8-2.7s2.7 1.2 2.7 2.7"
      style={{
        fill: `url(#${scopedId("g61")})`,
      }}
    />
    <path
      d="M142 142.4c0 1.3-1.1 2.4-2.4 2.4s-2.4-1.1-2.4-2.4 1.1-2.4 2.4-2.4 2.4 1.1 2.4 2.4"
      style={{
        fill: `url(#${scopedId("g62")})`,
      }}
    />
    <path
      fillRule="evenodd"
      className="s"
      d="M139.6 144.5c-1.1 0-2.1-.9-2.1-2 0-1.2 1-2.1 2.1-2.1 1.2 0 2.1.9 2.1 2.1 0 1.1-.9 2-2.1 2m0-3.8c-.9 0-1.7.8-1.7 1.8 0 .9.8 1.7 1.7 1.7 1 0 1.8-.8 1.8-1.7 0-1-.8-1.8-1.8-1.8"
    />
    <path
      d="M145.3 148.3c.1.4 0 .8-.4.9l-4.6 1.8c-.3.1-.7-.1-.8-.5l-.8-1.9c-.1-.4 0-.8.4-.9l4.6-1.8c.3-.1.7.1.8.5z"
      style={{
        fill: `url(#${scopedId("g63")})`,
      }}
    />
    <path
      d="M145.2 148.5c.1.3-.1.7-.4.8l-4.3 1.6c-.3.1-.7 0-.8-.3l-.6-1.7c-.1-.3 0-.7.4-.8l4.3-1.6c.3-.1.6 0 .7.3z"
      style={{
        fill: `url(#${scopedId("g64")})`,
      }}
    />
    <path
      fillRule="evenodd"
      className="s"
      d="M140.5 150.6c-.2 0-.4-.1-.5-.3l-.5-1.4q-.1-.2 0-.4c.1-.1.2-.2.4-.3l3.7-1.4h.2q.45 0 .6.3l.5 1.3c.1.3-.1.7-.4.8l-3.7 1.4zm3.3-3.7h-.1l-3.8 1.4q-.2.1-.3.3v.3l.5 1.3c.1.2.4.3.6.2l3.7-1.4c.3-.1.4-.3.3-.5l-.5-1.3c0-.2-.2-.3-.4-.3"
    />
    <path
      d="m223.5 142.1 31.5 12.3-3.3 8.3-31.4-12.3z"
      style={{
        fill: `url(#${scopedId("g65")})`,
      }}
    />
    <path
      className="d"
      d="M219.9 153.3c1.6.6 3.4-.1 4-1.7l2.9-7.2c.6-1.6-.1-3.3-1.7-4l-8.8-3.5-5.3 12.9zm35.8.2c.2.3.3.7.2 1l-3.3 8.6c-.2.5-.7.7-1.2.5s-.7-.7-.5-1.1l3.3-8.6c.2-.5.7-.7 1.2-.6q.1.1.3.2"
    />
    <path
      className="d"
      d="M217.9 134.2c.4.4.5.9.3 1.4l-6.7 16.2c-.2.6-.9.9-1.5.7-.7-.3-1-1-.7-1.6l6.7-16.2c.2-.7.9-1 1.5-.7z"
    />
    <path
      d="m218.3 137.7-5.4 12.8 7 2.8h.1l5.5-12.7-.4-.2z"
      style={{
        fill: `url(#${scopedId("g66")})`,
      }}
    />
    <path
      d="M218.4 139.1c.2-.4.6-.6.9-.4l4.5 1.8c.4.2.5.6.4.9l-.8 2c-.2.3-.6.5-.9.4l-4.5-1.9c-.4-.1-.5-.5-.4-.9z"
      style={{
        fill: `url(#${scopedId("g67")})`,
      }}
    />
    <path
      d="M218.6 139c.1-.3.5-.4.8-.3l4.3 1.7c.3.1.4.5.3.8l-.7 1.7c-.1.3-.5.4-.8.3l-4.2-1.7c-.3-.2-.5-.5-.4-.8z"
      style={{
        fill: `url(#${scopedId("g68")})`,
      }}
    />
    <path
      fillRule="evenodd"
      className="s"
      d="M222.5 142.9h-.2l-3.7-1.6q-.2-.1-.3-.3t-.1-.4l.6-1.3c.1-.2.3-.4.5-.4q.1 0 .3.1l3.7 1.5c.3.1.4.5.3.7l-.5 1.4q-.15.3-.6.3m-3.2-3.8c-.2 0-.3.1-.4.2l-.5 1.3q-.1.2 0 .4l.2.2 3.8 1.5c.2.1.4 0 .5-.2l.6-1.3c.1-.2-.1-.5-.3-.6l-3.7-1.5z"
    />
    <path
      d="M215.6 149c-.5-.2-.8-.6-.6-.9l1.7-3.8c.1-.2.6-.3 1.1-.1l2.6 1.2c.5.2.8.6.7.9l-1.7 3.8c-.1.3-.6.3-1.1.1z"
      style={{
        fill: `url(#${scopedId("g69")})`,
      }}
    />
    <path
      d="M215.8 149.1c-.4-.1-.7-.5-.6-.8l1.6-3.4c.1-.3.5-.3.9-.1l2.3 1c.4.2.6.5.5.8L219 150c-.1.3-.6.3-1 .2z"
      style={{
        fill: `url(#${scopedId("g70")})`,
      }}
    />
    <path
      fillRule="evenodd"
      className="s"
      d="M218.3 150q-.3 0-.4-.1l-1.8-.8c-.4-.2-.6-.5-.5-.8l1.3-3q.2-.2.5-.3.2 0 .4.1l1.8.8c.2.1.4.3.5.5v.3l-1.4 3c0 .2-.2.3-.4.3m-.9-4.8q-.2 0-.3.2l-1.4 3c0 .2.1.4.4.5l1.8.8c.3.1.6.1.7-.1l1.3-3q.1-.1 0-.2c0-.1-.2-.2-.3-.3l-1.8-.8q-.2-.1-.4-.1"
    />
    <path
      d="M196.5 98.8c-2.6-7.2-4.9-12.7-5.3-13.5-.9-2-5.4-6-10.1-6.2-4-.2-8.9 3.6-10.5 6-1.3 1.9-4.2 8.1-6.9 13.4 4.2-1.8 11.3-4.6 16.4-4.5 5.6.1 12.3 2.8 16.4 4.8"
      style={{
        fill: `url(#${scopedId("g71")})`,
      }}
    />
    <path
      d="M196.5 98.8c-4.1-2-10.8-4.7-16.4-4.8-5.1-.1-12.2 2.7-16.4 4.5-.7 1.4-1.4 2.7-2 3.9-3 5.8-12.9 28.3-12.9 28.3l-2 4.4c32.9-11.6 63 0 63 0s-7.8-21.5-13.3-36.3"
      style={{
        fill: `url(#${scopedId("g72")})`,
      }}
    />
    <path
      d="M153.8 128.1s28.6-7.3 50.4.9l-11-29s-11.7-12.7-26.9-.6z"
      style={{
        fill: `url(#${scopedId("g73")})`,
      }}
    />
    <path d="m204.2 129-2.1-5.5c-4.3-3.6-11.9-8-23.3-7.6-13.7.6-20.8 6.3-23.8 9.3l-1.2 2.9s28.6-7.3 50.4.9" />
    <path
      fillRule="evenodd"
      className="d"
      d="M179.5 122.5c-5.9 0-10.7-4.5-10.7-10.1s4.8-10.1 10.7-10.1c6 0 10.8 4.5 10.8 10.1s-4.8 10.1-10.8 10.1"
    />
    <path
      fillRule="evenodd"
      d="M179.5 120.6c-4.8 0-8.7-3.6-8.7-8.2 0-4.5 3.9-8.2 8.7-8.2 4.9 0 8.8 3.7 8.8 8.2 0 4.6-3.9 8.2-8.8 8.2"
      style={{
        fill: `url(#${scopedId("g74")})`,
      }}
    />
    <path
      className="M"
      d="m173.3 82.3-4.8 14.3c1.6-.6 3.4-1.2 5.2-1.7l3.4-14.9c-1.4.6-2.7 1.4-3.8 2.3"
    />
    <path
      className="L"
      d="M191.8 98.7c-3.6-2.9-13.4-8.9-25.5.7l-12.5 28.7s2-.5 5.5-1.1l11.2-28.8c9.7-6.8 16.7-2.2 21.3.5"
    />
    <path
      d="M152.6 107.2c-.8 3.3-2.7 5.7-4.4 5.3-1.6-.4-2.3-3.4-1.5-6.7s2.8-5.6 4.4-5.2c1.6.3 2.3 3.3 1.5 6.6"
      style={{
        fill: `url(#${scopedId("g75")})`,
      }}
    />
    <path
      d="M150.6 106.7c-.7 2.9-2.1 5.1-3.2 4.8s-1.3-3-.6-5.9c.8-2.9 2.3-4.9 3.2-4.7 1 .3 1.4 2.9.6 5.8"
      style={{
        opacity: 0.7,
        fill: `url(#${scopedId("g76")})`,
      }}
    />
    <path
      d="M150 106.1c-.6 2.5-1.9 4.3-2.8 4.1-1-.3-1.1-2.5-.5-5s1.9-4.2 2.6-4c1 .2 1.3 2.4.7 4.9"
      style={{
        opacity: 0.7,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g77")})`,
      }}
    />
    <path
      d="M149.1 101.2s-8.1-2.5-14.7-6.7-7.3-2.8-7.3-2.8c1.9 1.7 3.2 6.2 3.2 6.2 1.2-.5 4.7 1.6 8.7 4.3 3.9 2.7 6.8 5.7 7.7 6.8.1.1.4.3.4.3h.1c.8.3 1.9-1.4 2.5-3.7.5-2.2.3-4.2-.6-4.4"
      style={{
        fill: `url(#${scopedId("g78")})`,
      }}
    />
    <path
      className="R"
      d="M149.6 103.8q.2.1.3.2c.2-1.5-.1-2.7-.8-2.8 0 0-8.1-2.5-14.7-6.7s-7.3-2.8-7.3-2.8c.7.6 1.2 1.5 1.7 2.5 1 .2 2.9.9 6.1 2.9 6.5 4.2 14.7 6.7 14.7 6.7"
    />
    <path d="M130 98.7c-.4 0-.8-.3-.9-.8-.4-4.2-3.8-6.5-3.9-6.5-.4-.3-.5-.8-.2-1.3.2-.4.8-.5 1.2-.2.2.1 4.2 2.7 4.7 7.8.1.5-.3 1-.8 1z" />
    <path
      d="m132.5 105.5-32.5-.3s9-14.4 18.8-15.8 12.4 9.8 13.7 16.1"
      style={{
        fill: `url(#${scopedId("g79")})`,
      }}
    />
    <path
      className="R"
      d="M103.9 99.9q-1.2 1.5-2.1 2.7c5.1-.3 16-.6 30.4 1.5q-.3-1.3-.7-2.8c-12.3-1.7-22-1.7-27.6-1.4"
    />
    <path
      className="aC"
      d="M132.5 105.5c-1-4.9-2.8-12.8-8.2-15.4 4.3 3.1 8.4 13.5-3.2 14.5-8.7.7-15.2-.4-18.3-3.3-1.8 2.2-2.8 3.9-2.8 3.9z"
    />
    <path
      d="M108.3 95.3c1.4-1.3 8.5-7.8 15.3-4.8 6.8 2.9 2.3 14.2-9.3 13.7-11.7-.5-9.3-5.8-6-8.9"
      style={{
        fill: `url(#${scopedId("g80")})`,
      }}
    />
    <path
      d="M207.9 107.2c.8 3.3 2.8 5.7 4.4 5.3s2.3-3.4 1.5-6.7-2.8-5.6-4.4-5.2c-1.6.3-2.3 3.3-1.5 6.6"
      style={{
        fill: `url(#${scopedId("g81")})`,
      }}
    />
    <path
      d="M209.9 106.7c.7 2.9 2.1 5.1 3.2 4.8s1.3-3 .6-5.9-2.3-4.9-3.1-4.7c-1.1.3-1.4 2.9-.7 5.8"
      style={{
        opacity: 0.7,
        fill: `url(#${scopedId("g82")})`,
      }}
    />
    <path
      d="M210.5 106.1c.6 2.5 1.9 4.3 2.8 4.1 1-.3 1.1-2.5.6-5-.6-2.5-2-4.2-2.8-4-.9.2-1.2 2.4-.6 4.9"
      style={{
        opacity: 0.7,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g83")})`,
      }}
    />
    <path
      d="M211.4 101.2s8.1-2.5 14.7-6.7 7.3-2.8 7.3-2.8c-1.8 1.7-3.2 6.2-3.2 6.2-1.2-.5-4.7 1.6-8.7 4.3-3.9 2.7-6.8 5.7-7.7 6.8-.1.1-.4.3-.4.3h-.1c-.8.3-1.9-1.4-2.5-3.7-.5-2.2-.3-4.2.6-4.4"
      style={{
        fill: `url(#${scopedId("g84")})`,
      }}
    />
    <path
      className="R"
      d="M210.9 103.8q-.2.1-.3.2c-.2-1.5.1-2.7.8-2.8 0 0 8.1-2.5 14.7-6.7s7.3-2.8 7.3-2.8c-.6.6-1.2 1.5-1.7 2.5-1 .2-2.9.9-6.1 2.9-6.5 4.2-14.7 6.7-14.7 6.7"
    />
    <path d="M230.5 98.7c.4 0 .8-.3.9-.8.4-4.2 3.9-6.5 3.9-6.5.4-.3.5-.8.3-1.3-.3-.4-.9-.5-1.3-.2-.2.1-4.2 2.7-4.7 7.8-.1.5.3 1 .8 1z" />
    <path
      d="m228 105.5 32.5-.3s-9-14.4-18.8-15.8-12.4 9.8-13.7 16.1"
      style={{
        fill: `url(#${scopedId("g85")})`,
      }}
    />
    <path
      className="R"
      d="M256.6 99.9c.8 1 1.6 1.9 2.2 2.7-5.2-.3-16.1-.6-30.5 1.5q.3-1.3.7-2.8c12.3-1.7 22-1.7 27.6-1.4"
    />
    <path
      className="aC"
      d="M228 105.5c1-4.9 2.8-12.8 8.2-15.4-4.3 3.1-8.3 13.5 3.2 14.5 8.7.7 15.3-.4 18.3-3.3 1.8 2.2 2.8 3.9 2.8 3.9z"
    />
    <path
      d="M252.2 95.3c-1.4-1.3-8.5-7.8-15.3-4.8-6.8 2.9-2.3 14.2 9.3 13.7 11.7-.5 9.3-5.8 6-8.9"
      style={{
        fill: `url(#${scopedId("g86")})`,
      }}
    />
    <path
      className="G"
      d="M207.6 296.9c2.4-7.4 3.4-13.3 2.4-18.3-1.8-4.5-3.7-9-4.7-12.3h-24v95.3c5.1-.6 9.1-5.3 9.1-5.3q4.4-7.8 7.9-14.3c-5.2-3.5 6.5-36.2 9.3-45.1"
    />
    <path
      d="m193 319.3-14.4 1.5-14.4-1.5-4.7 2.8s5.1 26.4 6.3 31.8 3.3 11.5 11.2 11.5h3.2c7.9 0 10-6.1 11.2-11.5s6.3-31.8 6.3-31.8z"
      style={{
        fill: `url(#${scopedId("g87")})`,
      }}
    />
    <path
      d="M159.5 322.1s7.6 3.9 19.9 3.5c12.2-.3 18.3-3.5 18.3-3.5z"
      style={{
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g88")})`,
      }}
    />
    <path
      d="M200.6 252.9c-3.7-11.6-.3-18.2-2.2-19.1s-4.3 2.1-9 5.9c-3.5 2.9-8.5 3.3-10.8 3.3s-7.3-.4-10.8-3.3c-4.6-3.8-7.1-6.8-9-5.9s1.5 7.5-2.2 19.1c-3.8 11.7-8.8 19.6-6.8 29.9s9.7 39.3 9.7 39.3 11.6 1.4 19.1 1.1c7.5.3 19.1-1.1 19.1-1.1s7.7-29 9.7-39.3-3-18.2-6.8-29.9"
      style={{
        fill: `url(#${scopedId("g89")})`,
      }}
    />
    <path
      d="M163.1 257.2c4.3-5.8 4.1-15.5-.7-20.8q-.9-1-1.5-2.3-1.2-.75-2.1-.3c-1.9.9 1.5 7.5-2.2 19.1-3.8 11.7-8.8 19.6-6.8 29.9 1.6 7.9 6.4 26.7 8.6 35.1-.8-4-1.7-8.8-2.8-14.3-6.1-32.1 3.3-40.7 7.5-46.4"
      style={{
        opacity: 0.2,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g90")})`,
      }}
    />
    <path
      d="M200.6 252.9c-3.7-11.6-.3-18.2-2.2-19.1-.7-.3-1.5-.1-2.4.5-.4.8-.8 1.5-1.4 2.1-4.9 5.3-5 15-.8 20.8 4.2 5.7 13.7 14.3 7.6 46.4-1.5 7.4-2.6 13.4-3.6 18.2.9-3.2 7.7-29.3 9.6-39 2-10.3-3-18.2-6.8-29.9"
      style={{
        opacity: 0.2,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g91")})`,
      }}
    />
    <path
      d="M178.5 245.5c8.8 0 15.3-9.4 15.3-9.4l.2-.4c-1.2 1.1-2.7 2.5-4.6 4-3.5 2.9-8.5 3.3-10.8 3.3s-7.3-.4-10.8-3.3c-2.3-1.9-4-3.5-5.4-4.6q.1.1.1.2c1.4 2.9 7.2 10.2 16 10.2"
      style={{
        opacity: 0.5,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g92")})`,
      }}
    />
    <path
      d="M159.5 322.1s11.6 1.4 19.1 1.1c7.5.3 19.1-1.1 19.1-1.1-20.7-2.5-38.2 0-38.2 0"
      style={{
        opacity: 0.5,
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g93")})`,
      }}
    />
    <path
      d="M222.3 111.4c.7.1 6.7 1.9 7.7 2.5 1 .7-.7 1.9-5.8 1.3-5-.7-4.8-4.1-1.9-3.8"
      style={{
        fill: `url(#${scopedId("g94")})`,
      }}
    />
    <path
      d="M138.6 111.5c-.7.1-6.8 1.9-7.8 2.5-.9.6.8 1.9 5.8 1.2 5.1-.6 4.8-4.1 2-3.7"
      style={{
        fill: `url(#${scopedId("g95")})`,
      }}
    />
    <path
      className="aT"
      d="M130.1 247q0-.1.1-.3 0-.2.2-.6.2-.3.5-.7t.7-.8l.6-.9q.2-.4.5-.7c.2-.2.4-.3.5-.4l.2-.2-.2.2q0 .1-.1.2-.1.2-.2.3-.3.4-.5.8c-.2.3-.4.6-.6.8-.4.6-.9 1.1-1.2 1.5q-.3.3-.4.5zm2.3.1s.2-.3.6-.8c.2-.2.4-.5.7-.8q.4-.5.8-.9c.3-.3.5-.7.8-1q.3-.4.7-.8.1-.1.3-.2.1-.2.3-.2l.2-.2-.2.2-.2.2q-.2.2-.3.4-.3.3-.6.8c-.3.3-.5.7-.8 1-.5.6-1.1 1.2-1.6 1.6zm2.7.2s.3-.4.7-.9q.4-.4.8-.9.5-.5.9-1l.5-.5c.1-.2.3-.3.4-.5.3-.3.5-.6.7-.9l.6-.6c.1-.1.2-.1.2-.1h.1-.1q0 .1-.1.2-.3.2-.6.6c-.1.3-.3.6-.6 1-.1.2-.3.3-.4.5q-.2.3-.5.5c-.3.4-.6.7-.9 1q-.4.5-.8.8c-.5.5-.9.8-.9.8m2.8.1s.3-.4.7-.9 1-1.2 1.6-1.9l.8-1q.4-.5.8-.9.3-.4.6-.6l.2-.2s-.3.4-.7.9q-.1.2-.3.4c-.1.2-.2.4-.3.5-.3.4-.6.7-.9 1.1-.6.7-1.2 1.3-1.7 1.8-.4.5-.8.8-.8.8m3.1.1.2-.3q.1-.1.3-.2.1-.2.3-.4c.4-.6.9-1.4 1.5-2.2q.4-.6.8-1.1.4-.6.7-1 .3-.5.6-.7l.2-.2-.2.3q-.2.2-.5.7c-.2.3-.4.6-.6 1l-.8 1.2-.8 1.2q-.4.5-.8.9c-.1.2-.2.3-.4.4l-.2.2zm2.9-.2s.2-.3.5-.8q.1-.2.3-.4c.1-.1.1-.2.3-.4q.2-.4.6-.9c.4-.6.8-1.3 1.2-1.7.3-.5.6-.7.6-.7s-.2.3-.5.8-.7 1.1-1.1 1.8q-.3.4-.6.9c-.2.3-.5.5-.7.7-.3.4-.6.7-.6.7m65.3.1.1-.3c.1-.1.2-.3.4-.5q.2-.4.4-.9l.4-1c.4-.7.7-1.4 1-1.9.1-.3.3-.5.4-.6l.1-.2-.1.2-.3.6c-.2.6-.5 1.3-.8 2-.1.3-.3.7-.5 1q-.2.5-.5.9c-.2.2-.4.4-.4.5zm1.8.2s.2-.3.5-.9c.2-.6.5-1.3.9-2q.2-.3.3-.5l.3-.6q.3-.4.5-.9.1-.2.2-.3l.3-.3.1-.1h.1l-.2.2-.2.2q0 .2-.1.4l-.5 1q-.2.5-.5 1c-.4.8-.8 1.5-1.1 2s-.6.8-.6.8m2.7-.3s.1-.4.4-1c.3-.5.6-1.3 1-2l.6-1q.3-.6.6-.9c.3-.5.6-.8.6-.8s-.2.3-.5.9l-.2.4q-.2.2-.3.5-.2.5-.5 1.1l-.6 1c-.2.4-.4.7-.5.9-.4.5-.6.9-.6.9m2 .1.2-.3q.2-.2.4-.6c.3-.6.7-1.3 1.1-2.1.2-.4.4-.7.6-1.1q.4-.5.7-.9l.5-.5.2-.2-.1.2q-.1.1-.2.3l-.3.3-.5 1q-.3.5-.6 1.1-.3.5-.7 1-.3.6-.6 1c-.1.2-.3.4-.5.6zm2.6-.1.4-.8.5-.7q.2-.3.5-.7l.4-.7.4-.7q.2-.3.4-.7l.5-.7q.2-.3.5-.6-.2.3-.4.7l-.4.7q-.1.4-.3.7l-.4.8-.5.7q-.3.3-.5.7l-.6.6q-.2.4-.5.7m3-.1s.1-.3.4-.9c.3-.5.7-1.2 1.2-1.9q.3-.6.6-1 .3-.5.6-.9c.1-.3.3-.5.4-.6l.2-.2q.1 0-.1.2-.2.3-.4.7c-.2.2-.3.5-.5.9q-.1.2-.3.5-.1.3-.3.5-.3.6-.6 1c-.2.4-.5.7-.6.9-.4.5-.6.8-.6.8m2.7.2q.1 0 .2-.2c.1-.1.2-.3.4-.5.3-.4.6-1.1 1-1.7q.3-.5.6-.9c.2-.3.4-.5.6-.8.1-.2.3-.3.4-.4l.2-.2-.1.2c-.1.2-.3.3-.4.5q-.2.4-.5.8c-.2.3-.3.6-.5 1q-.3.4-.6.9c-.2.3-.4.5-.6.7l-.5.5z"
      style={{
        opacity: 0.1,
      }}
    />
    <g
      style={{
        opacity: 0.1,
      }}
    >
      <path
        className="aT"
        d="m227.9 144.8.3.3.3.3q.1.2.3.4.1.3.3.6l.3.6c.1.3.2.5.3.7l.2.8c.1.5.3 1 .4 1.5q.1.8.2 1.3c.1.8.2 1.3.2 1.3s-.2-.5-.4-1.2c-.2-.8-.4-1.8-.7-2.8l-.2-.8c-.1-.2-.2-.4-.2-.7l-.3-.6q-.1-.3-.3-.6c-.1-.3-.4-.6-.5-.8zm3.6 1.4h.1q.1 0 .2.2.1 0 .3.2c.1.1.2.3.4.5q.3.5.5 1.2.3.7.5 1.5.1.8.3 1.6c.1.5.2.9.2 1.3.2.8.3 1.3.3 1.3s-.2-.5-.4-1.3c-.2-.7-.5-1.8-.7-2.8q-.2-.8-.4-1.5t-.5-1.2q-.1-.3-.3-.5-.1-.2-.2-.3-.2-.1-.2-.2zm5.4 1.9q.1 0 .4.2l.3.3q.2.2.4.5.3.6.6 1.3l.4 1.6q.1.9.2 1.6c.1.6.1 1.1.2 1.5 0 .4 0 .7.1 1q0 .2.1.2v.1-.1q-.1 0-.1-.2-.2-.4-.3-1t-.2-1.4q-.2-.8-.3-1.6c-.2-1.1-.5-2.2-.9-2.9q-.1-.3-.3-.5l-.3-.3c-.1-.2-.3-.3-.3-.3m5.2 2.3.2.2q.2.2.3.4t.3.4c.1.4.3.9.4 1.3.1.5.2 1.1.2 1.6.1 1.1.1 2.1.1 2.9v.9l.1.4s-.2-.5-.3-1.3-.1-1.8-.2-2.9q0-.8-.2-1.5-.1-.7-.3-1.3-.2-.5-.4-.8zm4.2 1.3s.2.5.5 1.2l.4 1.2c0 .3.1.5.2.8q0 .3.1.7t.1.8v.7q.1.7 0 1.3v1.3s-.1-.5-.1-1.3c0-.4-.1-.8-.1-1.3q0-.3-.1-.7 0-.4-.1-.7-.1-.8-.3-1.5c-.1-.4-.2-.9-.3-1.2-.2-.8-.3-1.3-.3-1.3m4.7 1.9v.2l.3.6q.1.4.2.9c.1.4.1.7.2 1.1v1.1q0 .3-.1.5v.5q-.1.2-.1.3-.1.2-.1.3l-.1.2v-.2q0-.1.1-.3v-1.3c0-.3 0-.7-.1-1.1 0-.3 0-.7-.1-1q0-.5-.1-.9t-.1-.7z"
      />
      <path
        className="aT"
        d="M225.9 151.1s.2-.4.6-1.1c.3-.3.5-.7.8-1.1q.2-.2.5-.6c.1-.2.3-.3.5-.5q.3-.3.6-.5l.6-.4q.6-.4 1.2-.7.5-.3.8-.3.2-.1.3-.1c.1 0 .1.1.1.1s0-.1-.1-.1q-.1 0-.2.1-.4.1-.8.5c-.4.2-.7.4-1.1.7l-.6.4c-.2.2-.4.4-.6.5-.2.2-.4.3-.5.6q-.3.2-.5.5c-.3.4-.6.7-.8 1-.5.6-.8 1-.8 1m1.7 1.3.3-.3q.15-.3.6-.9.2-.2.4-.5c.2-.2.4-.3.6-.5l.6-.6q.3-.2.7-.5.4-.2.7-.4l.8-.4q.3-.1.7-.3l.6-.2c.4-.1.8-.2 1-.2l.4-.1-.4.1c-.2.1-.5.2-.9.4l-.6.2c-.3.1-.5.3-.7.4q-.4.1-.7.4-.4.2-.7.4-.4.2-.7.5c-.3.1-.4.3-.7.5-.1.1-.4.3-.5.5q-.3.2-.5.4c-.3.3-.5.6-.7.8zm2 1.1s.5-.5 1.2-1.1c.4-.4.8-.8 1.3-1.2q.7-.7 1.5-1.3t1.7-1q.4-.3.8-.4l.8-.2q.4-.1.7-.1.3-.1.5-.1h.5l-.5.1q-.2 0-.5.1-.3 0-.7.1-.3.1-.7.3c-.3.1-.5.3-.8.4q-.8.4-1.6 1.1l-1.6 1.2q-.7.6-1.3 1.1c-.7.6-1.3 1-1.3 1m2.6.9.2-.4q.3-.45.9-.9.3-.3.7-.5.3-.3.7-.5l.9-.6c.2-.1.5-.3.9-.5.3-.1.6-.3.9-.4q.5-.2.9-.3l.9-.3q.5 0 .9-.1.7 0 1.2-.1h.5s-.7.1-1.7.3l-.8.2q-.4.1-.9.2-.4.2-.9.4t-.9.4q-.5.2-.9.5-.4.2-.8.5c-.5.3-1.1.7-1.5.9q-.6.5-.9.8c-.2.2-.3.4-.3.4m3.4 1.1.3-.4q.2-.3.7-.9l.5-.5c.2-.1.5-.3.7-.5.2-.1.5-.3.7-.4q.5-.3.9-.5.8-.3 1.7-.6c.5-.1 1.1-.2 1.5-.3q.4-.1.7-.1.2 0 .4-.1l.4-.1-.4.1c-.2.2-.6.2-1 .4l-.8.2c-.2 0-.5.1-.7.2-.3 0-.6.2-.9.3q-.4.1-.8.3l-.8.4c-.3.2-.5.3-.8.4-.2.2-.4.3-.6.5q-.3.2-.6.5-.3.2-.5.4t-.3.4zm3 1.2.3-.3c.3-.1.5-.4.9-.7q.3-.2.7-.5c.2-.2.4-.3.7-.5.3-.1.5-.3.8-.5q.4-.2.9-.4.4-.2.9-.4l.9-.3c.3-.1.6-.2.8-.2l.8-.2c.5-.1.9-.1 1.2-.2h.4l-.4.1c-.3.1-.7.1-1.1.3l-.8.2c-.3 0-.5.2-.8.3q-.5.1-.9.3t-.9.4l-.8.4c-.3.1-.6.3-.9.4-.2.2-.5.3-.7.5q-.4.2-.7.4c-.4.3-.7.5-.9.7zm3.1.9c.1-.1.2-.3.4-.5q.2-.2.5-.4l1-.8 1.2-.6.6-.3.6-.2.6-.3.6-.2 1.2-.4q1.3-.3 2.6-.5h-.2.3-.1q-1.2.4-2.5.7l-1.2.4-.6.3-.6.2q-.3.2-.6.3l-.6.3q-.6.2-1.1.5-.6.3-1.1.7-.3.2-.5.4-.3.2-.5.4m2.8 1 .3-.2c.3-.2.5-.5.9-.7l.6-.4q.3-.2.7-.3l.8-.4q.4-.2.8-.3.4-.2.9-.3c.2-.1.5-.1.8-.2.5-.1 1.1-.1 1.5-.1q.3-.1.6-.1.3.1.5.1h.2-.1.1-.2q-.2 0-.5.1h-.6q-.3.1-.7.1-.3.1-.7.2c-.3.1-.6.1-.9.2q-.4.1-.8.3-.4.1-.8.3-.4.1-.8.3c-.2.1-.5.2-.7.3l-.6.4c-.4.2-.7.4-.9.5zm1.6.9.2-.1q.2-.2.6-.3c.3-.1.5-.2.9-.3l1-.2h1.1q.3.1.5.1.2.1.4.1l.4.2.2.2.1.2-.2-.2q-.1 0-.2-.1t-.3-.1q-.2-.1-.4-.1h-1.5c-.7.1-1.5.2-2 .3l-.6.2zm-138.9-4.8.3.2c.1.1.4.3.7.5l.4.4.5.5q.2.2.4.5t.5.6l.4.6.3.6c.2.4.3.8.5 1.1.1.3.2.6.3.8v.3l-.1-.3q-.1-.3-.4-.7l-.2-.6c-.1-.1-.2-.3-.3-.5l-.4-.6-.4-.6c-.3-.3-.5-.7-.8-1.1-.2-.1-.3-.3-.5-.4q-.2-.3-.4-.4c-.2-.3-.4-.5-.6-.7zm2.8-1.4h.8c.1.1.3.1.5.2.3.2.7.5 1 .8q.5.5 1 1.1c.3.4.6.8.8 1.2q.3.7.6 1.2c.2.7.4 1.2.4 1.2s-.2-.5-.6-1.1c-.1-.4-.4-.7-.6-1.1-.3-.4-.5-.8-.8-1.2s-.7-.8-1-1.1q-.2-.3-.5-.5-.2-.2-.4-.3-.3-.2-.5-.3-.2 0-.3-.1h-.3q-.1.1-.1 0m3.6-1.2.3.2q.2.2.7.5c.3.2.6.5 1 .8l.5.5q.2.2.4.5c.4.4.6.9.8 1.2q.2.3.3.6.2.3.3.6.2.5.2.8l.1.4s-.2-.5-.5-1.2q-.3-.4-.6-1c-.3-.4-.5-.8-.8-1.2l-.4-.6c-.2-.1-.3-.3-.5-.4l-.9-.9c-.6-.5-.9-.8-.9-.8m2.9-1.3s.1-.1.3 0 .5.2.8.5c.3.2.7.5 1.1.7q.3.3.6.5t.6.5l.6.6.4.6.4.6c.1.2.2.4.2.6l.3.9.1.4-.2-.3q0-.2-.1-.4t-.2-.5c-.1-.2-.2-.4-.3-.5l-.4-.6q-.1-.2-.2-.3l-.3-.3c-.1-.2-.3-.4-.5-.6q-.3-.2-.5-.5-.3-.2-.6-.5-.6-.4-1.1-.8-.4-.4-.7-.5c-.2-.1-.3-.1-.3-.1m4-1.4q.2 0 .5.1.2 0 .4.2c.3.1.6.4.9.6q.7.7 1.4 1.5c.1.1.2.2.3.4l.2.5c.1.3.2.6.4 1l.3.9q.1.5.3 1v-.1h.1-.1v.1l-.3-.5c0-.1-.1-.3-.2-.4l-.4-1-.2-.4c0-.2-.1-.3-.2-.5l-.2-.4c-.1-.1-.2-.3-.3-.4q-.6-.8-1.3-1.5-.3-.4-.7-.7c-.3-.2-.6-.4-.9-.4m3.7-1.5.4.1c.1.1.2.1.3.2q.2.1.5.2.2.2.5.4.2.1.5.4l.5.5.4.6.4.6c.1.2.2.5.3.7l.3.6q0 .3.1.6 0 .2.1.5 0 .2.1.3v.2s0 .1 0 0v-.1.2l-.1-.1v-.1c0-.2-.2-.5-.3-.9q-.1-.3-.2-.5c0-.2-.1-.4-.2-.6l-.4-.6-.3-.6c-.2-.2-.3-.4-.5-.6q-.2-.3-.4-.5c-.2-.2-.3-.4-.5-.5l-.4-.4-.4-.2c-.1-.1-.3-.2-.4-.2q-.2-.2-.3-.2m3.5-1.3.4.1q.1.1.4.2.1 0 .2.1.1 0 .3.1.2.2.5.4c.2.1.4.3.6.4.2.2.4.3.6.5q.2.3.5.6.3.4.5.7t.4.7l.4.6.2.6q.1.3.2.5 0 .3.1.4v.4l-.1-.3q0-.2-.1-.4c-.1-.2-.2-.4-.3-.5l-.2-.6-.4-.6-.4-.6c-.2-.2-.3-.5-.5-.7q-.3-.3-.5-.6c-.2-.2-.4-.3-.6-.5-.2-.1-.3-.3-.5-.5q-.3-.1-.5-.3l-.2-.2q-.2-.1-.3-.1-.2-.1-.3-.2z"
      />
      <path
        className="aT"
        d="M108.9 158.7v-.3q0-.2.1-.7c.1-.6.4-1.4.7-2.1.3-.8.6-1.5 1-2q.2-.4.5-.6h.2q-.1 0-.2.1c-.1.1-.2.3-.4.6-.3.5-.6 1.2-.9 2-.2.7-.5 1.5-.7 2q-.2.5-.3.7zm3.5 1.5v-.4c0-.2-.1-.6-.1-1v-.6q0-.4.1-.8c0-.2 0-.5.1-.8q.1-.4.1-.8.2-.4.3-.7.1-.4.3-.8.1-.3.3-.6t.3-.6q.2-.3.4-.5.1-.2.2-.3l.3-.3-.2.3q-.1.2-.3.4-.1.2-.2.5-.2.2-.3.6l-.3.6-.2.8q-.2.3-.3.7c-.1.5-.2 1.1-.3 1.6q0 .3-.1.7v.6c-.1.4-.1.8-.1 1zm4.1-2s-.1-.5 0-1.4c0-.2 0-.4.1-.7q0-.3.1-.7c0-.3.1-.6.2-.8q.1-.4.3-.9.3-.8.6-1.5c.3-.5.6-.9.8-1.3q.4-.5.7-.7l.2-.2h.1q-.1.1-.3.2-.1.1-.2.3-.2.3-.4.5-.3.6-.6 1.3-.3.8-.7 1.5l-.2.8c-.1.3-.2.6-.3.8q0 .4-.1.8c-.1.2-.1.4-.2.6-.1.9-.1 1.4-.1 1.4m3.2-1 .1-.4c0-.2 0-.4.1-.6q.1-.3.2-.7c.1-.2.2-.5.3-.8.1-.2.3-.5.4-.8q.5-.9 1.1-1.8l1.2-1.6c.4-.5.8-1 1.2-1.4.4-.3.7-.6 1-.7q.2-.1.3-.2h.2-.1c-.1.1-.2.1-.4.2q-.1.2-.4.4l-.5.5q-.2.2-.5.6-.3.3-.6.7-.6.8-1.2 1.7T121 154c-.1.3-.3.6-.4.8-.1.3-.3.6-.4.8q-.1.4-.2.7t-.2.5zm3.9-1.3q.2-.7.5-1.4l.6-1.4q.3-.7.7-1.4l.8-1.3 1-1.2q.5-.5 1-1.1l1.3-.9 1.3-.7v-.1.3-.2l-1.2.8-1.2 1-1 1.1-.9 1.2-.9 1.3-.7 1.3-.7 1.3zm3.7-1.7.1-.4.2-.4.2-.4c.1-.2.1-.3.2-.4l.3-.4q.1-.2.3-.4l.6-.6.6-.7q.4-.3.8-.5.3-.3.7-.5c.2-.2.5-.3.8-.5.3-.1.6-.3 1-.4q.2-.1.5-.2c.1 0 .3-.1.5 0-.2-.1-.3 0-.5.1q-.2.1-.5.2l-.9.5-.4.2q-.2.2-.4.3-.3.2-.7.5l-.7.6-.6.6-.6.6q-.3.3-.6.7l-.3.3-.2.4c-.1.1-.1.3-.2.4zm3.6-1.3.1-.1c.1-.2.1-.3.3-.5q.3-.3.6-.5c.3-.2.6-.4.8-.6l.9-.3q.4-.2.8-.2.2-.1.3-.1h.5l-.2.1h-.3c-.1 0-.2.1-.3.1q-.1.1-.3.1l-.4.2c-.3.1-.5.3-.8.4-.3.2-.6.3-.8.5l-.4.2q-.1.1-.3.2c0 .1-.1.1-.2.2l-.2.2z"
      />
    </g>
    <path
      d="M168.8 251.1s2.5-6.3 3.9-4.7c.9.9.2 9.2.3 13 0 3.8-6.2 4.9-6 12.2.1 7.2.7 39.2.7 43.9.1 4.7-5.6-3.6-5.6-6.2-.1-2.5-.6-32.5-.7-38.2-.1-5.8 3.2-8.9 5.5-11.5 2.2-2.6 1.9-8.5 1.9-8.5"
      style={{
        opacity: 0.1,
        fill: "#fff",
      }}
    />
    <path
      d="M149.5 216.9h-5.7c3.2.3 5.5 1 5.5 2 0 .9-2.2 1.7-5.3 1.9h5.5c.4 0 .7-.3.7-.6v-2.7c0-.3-.3-.6-.7-.6"
      style={{
        mixBlendMode: "multiply",
        fill: `url(#${scopedId("g96")})`,
      }}
    />
    <path
      d="M194.9 263.3c-6.8-6.8-6-12.8-6.4-17.3-.3-4-.3-1.1-7-.5 0 0-1.8.1-2.9.1s-2.9-.1-2.9-.1c-6.8-.6-6.7-3.5-7.1.5-.4 4.5.4 10.5-6.4 17.3-2.7 2.8-1.3 40.5-.4 58.3 4.4-.6 9.3-.8 13.9-.8h5.8c4.6 0 9.4.2 13.9.8.8-17.8 2.3-55.5-.5-58.3"
      style={{
        opacity: 0.5,
        fill: `url(#${scopedId("g97")})`,
      }}
    />
  </svg>
  );
};
