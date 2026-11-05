// Leader APK Corporate Light SaaS Theme Color Palette
// Matched exactly to FestFlow Leader APK (colors.dart & theme.dart)

export const BG_LIGHT = "#f8f9fa";             // Crisp off-white corporate background (AppColors.lightBackground)
export const CARD_LIGHT = "#ffffff";           // Pure white elevated cards (AppColors.lightCard)
export const SURFACE_SUBTLE = "#f1f4f9";       // Subtle segment/chip fills (AppColors.lightSurfaceSubtle)
export const CARD_BORDER_LIGHT = "#e2e8f0";     // Sharp 1px SaaS border (AppColors.lightBorder)
export const BORDER_SUBTLE = "#eaecf0";        // AppColors.lightBorderSubtle

export const TEXT_PRIMARY_LIGHT = "#0f172a";   // Deep charcoal Slate 900 (AppColors.lightTextPrimary)
export const TEXT_SECONDARY_LIGHT = "#334155"; // Rich charcoal Slate 700 (AppColors.lightTextSecondary)
export const TEXT_MUTED_LIGHT = "#64748b";     // Slate 500 (AppColors.lightTextMuted)
export const TEXT_SUBTLE_LIGHT = "#94a3b8";    // Slate 400 (AppColors.lightTextSubtle)

// --- Signature Brand Colors ---
export const CORAL_PRIMARY = "#f14d4d";        // Vibrant Coral Crimson (AppColors.primary)
export const CORAL_DARK = "#d63333";           // AppColors.primaryDark
export const CORAL_LIGHT = "#ff6666";          // AppColors.primaryLight
export const CORAL_SOFT = "rgba(241, 77, 77, 0.08)"; // 8% soft pill background (AppColors.primarySoft)
export const CORAL_GLOW = "rgba(241, 77, 77, 0.20)"; // 20% glow (AppColors.primaryGlow)
export const ACCENT = CORAL_PRIMARY;           // Alias for CORAL_PRIMARY

// --- Corporate Accents for Status Indicators & Productivity Badges ---
export const EMERALD_SUCCESS = "#10b981";      // Emerald Green (Registered / Active / Live)
export const EMERALD_SOFT = "rgba(16, 185, 129, 0.08)";
export const SUCCESS = EMERALD_SUCCESS;        // Alias

export const SAPPHIRE_BLUE = "#2563eb";        // Corporate Tech Sapphire (Members / Team Roster)
export const SAPPHIRE_SOFT = "rgba(37, 99, 235, 0.08)";
export const BLUE_NEUTRAL = SAPPHIRE_BLUE;     // Alias

export const AMBER_WARNING = "#f59e0b";        // Amber Bronze (Locks / Pending / Schedule)
export const AMBER_DARK = "#d97706";
export const AMBER_SOFT = "rgba(245, 158, 11, 0.08)";
export const WARNING = AMBER_WARNING;          // Alias

export const RED_DANGER = "#ef4444";           // Urgent Alert / Closed / Absent
export const RED_SOFT = "rgba(239, 68, 68, 0.08)";
export const DANGER = RED_DANGER;              // Alias

// --- Category Normalization & Tag Colors (Low, Mid, High, General) ---
export const normalizeCategory = (cat) => {
  if (!cat || cat.toLowerCase() === "all") return undefined;
  const c = String(cat).trim().toLowerCase();
  if (c.includes("sub") || c === "sj" || c === "low") return "Low";
  if (c.includes("jun") || c === "jr" || c === "mid") return "Mid";
  if (c.includes("sen") || c === "sr" || c === "high") return "High";
  if (c.includes("gen")) return "General";
  return cat;
};

export const CAT_COLORS = {
  "Low": "#7c3aed",                            // Violet 600 (formerly Sub-Junior)
  "Mid": "#2563eb",                            // Sapphire Blue (formerly Junior)
  "High": "#d97706",                           // Amber Bronze (formerly Senior)
  "General": "#10b981",                        // Emerald Mint
  // Backward compatibility aliases
  "Sub-Junior": "#7c3aed",
  "Junior": "#2563eb",
  "Senior": "#d97706",
};

export const getCategoryColor = (category) => {
  if (!category) return CAT_COLORS.General;
  const norm = normalizeCategory(category);
  if (norm && CAT_COLORS[norm]) return CAT_COLORS[norm];
  const match = Object.keys(CAT_COLORS).find(k => category.toLowerCase().includes(k.toLowerCase()));
  return match ? CAT_COLORS[match] : CAT_COLORS.General;
};

// Categories & Sessions
export const CATEGORIES = ["All", "Low", "Mid", "High", "General"];
export const STUDENT_CATEGORIES = ["Low", "Mid", "High"];
export const SESSIONS = ["Stage", "Off-Stage"];
