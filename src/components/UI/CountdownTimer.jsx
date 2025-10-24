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
      return numericValue; // It's already in milliseconds
    }

    if (numericValue > 1e9) {
      return numericValue * 1000; // It's in seconds, so convert to ms
    }

    // Treat smaller numbers as an offset (seconds) from "now"
    return Date.now() + numericValue * 1000; //Assume it's a relative offset from now
  }

  if (typeof deadlineValue === "string") {
    const parsed = Date.parse(deadlineValue);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  //If it’s a string like "2025-10-22T12:00:00Z", try to parse it into a timestamp using Date.parse().

  return null;
};

const CountdownTimer = ({ deadline }) => {
  const deadlineTime = useMemo(() => getDeadlineTime(deadline), [deadline]);
  //Memoize the result of getDeadlineTime to avoid recalculating it on every render unless deadline changes.

  const calculateTimeLeft = useCallback(() => {
    if (!deadlineTime) return null;

    const total = deadlineTime - Date.now(); // total ms remaining
    const clampedTotal = Math.max(total, 0); // prevent negative values
    //If the time is in the past, we clamp it to zero so nothing breaks.

    const totalSeconds = Math.floor(clampedTotal / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const days = Math.floor(totalSeconds / 86400);
    //Convert milliseconds → seconds, then break it down into days, hours, minutes, seconds.

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: total <= 0
    };
  }, [deadlineTime]);
    //Return an object representing the time left. isExpired will be true when countdown hits 0.


  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());
  // Initialize state with the current countdown value.

  useEffect(() => {
    if (!deadlineTime) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(calculateTimeLeft()); //update initially 
    //If deadline is missing, no need to do anything.

    const interval = setInterval(() => {
      const newTime = calculateTimeLeft();
      if (!newTime) {
        clearInterval(interval);
        setTimeLeft(null);
        return;
      }
      setTimeLeft(newTime);
      if (newTime.isExpired) {
        clearInterval(interval); // stop when expired
      }
    }, 1000);
//Starts a timer using setInterval. Every second, it:
//Calculates new time left
//Stops if the time is expired


    return () => clearInterval(interval); //// clean up on unmount
  }, [calculateTimeLeft, deadlineTime]);
  //Always clean up timers in React to avoid memory leaks.

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("CountdownTimer", {
        deadline,
        deadlineTime,
        timeLeft
      });
    }
  }, [deadline, deadlineTime, timeLeft]);
  //Just logs helpful info during development — not necessary but very useful while debugging.

  if (!deadlineTime || !timeLeft) return null;
  // Final Display: If data isn't ready yet, show nothing.

  const pad = (value) => String(value).padStart(2, "0");
  // Pads single digits like 5 → 05.

  return timeLeft.isExpired
    ? "Expired"
    : `${
        timeLeft.days > 0 ? `${timeLeft.days}d ` : ""
      }${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(
        timeLeft.seconds
      )}s`;
};

export default CountdownTimer;
