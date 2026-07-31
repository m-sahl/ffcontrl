import React from "react";
import Ic from "./common/Ic";
import { CORAL_PRIMARY } from "../styles/DesignTokens";

const CallListPage = ({ program, participants, onBack, onStartRegistration }) => {
  return (
    <div className="anim-fade" style={{ maxWidth: 520, margin: "0 auto", padding: "14px 14px 84px" }}>
      
      {/* Borderless Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button
          onClick={onBack}
          style={{
            background: "#ffffff",
            border: "none",
            color: "#0f172a",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
          }}
        >
          <Ic name="back" size={14} /> Back
        </button>

        <span className="badge badge-coral" style={{ padding: "4px 9px", fontSize: 10 }}>CALLING UP ON STAGE</span>
      </div>

      {/* Borderless Program Bar */}
      <div style={{
        background: "#ffffff",
        border: "none",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <div>
          <div style={{ fontSize: 10, color: CORAL_PRIMARY, fontWeight: 800, textTransform: "uppercase" }}>Call List Roster</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{program.name}</div>
        </div>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>
          <span style={{ color: CORAL_PRIMARY, fontSize: 17 }}>{participants.length}</span> Entries
        </div>
      </div>

      {/* BORDERLESS PARTICIPANT LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {participants.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: "#64748b", fontSize: 12 }}>
            No registered participants
          </div>
        ) : (
          participants.map(p => (
            <div key={p.id} style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "#ffffff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: CORAL_PRIMARY,
                  background: "#fee2e2",
                  padding: "3px 8px",
                  borderRadius: 8,
                  minWidth: 44,
                  textAlign: "center"
                }}>
                  #{p.chestNo}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{p.name}</span>
              </div>

              <span style={{ fontSize: 11, color: p.groupColor, fontWeight: 800 }}>
                {p.groupName}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Sticky Bottom Action */}
      <div className="bottom-bar">
        <button className="btn-mobile-primary" onClick={onStartRegistration}>
          Start Registration <Ic name="arrowRight" size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default CallListPage;
