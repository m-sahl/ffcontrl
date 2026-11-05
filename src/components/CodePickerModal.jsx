import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Ic from "./common/Ic";
import {
  CORAL_PRIMARY,
  EMERALD_SUCCESS,
  CARD_BORDER_LIGHT,
  TEXT_PRIMARY_LIGHT,
  TEXT_MUTED_LIGHT
} from "../styles/DesignTokens";
import { triggerHaptic } from "../utils/haptics";

const CodePickerModal = ({ student, remainingLetters = [], isOpen, onClose, onAssignCode }) => {
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
    triggerHaptic("light");
    setIsShuffling(true);
    setTimeout(() => {
      setIsShuffling(false);
    }, 380);
  };

  const handleCardClick = (idx) => {
    if (flippedIndex !== null || assignedLetter || cardCount === 0 || isShuffling) return;

    triggerHaptic("medium");
    const randomIdx = Math.floor(Math.random() * remainingLetters.length);
    const pickedLetter = remainingLetters[randomIdx];

    setFlippedIndex(idx);
    setAssignedLetter(pickedLetter);

    setTimeout(() => {
      triggerHaptic("success");
      onAssignCode(student.id, pickedLetter);
      onClose();
    }, 850);
  };

  return createPortal(
    <div
      className="anim-fade"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)"
      }}
    >
      <div
        className="anim-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 500,
          padding: "16px 20px 32px",
          background: "#ffffff",
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          borderTop: `1.2px solid ${CARD_BORDER_LIGHT}`,
          textAlign: "center",
          boxShadow: "0 -12px 36px rgba(15, 23, 42, 0.12)"
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: "#cbd5e1",
            margin: "0 auto 12px"
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: CORAL_PRIMARY,
              letterSpacing: "1px",
              textTransform: "uppercase"
            }}
          >
            Code Letter Selection
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f4f9",
              border: `1px solid ${CARD_BORDER_LIGHT}`,
              borderRadius: "50%",
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: TEXT_MUTED_LIGHT,
              cursor: "pointer"
            }}
          >
            <Ic name="x" size={14} />
          </button>
        </div>

        {/* Student Name */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: TEXT_PRIMARY_LIGHT,
            letterSpacing: "-0.3px",
            marginBottom: 4
          }}
        >
          #{student.chestNo} {student.name}
        </div>

        <div style={{ fontSize: 13, color: TEXT_MUTED_LIGHT, marginBottom: 14 }}>
          {assignedLetter ? (
            <span style={{ color: EMERALD_SUCCESS, fontWeight: 800, fontSize: 14 }}>
              Assigned Code Letter {assignedLetter}!
            </span>
          ) : (
            `Select 1 card from ${cardCount} remaining mystery card${cardCount > 1 ? "s" : ""}`
          )}
        </div>

        {/* Shuffle Button inside Modal */}
        {!assignedLetter && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <button
              onClick={handleShuffleClick}
              disabled={isShuffling}
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                border: `1px solid ${CARD_BORDER_LIGHT}`,
                background: "#f8fafc",
                color: CORAL_PRIMARY,
                fontWeight: 700,
                fontSize: 11,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)"
              }}
            >
              <Ic name="shuffle" size={13} color={CORAL_PRIMARY} />
              {isShuffling ? "Shuffling Cards..." : "Shuffle Mystery Cards"}
            </button>
          </div>
        )}

        {/* REVEALABLE FACE DOWN CARDS GRID */}
        <div
          style={{
            background: "#f8fafc",
            border: `1px solid ${CARD_BORDER_LIGHT}`,
            borderRadius: 20,
            padding: "20px 14px",
            marginBottom: 16,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 140,
            transform: isShuffling ? "scale(0.97) rotate(-0.5deg)" : "scale(1)",
            transition: "transform 0.2s ease"
          }}
        >
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

        <div style={{ fontSize: 11, color: TEXT_MUTED_LIGHT, fontWeight: 500 }}>
          {assignedLetter ? "Saving assignment..." : "Tap any mystery card to flip and assign spot code"}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CodePickerModal;
