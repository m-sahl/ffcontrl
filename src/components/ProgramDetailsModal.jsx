import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Ic from "./common/Ic";
import { triggerHaptic } from "../utils/haptics";
import {
  CORAL_PRIMARY,
  EMERALD_SUCCESS,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT,
  getCategoryColor
} from "../styles/DesignTokens";

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

const ProgramDetailsModal = ({
  program,
  isOpen,
  onClose,
  participants = [],
  onUpdateAttendance,
  onAssignCodeLetter,
  onSaveRoster,
  onReopenProgram
}) => {
  // isEditing controls whether we show the initial read-only coded participants sheet,
  // or the edit mode showing remaining/absent students to add latecomers
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
  const [showNoChangesNotice, setShowNoChangesNotice] = useState(false);
  const [editSnapshot, setEditSnapshot] = useState(null);
  const [showConfirmReopen, setShowConfirmReopen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const isRunning = program?.status === "Running";
  const catColor = program ? getCategoryColor(program.category) : "";

  // 1. Only students who actually participated in this program (explicitly present or assigned a code letter)
  const participatingList = (participants || []).filter(p => {
    return p.isPresent === true || !!p.codeLetter;
  });

  const codedParticipants = (
    !isRunning
      ? participatingList.map((p, idx) => ({
          ...p,
          codeLetter: p.codeLetter || getLetterCode(idx)
        }))
      : (participants || []).filter(p => p.isPresent && p.codeLetter)
  ).sort((a, b) => {
    if (a.codeLetter && b.codeLetter) {
      return a.codeLetter.localeCompare(b.codeLetter);
    }
    return (parseInt(a.chestNo) || 0) - (parseInt(b.chestNo) || 0);
  });

  // Auto-persist code letters into deskState if program is completed and students didn't have one
  useEffect(() => {
    if (isOpen && !isRunning && codedParticipants.length > 0 && onAssignCodeLetter && program) {
      codedParticipants.forEach(p => {
        const orig = (participants || []).find(o => o.id === p.id);
        if (!orig?.codeLetter && p.codeLetter) {
          onAssignCodeLetter(program.id, p.id, p.codeLetter);
        }
      });
    }
  }, [isOpen, isRunning, codedParticipants.length, program?.id]);

  if (!isOpen || !program) return null;

  // 2. Remaining students who are marked absent or don't have code letters
  const remainingParticipants = participants
    .filter(p => !p.codeLetter || !p.isPresent)
    .sort((a, b) => (parseInt(a.chestNo) || 0) - (parseInt(b.chestNo) || 0));

  // 3. Set of all currently assigned code letters
  const usedLettersSet = new Set(
    participants
      .filter(p => p.codeLetter)
      .map(p => p.codeLetter.toUpperCase())
  );

  // 4. Calculate the next available sequential code letter
  let nextAvailableLetter = "A";
  for (let i = 0; i < 100; i++) {
    const candidate = getLetterCode(i);
    if (!usedLettersSet.has(candidate)) {
      nextAvailableLetter = candidate;
      break;
    }
  }

  // Filter remaining participants by search in edit mode
  const filteredRemaining = remainingParticipants.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchName = p.name?.toLowerCase().includes(q);
    const matchChest = p.chestNo?.toString().toLowerCase().includes(q);
    const matchGroup = p.groupName?.toLowerCase().includes(q);
    return matchName || matchChest || matchGroup;
  });

  // Start edit mode with snapshot to track whether any updates actually occur
  const handleStartEditing = () => {
    triggerHaptic("medium");
    const snapshot = {};
    participants.forEach(p => {
      snapshot[p.id] = {
        isPresent: !!p.isPresent,
        codeLetter: p.codeLetter || null
      };
    });
    setEditSnapshot(snapshot);
    setIsEditing(true);
    setSearchQuery("");
  };

  // Assign next code letter to a latecomer
  const handleAdmitLateStudent = (studentId) => {
    triggerHaptic("medium");
    if (onUpdateAttendance) {
      onUpdateAttendance(program.id, studentId, true);
    }
    if (onAssignCodeLetter) {
      onAssignCodeLetter(program.id, studentId, nextAvailableLetter);
    }
  };

  // Revert a student back to absent if added by mistake
  const handleRevertStudent = (studentId) => {
    triggerHaptic("light");
    if (onAssignCodeLetter) {
      onAssignCodeLetter(program.id, studentId, null);
    }
    if (onUpdateAttendance) {
      onUpdateAttendance(program.id, studentId, false);
    }
  };

  // Handle clicking "Update": only show confirmation dialog if updates were made, otherwise notify
  const handleUpdateClick = () => {
    let hasChanges = false;
    if (editSnapshot) {
      for (const p of participants) {
        const snap = editSnapshot[p.id];
        const currentPresent = !!p.isPresent;
        const currentCode = p.codeLetter || null;
        if (!snap || snap.isPresent !== currentPresent || snap.codeLetter !== currentCode) {
          hasChanges = true;
          break;
        }
      }
    }

    if (hasChanges) {
      triggerHaptic("medium");
      setShowConfirmUpdate(true);
    } else {
      triggerHaptic("light");
      setShowNoChangesNotice(true);
    }
  };

  const handleClose = () => {
    triggerHaptic("light");
    setIsEditing(false);
    setShowConfirmUpdate(false);
    setShowNoChangesNotice(false);
    setEditSnapshot(null);
    setSearchQuery("");
    onClose();
  };

  return (
    <>
      {createPortal(
        <div
          className="anim-fade"
          onClick={handleClose}
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
              maxWidth: 520,
              maxHeight: "90vh",
              background: "#ffffff",
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              borderTop: `1.2px solid ${CARD_BORDER_LIGHT}`,
              padding: "16px 18px 22px",
              boxShadow: "0 -12px 36px rgba(15, 23, 42, 0.14)",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
          >
        {/* Pull handle */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: "#cbd5e1",
            margin: "0 auto 10px",
            flexShrink: 0
          }}
        />

        {/* Modal Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
            flexShrink: 0
          }}
        >
          <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: catColor
                }}
              >
                {program.category} • {program.session}
              </span>
              <span>•</span>
              {isRunning ? (
                <span className="badge badge-emerald" style={{ fontSize: 10, padding: "2px 7px" }}>
                  <span className="blink-indicator" style={{ background: EMERALD_SUCCESS, width: 5, height: 5 }} />
                  Running
                </span>
              ) : (
                <span className="badge badge-slate" style={{ fontSize: 10, padding: "2px 7px" }}>
                  Finished
                </span>
              )}
            </div>

            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: TEXT_PRIMARY_LIGHT,
                letterSpacing: "-0.3px",
                lineHeight: 1.25,
                margin: 0
              }}
            >
              {program.name}
            </h3>
          </div>

          <button
            onClick={handleClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#f1f5f9",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: TEXT_MUTED_LIGHT,
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            <Ic name="x" size={16} />
          </button>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: DEFAULT READ-ONLY ASSIGNED CODE LETTERS VIEW    */}
        {/* ======================================================== */}
        {!isEditing && (
          <>
            {/* Header / Counter Banner */}
            <div
              style={{
                background: "#f8fafc",
                border: `1.2px solid ${CARD_BORDER_LIGHT}`,
                borderRadius: 14,
                padding: "10px 14px",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: isRunning ? CORAL_PRIMARY : "#64748b", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                  {isRunning ? "Assigned Code Letters" : "Participation History"}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY_LIGHT, marginTop: 1 }}>
                  {codedParticipants.length} Participating Students
                </div>
              </div>
              <span className={`badge ${isRunning ? "badge-coral" : "badge-slate"}`} style={{ fontSize: 11, padding: "4px 9px" }}>
                {isRunning ? "Active Roster" : "Finalized"}
              </span>
            </div>

            {/* Scrollable list of students who have code letters ONLY */}
            <div
              className="no-scrollbar"
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                paddingRight: 2,
                marginBottom: 14
              }}
            >
              {codedParticipants.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "36px 16px",
                    color: TEXT_MUTED_LIGHT,
                    fontSize: 13,
                    background: "#f8fafc",
                    borderRadius: 16,
                    border: `1px dashed ${CARD_BORDER_LIGHT}`
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>📋</div>
                  {isRunning
                    ? "No code letters have been assigned yet."
                    : "No participating student records found."}
                </div>
              ) : (
                codedParticipants.map(st => (
                  <div
                    key={st.id}
                    style={{
                      padding: "11px 14px",
                      borderRadius: 14,
                      background: "#ffffff",
                      border: `1.2px solid ${CARD_BORDER_LIGHT}`,
                      boxShadow: "0 1px 4px rgba(15, 23, 42, 0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12
                    }}
                  >
                    {/* Left: Chest No, Name, Group */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          background: `${catColor}14`,
                          color: catColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 800,
                          flexShrink: 0
                        }}
                      >
                        {st.chestNo || "—"}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: TEXT_PRIMARY_LIGHT,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {st.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: TEXT_MUTED_LIGHT,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 2
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: st.groupColor || "#94a3b8"
                            }}
                          />
                          <span style={{ fontWeight: 600 }}>{st.groupName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Code Letter Badge */}
                    <div
                      style={{
                        minWidth: 36,
                        height: 34,
                        padding: "0 10px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #f14d4d 0%, #dc2626 100%)",
                        color: "#ffffff",
                        fontSize: 14,
                        fontWeight: 900,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(241, 77, 77, 0.28)",
                        letterSpacing: "0.5px",
                        flexShrink: 0
                      }}
                    >
                      {st.codeLetter}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Action Bar */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              {isRunning ? (
                <>
                  <button
                    onClick={handleStartEditing}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #f14d4d 0%, #dc2626 100%)",
                      border: "none",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 4px 14px rgba(241, 77, 77, 0.28)"
                    }}
                  >
                    <Ic name="edit" size={15} color="#ffffff" /> Edit / Add Late Student
                  </button>

                  <button
                    onClick={handleClose}
                    style={{
                      padding: "0 20px",
                      height: 44,
                      borderRadius: 14,
                      background: "#ffffff",
                      border: `1.2px solid ${CARD_BORDER_LIGHT}`,
                      color: TEXT_PRIMARY_LIGHT,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer"
                    }}
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleStartEditing}
                    style={{
                      flex: 1.3,
                      height: 44,
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #f14d4d 0%, #dc2626 100%)",
                      border: "none",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      boxShadow: "0 4px 14px rgba(241, 77, 77, 0.28)"
                    }}
                  >
                    <Ic name="edit" size={14} color="#ffffff" /> Edit / Add Late Student
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic("medium");
                      setShowConfirmReopen(true);
                    }}
                    style={{
                      flex: 0.9,
                      height: 44,
                      borderRadius: 14,
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1.2px solid rgba(16, 185, 129, 0.3)",
                      color: "#065f46",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5
                    }}
                  >
                    <Ic name="play" size={13} color="#065f46" /> Resume
                  </button>

                  <button
                    onClick={handleClose}
                    style={{
                      padding: "0 16px",
                      height: 44,
                      borderRadius: 14,
                      background: "#ffffff",
                      border: `1.2px solid ${CARD_BORDER_LIGHT}`,
                      color: TEXT_PRIMARY_LIGHT,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer"
                    }}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: EDIT MODE - SHOW REMAINING/ABSENT STUDENTS       */}
        {/* ======================================================== */}
        {isEditing && (
          <>
            {/* Edit Mode Top Status Bar */}
            <div
              style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1.2px solid rgba(16, 185, 129, 0.25)",
                borderRadius: 14,
                padding: "10px 14px",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                  Admit Latecomer Student
                </div>
                <div style={{ fontSize: 12, color: "#047857", marginTop: 1 }}>
                  Next available code letter: <strong>Code {nextAvailableLetter}</strong>
                </div>
              </div>

              <div
                style={{
                  background: EMERALD_SUCCESS,
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 8,
                  boxShadow: "0 2px 6px rgba(16, 185, 129, 0.3)"
                }}
              >
                Next: {nextAvailableLetter}
              </div>
            </div>

            {/* Search Box to find absent/late students */}
            <div style={{ position: "relative", marginBottom: 12, flexShrink: 0 }}>
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  pointerEvents: "none"
                }}
              >
                <Ic name="search" size={15} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search remaining students by name or chest no..."
                style={{
                  width: "100%",
                  height: 40,
                  padding: "0 12px 0 36px",
                  borderRadius: 12,
                  border: `1.2px solid ${CARD_BORDER_LIGHT}`,
                  fontSize: 13,
                  outline: "none",
                  color: TEXT_PRIMARY_LIGHT
                }}
              />
            </div>

            {/* Remaining / Absent Students List */}
            <div
              className="no-scrollbar"
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                paddingRight: 2,
                marginBottom: 14
              }}
            >
              {filteredRemaining.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 16px",
                    color: TEXT_MUTED_LIGHT,
                    fontSize: 13,
                    background: "#f8fafc",
                    borderRadius: 16,
                    border: `1px dashed ${CARD_BORDER_LIGHT}`
                  }}
                >
                  {searchQuery.trim()
                    ? `No absent students found matching "${searchQuery}"`
                    : "All students for this program have already been assigned code letters."}
                </div>
              ) : (
                filteredRemaining.map(st => (
                  <div
                    key={st.id}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 14,
                      background: "#ffffff",
                      border: `1.2px solid ${CARD_BORDER_LIGHT}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12
                    }}
                  >
                    {/* Left: Chest No, Name, Group */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "#f1f5f9",
                          color: TEXT_MUTED_LIGHT,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 800,
                          flexShrink: 0
                        }}
                      >
                        {st.chestNo || "—"}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: TEXT_PRIMARY_LIGHT,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {st.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: TEXT_MUTED_LIGHT,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 2
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: st.groupColor || "#94a3b8"
                            }}
                          />
                          <span style={{ fontWeight: 600 }}>{st.groupName}</span>
                          <span>•</span>
                          <span style={{ color: "#94a3b8" }}>Absent</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Small Add Button */}
                    <button
                      onClick={() => handleAdmitLateStudent(st.id)}
                      style={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 10,
                        padding: "7px 12px",
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
                        flexShrink: 0
                      }}
                    >
                      <Ic name="plus" size={13} color="#ffffff" />
                      <span>Add Code {nextAvailableLetter}</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Action Bar in Edit Mode */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <button
                type="button"
                onClick={handleUpdateClick}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)"
                }}
              >
                <Ic name="check" size={16} color="#ffffff" /> Update
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setIsEditing(false);
                  setSearchQuery("");
                  setEditSnapshot(null);
                }}
                style={{
                  padding: "0 18px",
                  height: 44,
                  borderRadius: 14,
                  background: "#ffffff",
                  border: `1.2px solid ${CARD_BORDER_LIGHT}`,
                  color: TEXT_PRIMARY_LIGHT,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer"
                }}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )}

  {/* Update Confirmation Dialog (Rendered in top-level Portal, Centered over Viewport) */}
  {showConfirmUpdate && createPortal(
    <div
      className="anim-fade"
      onClick={() => setShowConfirmUpdate(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      <div
        className="anim-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#ffffff",
          borderRadius: 20,
          padding: "24px 22px 20px",
          boxShadow: "0 20px 48px rgba(15, 23, 42, 0.35)",
          border: `1.2px solid ${CARD_BORDER_LIGHT}`,
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "rgba(16, 185, 129, 0.12)",
            color: EMERALD_SUCCESS,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px"
          }}
        >
          <Ic name="check" size={26} color={EMERALD_SUCCESS} />
        </div>

        <h4
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: TEXT_PRIMARY_LIGHT,
            marginBottom: 8,
            letterSpacing: "-0.2px"
          }}
        >
          Confirm Roster Update?
        </h4>

        <p
          style={{
            fontSize: 13,
            color: TEXT_MUTED_LIGHT,
            lineHeight: 1.5,
            marginBottom: 20
          }}
        >
          Are you sure you want to save these participant updates? All assigned code letters will remain active for this event.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setShowConfirmUpdate(false);
            }}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              border: `1.2px solid ${CARD_BORDER_LIGHT}`,
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
            disabled={isSaving}
            onClick={async () => {
              triggerHaptic("success");
              setIsSaving(true);
              if (onSaveRoster && program) {
                try {
                  await onSaveRoster(program.id);
                  setToastMessage("Roster updated & synced to Cloud!");
                  setTimeout(() => setToastMessage(null), 3000);
                } catch (err) {
                  console.warn("Could not save roster:", err);
                }
              }
              setIsSaving(false);
              setShowConfirmUpdate(false);
              setIsEditing(false);
              setEditSnapshot(null);
              setSearchQuery("");
            }}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 13,
              cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.7 : 1,
              boxShadow: "0 3px 10px rgba(16, 185, 129, 0.3)"
            }}
          >
            {isSaving ? "Saving..." : "Yes, Update"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}

  {/* No Changes Notice Dialog (Rendered in top-level Portal, Centered over Viewport) */}
  {showNoChangesNotice && createPortal(
    <div
      className="anim-fade"
      onClick={() => {
        triggerHaptic("light");
        setShowNoChangesNotice(false);
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      <div
        className="anim-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 340,
          background: "#ffffff",
          borderRadius: 20,
          padding: "24px 22px 20px",
          boxShadow: "0 20px 48px rgba(15, 23, 42, 0.35)",
          border: `1.2px solid ${CARD_BORDER_LIGHT}`,
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "#f1f5f9",
            color: TEXT_MUTED_LIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px"
          }}
        >
          <Ic name="info" size={24} color={TEXT_MUTED_LIGHT} />
        </div>

        <h4
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: TEXT_PRIMARY_LIGHT,
            marginBottom: 8,
            letterSpacing: "-0.2px"
          }}
        >
          No Changes
        </h4>

        <p
          style={{
            fontSize: 13,
            color: TEXT_MUTED_LIGHT,
            lineHeight: 1.5,
            marginBottom: 20
          }}
        >
          Didn't make any updates or edits.
        </p>

        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            setShowNoChangesNotice(false);
            setIsEditing(false);
            setEditSnapshot(null);
            setSearchQuery("");
          }}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 12,
            border: `1.2px solid ${CARD_BORDER_LIGHT}`,
            background: "#ffffff",
            color: TEXT_PRIMARY_LIGHT,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer"
          }}
        >
          OK
        </button>
      </div>
    </div>,
    document.body
  )}

  {/* Reopen Program Confirmation Dialog */}
  {showConfirmReopen && createPortal(
    <div
      className="anim-fade"
      onClick={() => setShowConfirmReopen(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      <div
        className="anim-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#ffffff",
          borderRadius: 20,
          padding: "24px 22px 20px",
          boxShadow: "0 20px 48px rgba(15, 23, 42, 0.35)",
          border: `1.2px solid ${CARD_BORDER_LIGHT}`,
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "rgba(16, 185, 129, 0.12)",
            color: EMERALD_SUCCESS,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px"
          }}
        >
          <Ic name="play" size={24} color={EMERALD_SUCCESS} />
        </div>

        <h4
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: TEXT_PRIMARY_LIGHT,
            marginBottom: 8,
            letterSpacing: "-0.2px"
          }}
        >
          Resume this Program?
        </h4>

        <p
          style={{
            fontSize: 13,
            color: TEXT_MUTED_LIGHT,
            lineHeight: 1.5,
            marginBottom: 20
          }}
        >
          This will change status back to <strong>Running</strong>, restore its live session stream, and allow regular desk operations.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setShowConfirmReopen(false);
            }}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              border: `1.2px solid ${CARD_BORDER_LIGHT}`,
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
            onClick={async () => {
              triggerHaptic("success");
              setShowConfirmReopen(false);
              if (onReopenProgram && program) {
                await onReopenProgram(program.id);
              }
              handleClose();
            }}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(16, 185, 129, 0.3)"
            }}
          >
            Yes, Resume
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}

  {/* Sync Success Toast */}
  {toastMessage && createPortal(
    <div
      className="anim-fade"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0f172a",
        color: "#ffffff",
        padding: "10px 18px",
        borderRadius: 14,
        fontSize: 13,
        fontWeight: 700,
        zIndex: 300,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.28)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        border: "1px solid rgba(255, 255, 255, 0.15)"
      }}
    >
      <Ic name="checkCircle" size={16} color={EMERALD_SUCCESS} />
      <span>{toastMessage}</span>
    </div>,
    document.body
  )}
</>
  );
};

export default ProgramDetailsModal;
