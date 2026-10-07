import { useEffect, useRef, useState } from "react";
import { Container } from "./styles";
import Helper from "../../../utils/Helper";
import { useStorage } from "../../../utils/Storage";

export const ProgressBar = () => {
  const [timeInPercent, setTimeInPercent] = useState(0);
  const { setItem, getItem } = useStorage();

  const currentTime = useRef(0);

  const secondsToExpire = 100;

  const calculatePercent = () => {
    const percent = (currentTime.current / secondsToExpire) * 100;
    setTimeInPercent(percent);
  };

  const showTimeLeft = () => {
    return secondsToExpire - currentTime.current || 0;
  };

  const timerWaiting = Helper.transformSecondsToMinutes(showTimeLeft());

  useEffect(() => {
    const startedCounting = getItem("startedCounting");
    if (startedCounting) {
      const diff = Helper.diffSeconds(JSON.parse(startedCounting));
      currentTime.current =
        Number(diff) > secondsToExpire ? secondsToExpire : Number(diff);
    } else {
      setItem("startedCounting", JSON.stringify(new Date()));
    }
  }, []);

  useEffect(() => {
    if (timeInPercent < 100) {
      const inteval = setInterval(() => {
        currentTime.current = currentTime.current + 1;
        calculatePercent();
      }, 1000);
      return () => clearInterval(inteval);
    }
  }, [timeInPercent]);

  return (
    <Container width={timeInPercent}>
      <div className="progress-bar"></div>
      <div className="title-container">
        <span className="time-title bolder">
          {timeInPercent <= 99.99
            ? `Tempo para chegar no veículo: ${timerWaiting || "00:00"}`
            : "Tempo para chegada esgotado"}
        </span>
      </div>
    </Container>
  );
};
