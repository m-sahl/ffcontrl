import React from "react";
import Ic from "./common/Ic";
import { CORAL_PRIMARY, EMERALD_SUCCESS, RED_DANGER } from "../styles/DesignTokens";

const EndProgramModal = ({ program, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !program) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(15, 23, 42, 0.6)",
        padding: 0
      }}
      onClick={onClose}
    >
      <div
        className="anim-fade"
        style={{
          width: "100%",
          maxWidth: 520,
          padding: "24px 20px 32px",
          background: "#ffffff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          border: "none",
          textAlign: "center",
          boxShadow: "0 -12px 36px rgba(0,0,0,0.12)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle / Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span className="badge badge-coral" style={{ fontSize: 10 }}>CONFIRM END PROGRAM</span>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#64748b", padding: 4 }}>
            <Ic name="x" size={20} />
          </button>
        </div>

        {/* Warning Icon Badge */}
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: "#fee2e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 14px",
          color: RED_DANGER
        }}>
          <Ic name="checkCircle" size={26} color={RED_DANGER} />
        </div>

        {/* Program Name */}
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
          End "{program.name}"?
        </h3>

        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 24, padding: "0 10px" }}>
          Are you sure you want to complete and end the <strong style={{ color: "#0f172a" }}>{program.session}</strong> session for this program?
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 12,
              border: "none",
              background: "#f1f5f9",
              color: "#334155",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm(program.id);
              onClose();
            }}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 12,
              border: "none",
              background: CORAL_PRIMARY,
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(241, 77, 77, 0.25)"
            }}
          >
            Confirm & End
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndProgramModal;
