import React, { useCallback, useEffect, useMemo, useState } from "react";

const getDeadlineTime = (deadlineValue) => {
  if (!deadlineValue) return null;

  if (deadlineValue instanceof Date) {
    return deadlineValue.getTime();
  }

  const numericValue =
    typeof deadlineValue === "string"
      ? Number(deadlineValue.trim())
      : deadlineValue;

  if (typeof numericValue === "number" && Number.isFinite(numericValue)) {
    if (numericValue > 1e12) {
      return numericValue;
    }

    if (numericValue > 1e9) {
      return numericValue * 1000;
    }

    // Treat smaller numbers as an offset (seconds) from "now"
    return Date.now() + numericValue * 1000;
  }

  if (typeof deadlineValue === "string") {
    const parsed = Date.parse(deadlineValue);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
};

const CountdownTimer = ({ deadline }) => {
  const deadlineTime = useMemo(() => getDeadlineTime(deadline), [deadline]);

  const calculateTimeLeft = useCallback(() => {
    if (!deadlineTime) return null;

    const total = deadlineTime - Date.now();
    const clampedTotal = Math.max(total, 0);

    const totalSeconds = Math.floor(clampedTotal / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const days = Math.floor(totalSeconds / 86400);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: total <= 0
    };
  }, [deadlineTime]);

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    if (!deadlineTime) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTime = calculateTimeLeft();
      if (!newTime) {
        clearInterval(interval);
        setTimeLeft(null);
        return;
      }
      setTimeLeft(newTime);
      if (newTime.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft, deadlineTime]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("CountdownTimer", {
        deadline,
        deadlineTime,
        timeLeft
      });
    }
  }, [deadline, deadlineTime, timeLeft]);

  if (!deadlineTime || !timeLeft) return null;

  const pad = (value) => String(value).padStart(2, "0");

  return timeLeft.isExpired
    ? "Expired"
    : `${
        timeLeft.days > 0 ? `${timeLeft.days}d ` : ""
      }${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(
        timeLeft.seconds
      )}s`;
};

export default CountdownTimer;
