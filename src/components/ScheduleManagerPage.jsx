import React, { useState, useEffect } from "react";
import Ic from "./common/Ic";
import { CORAL_PRIMARY, EMERALD_SUCCESS, SCHEDULE_DATES, CATEGORIES } from "../styles/DesignTokens";

const ScheduleManagerPage = ({ programs, onBack, onSaveSchedule }) => {
  const [editablePrograms, setEditablePrograms] = useState([]);
  const [selectedFilterDay, setSelectedFilterDay] = useState("Day 1");
  const [newProgName, setNewProgName] = useState("");
  const [newProgCat, setNewProgCat] = useState("Junior");
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  // Drag and Drop state
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  useEffect(() => {
    if (programs) {
      setEditablePrograms(JSON.parse(JSON.stringify(programs.filter(p => p.session === "Stage"))));
    }
  }, [programs]);

  const visiblePrograms = editablePrograms.filter(p => (p.date || "Day 1") === selectedFilterDay);

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

  const handleDrop = (e, targetVisibleIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetVisibleIdx) return;

    const sourceItem = visiblePrograms[draggedIdx];
    const targetItem = visiblePrograms[targetVisibleIdx];

    const sourceGlobalIdx = editablePrograms.findIndex(p => p.id === sourceItem.id);
    const targetGlobalIdx = editablePrograms.findIndex(p => p.id === targetItem.id);

    if (sourceGlobalIdx !== -1 && targetGlobalIdx !== -1) {
      const updated = [...editablePrograms];
      const [moved] = updated.splice(sourceGlobalIdx, 1);
      updated.splice(targetGlobalIdx, 0, moved);
      setEditablePrograms(updated);
      setHasOrderChanged(true); // Flag order change!
    }

    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDelete = (id) => {
    const updated = editablePrograms.filter(p => p.id !== id);
    setEditablePrograms(updated);
    onSaveSchedule(updated); // Save deletion immediately!
  };

  const handleAddProgram = () => {
    if (!newProgName.trim()) return;
    const newProg = {
      id: `prog-${Date.now()}`,
      name: newProgName.trim(),
      category: newProgCat,
      session: "Stage",
      date: selectedFilterDay,
      type: "Single",
      status: "Upcoming",
      criteria: ["Fluency", "Presentation"]
    };

    const updated = [newProg, ...editablePrograms];
    setEditablePrograms(updated);
    onSaveSchedule(updated); // Save addition immediately!
    setNewProgName("");
    setShowAddForm(false);
  };

  const handleSave = () => {
    onSaveSchedule(editablePrograms);
    setHasOrderChanged(false);
    onBack();
  };

  return (
    <div className="anim-fade" style={{ maxWidth: 520, margin: "0 auto", padding: "14px 14px 84px" }}>
      
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
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

        <span className="badge badge-coral" style={{ padding: "4px 9px", fontSize: 10 }}>SCHEDULE MANAGER</span>
      </div>

      {/* Program Header Banner */}
      <div style={{
        background: "#ffffff",
        border: "none",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <div>
          <div style={{ fontSize: 10, color: CORAL_PRIMARY, fontWeight: 800, textTransform: "uppercase" }}>Stage Schedule Organizer</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{selectedFilterDay} Programs ({visiblePrograms.length})</div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "none",
            background: CORAL_PRIMARY,
            color: "#ffffff",
            fontSize: 11,
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          {showAddForm ? "Cancel" : "+ Add Program"}
        </button>
      </div>

      {/* Add Program Form Card */}
      {showAddForm && (
        <div style={{ background: "#ffffff", padding: 14, borderRadius: 14, marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Add New Program to {selectedFilterDay}</div>
          <input
            type="text"
            placeholder="Program Name (e.g. Arabic Speech)"
            value={newProgName}
            onChange={(e) => setNewProgName(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: "none",
              background: "#f8fafc",
              fontSize: 13,
              outline: "none",
              marginBottom: 10
            }}
          />

          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <select
              value={newProgCat}
              onChange={(e) => setNewProgCat(e.target.value)}
              style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: "#f8fafc", fontSize: 12, fontWeight: 700 }}
            >
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button
            onClick={handleAddProgram}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 8,
              border: "none",
              background: CORAL_PRIMARY,
              color: "#fff",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            Add to {selectedFilterDay}
          </button>
        </div>
      )}

      {/* Day Filter Pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 2 }}>
        {SCHEDULE_DATES.map(d => (
          <button
            key={d}
            onClick={() => setSelectedFilterDay(d)}
            style={{
              flex: 1,
              padding: "8px 14px",
              borderRadius: 10,
              background: selectedFilterDay === d ? CORAL_PRIMARY : "#ffffff",
              color: selectedFilterDay === d ? "#ffffff" : "#475569",
              fontWeight: 800,
              fontSize: 12,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
            }}
          >
            {d}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, fontWeight: 600 }}>
        💡 Drag using the <strong style={{ color: "#0f172a" }}>⋮⋮ handle</strong> to reorder {selectedFilterDay} programs.
      </div>

      {/* DRAG AND DROP REORDER LIST (FILTERED BY SELECTED DAY) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visiblePrograms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: "#64748b", fontSize: 12 }}>
            No programs scheduled for {selectedFilterDay}. Tap "+ Add Program" to add one!
          </div>
        ) : (
          visiblePrograms.map((p, i) => {
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
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: isDragging ? "#fee2e2" : isTarget ? "#d1fae5" : "#ffffff",
                  border: isTarget ? `2px dashed ${CORAL_PRIMARY}` : "none",
                  opacity: isDragging ? 0.5 : 1,
                  transform: isTarget ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: isDragging ? "0 8px 20px rgba(0,0,0,0.1)" : "0 2px 6px rgba(0,0,0,0.03)"
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
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                    #{i + 1} {p.name}
                  </div>
                  
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    <span style={{ fontWeight: 700 }}>{p.category}</span>
                  </div>
                </div>

                {/* Delete Action */}
                <div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      padding: "6px 8px",
                      borderRadius: 6,
                      border: "none",
                      background: "#fee2e2",
                      color: "#dc2626",
                      fontSize: 10,
                      fontWeight: 800,
                      cursor: "pointer"
                    }}
                  >
                    <Ic name="x" size={12} color="#dc2626" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sticky Bottom Bar ONLY shown when order has changed */}
      {hasOrderChanged && (
        <div className="bottom-bar anim-fade">
          <button className="btn-mobile-primary" onClick={handleSave}>
            Save & Apply Order Changes <Ic name="check" size={16} color="#fff" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagerPage;
