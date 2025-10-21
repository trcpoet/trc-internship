import React, { useEffect, useState } from "react";

const CountdownTimer = ({ deadline }) => {
  const getTimeLeft = (deadlineValue) => {
    const deadlineTime = typeof deadlineValue === "string"
      ? new Date(Number(deadlineValue)).getTime()
      : deadlineValue;

    const total = deadlineTime - Date.now();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    return total > 0 ? { hours, minutes, seconds } : null;
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = getTimeLeft(deadline);
      if (!newTime) clearInterval(interval);
      setTimeLeft(newTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  useEffect(() => {
    console.log("Parsed Deadline:", deadline); // Use deadline instead of deadlineValue
    console.log("Time Left:", timeLeft);
  }, [deadline, timeLeft]); // Update dependency array

  if (!timeLeft) return null;

  return (
    <div>
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

export default CountdownTimer;
