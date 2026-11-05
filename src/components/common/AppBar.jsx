import React from "react";
import Ic from "./Ic";
import { CORAL_PRIMARY, EMERALD_SUCCESS, CARD_BORDER_LIGHT, TEXT_PRIMARY_LIGHT, TEXT_MUTED_LIGHT } from "../../styles/DesignTokens";
import { triggerHaptic } from "../../utils/haptics";

const AppBar = ({
  currentTab,
  selectedSession = "Off-Stage",
  subView,
  onBack,
  onOpenSettings,
  activeStreams,
  programs = []
}) => {
  // Only show LIVE indicator if any genuine program is currently running in the active session
  const hasLiveStream = programs.some(p => {
    const isRunning = (p.status || "").toLowerCase() === "running";
    if (!isRunning) return false;
    // Stage session is currently opening soon / not started
    if (selectedSession === "Stage") return false;
    return p.session === selectedSession;
  });

  // Derive title based on subView or tab
  let title = "FestFlow Control";
  let subtitle = "Control Desk";
  let showBackButton = false;

  if (subView === "call-list") {
    title = "Call Sheet";
    subtitle = "Participant Roster";
    showBackButton = true;
  } else if (subView === "attendance") {
    title = "Attendance Desk";
    subtitle = "Check-in Registry";
    showBackButton = true;
  } else if (subView === "code-letter") {
    title = "Code Allocation";
    subtitle = "Secret Chest Letters";
    showBackButton = true;
  } else if (selectedSession === "Off-Stage") {
    title = "Off-Stage Desk";
    subtitle = hasLiveStream ? "Live Competitions" : "Off-Stage Programs";
    showBackButton = false;
  } else {
    title = "Stage Session";
    subtitle = "Opening Soon";
    showBackButton = false;
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 80,
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${CARD_BORDER_LIGHT}`,
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.03)"
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 56
        }}
      >
        {/* Left Section: Back button (Desktop only when showBackButton) or Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {showBackButton && (
            <button
              onClick={(e) => {
                triggerHaptic("light");
                if (onBack) onBack(e);
              }}
              className="ui-back-btn"
              style={{
                background: "#ffffff",
                border: `1px solid ${CARD_BORDER_LIGHT}`,
                borderRadius: 10,
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: TEXT_PRIMARY_LIGHT,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                transition: "transform 0.15s ease"
              }}
              aria-label="Go back"
            >
              <Ic name="back" size={16} />
            </button>
          )}

          <div
            className={`appbar-logo ${showBackButton ? "desktop-hide-when-back" : ""}`}
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              background: "linear-gradient(135deg, #f14d4d 0%, #d63333 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 3px 10px rgba(241, 77, 77, 0.3)"
            }}
          >
            <Ic name="zap" size={18} color="#ffffff" />
          </div>

          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                color: CORAL_PRIMARY,
                lineHeight: 1.1
              }}
            >
              {subtitle}
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: TEXT_PRIMARY_LIGHT,
                lineHeight: 1.2,
                letterSpacing: "-0.4px"
              }}
            >
              {title}
            </div>
          </div>
        </div>

        {/* Right Section: Live Stream Indicator and Settings */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {hasLiveStream && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(16, 185, 129, 0.08)",
                color: EMERALD_SUCCESS,
                border: "1px solid rgba(16, 185, 129, 0.25)",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.4px"
              }}
            >
              <span className="blink-indicator" style={{ background: EMERALD_SUCCESS, marginRight: 5 }} />
              LIVE
            </div>
          )}

          <button
            onClick={(e) => {
              triggerHaptic("light");
              if (onOpenSettings) onOpenSettings(e);
            }}
            title="Portal Settings"
            style={{
              background: "#ffffff",
              border: `1px solid ${CARD_BORDER_LIGHT}`,
              borderRadius: 10,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: TEXT_MUTED_LIGHT,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              transition: "transform 0.15s ease"
            }}
            aria-label="Settings"
          >
            <Ic name="settings" size={18} color={TEXT_MUTED_LIGHT} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppBar;
