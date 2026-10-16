import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFValue } from "react-native-responsive-fontsize";

const STORAGE_KEY = "waitingTimer";

const TimerCircle = ({ initialSeconds = 0, onTimeUpdate }) => {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [elapsedAfterTolerance, setElapsedAfterTolerance] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const radius = RFValue(25);
  const strokeWidth = RFValue(4);
  const circumference = 2 * Math.PI * radius;

  // iniciar sessão no storage
  const startWaiting = async () => {
    const now = Date.now();
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    let data = raw ? JSON.parse(raw) : { startTime: null, totalPaused: 0 };

    if (!data.startTime) {
      data.startTime = now;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  };

  // calcular tempo acumulado até agora
  const getElapsed = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;

    const data = JSON.parse(raw);
    let elapsed = data.totalPaused;

    if (data.startTime) {
      elapsed += Math.floor((Date.now() - data.startTime) / 1000);
    }

    return elapsed;
  };

  // ao montar, inicia e carrega valor
  useEffect(() => {
    const init = async () => {
      await startWaiting();
      const elapsed = await getElapsed();

      if (elapsed < initialSeconds) {
        setRemaining(initialSeconds - elapsed);
        setElapsedAfterTolerance(0);
      } else {
        setRemaining(0);
        setElapsedAfterTolerance(elapsed - initialSeconds);
      }

      onTimeUpdate?.(elapsed);
    };
    init();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await startWaiting();
      const elapsed = await getElapsed();

      if (!isMounted) return;

      if (elapsed < initialSeconds) {
        setRemaining(initialSeconds - elapsed);
        setElapsedAfterTolerance(0);
      } else {
        setRemaining(0);
        setElapsedAfterTolerance(elapsed - initialSeconds);
      }

      onTimeUpdate?.(elapsed);
    };

    init();

    intervalRef.current = setInterval(async () => {
      const elapsed = await getElapsed();
      if (!isMounted) return;

      if (elapsed < initialSeconds) {
        setRemaining(initialSeconds - elapsed);
        setElapsedAfterTolerance(0);
      } else {
        setRemaining(0);
        setElapsedAfterTolerance(elapsed - initialSeconds);
      }

      onTimeUpdate?.(elapsed);
    }, 1000);

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initialSeconds]);

  const formatTime = (secs: number) => {
    const safe = Math.max(0, Number(secs) || 0);
    const m = String(Math.floor(safe / 60)).padStart(2, "0");
    const s = String(safe % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const progress =
    initialSeconds > 0 ? remaining / initialSeconds : 0;
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset =
    circumference - circumference * safeProgress;

  const activeColor = remaining > 0 ? "green" : "gray";

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.timerContainer,
          { width: radius * 2 + RFValue(20), height: radius * 2 + RFValue(20) },
        ]}
      >
        <Svg height={radius * 2 + RFValue(20)} width={radius * 2 + RFValue(20)}>
          <Circle
            stroke="#e6e6e6"
            fill="none"
            cx={radius + RFValue(10)}
            cy={radius + RFValue(10)}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={activeColor}
            fill="none"
            cx={radius + RFValue(10)}
            cy={radius + RFValue(10)}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={[circumference, circumference]}
            strokeDashoffset={isNaN(strokeDashoffset) ? 0 : strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>

        <View style={styles.timeOverlay} pointerEvents="none">
          <Text style={[styles.timeText, { color: activeColor, fontSize: RFValue(16) }]}>
            {remaining > 0 ? formatTime(remaining) : formatTime(elapsedAfterTolerance)}
          </Text>
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.infoText} numberOfLines={3}>
          {remaining > 0
            ? "Após o tempo de tolerância a cobrança pelo tempo de espera será iniciada."
            : "A cobrança pelo tempo de espera iniciou"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", padding: RFValue(10) },
  timerContainer: { alignItems: "center", justifyContent: "center" },
  timeOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  timeText: { fontSize: RFValue(22), fontWeight: "bold" },
  textContainer: { flex: 1, marginLeft: RFValue(16) },
  infoText: { fontSize: RFValue(14), color: "#555" },
});

export default TimerCircle;
