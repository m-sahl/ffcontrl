import React from "react";
import Ic from "./common/Ic";
import { CORAL_PRIMARY } from "../styles/DesignTokens";

const StreamModal = ({ program, participantsCount, isOpen, onClose, onStream }) => {
  if (!isOpen || !program) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
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
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          border: "none",
          boxShadow: "0 -12px 36px rgba(0, 0, 0, 0.12)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CORAL_PRIMARY
            }}>
              <Ic name="play" size={18} color={CORAL_PRIMARY} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.8px", color: CORAL_PRIMARY }}>
                Stage Call Up
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
                Call Up Program
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              padding: 4
            }}
          >
            <Ic name="x" size={20} />
          </button>
        </div>

        {/* Details Card */}
        <div style={{
          background: "#f8fafc",
          borderRadius: 14,
          padding: 16,
          marginBottom: 18
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
            {program.name}
          </div>
          
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            <span className="badge badge-coral">{program.category}</span>
            <span className="badge badge-slate">{program.session}</span>
            <span className="badge badge-slate">{program.type}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#64748b" }}>Registered Entries</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: CORAL_PRIMARY, marginTop: 2 }}>
                {participantsCount} Entries
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#64748b" }}>Criteria Items</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#334155", marginTop: 4 }}>
                {program.criteria?.length || 0} Items
              </div>
            </div>
          </div>
        </div>

        {/* Warning if 0 entries */}
        {participantsCount === 0 && (
          <div style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: "#fee2e2",
            color: "#991b1b",
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 14,
            textAlign: "center"
          }}>
            ⚠️ Cannot call up program with 0 registered entries.
          </div>
        )}

        {/* Footer Buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 10,
              border: "none",
              background: "#f1f5f9",
              color: "#475569",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
          <button
            disabled={participantsCount === 0}
            onClick={() => {
              if (participantsCount > 0) {
                onStream();
              }
            }}
            style={{
              flex: 2,
              height: 44,
              borderRadius: 10,
              border: "none",
              background: participantsCount === 0 ? "#cbd5e1" : CORAL_PRIMARY,
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 13,
              cursor: participantsCount === 0 ? "not-allowed" : "pointer",
              opacity: participantsCount === 0 ? 0.7 : 1,
              boxShadow: participantsCount === 0 ? "none" : "0 4px 14px rgba(241, 77, 77, 0.25)"
            }}
          >
            {participantsCount === 0 ? "No Entries to Call Up" : "Call Up & Open List"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreamModal;
