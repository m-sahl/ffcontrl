import React, { useState, useEffect, useRef } from "react";
import Ic from "./common/Ic";
import CodePickerModal from "./CodePickerModal";
import {
  CORAL_PRIMARY,
  EMERALD_SUCCESS,
  RED_DANGER,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT
} from "../styles/DesignTokens";
import { triggerHaptic } from "../utils/haptics";

const ALL_ALPHABETS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
  "U", "V", "W", "X", "Y", "Z"
];

const getLetterCode = (index) => {
  if (index < 26) return ALL_ALPHABETS[index];
  const first = ALL_ALPHABETS[Math.floor(index / 26) - 1];
  const second = ALL_ALPHABETS[index % 26];
  return `${first}${second}`;
};

const CodeLetterPage = ({
  program,
  participants = [],
  onAssignCode,
  onResetCodes,
  onFinish,
  onBack
}) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleOpenPicker = (student) => {
    triggerHaptic("medium");
    setSelectedStudent(student);
    try {
      window.history.pushState({ modal: "code-picker" }, "");
    } catch {}
  };

  const handleClosePicker = () => {
    triggerHaptic("light");
    if (window.history.state?.modal === "code-picker") {
      window.history.back();
    } else {
      setSelectedStudent(null);
    }
  };

  useEffect(() => {
    const handlePop = () => {
      if (selectedStudent) {
        setSelectedStudent(null);
      }
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [selectedStudent]);
  const isOffStage = program?.session === "Off-Stage";
  const autoAssignedRef = useRef(false);

  const presentParticipants = participants.filter(p => p.isPresent);
  const assignedCodes = presentParticipants.map(p => p.codeLetter).filter(Boolean);
  const totalLettersPool = presentParticipants.map((_, i) => getLetterCode(i));
  const remainingLetters = totalLettersPool.filter(l => !assignedCodes.includes(l));

  // Automatically assign random code letters for Off-Stage programs
  useEffect(() => {
    if (isOffStage && presentParticipants.length > 0 && !autoAssignedRef.current) {
      const unassigned = presentParticipants.filter(p => !p.codeLetter);
      if (unassigned.length > 0) {
        autoAssignedRef.current = true;
        const pool = presentParticipants.map((_, i) => getLetterCode(i));
        const alreadyUsed = new Set(presentParticipants.map(p => p.codeLetter).filter(Boolean));
        const available = pool.filter(l => !alreadyUsed.has(l));

        // Fisher-Yates random shuffle
        for (let i = available.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [available[i], available[j]] = [available[j], available[i]];
        }

        unassigned.forEach((p, idx) => {
          if (available[idx]) {
            onAssignCode(p.id, available[idx]);
          }
        });
      }
    }
  }, [isOffStage, presentParticipants, onAssignCode]);

  const isAllAssigned = presentParticipants.length > 0 && assignedCodes.length === presentParticipants.length;

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

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: isAllAssigned ? EMERALD_SUCCESS : CORAL_PRIMARY
            }}
          >
            {assignedCodes.length} / {presentParticipants.length} Coded
          </div>

          {!isOffStage && assignedCodes.length > 0 && (
            <button
              onClick={() => {
                triggerHaptic("light");
                if (onResetCodes) onResetCodes();
              }}
              style={{
                padding: "4px 10px",
                borderRadius: 8,
                border: "none",
                background: "rgba(239, 68, 68, 0.08)",
                color: RED_DANGER,
                fontSize: 11,
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              Reset
            </button>
          )}
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
          boxShadow: "0 3px 12px rgba(15, 23, 42, 0.04)"
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: CORAL_PRIMARY,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
        >
          {isOffStage ? "Off-Stage Random Codes" : "Spot Code Selection"}
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
          {isOffStage
            ? `Random code letters automatically assigned to all ${presentParticipants.length} present participants.`
            : "Mystery card allocation for judge anonymity"}
        </div>
      </div>

      {/* PARTICIPANT ROWS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {presentParticipants.length === 0 ? (
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
            No participants marked as present. Please go back to Attendance to mark present students.
          </div>
        ) : (
          presentParticipants.map(p => (
            <div
              key={p.id}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                background: "#ffffff",
                border: `1px solid ${p.codeLetter ? "rgba(16, 185, 129, 0.3)" : CARD_BORDER_LIGHT}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 4px rgba(15, 23, 42, 0.02)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: CORAL_PRIMARY,
                    background: "rgba(241, 77, 77, 0.08)",
                    border: "1px solid rgba(241, 77, 77, 0.2)",
                    padding: "2px 7px",
                    borderRadius: 6,
                    flexShrink: 0
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

              <div>
                {p.codeLetter ? (
                  <span
                    style={{
                      fontSize: 12,
                      padding: "5px 14px",
                      fontWeight: 800,
                      color: EMERALD_SUCCESS,
                      background: "rgba(16, 185, 129, 0.08)",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      borderRadius: 8
                    }}
                  >
                    Code {p.codeLetter}
                  </span>
                ) : !isOffStage ? (
                  <button
                    onClick={() => handleOpenPicker(p)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 10,
                      border: "none",
                      background: CORAL_PRIMARY,
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(241, 77, 77, 0.25)",
                      transition: "all 0.15s ease"
                    }}
                  >
                    Draw Card
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: TEXT_MUTED_LIGHT }}>Assigning...</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Code Card Picker Modal (Only for Stage where participants draw manually) */}
      {!isOffStage && (
        <CodePickerModal
          student={selectedStudent}
          remainingLetters={remainingLetters}
          isOpen={!!selectedStudent}
          onClose={handleClosePicker}
          onAssignCode={onAssignCode}
        />
      )}

      {/* Sticky Bottom Action */}
      <div className="bottom-bar">
        <button
          className="btn-mobile-primary"
          onClick={(e) => {
            triggerHaptic("success");
            if (onFinish) onFinish(e);
          }}
          disabled={!isAllAssigned}
          style={{
            maxWidth: 520,
            margin: "0 auto",
            background: isAllAssigned
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              : "#cbd5e1",
            color: isAllAssigned ? "#ffffff" : "#64748b",
            opacity: isAllAssigned ? 1 : 0.6,
            boxShadow: isAllAssigned ? "0 4px 16px rgba(16, 185, 129, 0.3)" : "none"
          }}
        >
          Finish & Set Running{" "}
          <Ic name="checkCircle" size={16} color={isAllAssigned ? "#ffffff" : "#64748b"} />
        </button>
      </div>
    </div>
  );
};

export default CodeLetterPage;
