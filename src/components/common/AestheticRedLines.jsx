import React from "react";

// In the Leader APK, the background is a pristine, crisp corporate SaaS surface
// with an ultra-subtle top ambient warm splash (AppColors.lightAmbientSplash).
const AestheticRedLines = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 240,
        pointerEvents: "none",
        zIndex: 0,
        background: "radial-gradient(circle at 50% 0%, rgba(241, 77, 77, 0.04) 0%, transparent 70%)"
      }}
    />
  );
};

export default AestheticRedLines;
