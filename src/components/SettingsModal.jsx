import React from "react";
import { createPortal } from "react-dom";
import Ic from "./common/Ic";
import { triggerHaptic } from "../utils/haptics";
import {
  CORAL_PRIMARY,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT
} from "../styles/DesignTokens";

const SettingsModal = ({ isOpen, onClose, onLockDesk }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    triggerHaptic("light");
    onClose();
  };

  const handleLogout = () => {
    triggerHaptic("medium");
    onClose();
    if (onLockDesk) {
      onLockDesk();
    }
  };

  return createPortal(
    <div
      className="anim-fade"
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 150,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 16px 12px"
      }}
    >
      <div
        className="anim-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 500,
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: 22,
          border: `1px solid ${CARD_BORDER_LIGHT}`,
          padding: "18px 20px 20px",
          boxShadow: "0 12px 36px rgba(15, 23, 42, 0.16), 0 2px 8px rgba(0, 0, 0, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(241, 77, 77, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: CORAL_PRIMARY
              }}
            >
              <Ic name="shield" size={18} color={CORAL_PRIMARY} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: TEXT_PRIMARY_LIGHT,
                  letterSpacing: "-0.3px"
                }}
              >
                Operator Session
              </h3>
              <p style={{ fontSize: 11, color: TEXT_MUTED_LIGHT }}>
                FestFlow Control Desk
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: "#f1f4f9",
              border: `1px solid ${CARD_BORDER_LIGHT}`,
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: TEXT_MUTED_LIGHT
            }}
            aria-label="Close"
          >
            <Ic name="x" size={16} />
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #f14d4d 0%, #dc2626 100%)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "0 6px 20px rgba(241, 77, 77, 0.35)",
              transition: "transform 0.15s ease"
            }}
          >
            <Ic name="logout" size={18} color="#ffffff" />
            <span>Log Out / Lock Desk</span>
          </button>

          <button
            onClick={handleClose}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: 14,
              border: `1px solid ${CARD_BORDER_LIGHT}`,
              background: "#f8fafc",
              color: TEXT_MUTED_LIGHT,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SettingsModal;
