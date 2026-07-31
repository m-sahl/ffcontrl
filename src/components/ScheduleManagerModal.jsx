import React, { useState, useEffect } from "react";
import Ic from "./common/Ic";
import { CORAL_PRIMARY, EMERALD_SUCCESS, SCHEDULE_DATES, CATEGORIES, SESSIONS } from "../styles/DesignTokens";

const ScheduleManagerModal = ({ isOpen, programs, onClose, onSaveSchedule }) => {
  const [editablePrograms, setEditablePrograms] = useState([]);
  const [newProgName, setNewProgName] = useState("");
  const [newProgCat, setNewProgCat] = useState("Junior");
  const [newProgDay, setNewProgDay] = useState("Day 1");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Drag and Drop state
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  useEffect(() => {
    if (programs) {
      setEditablePrograms(JSON.parse(JSON.stringify(programs)));
    }
  }, [programs, isOpen]);

  if (!isOpen) return null;

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= editablePrograms.length) return;
    
    const updated = [...editablePrograms];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setEditablePrograms(updated);
  };

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const updated = [...editablePrograms];
    const draggedItem = updated[draggedIdx];
    updated.splice(draggedIdx, 1);
    updated.splice(index, 0, draggedItem);

    setEditablePrograms(updated);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleUpdateDay = (id, newDay) => {
    setEditablePrograms(prev => prev.map(p => p.id === id ? { ...p, date: newDay } : p));
  };

  const handleDelete = (id) => {
    setEditablePrograms(prev => prev.filter(p => p.id !== id));
  };

  const handleAddProgram = () => {
    if (!newProgName.trim()) return;
    const newProg = {
      id: `prog-${Date.now()}`,
      name: newProgName.trim(),
      category: newProgCat,
      session: "Stage",
      date: newProgDay,
      type: "Single",
      status: "Upcoming",
      criteria: ["Fluency", "Presentation"]
    };
    setEditablePrograms(prev => [newProg, ...prev]);
    setNewProgName("");
    setShowAddForm(false);
  };

  const handleSave = () => {
    onSaveSchedule(editablePrograms);
    onClose();
  };

  const daysList = SCHEDULE_DATES.filter(d => d !== "All Dates");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
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
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          padding: "20px 20px 24px",
          background: "#ffffff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          border: "none",
          boxShadow: "0 -12px 36px rgba(0,0,0,0.12)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: CORAL_PRIMARY }}>
              Schedule Manager
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
              Drag to Reorder & Assign Days
            </h3>
          </div>
          
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#64748b", padding: 4 }}>
            <Ic name="x" size={20} />
          </button>
        </div>

        {/* Add Program Toggle */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              background: "#f1f5f9",
              border: "none",
              color: CORAL_PRIMARY,
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6
            }}
          >
            + Add New Stage Program
          </button>
        ) : (
          <div style={{ background: "#f8fafc", padding: 14, borderRadius: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Add New Program</div>
            <input
              type="text"
              placeholder="Program Name (e.g. Arabic Song)"
              value={newProgName}
              onChange={(e) => setNewProgName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: "#ffffff",
                fontSize: 13,
                outline: "none",
                marginBottom: 8,
                boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
              }}
            />

            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <select
                value={newProgCat}
                onChange={(e) => setNewProgCat(e.target.value)}
                style={{ flex: 1, padding: "6px 8px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700 }}
              >
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                value={newProgDay}
                onChange={(e) => setNewProgDay(e.target.value)}
                style={{ flex: 1, padding: "6px 8px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700 }}
              >
                {daysList.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowAddForm(false)}
                style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: "none", background: "#e2e8f0", fontSize: 12, fontWeight: 700 }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddProgram}
                style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: "none", background: CORAL_PRIMARY, color: "#fff", fontSize: 12, fontWeight: 800 }}
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8, fontWeight: 600 }}>
          💡 Tip: Drag items using the ⋮⋮ handle to reorder, or use the ▲ ▼ buttons.
        </div>

        {/* Scrollable Editable Drag-and-Drop List */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4, marginBottom: 16 }}>
          {editablePrograms.map((p, i) => {
            const isDragging = draggedIdx === i;
            const isTarget = dragOverIdx === i;

            return (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: isDragging ? "#fee2e2" : isTarget ? "#d1fae5" : "#f8fafc",
                  border: isTarget ? `2px dashed ${CORAL_PRIMARY}` : "none",
                  opacity: isDragging ? 0.5 : 1,
                  transform: isTarget ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: isDragging ? "0 8px 20px rgba(0,0,0,0.1)" : "none"
                }}
              >
                {/* Drag Handle */}
                <div style={{
                  color: "#94a3b8",
                  cursor: "grab",
                  marginRight: 10,
                  fontSize: 16,
                  userSelect: "none",
                  fontWeight: 900
                }}>
                  ⋮⋮
                </div>

                <div style={{ flex: 1, paddingRight: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                    #{i + 1} {p.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{p.category}</span>
                    <span>·</span>
                    
                    {/* Inline Day Selector */}
                    <div style={{ display: "flex", gap: 4 }}>
                      {daysList.map(d => (
                        <button
                          key={d}
                          onClick={() => handleUpdateDay(p.id, d)}
                          style={{
                            padding: "2px 6px",
                            borderRadius: 6,
                            border: "none",
                            background: (p.date || "Day 1") === d ? CORAL_PRIMARY : "#e2e8f0",
                            color: (p.date || "Day 1") === d ? "#ffffff" : "#475569",
                            fontSize: 10,
                            fontWeight: 800,
                            cursor: "pointer"
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Controls & Delete */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <button
                    onClick={() => handleMove(i, -1)}
                    disabled={i === 0}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "none",
                      background: "#ffffff",
                      color: i === 0 ? "#cbd5e1" : "#334155",
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: i === 0 ? "default" : "pointer"
                    }}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMove(i, 1)}
                    disabled={i === editablePrograms.length - 1}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "none",
                      background: "#ffffff",
                      color: i === editablePrograms.length - 1 ? "#cbd5e1" : "#334155",
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: i === editablePrograms.length - 1 ? "default" : "pointer"
                    }}
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "none",
                      background: "#fee2e2",
                      color: "#dc2626",
                      fontSize: 10,
                      fontWeight: 800,
                      cursor: "pointer",
                      marginLeft: 4
                    }}
                  >
                    <Ic name="x" size={12} color="#dc2626" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Save Action */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            height: 46,
            borderRadius: 12,
            background: CORAL_PRIMARY,
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(241, 77, 77, 0.25)"
          }}
        >
          Save Schedule Changes
        </button>
      </div>
    </div>
  );
};

export default ScheduleManagerModal;
