import React from "react";
import Ic from "./common/Ic";
import {
  CORAL_PRIMARY,
  EMERALD_SUCCESS,
  RED_DANGER,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT
} from "../styles/DesignTokens";

const AttendancePage = ({
  program,
  participants = [],
  onUpdateAttendance,
  onBatchAttendance,
  onBack,
  onProceedToCodeLetter
}) => {
  const totalCount = participants.length;
  const presentCount = participants.filter(p => p.isPresent).length;
  const absentCount = totalCount - presentCount;

  return (
    <div
      className="anim-fade"
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "16px 16px 120px"
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14
        }}
      >
        <button
          onClick={onBack}
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 800
          }}
        >
          <span className="badge badge-emerald">
            {presentCount} Present
          </span>
          <span className="badge badge-red">
            {absentCount} Absent
          </span>
        </div>
      </div>

      {/* Program Summary Card */}
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
            Attendance Desk
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

        <button
          onClick={() => onBatchAttendance(program.id, participants.map(p => p.id), presentCount !== totalCount)}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: `1px solid ${CARD_BORDER_LIGHT}`,
            background: "#f1f4f9",
            color: "#334155",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          {presentCount === totalCount ? "Uncheck All" : "Check All"}
        </button>
      </div>

      {/* CHECKLIST ROWS */}
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
            No participants available for attendance
          </div>
        ) : (
          participants.map(p => (
            <div
              key={p.id}
              onClick={() => onUpdateAttendance(program.id, p.id, !p.isPresent)}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                background: "#ffffff",
                border: `1px solid ${p.isPresent ? "rgba(16, 185, 129, 0.3)" : CARD_BORDER_LIGHT}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(15, 23, 42, 0.02)",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Checkbox indicator */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    background: p.isPresent ? EMERALD_SUCCESS : "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0,
                    transition: "all 0.15s ease"
                  }}
                >
                  {p.isPresent && <Ic name="check" size={14} color="#ffffff" />}
                </div>

                <div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: CORAL_PRIMARY,
                      background: "rgba(241, 77, 77, 0.08)",
                      border: "1px solid rgba(241, 77, 77, 0.2)",
                      padding: "2px 7px",
                      borderRadius: 6,
                      marginRight: 8
                    }}
                  >
                    #{p.chestNo}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: p.isPresent ? TEXT_PRIMARY_LIGHT : "#94a3b8"
                    }}
                  >
                    {p.name}
                  </span>
                </div>
              </div>

              <span
                className={p.isPresent ? "badge badge-emerald" : "badge badge-red"}
                style={{ fontSize: 10 }}
              >
                {p.isPresent ? "PRESENT" : "ABSENT"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Sticky Bottom Action */}
      <div className="bottom-bar">
        <button
          className="btn-mobile-primary"
          onClick={onProceedToCodeLetter}
          disabled={presentCount === 0}
          style={{
            maxWidth: 520,
            margin: "0 auto",
            opacity: presentCount === 0 ? 0.5 : 1
          }}
        >
          Assign Code Letters ({presentCount} Present){" "}
          <Ic name="shuffle" size={16} color="#ffffff" />
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
