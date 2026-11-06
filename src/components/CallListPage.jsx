import React from "react";
import Ic from "./common/Ic";
import {
  CORAL_PRIMARY,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT
} from "../styles/DesignTokens";
import { triggerHaptic } from "../utils/haptics";

const CallListPage = ({ program, participants = [], onBack, onStartRegistration }) => {
  return (
    <div
      className="anim-fade"
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "16px 16px 120px"
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14
        }}
      >
        <button
          onClick={(e) => {
            triggerHaptic("light");
            if (onBack) onBack(e);
          }}
          className="ui-back-btn"
          style={{
            background: "#ffffff",
            border: `1px solid ${CARD_BORDER_LIGHT}`,
            color: TEXT_PRIMARY_LIGHT,
            borderRadius: 10,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)"
          }}
        >
          <Ic name="back" size={14} /> Back
        </button>

        <span
          className="badge badge-coral"
          style={{
            padding: "4px 10px",
            fontSize: 10,
            letterSpacing: "0.5px"
          }}
        >
          CALLING UP ON {program.session ? program.session.toUpperCase() : "STAGE"}
        </span>
      </div>

      {/* Program Summary Card (Leader APK elevated card) */}
      <div
        style={{
          background: "#ffffff",
          border: `1.2px solid ${CARD_BORDER_LIGHT}`,
          borderRadius: 18,
          padding: "16px 18px",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 3px 12px rgba(15, 23, 42, 0.04)"
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: CORAL_PRIMARY,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}
          >
            Call List Roster
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: TEXT_PRIMARY_LIGHT,
              letterSpacing: "-0.3px",
              marginTop: 2
            }}
          >
            {program.name}
          </div>
          <div style={{ fontSize: 12, color: TEXT_MUTED_LIGHT, marginTop: 2 }}>
            {program.category} • {program.session}
          </div>
        </div>

        <div
          style={{
            background: "rgba(241, 77, 77, 0.08)",
            border: "1px solid rgba(241, 77, 77, 0.2)",
            borderRadius: 12,
            padding: "8px 14px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: CORAL_PRIMARY, lineHeight: 1 }}>
            {participants.length}
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: TEXT_MUTED_LIGHT, marginTop: 2 }}>
            Entries
          </div>
        </div>
      </div>

      {/* PARTICIPANT LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {participants.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "36px 16px",
              background: "#ffffff",
              borderRadius: 18,
              border: `1px solid ${CARD_BORDER_LIGHT}`,
              color: TEXT_MUTED_LIGHT,
              fontSize: 13
            }}
          >
            No registered participants found for this program
          </div>
        ) : (
          participants.map(p => (
            <div
              key={p.id}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                background: "#ffffff",
                border: `1px solid ${CARD_BORDER_LIGHT}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 4px rgba(15, 23, 42, 0.02)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: CORAL_PRIMARY,
                    background: "rgba(241, 77, 77, 0.08)",
                    border: "1px solid rgba(241, 77, 77, 0.2)",
                    padding: "3px 8px",
                    borderRadius: 8,
                    minWidth: 46,
                    textAlign: "center"
                  }}
                >
                  #{p.chestNo}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: TEXT_PRIMARY_LIGHT,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {p.name}
                </span>
              </div>

              <span
                style={{
                  fontSize: 11,
                  color: p.groupColor || CORAL_PRIMARY,
                  fontWeight: 800,
                  background: `${p.groupColor || CORAL_PRIMARY}12`,
                  padding: "3px 8px",
                  borderRadius: 6
                }}
              >
                {p.groupName}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Sticky Bottom Action */}
      <div className="bottom-bar">
        <button
          className="btn-mobile-primary"
          onClick={(e) => {
            triggerHaptic("medium");
            if (onStartRegistration) onStartRegistration(e);
          }}
          style={{ maxWidth: 520, margin: "0 auto" }}
        >
          Start Registration Desk <Ic name="arrowRight" size={16} color="#ffffff" />
        </button>
      </div>
    </div>
  );
};

export default CallListPage;
