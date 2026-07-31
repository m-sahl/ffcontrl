import React from "react";
import Ic from "./common/Ic";
import { CORAL_PRIMARY, EMERALD_SUCCESS, RED_DANGER } from "../styles/DesignTokens";

const AttendancePage = ({ program, participants, onUpdateAttendance, onBatchAttendance, onBack, onProceedToCodeLetter }) => {
  const totalCount = participants.length;
  const presentCount = participants.filter(p => p.isPresent).length;
  const absentCount = totalCount - presentCount;

  return (
    <div className="anim-fade" style={{ maxWidth: 520, margin: "0 auto", padding: "14px 14px 84px" }}>
      
      {/* Borderless Top Bar */}
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

        <div style={{ fontSize: 12, fontWeight: 800, color: EMERALD_SUCCESS }}>
          {presentCount} Present / {absentCount} Absent
        </div>
      </div>

      {/* Program Header */}
      <div style={{
        background: "#ffffff",
        border: "none",
        borderRadius: 14,
        padding: "12px 14px",
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <div>
          <div style={{ fontSize: 10, color: CORAL_PRIMARY, fontWeight: 800, textTransform: "uppercase" }}>Attendance Desk</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{program.name}</div>
        </div>

        <button
          onClick={() => onBatchAttendance(program.id, participants.map(p => p.id), presentCount !== totalCount)}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "none",
            background: "#f1f5f9",
            color: "#475569",
            fontSize: 11,
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          {presentCount === totalCount ? "Uncheck All" : "Check All"}
        </button>
      </div>

      {/* BORDERLESS CHECKLIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {participants.map(p => (
          <div
            key={p.id}
            onClick={() => onUpdateAttendance(program.id, p.id, !p.isPresent)}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "#ffffff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: "none",
                background: p.isPresent ? EMERALD_SUCCESS : "#e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                flexShrink: 0
              }}>
                {p.isPresent && <Ic name="check" size={13} color="#ffffff" />}
              </div>

              <div>
                <span style={{ fontSize: 13, fontWeight: 800, color: CORAL_PRIMARY, marginRight: 6 }}>#{p.chestNo}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: p.isPresent ? "#0f172a" : "#94a3b8" }}>{p.name}</span>
              </div>
            </div>

            <span style={{ fontSize: 11, fontWeight: 800, color: p.isPresent ? EMERALD_SUCCESS : RED_DANGER }}>
              {p.isPresent ? "PRESENT" : "ABSENT"}
            </span>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Action */}
      <div className="bottom-bar">
        <button
          className="btn-mobile-primary"
          onClick={onProceedToCodeLetter}
          disabled={presentCount === 0}
          style={{ opacity: presentCount === 0 ? 0.5 : 1 }}
        >
          Assign Code Letters <Ic name="shuffle" size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
