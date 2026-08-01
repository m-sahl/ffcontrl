import React, { createContext, useContext, useState, useEffect } from "react";

const INITIAL_PROGRAMS = [
  { id: "p-101", name: "Malayalam Elocution", category: "Senior", session: "Stage", date: "Day 1", type: "Single", status: "Upcoming", criteria: ["Fluency", "Content", "Body Language"] },
  { id: "p-102", name: "Qur'an Recitation", category: "Junior", session: "Stage", date: "Day 1", type: "Single", status: "Upcoming", criteria: ["Tajweed", "Melody", "Pronunciation"] },
  { id: "p-103", name: "Group Song (Islamic)", category: "Senior", session: "Stage", date: "Day 1", type: "Group", status: "Upcoming", criteria: ["Rhythm", "Harmony", "Lyrics"] },
  { id: "p-104", name: "Islamic Quiz", category: "General", session: "Stage", date: "Day 2", type: "Single", status: "Upcoming", criteria: ["Accuracy", "Speed"] },
  { id: "p-105", name: "English Speech", category: "Sub-Junior", session: "Stage", date: "Day 2", type: "Single", status: "Upcoming", criteria: ["Pronunciation", "Expression", "Clarity"] },
  { id: "p-106", name: "English Essay Writing", category: "Junior", session: "Off-Stage", date: "Day 1", type: "Single", status: "Upcoming", criteria: ["Grammar", "Structure", "Creativity"] },
  { id: "p-107", name: "Pencil Drawing", category: "Sub-Junior", session: "Off-Stage", date: "Day 1", type: "Single", status: "Upcoming", criteria: ["Shading", "Proportion", "Neatness"] },
  { id: "p-108", name: "Calligraphy", category: "Senior", session: "Off-Stage", date: "Day 2", type: "Single", status: "Upcoming", criteria: ["Style", "Precision", "Flow"] },
  { id: "p-109", name: "Water Color Painting", category: "General", session: "Off-Stage", date: "Day 2", type: "Single", status: "Upcoming", criteria: ["Color Mixing", "Theme", "Artistry"] }
];

const INITIAL_GROUPS = [
  { id: "g-1", name: "Al-Bairaq", color: "#6c63ff" },
  { id: "g-2", name: "Al-Fursan", color: "#22d3ee" },
  { id: "g-3", name: "Al-Shaheen", color: "#f472b6" },
  { id: "g-4", name: "Al-Nujoom", color: "#34d399" }
];

const INITIAL_STUDENTS = {
  "g-1": [
    { id: "st-101", name: "Muhammed Safwan", chestNo: "301", category: "Senior" },
    { id: "st-102", name: "Ameen Faisal", chestNo: "201", category: "Junior" },
    { id: "st-103", name: "Bilal Ahmed", chestNo: "101", category: "Sub-Junior" },
    { id: "st-104", name: "Hamza Riaz", chestNo: "305", category: "Senior" },
    { id: "st-105", name: "Salman Faris", chestNo: "205", category: "Junior" },
    { id: "st-106", name: "Nu'man Basheer", chestNo: "105", category: "Sub-Junior" }
  ],
  "g-2": [
    { id: "st-201", name: "Rashid Khan", chestNo: "302", category: "Senior" },
    { id: "st-202", name: "Zayan Ali", chestNo: "202", category: "Junior" },
    { id: "st-203", name: "Hamdan Nizam", chestNo: "102", category: "Sub-Junior" },
    { id: "st-204", name: "Omar Mukhtar", chestNo: "306", category: "Senior" },
    { id: "st-205", name: "Anas Bin Malik", chestNo: "206", category: "Junior" },
    { id: "st-206", name: "Ayman Zaid", chestNo: "106", category: "Sub-Junior" }
  ],
  "g-3": [
    { id: "st-301", name: "Faris Rahman", chestNo: "303", category: "Senior" },
    { id: "st-302", name: "Rayyan Hassan", chestNo: "203", category: "Junior" },
    { id: "st-303", name: "Ibrahim Koya", chestNo: "103", category: "Sub-Junior" },
    { id: "st-304", name: "Luqman Hakim", chestNo: "307", category: "Senior" },
    { id: "st-305", name: "Zayd Haris", chestNo: "207", category: "Junior" },
    { id: "st-306", name: "Tariq Jameel", chestNo: "107", category: "Sub-Junior" }
  ],
  "g-4": [
    { id: "st-401", name: "Nihal Mustafa", chestNo: "304", category: "Senior" },
    { id: "st-402", name: "Danish Zakariya", chestNo: "204", category: "Junior" },
    { id: "st-403", name: "Yusuf Tariq", chestNo: "104", category: "Sub-Junior" },
    { id: "st-404", name: "Shamil Usman", chestNo: "308", category: "Senior" },
    { id: "st-405", name: "Adnan Sami", chestNo: "208", category: "Junior" },
    { id: "st-406", name: "Mikail Shah", chestNo: "108", category: "Sub-Junior" }
  ]
};

