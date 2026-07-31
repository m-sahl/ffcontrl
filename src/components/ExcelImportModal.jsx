import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Ic from "./common/Ic";
import { CORAL_PRIMARY, EMERALD_SUCCESS, SCHEDULE_DATES } from "../styles/DesignTokens";

const ExcelImportModal = ({ isOpen, targetDate = "Day 1", targetSession = "Stage", onClose, onImportSchedule }) => {
  const [activeImportDay, setActiveImportDay] = useState("Day 1");
  const [parsedItems, setParsedItems] = useState([]);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isOffStage = targetSession === "Off-Stage";
  const daysList = SCHEDULE_DATES.filter(d => d !== "All Dates");

  useEffect(() => {
    const defaultDay = targetDate === "All Dates" ? "Day 1" : targetDate;
    setActiveImportDay(defaultDay);
  }, [targetDate, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "array" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawData = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (!rawData || rawData.length === 0) {
          setErrorMsg("Excel file is empty or has invalid data");
          setParsedItems([]);
          return;
        }

        // Normalize column headers
        const normalized = rawData.map((row, index) => {
          const keys = Object.keys(row);
          
          const getKeyVal = (possibleNames) => {
            const foundKey = keys.find(k => possibleNames.some(p => k.trim().toLowerCase() === p.toLowerCase()));
            return foundKey ? row[foundKey].toString().trim() : "";
          };

          const name = getKeyVal(["name", "program", "program name", "item", "title", "programname"]) || `Program ${index + 1}`;
          let category = getKeyVal(["category", "cat", "group category"]) || "Junior";

          // Format category
          if (category.toLowerCase().includes("sub")) category = "Sub-Junior";
          else if (category.toLowerCase().includes("sen")) category = "Senior";
          else if (category.toLowerCase().includes("gen")) category = "General";
          else category = "Junior";

          return {
            id: `prog-imp-${Date.now()}-${index}`,
            name,
            category,
            session: isOffStage ? "Off-Stage" : "Stage",
            date: isOffStage ? undefined : activeImportDay,
            type: "Single",
            status: "Upcoming",
            criteria: ["Fluency", "Presentation", "Content"]
          };
        });

        setParsedItems(normalized);
      } catch (err) {
        setErrorMsg("Failed to parse Excel file. Please check file format.");
        setParsedItems([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleConfirmImport = () => {
    if (parsedItems.length > 0) {
      const updatedWithSession = parsedItems.map(p => ({
        ...p,
        session: isOffStage ? "Off-Stage" : "Stage",
        date: isOffStage ? undefined : activeImportDay
      }));
      onImportSchedule(updatedWithSession, activeImportDay, targetSession);
      onClose();
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      { "Program Name": isOffStage ? "Pencil Drawing" : "Malayalam Elocution", "Category": "Senior" },
      { "Program Name": isOffStage ? "English Essay" : "Qur'an Recitation", "Category": "Junior" },
      { "Program Name": isOffStage ? "Water Color Painting" : "Islamic Group Song", "Category": "General" },
      { "Program Name": isOffStage ? "Calligraphy" : "English Speech", "Category": "Sub-Junior" }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    const sheetTitle = isOffStage ? "OffStage_Schedule" : `${activeImportDay}_Schedule`;
    XLSX.utils.book_append_sheet(wb, ws, sheetTitle);
    XLSX.writeFile(wb, `FestFlow_${sheetTitle}_Template.xlsx`);
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
          textAlign: "left",
          boxShadow: "0 -12px 36px rgba(0,0,0,0.12)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Ic name="upload" size={18} color={CORAL_PRIMARY} />
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
              Import {isOffStage ? "Off-Stage" : "Stage"} Schedule
            </div>
            {!isOffStage && <span className="badge badge-coral" style={{ fontSize: 11 }}>{activeImportDay}</span>}
            {isOffStage && <span className="badge badge-slate" style={{ fontSize: 11 }}>Off-Stage</span>}
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#64748b", padding: 4 }}>
            <Ic name="x" size={20} />
          </button>
        </div>

        {/* Target Day Selector Bar (Only for Stage) */}
        {!isOffStage && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", marginBottom: 6 }}>Select Target Day for Import:</div>
            <div style={{ display: "flex", gap: 6 }}>
              {daysList.map(d => (
                <button
                  key={d}
                  onClick={() => {
                    setActiveImportDay(d);
                    if (parsedItems.length > 0) {
                      setParsedItems(prev => prev.map(p => ({ ...p, date: d })));
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 10,
                    border: "none",
                    background: activeImportDay === d ? CORAL_PRIMARY : "#f1f5f9",
                    color: activeImportDay === d ? "#ffffff" : "#475569",
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: "pointer"
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upload Zone */}
        <div style={{
          background: "#f8fafc",
          borderRadius: 16,
          padding: 18,
          textAlign: "center",
          marginBottom: 14,
          position: "relative"
        }}>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
              width: "100%",
              height: "100%"
            }}
          />
          <Ic name="fileText" size={28} color={CORAL_PRIMARY} />
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginTop: 6 }}>
            {fileName ? fileName : `Tap to choose Excel for ${isOffStage ? "Off-Stage" : activeImportDay}`}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
            Importing programs directly into <strong style={{ color: CORAL_PRIMARY }}>{isOffStage ? "Off-Stage" : activeImportDay}</strong>
          </div>
        </div>

        {/* Sample Template Link */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#64748b" }}>Need a template file?</div>
          <button
            onClick={handleDownloadSample}
            style={{
              background: "transparent",
              border: "none",
              color: CORAL_PRIMARY,
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            Download {isOffStage ? "Off-Stage" : activeImportDay} Template
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: 10, borderRadius: 8, fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
            {errorMsg}
          </div>
        )}

        {/* Preview Parsed List */}
        {parsedItems.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: EMERALD_SUCCESS, marginBottom: 8 }}>
              Parsed {parsedItems.length} Programs for {isOffStage ? "Off-Stage" : activeImportDay}
            </div>
            
            <div style={{ maxHeight: 150, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, paddingRight: 4 }}>
              {parsedItems.map((p, i) => (
                <div key={p.id} style={{
                  padding: "8px 10px",
                  background: "#f8fafc",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 12
                }}>
                  <div>
                    <span style={{ fontWeight: 800, marginRight: 6 }}>#{i + 1}</span>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>{p.name}</span>
                  </div>
                  <span className="badge badge-slate" style={{ fontSize: 10 }}>{p.category} · {p.session}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirmImport}
          disabled={parsedItems.length === 0}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 12,
            background: parsedItems.length > 0 ? CORAL_PRIMARY : "#cbd5e1",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 14,
            border: "none",
            cursor: parsedItems.length > 0 ? "pointer" : "not-allowed",
            boxShadow: parsedItems.length > 0 ? "0 4px 14px rgba(241, 77, 77, 0.25)" : "none"
          }}
        >
          Confirm & Import to {isOffStage ? "Off-Stage" : activeImportDay} ({parsedItems.length} Items)
        </button>
      </div>
    </div>
  );
};

export default ExcelImportModal;
