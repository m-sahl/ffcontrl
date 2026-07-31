import React, { useState } from "react";
import Ic from "./common/Ic";
import CodePickerModal from "./CodePickerModal";
import { CORAL_PRIMARY, EMERALD_SUCCESS, RED_DANGER } from "../styles/DesignTokens";

const ALL_ALPHABETS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const CodeLetterPage = ({ program, participants, onAssignCode, onResetCodes, onFinish, onBack }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const presentParticipants = participants.filter(p => p.isPresent);
  const assignedCodes = presentParticipants.map(p => p.codeLetter).filter(Boolean);
  const totalLettersPool = ALL_ALPHABETS.slice(0, presentParticipants.length);
  const remainingLetters = totalLettersPool.filter(l => !assignedCodes.includes(l));

  const isAllAssigned = presentParticipants.length > 0 && assignedCodes.length === presentParticipants.length;

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

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: isAllAssigned ? EMERALD_SUCCESS : CORAL_PRIMARY }}>
            {assignedCodes.length} / {presentParticipants.length} Coded
          </div>
          
          {assignedCodes.length > 0 && (
            <button
              onClick={onResetCodes}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: "none",
                background: "#fee2e2",
                color: RED_DANGER,
                fontSize: 10,
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Program Header */}
      <div style={{
        background: "#ffffff",
        border: "none",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <div style={{ fontSize: 10, color: CORAL_PRIMARY, fontWeight: 800, textTransform: "uppercase" }}>Spot Code Selection</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{program.name}</div>
      </div>

      {/* BORDERLESS ROWS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {presentParticipants.map(p => (
          <div
            key={p.id}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "#ffffff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
            }}
          >
            {/* Left Edge: Chest No & Name */}
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: CORAL_PRIMARY, marginRight: 6 }}>#{p.chestNo}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{p.name}</span>
            </div>

            {/* Opposite Edge (Right): Code Button or Assigned Badge */}
            <div>
              {p.codeLetter ? (
                <span style={{
                  fontSize: 12,
                  padding: "5px 12px",
                  fontWeight: 800,
                  color: EMERALD_SUCCESS,
                  background: "#d1fae5",
                  borderRadius: 8
                }}>
                  Code {p.codeLetter}
                </span>
              ) : (
                <button
                  onClick={() => setSelectedStudent(p)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: CORAL_PRIMARY,
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(241, 77, 77, 0.25)"
                  }}
                >
                  Code
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selection Modal */}
      <CodePickerModal
        student={selectedStudent}
        remainingLetters={remainingLetters}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onAssignCode={onAssignCode}
      />

      {/* Sticky Bottom Action */}
      <div className="bottom-bar">
        <button
          className="btn-mobile-primary"
          onClick={onFinish}
          disabled={!isAllAssigned}
          style={{
            background: isAllAssigned ? EMERALD_SUCCESS : "#cbd5e1",
            color: isAllAssigned ? "#0f172a" : "#64748b",
            opacity: isAllAssigned ? 1 : 0.6,
            boxShadow: isAllAssigned ? "0 4px 16px rgba(29, 209, 131, 0.3)" : "none"
          }}
        >
          Finish & Set Running <Ic name="checkCircle" size={16} color={isAllAssigned ? "#0f172a" : "#64748b"} />
        </button>
      </div>
    </div>
  );
};

export default CodeLetterPage;