const INITIAL_REGISTRATIONS = [
  // p-101: Malayalam Elocution (Senior)
  { id: "r-101-1", programId: "p-101", groupId: "g-1", participantIds: ["st-101", "st-104"] },
  { id: "r-101-2", programId: "p-101", groupId: "g-2", participantIds: ["st-201", "st-204"] },
  { id: "r-101-3", programId: "p-101", groupId: "g-3", participantIds: ["st-301", "st-304"] },
  { id: "r-101-4", programId: "p-101", groupId: "g-4", participantIds: ["st-401", "st-404"] },
  
  // p-102: Qur'an Recitation (Junior)
  { id: "r-102-1", programId: "p-102", groupId: "g-1", participantIds: ["st-102", "st-105"] },
  { id: "r-102-2", programId: "p-102", groupId: "g-2", participantIds: ["st-202", "st-205"] },
  { id: "r-102-3", programId: "p-102", groupId: "g-3", participantIds: ["st-302", "st-305"] },
  { id: "r-102-4", programId: "p-102", groupId: "g-4", participantIds: ["st-402", "st-405"] },

  // p-103: Group Song (Islamic)
  { id: "r-103-1", programId: "p-103", groupId: "g-1", participantIds: ["st-101", "st-102"] },
  { id: "r-103-2", programId: "p-103", groupId: "g-2", participantIds: ["st-201", "st-202"] },
  { id: "r-103-3", programId: "p-103", groupId: "g-3", participantIds: ["st-301", "st-302"] },
  { id: "r-103-4", programId: "p-103", groupId: "g-4", participantIds: ["st-401", "st-402"] },
  
  // p-104: Islamic Quiz (General - Mixed Sub/Jnr/Snr)
  { id: "r-104-1", programId: "p-104", groupId: "g-1", participantIds: ["st-101", "st-102", "st-103"] },
  { id: "r-104-2", programId: "p-104", groupId: "g-2", participantIds: ["st-201", "st-202", "st-203"] },
  { id: "r-104-3", programId: "p-104", groupId: "g-3", participantIds: ["st-301", "st-302", "st-303"] },
  { id: "r-104-4", programId: "p-104", groupId: "g-4", participantIds: ["st-401", "st-402", "st-403"] },

  // p-105: English Speech (Sub-Junior)
  { id: "r-105-1", programId: "p-105", groupId: "g-1", participantIds: ["st-103", "st-106"] },
  { id: "r-105-2", programId: "p-105", groupId: "g-2", participantIds: ["st-203", "st-206"] },
  { id: "r-105-3", programId: "p-105", groupId: "g-3", participantIds: ["st-303", "st-306"] },
  { id: "r-105-4", programId: "p-105", groupId: "g-4", participantIds: ["st-403", "st-406"] },

  // p-106: English Essay Writing (Off-Stage Junior)
  { id: "r-106-1", programId: "p-106", groupId: "g-1", participantIds: ["st-102", "st-105"] },
  { id: "r-106-2", programId: "p-106", groupId: "g-2", participantIds: ["st-202", "st-205"] },
  { id: "r-106-3", programId: "p-106", groupId: "g-3", participantIds: ["st-302", "st-305"] },
  { id: "r-106-4", programId: "p-106", groupId: "g-4", participantIds: ["st-402", "st-405"] },

  // p-107: Pencil Drawing (Off-Stage Sub-Junior)
  { id: "r-107-1", programId: "p-107", groupId: "g-1", participantIds: ["st-103"] },
  { id: "r-107-2", programId: "p-107", groupId: "g-2", participantIds: ["st-203"] },
  { id: "r-107-3", programId: "p-107", groupId: "g-3", participantIds: ["st-303"] },
  { id: "r-107-4", programId: "p-107", groupId: "g-4", participantIds: ["st-403"] },

  // p-108: Calligraphy (Off-Stage Senior)
  { id: "r-108-1", programId: "p-108", groupId: "g-1", participantIds: ["st-104"] },
  { id: "r-108-2", programId: "p-108", groupId: "g-2", participantIds: ["st-204"] },
  { id: "r-108-3", programId: "p-108", groupId: "g-3", participantIds: ["st-304"] },
  { id: "r-108-4", programId: "p-108", groupId: "g-4", participantIds: ["st-404"] },

  // p-109: Water Color Painting (Off-Stage General)
  { id: "r-109-1", programId: "p-109", groupId: "g-1", participantIds: ["st-105", "st-106"] },
  { id: "r-109-2", programId: "p-109", groupId: "g-2", participantIds: ["st-205", "st-206"] },
  { id: "r-109-3", programId: "p-109", groupId: "g-3", participantIds: ["st-305", "st-306"] },
  { id: "r-109-4", programId: "p-109", groupId: "g-4", participantIds: ["st-405", "st-406"] }
];

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
