import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convexApi";
import { normalizeCategory } from "../styles/DesignTokens";

const INITIAL_PROGRAMS = [];

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

const INITIAL_GROUPS = [
  { id: "g-1", name: "Al-Bairaq", color: "#6c63ff" },
  { id: "g-2", name: "Al-Fursan", color: "#22d3ee" },
  { id: "g-3", name: "Al-Shaheen", color: "#f472b6" },
  { id: "g-4", name: "Al-Nujoom", color: "#34d399" }
];

const INITIAL_STUDENTS = {};

const INITIAL_REGISTRATIONS = [];

const CONVEX_SITE_URL = import.meta.env.VITE_CONVEX_SITE_URL || "https://scrupulous-goldfish-520.convex.site";

const DeskContext = createContext();
export const useDesk = () => useContext(DeskContext);

export const DeskProvider = ({ children }) => {
  const convexPrograms = useQuery(api.programs.get);
  const convexStudents = useQuery(api.students.get);
  const convexRegistrations = useQuery(api.registrations.get);
  const convexUsers = useQuery(api.users.get);

  const updateProgramStatusMutation = useMutation(api.programs.updateStatus);
  const updateParticipantsHistoryMutation = useMutation(api.programs.updateParticipantsHistory);
  const setAllProgramsMutation = useMutation(api.programs.setAll);

  const [programs, setPrograms] = useState(() => {
    try {
      const s = localStorage.getItem("ff_programs");
      if (s) {
        const parsed = JSON.parse(s);
        // Purge any legacy dummy/trial program IDs (e.g. p-101 .. p-109)
        const sanitized = parsed.filter(p => p && p.id && !p.id.startsWith("p-10"));
        if (sanitized.length > 0) {
          return sanitized.map(p => ({
            ...p,
            category: normalizeCategory(p.category) || p.category || "General",
            date: p.date || "Day 1"
          }));
        }
      }
      return INITIAL_PROGRAMS;
    } catch { return INITIAL_PROGRAMS; }
  });

  // Immediate bootstrap fetch from Convex Cloud endpoint to ensure all 135 programs across ALL categories are loaded instantly with real statuses
  useEffect(() => {
    fetch(`${CONVEX_SITE_URL}/api/leader/data?groupId=g-1`)
      .then(res => res.json())
      .then(json => {
        if (json?.data?.programs && Array.isArray(json.data.programs) && json.data.programs.length > 0) {
          // Always map directly from cloud API data to ensure genuine statuses and remove any stale dummy data
          const allMapped = json.data.programs.map(cp => ({
            id: cp.id,
            name: cp.name,
            category: normalizeCategory(cp.category) || "General",
            session: cp.session || "Stage",
            type: cp.type || "Single",
            maxParticipants: cp.maxParticipants || 1,
            criteria: cp.criteria || [],
            date: cp.date || "Day 1",
            status: cp.status || "Upcoming",
            sortOrder: cp.sortOrder !== undefined ? cp.sortOrder : 0,
            participantsHistory: cp.participantsHistory || cp.codeAllocations || null,
            codeAllocations: cp.codeAllocations || cp.participantsHistory || null,
          }));
          setPrograms(allMapped);
          try { localStorage.setItem("ff_programs", JSON.stringify(allMapped)); } catch {}
        }

        if (json?.data?.students && Array.isArray(json.data.students) && json.data.students.length > 0) {
          setStudents(prev => {
            if (Object.keys(prev).length === 0) {
              const grouped = {};
              for (const st of json.data.students) {
                const normSt = { ...st, category: normalizeCategory(st.category) || st.category };
                if (!grouped[st.groupId]) grouped[st.groupId] = [];
                grouped[st.groupId].push(normSt);
              }
              try { localStorage.setItem("ff_students", JSON.stringify(grouped)); } catch {}
              return grouped;
            }
            return prev;
          });
        }

        if (json?.data?.registrations && Array.isArray(json.data.registrations) && json.data.registrations.length > 0) {
          setRegistrations(prev => {
            if (prev.length === 0) {
              try { localStorage.setItem("ff_registrations", JSON.stringify(json.data.registrations)); } catch {}
              return json.data.registrations;
            }
            return prev;
          });
        }
      })
      .catch(err => {
        console.warn("Bootstrap cloud fetch notice:", err);
      });
  }, []);

  // Sync convex programs live from Cloud
  useEffect(() => {
    if (convexPrograms && Array.isArray(convexPrograms) && convexPrograms.length > 0) {
      setPrograms(prev => {
        return convexPrograms.map(cp => {
          const local = prev.find(p => p.id === cp.id);
          return {
            id: cp.id,
            name: cp.name,
            category: normalizeCategory(cp.category) || "General",
            session: cp.session || "Stage",
            type: cp.type || "Single",
            maxParticipants: cp.maxParticipants || 1,
            criteria: cp.criteria || [],
            date: cp.date || local?.date || "Day 1",
            status: cp.status || "Upcoming",
            sortOrder: cp.sortOrder !== undefined ? cp.sortOrder : local?.sortOrder,
            participantsHistory: cp.participantsHistory || cp.codeAllocations || local?.participantsHistory || null,
            codeAllocations: cp.codeAllocations || cp.participantsHistory || local?.codeAllocations || null,
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

  // Sync convex students live from Cloud
  useEffect(() => {
    if (convexStudents && Array.isArray(convexStudents) && convexStudents.length > 0) {
      const grouped = {};
      for (const st of convexStudents) {
        const normSt = { ...st, category: normalizeCategory(st.category) || st.category };
        if (!grouped[st.groupId]) grouped[st.groupId] = [];
        grouped[st.groupId].push(normSt);
      }
      setStudents(grouped);
    }
  }, [convexStudents]);

  const [registrations, setRegistrations] = useState(() => {
    try {
      const s = localStorage.getItem("ff_registrations");
      return s ? JSON.parse(s) : INITIAL_REGISTRATIONS;
    } catch { return INITIAL_REGISTRATIONS; }
  });

  // Sync convex registrations live from Cloud
  useEffect(() => {
    if (convexRegistrations && Array.isArray(convexRegistrations) && convexRegistrations.length > 0) {
      setRegistrations(convexRegistrations);
    }
  }, [convexRegistrations]);

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

  // Sync convex users/groups live from Cloud
  useEffect(() => {
    if (convexUsers && Array.isArray(convexUsers) && convexUsers.length > 0) {
      const grps = convexUsers
        .filter(u => u.role === "group")
        .map((u, i) => ({
          id: u.id,
          name: u.name,
          color: u.color || ["#6c63ff","#22d3ee","#f472b6","#34d399"][i % 4]
        }));
      if (grps.length > 0) setGroups(grps);
    }
  }, [convexUsers]);

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
      if (s) {
        const parsed = JSON.parse(s);
        // Purge any dummy legacy IDs
        const stage = parsed?.Stage && !parsed.Stage.startsWith("p-10") ? parsed.Stage : null;
        const offStage = parsed?.["Off-Stage"] && !parsed["Off-Stage"].startsWith("p-10") ? parsed["Off-Stage"] : null;
        return { Stage: stage, "Off-Stage": offStage };
      }
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

  // Synchronize activeStreams strictly with verified Running programs from the database/API
  useEffect(() => {
    const runningStage = programs.find(p => p.session === "Stage" && (p.status || "").toLowerCase() === "running");
    const runningOffStage = programs.find(p => p.session === "Off-Stage" && (p.status || "").toLowerCase() === "running");

    const validStageId = runningStage ? runningStage.id : null;
    const validOffStageId = runningOffStage ? runningOffStage.id : null;

    setActiveStreams(prev => {
      // If already matching verified running programs, keep state stable
      if (prev?.Stage === validStageId && prev?.["Off-Stage"] === validOffStageId) {
        return prev;
      }
      const updated = { Stage: validStageId, "Off-Stage": validOffStageId };
      try { localStorage.setItem("ff_active_streams", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, [programs]);

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
    const rawParts = getParticipantsForProgram(programId);
    const pState = deskState[programId] || { attendance: {}, codeLetters: {} };
    const participating = rawParts.filter(p => p.isPresent !== false && (p.codeLetter || pState.codeLetters?.[p.id]));

    const history = participating.map((p, idx) => {
      const code = p.codeLetter || pState.codeLetters?.[p.id] || getLetterCode(idx);
      return {
        studentId: String(p.id),
        chestNo: String(p.chestNo || ""),
        name: p.name || "",
        groupId: p.groupId || "",
        groupName: p.groupName || "",
        codeLetter: String(code).trim().toUpperCase()
      };
    });

    // When code letters are finished, set program status to "Running"
    setPrograms(prev => prev.map(p => p.id === programId ? {
      ...p,
      status: "Running",
      participantsHistory: history.length > 0 ? history : (p.participantsHistory || null),
      codeAllocations: history.length > 0 ? history : (p.codeAllocations || null),
    } : p));

    if (updateProgramStatusMutation) {
      updateProgramStatusMutation({
        id: programId,
        status: "Running",
        participantsHistory: history,
        codeAllocations: history,
      }).catch(err => {
        console.warn("Could not sync status & roster to convex:", err);
      });
    }
  };

  const resetToTrialData = () => {
    try {
      localStorage.removeItem("ff_desk_state");
      localStorage.removeItem("ff_active_stream");
      localStorage.removeItem("ff_active_streams");
    } catch {}
    setDeskState({});
    setActiveStreams({ Stage: null, "Off-Stage": null });

    // Refresh all 135 programs across all categories from Convex cloud
    fetch(`${CONVEX_SITE_URL}/api/leader/data?groupId=g-1`)
      .then(res => res.json())
      .then(json => {
        if (json?.data?.programs?.length > 0) {
          const allMapped = json.data.programs.map(cp => ({
            id: cp.id,
            name: cp.name,
            category: normalizeCategory(cp.category) || "General",
            session: cp.session || "Stage",
            type: cp.type || "Single",
            maxParticipants: cp.maxParticipants || 1,
            criteria: cp.criteria || [],
            date: cp.date || "Day 1",
            status: cp.status || "Upcoming",
            sortOrder: cp.sortOrder,
            participantsHistory: cp.participantsHistory || cp.codeAllocations || null,
            codeAllocations: cp.codeAllocations || cp.participantsHistory || null,
          }));
          setPrograms(allMapped);
          try { localStorage.setItem("ff_programs", JSON.stringify(allMapped)); } catch {}
        }
      })
      .catch(err => console.warn("Reset refresh notice:", err));
  };

  const markProgramCompleted = (programId) => {
    const prog = programs.find(p => p.id === programId);
    const session = prog ? prog.session : "Stage";

    // Only students who actually participated (must be marked present in attendance or have a code letter)
    const currentParts = getParticipantsForProgram(programId);
    const participating = currentParts.filter(p => p.isPresent === true || !!p.codeLetter);

    const progState = deskState[programId] || { attendance: {}, codeLetters: {} };
    const updatedCodes = { ...progState.codeLetters };
    const updatedAttendance = { ...progState.attendance };

    participating.forEach((st, idx) => {
      updatedAttendance[st.id] = true;
      if (!updatedCodes[st.id]) {
        updatedCodes[st.id] = st.codeLetter || getLetterCode(idx);
      }
    });

    setDeskState(prev => ({
      ...prev,
      [programId]: {
        attendance: updatedAttendance,
        codeLetters: updatedCodes
      }
    }));

    let history = participating.map((st, idx) => {
      const code = updatedCodes[st.id] || st.codeLetter || getLetterCode(idx);
      return {
        studentId: String(st.id),
        chestNo: String(st.chestNo || ""),
        name: st.name || "",
        groupId: st.groupId || "",
        groupName: st.groupName || "",
        codeLetter: String(code).trim().toUpperCase()
      };
    });

    if (history.length === 0 && (prog?.participantsHistory?.length > 0 || prog?.codeAllocations?.length > 0)) {
      history = prog.participantsHistory || prog.codeAllocations || [];
    }

    setPrograms(prev => prev.map(p => p.id === programId ? {
      ...p,
      status: "Completed",
      participantsHistory: history.length > 0 ? history : (p.participantsHistory || null),
      codeAllocations: history.length > 0 ? history : (p.codeAllocations || null),
    } : p));

    setActiveStreams(prev => ({
      ...prev,
      [session]: prev[session] === programId ? null : prev[session]
    }));

    if (updateProgramStatusMutation) {
      updateProgramStatusMutation({
        id: programId,
        status: "Completed",
        participantsHistory: history,
        codeAllocations: history,
      }).catch(err => {
        console.warn("Could not sync status & sealed roster to convex:", err);
      });
    }
  };

  // Helper to fetch participant list for a program
  const getParticipantsForProgram = (programId) => {
    if (!programId) return [];
    const prog = programs.find(p => p.id === programId);
    const isCompleted = prog?.status === "Completed" || prog?.status === "published";
    const pState = deskState[programId] || { attendance: {}, codeLetters: {} };

    // Robust list of all students for lookup
    const allStudentsList = Array.isArray(students)
      ? students
      : Object.values(students || {}).flat();

    // 1. Check if specific registrations exist for this program (applies to Stage and registered Off-Stage)
    const progRegs = registrations.filter(r => r.programId === programId);

    if (progRegs.length > 0) {
      return progRegs.flatMap(r => {
        const grp = groups.find(g => g.id === r.groupId || g.groupId === r.groupId);
        const groupStudents = Array.isArray(students)
          ? students.filter(s => s.groupId === r.groupId)
          : (students[r.groupId] || []);

        return (r.participantIds || []).map(id => {
          const st = (groupStudents && groupStudents.find(s => s.id === id)) ||
                     allStudentsList.find(s => s.id === id);

          const isPresent = pState.attendance[id] !== undefined ? pState.attendance[id] : true;
          const histMatch = (prog?.participantsHistory || prog?.codeAllocations || []).find(h => String(h.studentId) === String(id));
          return {
            id: id,
            name: st?.name || `Participant (${id})`,
            chestNo: st?.chestNo || "—",
            category: st?.category || prog?.category || "",
            groupId: r.groupId,
            groupName: grp?.name || r.groupId || "Unknown Group",
            groupColor: grp?.color || "#f59e0b",
            isPresent: isPresent,
            codeLetter: pState.codeLetters[id] || histMatch?.codeLetter || null
          };
        });
      }).sort((a, b) => (parseInt(a.chestNo) || 0) - (parseInt(b.chestNo) || 0));
    }

    // 2. For Off-Stage without explicit registrations:
    if (prog?.session === "Off-Stage" || (prog?.type && prog.type.includes("Off-Stage"))) {
      const progCat = normalizeCategory(prog.category) || "General";
      const isGeneral = progCat === "General";

      const categoryStudents = allStudentsList.filter(st => {
        if (isGeneral) return true;
        const stCat = normalizeCategory(st.category);
        return stCat === progCat;
      });

      return categoryStudents.map(st => {
        const grp = groups.find(g => g.id === st.groupId || g.groupId === st.groupId);
        const histMatch = (prog?.participantsHistory || prog?.codeAllocations || []).find(h => String(h.studentId) === String(st.id));
        
        // Only students who were marked present, or have an assigned code letter / history record are participating
        const isPresent = pState.attendance[st.id] !== undefined
          ? pState.attendance[st.id]
          : (!!pState.codeLetters[st.id] || !!histMatch);

        return {
          id: st.id,
          name: st.name || `Participant (${st.id})`,
          chestNo: st.chestNo || "—",
          category: st.category || prog.category || "",
          groupId: st.groupId,
          groupName: grp?.name || st.groupId || "Unknown Group",
          groupColor: grp?.color || "#f59e0b",
          isPresent: isPresent,
          codeLetter: pState.codeLetters[st.id] || histMatch?.codeLetter || null
        };
      }).sort((a, b) => (parseInt(a.chestNo) || 0) - (parseInt(b.chestNo) || 0));
    }

    return [];
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
      resetToTrialData,
      markProgramCompleted,
      getParticipantsForProgram
    }}>
      {children}
    </DeskContext.Provider>
  );
};
