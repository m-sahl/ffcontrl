import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../convexApi";

const INITIAL_PROGRAMS = [];

const INITIAL_GROUPS = [
  { id: "g-1", name: "Al-Bairaq", color: "#6c63ff" },
  { id: "g-2", name: "Al-Fursan", color: "#22d3ee" },
  { id: "g-3", name: "Al-Shaheen", color: "#f472b6" },
  { id: "g-4", name: "Al-Nujoom", color: "#34d399" }
];

const INITIAL_STUDENTS = {};

const INITIAL_REGISTRATIONS = [];

const DeskContext = createContext();
export const useDesk = () => useContext(DeskContext);

export const DeskProvider = ({ children }) => {
  const convexPrograms = useQuery(api.programs.get);

  const [programs, setPrograms] = useState(() => {
    try {
      const s = localStorage.getItem("ff_programs");
      if (s) {
        const parsed = JSON.parse(s);
        return parsed.map(p => ({ ...p, date: p.date || "Day 1" }));
      }
      return INITIAL_PROGRAMS;
    } catch { return INITIAL_PROGRAMS; }
  });

  // Sync convex programs live from Cloud
  useEffect(() => {
    if (convexPrograms && Array.isArray(convexPrograms) && convexPrograms.length > 0) {
      setPrograms(prev => {
        return convexPrograms.map(cp => {
          const local = prev.find(p => p.id === cp.id);
          return {
            id: cp.id,
            name: cp.name,
            category: cp.category || "General",
            session: cp.session || "Stage",
            type: cp.type || "Single",
            maxParticipants: cp.maxParticipants || 1,
            criteria: cp.criteria || [],
            date: cp.date || local?.date || "Day 1",
            status: cp.status || local?.status || "Upcoming",
            sortOrder: cp.sortOrder !== undefined ? cp.sortOrder : local?.sortOrder
          };
        });
      });
    }
  }, [convexPrograms]);

  const [students, setStudents] = useState(() => {
    try {
      const s = localStorage.getItem("ff_students");
      return s ? JSON.parse(s) : INITIAL_STUDENTS;
    } catch { return INITIAL_STUDENTS; }
  });

  const [registrations, setRegistrations] = useState(() => {
    try {
      const s = localStorage.getItem("ff_registrations");
      return s ? JSON.parse(s) : INITIAL_REGISTRATIONS;
    } catch { return INITIAL_REGISTRATIONS; }
  });

  const [groups, setGroups] = useState(() => {
    try {
      const s = localStorage.getItem("ff_users");
      if (s) {
        const parsed = JSON.parse(s);
        const grps = parsed.filter(u => u.role === "group").map((u, i) => ({
          id: u.id,
          name: u.name,
          color: u.color || ["#6c63ff","#22d3ee","#f472b6","#34d399"][i % 4]
        }));
        if (grps.length > 0) return grps;
      }
      return INITIAL_GROUPS;
    } catch { return INITIAL_GROUPS; }
  });

  // Desk state contains attendance, code letters, and stream status per program
  const [deskState, setDeskState] = useState(() => {
    try {
      const s = localStorage.getItem("ff_desk_state");
      return s ? JSON.parse(s) : {};
    } catch { return {}; }
  });

  const [activeStreams, setActiveStreams] = useState(() => {
    try {
      const s = localStorage.getItem("ff_active_streams");
      if (s) return JSON.parse(s);
      const oldSingle = localStorage.getItem("ff_active_stream");
      if (oldSingle) return { Stage: oldSingle, "Off-Stage": null };
      return { Stage: null, "Off-Stage": null };
    } catch { return { Stage: null, "Off-Stage": null }; }
  });

  useEffect(() => {
    try { localStorage.setItem("ff_programs", JSON.stringify(programs)); } catch {}
  }, [programs]);

  useEffect(() => {
    try { localStorage.setItem("ff_students", JSON.stringify(students)); } catch {}
  }, [students]);

  useEffect(() => {
    try { localStorage.setItem("ff_registrations", JSON.stringify(registrations)); } catch {}
  }, [registrations]);

  useEffect(() => {
    try { localStorage.setItem("ff_desk_state", JSON.stringify(deskState)); } catch {}
  }, [deskState]);

  useEffect(() => {
    try {
      localStorage.setItem("ff_active_streams", JSON.stringify(activeStreams));
    } catch {}
  }, [activeStreams]);

  // Actions
  const streamProgram = (programId) => {
    const prog = programs.find(p => p.id === programId);
    const session = prog ? prog.session : "Stage";
    setActiveStreams(prev => ({
      ...prev,
      [session]: programId
    }));
  };

  const updateAttendance = (programId, studentId, isPresent) => {
    setDeskState(prev => {
      const progState = prev[programId] || { attendance: {}, codeLetters: {} };
      return {
        ...prev,
        [programId]: {
          ...progState,
          attendance: { ...progState.attendance, [studentId]: isPresent }
        }
      };
    });
  };

  const batchAttendance = (programId, studentIds, isPresent) => {
    setDeskState(prev => {
      const progState = prev[programId] || { attendance: {}, codeLetters: {} };
      const updatedAttendance = { ...progState.attendance };
      studentIds.forEach(id => {
        updatedAttendance[id] = isPresent;
      });
      return {
        ...prev,
        [programId]: {
          ...progState,
          attendance: updatedAttendance
        }
      };
    });
  };

  const assignCodeLetter = (programId, studentId, codeLetter) => {
    setDeskState(prev => {
      const progState = prev[programId] || { attendance: {}, codeLetters: {} };
      return {
        ...prev,
        [programId]: {
          ...progState,
          codeLetters: { ...progState.codeLetters, [studentId]: codeLetter }
        }
      };
    });
  };

  const resetCodeLetters = (programId) => {
    setDeskState(prev => {
      const progState = prev[programId] || { attendance: {}, codeLetters: {} };
      return {
        ...prev,
        [programId]: {
          ...progState,
          codeLetters: {}
        }
      };
    });
  };

  const finishCodeLetters = (programId) => {
    // When code letters are finished, set program status to "Running"
    setPrograms(prev => prev.map(p => p.id === programId ? { ...p, status: "Running" } : p));
  };

  const importSchedule = (importedPrograms, targetDate, targetSession) => {
    if (targetSession === "Off-Stage") {
      setPrograms(prev => {
        const stagePrograms = prev.filter(p => p.session === "Stage");
        return [...stagePrograms, ...importedPrograms];
      });
    } else if (targetDate && targetDate !== "All Dates") {
      setPrograms(prev => {
        const otherPrograms = prev.filter(p => p.session !== "Stage" || (p.date || "Day 1") !== targetDate);
        return [...otherPrograms, ...importedPrograms];
      });
    } else {
      setPrograms(importedPrograms);
    }
  };

  const resetToTrialData = () => {
    try {
      localStorage.removeItem("ff_programs");
      localStorage.removeItem("ff_students");
      localStorage.removeItem("ff_registrations");
      localStorage.removeItem("ff_desk_state");
      localStorage.removeItem("ff_active_stream");
      localStorage.removeItem("ff_active_streams");
    } catch {}
    setPrograms(INITIAL_PROGRAMS);
    setStudents(INITIAL_STUDENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setDeskState({});
    setActiveStreams({ Stage: null, "Off-Stage": null });
  };

  const markProgramCompleted = (programId) => {
    const prog = programs.find(p => p.id === programId);
    const session = prog ? prog.session : "Stage";
    setPrograms(prev => prev.map(p => p.id === programId ? { ...p, status: "Completed" } : p));
    setActiveStreams(prev => ({
      ...prev,
      [session]: prev[session] === programId ? null : prev[session]
    }));
  };

  // Helper to fetch participant list for a program
  const getParticipantsForProgram = (programId) => {
    if (!programId) return [];
    const progRegs = registrations.filter(r => r.programId === programId);
    const pState = deskState[programId] || { attendance: {}, codeLetters: {} };

    return progRegs.flatMap(r => {
      const grp = groups.find(g => g.id === r.groupId);
      const groupStudents = students[r.groupId] || [];
      return (r.participantIds || []).map(id => {
        const st = groupStudents.find(s => s.id === id);
        if (!st) return null;
        return {
          ...st,
          groupId: r.groupId,
          groupName: grp?.name || "Unknown Group",
          groupColor: grp?.color || "#f59e0b",
          isPresent: pState.attendance[st.id] !== undefined ? pState.attendance[st.id] : true,
          codeLetter: pState.codeLetters[st.id] || null
        };
      }).filter(Boolean);
    }).sort((a, b) => (parseInt(a.chestNo) || 0) - (parseInt(b.chestNo) || 0));
  };

  return (
    <DeskContext.Provider value={{
      programs,
      students,
      registrations,
      groups,
      deskState,
      activeStreams,
      activeStreamId: activeStreams?.Stage || null,
      streamProgram,
      updateAttendance,
      batchAttendance,
      assignCodeLetter,
      resetCodeLetters,
      finishCodeLetters,
      importSchedule,
      resetToTrialData,
      markProgramCompleted,
      getParticipantsForProgram
    }}>
      {children}
    </DeskContext.Provider>
  );
};
