import React, { useState, useEffect } from "react";
import Ic from "./common/Ic";
import { CORAL_PRIMARY, EMERALD_SUCCESS } from "../styles/DesignTokens";

const CodePickerModal = ({ student, remainingLetters, isOpen, onClose, onAssignCode }) => {
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [assignedLetter, setAssignedLetter] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    setFlippedIndex(null);
    setAssignedLetter(null);
    setIsShuffling(false);
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const cardCount = remainingLetters.length;

  const handleShuffleClick = () => {
    if (flippedIndex !== null || assignedLetter || cardCount === 0) return;
    setIsShuffling(true);
    setTimeout(() => {
      setIsShuffling(false);
    }, 400);
  };

  const handleCardClick = (idx) => {
    if (flippedIndex !== null || assignedLetter || cardCount === 0 || isShuffling) return;

    const randomIdx = Math.floor(Math.random() * remainingLetters.length);
    const pickedLetter = remainingLetters[randomIdx];

    setFlippedIndex(idx);
    setAssignedLetter(pickedLetter);

    setTimeout(() => {
      onAssignCode(student.id, pickedLetter);
      onClose();
    }, 850);
  };

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
          border: "none",
          textAlign: "center",
          boxShadow: "0 -12px 36px rgba(0,0,0,0.12)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: CORAL_PRIMARY }}>Code Letter Selection</div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#64748b", padding: 4 }}>
            <Ic name="x" size={20} />
          </button>
        </div>

        {/* Student Name */}
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
          #{student.chestNo} {student.name}
        </div>
        
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>
          {assignedLetter ? (
            <span style={{ color: EMERALD_SUCCESS, fontWeight: 800, fontSize: 14 }}>Assigned Code Letter {assignedLetter}!</span>
          ) : (
            `Select 1 card from ${cardCount} remaining mystery card${cardCount > 1 ? "s" : ""}`
          )}
        </div>

        {/* Shuffle Button inside Modal */}
        {!assignedLetter && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <button
              onClick={handleShuffleClick}
              disabled={isShuffling}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                background: "#f1f5f9",
                color: CORAL_PRIMARY,
                fontWeight: 800,
                fontSize: 11,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <Ic name="shuffle" size={13} color={CORAL_PRIMARY} /> {isShuffling ? "Shuffling Cards..." : "Shuffle Mystery Cards"}
            </button>
          </div>
        )}

        {/* REVEALABLE FACE DOWN CARDS GRID */}
        <div style={{
          background: "#f8fafc",
          border: "none",
          borderRadius: 20,
          padding: "24px 16px",
          marginBottom: 16,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 140,
          transform: isShuffling ? "scale(0.96) rotate(-1deg)" : "scale(1)",
          transition: "transform 0.2s ease"
        }}>
          {Array.from({ length: cardCount }).map((_, idx) => {
            const isFlipped = flippedIndex === idx;
            return (
              <div
                key={idx}
                className={`flip-card ${isFlipped ? "flipped" : ""}`}
                onClick={() => handleCardClick(idx)}
              >
                <div className="flip-card-inner">
                  {/* Front Face-Down Card */}
                  <div className="flip-card-front">
                    ?
                  </div>

                  {/* Back Face-Up Card */}
                  <div className="flip-card-back">
                    {isFlipped ? assignedLetter : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 11, color: "#94a3b8" }}>
          {assignedLetter ? "Saving assignment..." : "Tap any card to flip and assign letter"}
        </div>
      </div>
    </div>
  );
};

export default CodePickerModal;
