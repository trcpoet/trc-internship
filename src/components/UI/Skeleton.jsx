import React from "react";

const Skeleton = ({ width, height, borderRadius, style={} }) => {
  return (
    <div
      className="skeleton-box"
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    ></div>
  );
};

export default Skeleton;
