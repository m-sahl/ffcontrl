import React from "react";
import { createPortal } from "react-dom";
import Ic from "./common/Ic";
import {
  CORAL_PRIMARY,
  RED_DANGER,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT
} from "../styles/DesignTokens";

const EndProgramModal = ({ program, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !program) return null;

  return createPortal(
    <div
      className="anim-fade"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 150,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center"
      }}
    >
      <div
        className="anim-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 500,
          background: "#ffffff",
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          borderTop: `1.2px solid ${CARD_BORDER_LIGHT}`,
          padding: "16px 20px 28px",
          boxShadow: "0 -12px 36px rgba(15, 23, 42, 0.12)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          textAlign: "center"
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: "#cbd5e1",
            margin: "0 auto 2px"
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span className="badge badge-coral" style={{ fontSize: 10 }}>
            CONFIRM END PROGRAM
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#f1f4f9",
              border: `1px solid ${CARD_BORDER_LIGHT}`,
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: TEXT_MUTED_LIGHT,
              cursor: "pointer"
            }}
            aria-label="Close"
          >
            <Ic name="x" size={14} />
          </button>
        </div>

        {/* Warning Icon Badge */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            color: RED_DANGER
          }}
        >
          <Ic name="checkCircle" size={26} color={RED_DANGER} />
        </div>

        {/* Program Name */}
        <div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: TEXT_PRIMARY_LIGHT,
              letterSpacing: "-0.3px",
              marginBottom: 6
            }}
          >
            End "{program.name}"?
          </h3>

          <p
            style={{
              fontSize: 13,
              color: TEXT_MUTED_LIGHT,
              padding: "0 10px",
              lineHeight: 1.5
            }}
          >
            Are you sure you want to finish and end the{" "}
            <strong style={{ color: TEXT_PRIMARY_LIGHT }}>{program.session}</strong> session for this program?
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 14,
              border: `1px solid ${CARD_BORDER_LIGHT}`,
              background: "#ffffff",
              color: TEXT_MUTED_LIGHT,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm(program.id);
              onClose();
            }}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #f14d4d 0%, #dc2626 100%)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(241, 77, 77, 0.3)"
            }}
          >
            Confirm & End
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EndProgramModal;
