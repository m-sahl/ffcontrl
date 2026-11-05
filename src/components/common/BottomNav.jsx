import React from "react";
import Ic from "./Ic";
import { CORAL_PRIMARY, CARD_BORDER_LIGHT, TEXT_MUTED_LIGHT } from "../../styles/DesignTokens";

const BottomNav = ({
  selectedSession = "Off-Stage",
  onSelectSession,
  offStageBadgeCount = 0
}) => {
  const tabs = [
    {
      id: "Off-Stage",
      label: "Off-Stage Desk",
      icon: "palette",
      badge: offStageBadgeCount > 0 ? offStageBadgeCount : null
    },
    {
      id: "Stage",
      label: "Stage",
      icon: "theater"
    }
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 18,
        left: 0,
        right: 0,
        zIndex: 85,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "0 16px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          height: 66,
          background: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: 26,
          padding: "6px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)",
          border: `1.2px solid ${CARD_BORDER_LIGHT}`,
          pointerEvents: "auto"
        }}
      >
        {tabs.map((tab) => {
          const isSelected = selectedSession === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectSession && onSelectSession(tab.id)}
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 4px",
                background: isSelected ? "rgba(241, 77, 77, 0.08)" : "transparent",
                border: "none",
                borderRadius: 18,
                cursor: "pointer",
                transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
                color: isSelected ? CORAL_PRIMARY : TEXT_MUTED_LIGHT,
                position: "relative"
              }}
            >
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic
                  name={tab.icon}
                  size={22}
                  color={isSelected ? CORAL_PRIMARY : TEXT_MUTED_LIGHT}
                />
                {tab.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -10,
                      background: CORAL_PRIMARY,
                      color: "#ffffff",
                      fontSize: 9,
                      fontWeight: 800,
                      borderRadius: 10,
                      padding: "1px 5px",
                      minWidth: 16,
                      textAlign: "center",
                      lineHeight: "14px",
                      border: "1.5px solid #ffffff",
                      boxShadow: "0 2px 4px rgba(241, 77, 77, 0.3)"
                    }}
                  >
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isSelected ? 700 : 500,
                  marginTop: 3,
                  letterSpacing: "-0.1px",
                  lineHeight: 1
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
