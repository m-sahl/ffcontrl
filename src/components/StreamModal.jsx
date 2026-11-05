import React from "react";
import { createPortal } from "react-dom";
import Ic from "./common/Ic";
import {
  CORAL_PRIMARY,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT,
  getCategoryColor
} from "../styles/DesignTokens";

const StreamModal = ({ program, participantsCount = 0, isOpen, onClose, onStream }) => {
  if (!isOpen || !program) return null;

  const isOffStage = program.session === "Off-Stage";
  const catColor = getCategoryColor(program.category);

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
          gap: 16
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

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
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
              <Ic name="play" size={18} color={CORAL_PRIMARY} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: CORAL_PRIMARY
                }}
              >
                {program.session?.toUpperCase() || "STAGE"} CALL UP
              </div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: TEXT_PRIMARY_LIGHT,
                  letterSpacing: "-0.3px",
                  marginTop: 1
                }}
              >
                Call Up Program
              </h3>
            </div>
          </div>

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
            <Ic name="x" size={16} />
          </button>
        </div>

        {/* Program Details Card */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: 16,
            border: `1px solid ${CARD_BORDER_LIGHT}`,
            padding: 14
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: TEXT_PRIMARY_LIGHT,
              letterSpacing: "-0.2px",
              marginBottom: 8
            }}
          >
            {program.name}
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            <span
              className="badge"
              style={{
                background: `${catColor}14`,
                color: catColor,
                border: `1px solid ${catColor}33`
              }}
            >
              {program.category}
            </span>
            <span className="badge badge-slate">{program.session}</span>
            <span className="badge badge-slate">{program.type}</span>
          </div>

          {isOffStage ? (
            <div
              style={{
                borderTop: `1px solid ${CARD_BORDER_LIGHT}`,
                paddingTop: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: TEXT_MUTED_LIGHT, fontWeight: 500 }}>
                  Eligibility & Entry
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY_LIGHT, marginTop: 2 }}>
                  All {program.category} Students
                </div>
              </div>
              <span className="badge badge-coral" style={{ fontSize: 11 }}>
                Open to Category
              </span>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                borderTop: `1px solid ${CARD_BORDER_LIGHT}`,
                paddingTop: 10
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: TEXT_MUTED_LIGHT, fontWeight: 500 }}>
                  Registered Entries
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: CORAL_PRIMARY,
                    marginTop: 2
                  }}
                >
                  {participantsCount} Entries
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: TEXT_MUTED_LIGHT, fontWeight: 500 }}>
                  Criteria Evaluation
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#334155",
                    marginTop: 3
                  }}
                >
                  {program.criteria?.length || 0} Items
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notice if 0 entries (Only for Stage where entries are required) */}
        {!isOffStage && participantsCount === 0 && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              color: "#92400e",
              fontSize: 12,
              fontWeight: 600,
              textAlign: "center"
            }}
          >
            ℹ️ No registered entries recorded yet. Calling up will open the roster desk.
          </div>
        )}

        {/* Footer Buttons */}
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
            onClick={onStream}
            style={{
              flex: 2,
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
            Call Up Program
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StreamModal;
