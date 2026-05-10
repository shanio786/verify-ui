import { useState, useRef } from "react";
import { moduleData, practiceItems, selfSkillsAssessmentData, misinfoThisWeekItem } from "./data";
import { getWeeklyModules } from "./admin/adminStore";
import type { PracticeItem, AssessItem } from "./data";

type Page = "learning" | "practice" | "me" | "lesson" | "scenario" | "assessment-pre" | "assessment-post" | "weekly";

interface User { name: string; email: string; joinedAt: string; }

function loadUser(): User | null {
  try { const raw = localStorage.getItem("verifyAuCurrentUser"); if (raw) return JSON.parse(raw); } catch {}
  return null;
}
function saveUser(u: User | null) {
  try { if (u) localStorage.setItem("verifyAuCurrentUser", JSON.stringify(u)); else localStorage.removeItem("verifyAuCurrentUser"); } catch {}
}
function loadRegistry(): Record<string, User> {
  try { const raw = localStorage.getItem("verifyAuUserRegistry"); if (raw) return JSON.parse(raw); } catch {}
  return {};
}
function saveRegistry(r: Record<string, User>) {
  try { localStorage.setItem("verifyAuUserRegistry", JSON.stringify(r)); } catch {}
}

interface AppState {
  completedModules: number[];
  keyCheckPassed: number[];
  moduleNeedsReview: number[];
  completedPractices: string[];
  practiceResults: Record<string, { q1: boolean; q2: boolean; q3?: boolean }>;
  currentModule: number;
  currentCard: number;
  lastLearningModule: number | null;
  pretestScore: number | null;
  posttestScore: number | null;
  completedPretest: boolean;
  posttestUnlocked: boolean;
  recentActivity: { text: string; time: string }[];
  selfAssessments: {
    initial: { currentIndex: number; answers: (number | null)[]; completed: boolean };
    final: { currentIndex: number; answers: (number | null)[]; completed: boolean };
  };
}

const defaultState: AppState = {
  completedModules: [],
  keyCheckPassed: [],
  moduleNeedsReview: [],
  completedPractices: [],
  practiceResults: {},
  currentModule: 0,
  currentCard: 0,
  lastLearningModule: null,
  pretestScore: null,
  posttestScore: null,
  completedPretest: false,
  posttestUnlocked: false,
  recentActivity: [],
  selfAssessments: {
    initial: { currentIndex: 0, answers: [], completed: false },
    final: { currentIndex: 0, answers: [], completed: false },
  },
};

function loadState(): AppState {
  try { const raw = localStorage.getItem("verifyAuState_v3"); if (raw) return { ...defaultState, ...JSON.parse(raw) }; } catch {}
  return { ...defaultState };
}
function saveState(s: AppState) {
  try { localStorage.setItem("verifyAuState_v3", JSON.stringify(s)); } catch {}
}

const MODULE_NAMES = ["Claim Identification", "False Authority", "Emotional Framing", "Selective Evidence", "Misleading Statistics"];
const moduleIcons = ["🔍", "🎭", "😤", "🍒", "📊"];
const moduleColors = ["#e0eeff", "#fff3e0", "#fce4ec", "#e8f5e9", "#f3e5f5"];


function addActivity(state: AppState, text: string): AppState {
  const time = new Date().toLocaleString("en-AU", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  const newActivity = [{ text, time }, ...(state.recentActivity || [])].slice(0, 10);
  return { ...state, recentActivity: newActivity };
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, user, onSignIn, onLogout, requireAuth }: {
  page: Page; setPage: (p: Page) => void; user: User | null;
  onSignIn: () => void; onLogout: () => void; requireAuth: (action: () => void) => void;
}) {
  const isL = ["learning", "lesson", "assessment-pre", "assessment-post"].includes(page);
  const isP = ["practice", "scenario"].includes(page);
  const isM = page === "me";
  const isW = page === "weekly";
  const [menuOpen, setMenuOpen] = useState(false);
  const firstName = user ? user.name.split(" ")[0] : "";

  return (
    <nav className="nav">
      <div className="nav-logo">VERIFY<span>-AU</span></div>
      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <button className={`nav-btn ${isL ? "active" : ""}`} onClick={() => setPage("learning")}>Learning</button>
        <button className={`nav-btn ${isP ? "active" : ""}`} onClick={() => setPage("practice")}>Practice</button>
        <button className={`nav-btn ${isW ? "active" : ""}`} onClick={() => setPage("weekly")}>Weekly</button>
        <button className={`nav-btn ${isM ? "active" : ""}`} onClick={() => requireAuth(() => setPage("me"))}>Me</button>
        {user ? (
          <div style={{ position: "relative", marginLeft: "0.5rem" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)", color: "white", padding: "0.4rem 0.7rem", borderRadius: 999, fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
            >
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", color: "var(--primary-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800 }}>{firstName.charAt(0).toUpperCase()}</span>
              {firstName}<span style={{ fontSize: "0.65rem", opacity: 0.8 }}>▾</span>
            </button>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
                <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "white", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", border: "1px solid var(--border)", minWidth: 180, zIndex: 60, overflow: "hidden" }}>
                  <div style={{ padding: "0.7rem 0.85rem", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text)" }}>{user.name}</div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>{user.email}</div>
                  </div>
                  <button onClick={() => { setMenuOpen(false); setPage("me"); }} style={{ width: "100%", textAlign: "left", padding: "0.6rem 0.85rem", background: "white", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "var(--text)" }}>👤 My Progress</button>
                  <button onClick={() => { setMenuOpen(false); onLogout(); }} style={{ width: "100%", textAlign: "left", padding: "0.6rem 0.85rem", background: "white", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "var(--danger)", borderTop: "1px solid var(--border)" }}>↩ Log out</button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button onClick={onSignIn} style={{ marginLeft: "0.5rem", background: "var(--accent)", color: "var(--primary-dark)", border: "none", padding: "0.45rem 0.95rem", borderRadius: 999, fontWeight: 800, fontSize: "0.82rem", cursor: "pointer" }}>Sign In</button>
        )}
      </div>
    </nav>
  );
}

// ─── LEARNING HUB ──────────────────────────────────────────────────────────
function LearningPage({ state, setState, setPage, setScenarioItem, userName, loggedIn, requireAuth }: {
  state: AppState; setState: (s: AppState) => void; setPage: (p: Page) => void;
  setScenarioItem: (item: PracticeItem) => void; userName: string; loggedIn: boolean; requireAuth: (action: () => void) => void;
}) {
  const pretestDone = state.selfAssessments.initial.completed;
  const keyCheckCount = (state.keyCheckPassed || []).length;
  const allKeyChecksDone = keyCheckCount === moduleData.length;
  const lockIcon = !loggedIn ? <span style={{ marginLeft: "0.4rem", fontSize: "0.78rem", opacity: 0.85 }}>🔒</span> : null;

  function openModule(idx: number) {
    requireAuth(() => { setState({ ...state, currentModule: idx, currentCard: 0, lastLearningModule: idx }); setPage("lesson"); });
  }
  function gotoAssessment(target: Page) { requireAuth(() => setPage(target)); }
  function openScenarioGuarded(item: PracticeItem) { requireAuth(() => setScenarioItem(item)); }

  return (
    <div className="page-wrap">
      <div className="hero">
        <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.65, marginBottom: "0.3rem" }}>VERIFY-AU</div>
        <h1>Hi, {userName.split(" ")[0]} 👋</h1>
        <p>Equip yourself with the tools to navigate Australian election information.</p>
        {pretestDone && (
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.18)", padding: "3px 11px", borderRadius: "999px", fontSize: "0.8rem" }}>
              {keyCheckCount}/{moduleData.length} key checks passed
            </span>
            <span style={{ background: "rgba(255,255,255,0.18)", padding: "3px 11px", borderRadius: "999px", fontSize: "0.8rem" }}>
              {state.completedPractices.length} scenarios practiced
            </span>
          </div>
        )}
      </div>

      {state.lastLearningModule !== null && !(state.keyCheckPassed || []).includes(state.lastLearningModule) && (
        <div className="current-card">
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--primary)", marginBottom: "0.2rem" }}>Continue where you left off</div>
            <div style={{ fontWeight: 700 }}>{moduleData[state.lastLearningModule].title}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {(state.completedModules || []).includes(state.lastLearningModule) ? "Ready for Key Check" : `Card ${state.currentCard + 1} of ${moduleData[state.lastLearningModule].cards.length}`}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => openModule(state.lastLearningModule!)}>Resume →</button>
        </div>
      )}

      {!pretestDone && (
        <div className="alert alert-yellow">
          <span style={{ fontSize: "1.1rem" }}>💡</span>
          <div>
            <strong>Start with a quick self-check</strong>
            <p style={{ margin: "0.2rem 0 0.5rem", fontSize: "0.87rem" }}>A {selfSkillsAssessmentData.initial.items.length}-question scenario assessment helps measure your starting skills before learning.</p>
            <button className="btn btn-primary btn-sm" onClick={() => gotoAssessment("assessment-pre")}>Start Self-Assessment</button>
          </div>
        </div>
      )}

      {pretestDone && state.pretestScore !== null && (
        <div className="alert alert-green">
          <span>✅</span>
          <span><strong>Initial assessment complete</strong> — you scored {state.pretestScore}/{selfSkillsAssessmentData.initial.items.length}. Work through the modules below, then take the final assessment.</span>
        </div>
      )}

      <div className="sec-title">Self-Skills Assessment</div>
      <div className="grid-2" style={{ marginBottom: "1.25rem" }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="mod-chip">Assessment Module 01</span>
            {pretestDone && <span className="mod-tag done">Done</span>}
          </div>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.4rem" }}>Initial Self-Skills Assessment</h3>
          <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginBottom: "0.85rem" }}>A card-based self-check before learning. It helps you understand your current ability to identify claims, judge evidence, and recognise misinformation tactics.</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Status: <strong style={{ color: pretestDone ? "var(--success)" : "var(--primary)" }}>{pretestDone ? `Completed (${state.pretestScore}/${selfSkillsAssessmentData.initial.items.length})` : "Available"}</strong></span>
            <button className="btn btn-primary btn-sm" onClick={() => gotoAssessment("assessment-pre")}>{pretestDone ? "Review Assessment" : "Start Self-Assessment"}</button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0, opacity: allKeyChecksDone ? 1 : 0.7 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="mod-chip">Assessment Module 02</span>
            {!allKeyChecksDone && <span className="mod-tag" style={{ background: "#f3f4f6", color: "#6b7280" }}>🔒 Locked</span>}
            {state.selfAssessments.final.completed && <span className="mod-tag done">Done</span>}
          </div>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.4rem" }}>Final Self-Skills Assessment</h3>
          <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginBottom: "0.85rem" }}>A parallel card-based self-check after all learning modules. Uses the same structure and comparable difficulty as the initial assessment.</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Status: <strong style={{ color: allKeyChecksDone ? "var(--success)" : "var(--text-muted)" }}>
                {state.selfAssessments.final.completed ? `Completed (${state.posttestScore}/${selfSkillsAssessmentData.final.items.length})` : allKeyChecksDone ? "Unlocked" : `Locked (${keyCheckCount}/${moduleData.length} key checks passed)`}
              </strong>
            </span>
            {allKeyChecksDone ? (
              <button className="btn btn-primary btn-sm" onClick={() => gotoAssessment("assessment-post")} disabled={state.selfAssessments.final.completed}>{state.selfAssessments.final.completed ? "Done ✓" : "Start Final Assessment"}</button>
            ) : (
              <button className="btn btn-outline btn-sm" disabled>🔒 Locked</button>
            )}
          </div>
        </div>
      </div>

      <div className="misinfo-card">
        <div>
          <div className="misinfo-tag">Misinfo This Week</div>
          <h3>The "Pencil-Gate" Theory</h3>
          <p>Claims about erasable AEC pencils are trending. Practice identifying the claim and spotting the tactic.</p>
        </div>
        <button className="btn btn-outline" style={{ flexShrink: 0 }} onClick={() => openScenarioGuarded(misinfoThisWeekItem)}>Quick Analysis</button>
      </div>

      <div className="sec-title">Mechanisms &amp; Tactics</div>
      <div className="grid-3">
        {moduleData.map((mod, idx) => {
          const keyPassed = (state.keyCheckPassed || []).includes(idx);
          const cardsRead = (state.completedModules || []).includes(idx);
          const needsReview = state.moduleNeedsReview.includes(idx);
          return (
            <div key={idx} className={`module-card${keyPassed ? " done" : ""}${needsReview ? " review" : ""}`}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.55rem" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: moduleColors[idx], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{moduleIcons[idx]}</div>
                <span className="mod-chip">{mod.label}</span>
                {keyPassed && <span className="mod-tag done">Key Check ✓</span>}
                {!keyPassed && cardsRead && <span className="mod-tag" style={{ background: "#fffbeb", color: "#92400e", borderColor: "#fcd34d" }}>Cards Read</span>}
                {needsReview && <span className="mod-tag review">Review</span>}
              </div>
              <h3>{mod.title}</h3>
              <p style={{ marginBottom: "0.1rem" }}>{mod.desc}</p>
              {keyPassed && <div className="progress-bar"><div className="progress-fill" style={{ width: "100%", background: "var(--success)" }} /></div>}
              {!keyPassed && cardsRead && <div className="progress-bar"><div className="progress-fill" style={{ width: "75%", background: "#f59e0b" }} /></div>}
              <button className="start-btn" onClick={(e) => { e.stopPropagation(); openModule(idx); }}>
                {keyPassed ? "↩ Review" : cardsRead ? "🔑 Take Key Check" : "▶ Start Learn"}{lockIcon}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LESSON + KEY CHECK PAGE ────────────────────────────────────────────────
function LessonPage({ state, setState, setPage }: {
  state: AppState; setState: (s: AppState) => void; setPage: (p: Page) => void;
}) {
  const mod = moduleData[state.currentModule];
  const cardIdx = state.currentCard;
  const card = mod.cards[cardIdx];
  const total = mod.cards.length;
  const isLast = cardIdx === total - 1;
  const cardsRead = (state.completedModules || []).includes(state.currentModule);
  const keyPassed = (state.keyCheckPassed || []).includes(state.currentModule);

  // Key Check state
  const [kcMode, setKcMode] = useState<"off" | "quiz" | "result">(cardsRead && !keyPassed ? "quiz" : "off");
  const [kcQ, setKcQ] = useState(0);
  const [kcAnswers, setKcAnswers] = useState<(number | null)[]>([null, null, null]);
  const [kcConfirmed, setKcConfirmed] = useState<boolean[]>([false, false, false]);
  const [kcResult, setKcResult] = useState<boolean[]>([]);

  function next() { if (cardIdx < total - 1) setState({ ...state, currentCard: cardIdx + 1 }); }
  function prev() { if (cardIdx > 0) setState({ ...state, currentCard: cardIdx - 1 }); }

  function markCardsRead() {
    const newDone = (state.completedModules || []).includes(state.currentModule) ? state.completedModules : [...(state.completedModules || []), state.currentModule];
    setState({ ...state, completedModules: newDone });
    setKcMode("quiz");
    setKcQ(0);
    setKcAnswers([null, null, null]);
    setKcConfirmed([false, false, false]);
  }

  function kcSelectAnswer(optionIdx: number) {
    if (kcConfirmed[kcQ]) return;
    const newAnswers = [...kcAnswers]; newAnswers[kcQ] = optionIdx; setKcAnswers(newAnswers);
  }

  function kcConfirmAnswer() {
    if (kcAnswers[kcQ] === null) return;
    const newConf = [...kcConfirmed]; newConf[kcQ] = true; setKcConfirmed(newConf);
    setTimeout(() => {
      if (kcQ < 2) {
        setKcQ(kcQ + 1);
      } else {
        const results = mod.keyCheckQuestions.map((q, i) => kcAnswers[i] === q.correct);
        setKcResult(results);
        setKcMode("result");
        if (results.every(Boolean)) {
          const newKeyCheckPassed = [...new Set([...(state.keyCheckPassed || []), state.currentModule])];
          const posttestUnlocked = newKeyCheckPassed.length === moduleData.length;
          const newState = addActivity({ ...state, keyCheckPassed: newKeyCheckPassed, completedModules: [...new Set([...(state.completedModules || []), state.currentModule])], posttestUnlocked }, `Key Check passed: ${mod.title}`);
          setState(newState);
        }
      }
    }, 400);
  }

  function kcRetry() {
    setKcQ(0); setKcAnswers([null, null, null]); setKcConfirmed([false, false, false]); setKcResult([]); setKcMode("quiz");
  }

  const kcPassed = kcResult.length === 3 && kcResult.every(Boolean);

  return (
    <div className="page-wrap">
      <button className="back-btn" onClick={() => setPage("learning")}>← Back to Learning Hub</button>

      <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
        <span className="mod-chip">{mod.label}</span>
        <h2 style={{ fontWeight: 800, fontSize: "1.35rem", marginTop: "0.4rem", marginBottom: "0.2rem" }}>{mod.title}</h2>
        <p style={{ fontSize: "0.86rem", color: "var(--text-muted)" }}>{mod.desc}</p>
      </div>

      {kcMode === "off" && (
        <>
          <div className="fc-dots">
            {mod.cards.map((_, i) => (
              <div key={i} className={`fc-dot${i === cardIdx ? " active" : i < cardIdx ? " done-dot" : ""}`} />
            ))}
          </div>
          <div className="flashcard">
            <h2>{card.t}</h2>
            <p>{card.p}</p>
            <div className="fc-au"><strong>🇦🇺 AU Example:</strong> {card.au}</div>
            <div className="fc-reflect"><strong>Key check:</strong> {card.reflect}</div>
          </div>
          <p style={{ textAlign: "center", fontSize: "0.84rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>Card <strong>{cardIdx + 1}</strong> of <strong>{total}</strong></p>
          <div className="fc-nav">
            <button className="btn btn-outline" onClick={prev} disabled={cardIdx === 0}>← Previous</button>
            {!isLast ? (
              <button className="btn btn-primary" onClick={next}>Next →</button>
            ) : (
              <button className="btn btn-success" onClick={markCardsRead}>{cardsRead ? "Take Key Check 🔑" : "Finish Reading → Take Key Check"}</button>
            )}
          </div>
          {isLast && !cardsRead && (
            <div className="complete-box">
              <strong>You've reached the end of this module!</strong>
              <p style={{ fontSize: "0.86rem", color: "#374151", margin: "0.5rem 0 0.85rem" }}>Next, take the 3-question Key Check to confirm your understanding. You need 3/3 to complete the module.</p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button className="btn btn-success btn-sm" onClick={markCardsRead}>Take Key Check 🔑</button>
              </div>
            </div>
          )}
        </>
      )}

      {kcMode === "quiz" && (
        <div className="card" style={{ maxWidth: 580, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--primary)" }}>🔑 Key Check — {mod.title}</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Question {kcQ + 1} of 3</span>
          </div>
          <div className="fc-dots" style={{ marginBottom: "1rem" }}>
            {[0, 1, 2].map((i) => <div key={i} className={`fc-dot${i === kcQ ? " active" : i < kcQ ? " done-dot" : ""}`} />)}
          </div>
          <p style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.85rem" }}>{mod.keyCheckQuestions[kcQ].q}</p>
          {mod.keyCheckQuestions[kcQ].options.map((opt, i) => {
            let cls = "option-btn";
            if (kcConfirmed[kcQ]) {
              const isUserAnswer = kcAnswers[kcQ] === i;
              const isCorrect = i === mod.keyCheckQuestions[kcQ].correct;
              if (isUserAnswer && isCorrect) cls += " correct";
              else if (isUserAnswer && !isCorrect) cls += " incorrect";
            } else if (kcAnswers[kcQ] === i) cls += " selected";
            return <button key={i} className={cls} onClick={() => kcSelectAnswer(i)} disabled={kcConfirmed[kcQ]}>{opt}</button>;
          })}
          <button className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} onClick={kcConfirmAnswer} disabled={kcAnswers[kcQ] === null || kcConfirmed[kcQ]}>
            {kcConfirmed[kcQ] ? (kcQ < 2 ? "Loading next…" : "Loading results…") : "Confirm Answer"}
          </button>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.75rem", textAlign: "center" }}>You need 3 out of 3 correct to pass. No limit on attempts.</p>
        </div>
      )}

      {kcMode === "result" && (
        <div className="card" style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{kcPassed ? "🎉" : "📝"}</div>
          <h2 style={{ fontWeight: 800, fontSize: "1.3rem" }}>{kcPassed ? "Key Check Passed!" : "Not Quite — Try Again"}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.87rem", margin: "0.4rem 0 1rem" }}>
            {kcPassed ? `${mod.title} is now complete. Your understanding has been confirmed.` : `You got ${kcResult.filter(Boolean).length}/3 correct. Review the results below and try again.`}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
            {kcResult.map((ok, i) => (
              <div key={i} style={{ padding: "0.5rem 0.8rem", borderRadius: 8, border: `1.5px solid ${ok ? "#86efac" : "#fca5a5"}`, background: ok ? "#f0fdf4" : "#fef2f2", fontSize: "0.82rem", fontWeight: 700, color: ok ? "#166534" : "#991b1b", textAlign: "left", maxWidth: 260 }}>
                <span style={{ marginRight: "0.4rem" }}>{ok ? "✓" : "✗"}</span>
                Q{i + 1}: {ok ? "Correct" : "Incorrect — your answer was not right"}
              </div>
            ))}
          </div>
          {kcPassed ? (
            <button className="btn btn-success" onClick={() => setPage("learning")} style={{ width: "100%" }}>Back to Learning Hub →</button>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button className="btn btn-outline" onClick={() => setPage("learning")}>Back to Hub</button>
              <button className="btn btn-primary" onClick={kcRetry}>Try Again 🔄</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PRACTICE HUB ──────────────────────────────────────────────────────────
function PracticePage({ state, setState, setPage, setScenarioItem, loggedIn, requireAuth }: {
  state: AppState; setState: (s: AppState) => void; setPage: (p: Page) => void;
  setScenarioItem: (item: PracticeItem) => void; loggedIn: boolean; requireAuth: (action: () => void) => void;
}) {
  const [tab, setTab] = useState<"bank" | "done">("bank");
  const pretestDone = state.selfAssessments.initial.completed;
  const banked = practiceItems.filter((p) => !state.completedPractices.includes(p.id));
  const done = practiceItems.filter((p) => state.completedPractices.includes(p.id));
  function openItem(item: PracticeItem) { requireAuth(() => setScenarioItem(item)); }

  return (
    <div className="page-wrap">
      <h1 style={{ fontSize: "1.55rem", fontWeight: 800, marginBottom: "1.1rem" }}>Practice Hub</h1>
      {!pretestDone && (
        <div className="alert alert-yellow">
          <span>💡</span>
          <div>
            <strong>Complete the self-assessment first</strong> to measure your improvement later.{" "}
            <button className="btn btn-primary btn-sm" style={{ marginTop: "0.35rem" }} onClick={() => requireAuth(() => setPage("assessment-pre"))}>Start Assessment</button>
          </div>
        </div>
      )}
      <div className="tab-switch">
        <button className={`tab-btn ${tab === "bank" ? "active" : ""}`} onClick={() => setTab("bank")}>Question Bank ({banked.length})</button>
        <button className={`tab-btn ${tab === "done" ? "active" : ""}`} onClick={() => setTab("done")}>Practiced ({done.length})</button>
      </div>

      {tab === "bank" && (
        banked.length === 0 ? (
          <div className="empty-state"><div className="e-icon">🎉</div><strong>All scenarios completed!</strong><p>Switch to Practiced tab to review.</p></div>
        ) : (
          <div className="practice-card-grid">
            {banked.map((item) => (
              <div key={item.id} className="pcard" onClick={() => openItem(item)}>
                <div className="src-chip">{item.sourceLabel}</div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--primary)", marginBottom: "0.3rem" }}>{item.label}</div>
                <h4 style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.25rem", lineHeight: 1.4 }}>{item.title}</h4>
                <p style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{item.subtitle.split("|")[0].trim()}</p>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "done" && (
        done.length === 0 ? (
          <div className="empty-state"><div className="e-icon">📚</div><strong>No scenarios practiced yet.</strong><p>Head to the Question Bank to get started.</p></div>
        ) : (
          <div className="practice-card-grid">
            {done.map((item) => {
              const res = state.practiceResults[item.id];
              const allRight = res?.q1 && res?.q2 && res?.q3 !== false;
              const hasQ3 = res?.q3 !== undefined;
              return (
                <div key={item.id} className="pcard done-card" onClick={() => openItem(item)}>
                  <div className="src-chip">{item.sourceLabel}</div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--primary)", marginBottom: "0.3rem" }}>{item.label}</div>
                  <h4 style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.4rem", lineHeight: 1.4 }}>{item.title}</h4>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {[{ label: "Claim", ok: res?.q1 }, { label: "Verdict", ok: res?.q2 }, { label: "Mechanism", ok: res?.q3 }].map((b) => (
                      b.ok !== undefined && (
                        <span key={b.label} style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 7px", borderRadius: "999px", background: b.ok ? "#dcfce7" : "#fee2e2", color: b.ok ? "#166534" : "#991b1b" }}>
                          {b.ok ? "✓" : "✗"} {b.label}
                        </span>
                      )
                    ))}
                    {!hasQ3 && <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>— Redo for Step 3</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

// ─── SCENARIO PAGE ─────────────────────────────────────────────────────────
function ScenarioPage({ item, state, setState, setPage, scenarioBack }: {
  item: PracticeItem; state: AppState; setState: (s: AppState) => void; setPage: (p: Page) => void; scenarioBack?: "learning" | "practice" | "weekly";
}) {
  const [step, setStep] = useState(1);
  const [q1Ans, setQ1Ans] = useState<number | null>(null);
  const [q2Ans, setQ2Ans] = useState<string | null>(null);
  const [q3Sel, setQ3Sel] = useState<Set<number>>(new Set());
  const [confirmed1, setConfirmed1] = useState(false);
  const [confirmed2, setConfirmed2] = useState(false);
  const [q3Submitted, setQ3Submitted] = useState(false);

  const correctMechanisms = item.mechanisms || [0];
  const back = scenarioBack ?? "practice";
  const backLabel = back === "learning" ? "Learning" : back === "weekly" ? "Weekly" : "Practice";

  function confirmQ1() {
    if (q1Ans === null) return;
    setConfirmed1(true);
    setTimeout(() => setStep(2), 500);
  }

  function confirmQ2() {
    if (!q2Ans) return;
    setConfirmed2(true);
    setTimeout(() => setStep(3), 500);
  }

  function toggleMechanism(idx: number) {
    if (q3Submitted) return;
    const next = new Set(q3Sel);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setQ3Sel(next);
  }

  function submitMechanisms() {
    if (q3Sel.size === 0) return;
    setQ3Submitted(true);
    const selected = Array.from(q3Sel).sort();
    const correct = [...correctMechanisms].sort();
    const q3C = selected.length === correct.length && selected.every((v, i) => v === correct[i]);
    const q1C = q1Ans === item.q1Correct;
    const q2C = q2Ans === item.q2Correct;
    const newCompleted = state.completedPractices.includes(item.id) ? state.completedPractices : [...state.completedPractices, item.id];
    const newState = addActivity({ ...state, completedPractices: newCompleted, practiceResults: { ...state.practiceResults, [item.id]: { q1: q1C, q2: q2C, q3: q3C } } }, `Completed scenario: ${item.title.split("'")[0]}`);
    setState(newState);
    setTimeout(() => setStep(4), 400);
  }

  const q1C = q1Ans === item.q1Correct;
  const q2C = q2Ans === item.q2Correct;
  const selected = Array.from(q3Sel).sort();
  const correct = [...correctMechanisms].sort();
  const q3C = selected.length === correct.length && selected.every((v, i) => v === correct[i]);

  const steps = [{ label: "1. Identify Claim" }, { label: "2. Judge Claim" }, { label: "3. Mechanisms" }, { label: "4. Result" }];

  return (
    <div className="page-wrap">
      <button className="back-btn" onClick={() => setPage(back)}>← Back to {backLabel}</button>

      <div className="steps-wrap">
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, flex: i < steps.length - 1 ? 1 : undefined }}>
            <span className={`step-pill${step === i + 1 ? " active" : step > i + 1 ? " done-step" : ""}`}>{s.label}</span>
            {i < steps.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: "1rem" }}>
        <div className="card">
          <span className="src-chip">{item.sourceLabel}</span>
          <h3 style={{ fontWeight: 800, fontSize: "0.97rem", margin: "0.5rem 0 0.2rem" }}>{item.title}</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}><em>{item.subtitle}</em></p>
          <div className="post-bubble" dangerouslySetInnerHTML={{ __html: item.postText }} />
          <div className="context-box"><strong>Context:</strong> {item.contextText}</div>
        </div>

        <div className="card">
          {step === 1 && (
            <>
              <h3 style={{ fontWeight: 700, marginBottom: "0.7rem" }}>1. Identify the Claim</h3>
              <p style={{ fontSize: "0.87rem", color: "var(--text-muted)", marginBottom: "0.9rem" }}>{item.q1}</p>
              {item.q1Options.map((opt, i) => {
                let cls = "option-btn";
                if (confirmed1) { if (i === item.q1Correct) cls += " correct"; else if (i === q1Ans) cls += " incorrect"; }
                else if (q1Ans === i) cls += " selected";
                return <button key={i} className={cls} onClick={() => !confirmed1 && setQ1Ans(i)} disabled={confirmed1}>{opt}</button>;
              })}
              <button className="btn btn-primary" style={{ width: "100%", marginTop: "0.4rem" }} onClick={confirmQ1} disabled={q1Ans === null}>Confirm Answer</button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 style={{ fontWeight: 700, marginBottom: "0.7rem" }}>2. Judge the Claim</h3>
              <p style={{ fontSize: "0.87rem", color: "var(--text-muted)", marginBottom: "0.9rem" }}>{item.q2Question}</p>
              <div className="grid-2" style={{ gap: "8px" }}>
                {item.q2Options.map((opt) => {
                  let cls = "option-btn";
                  if (confirmed2) { if (opt === item.q2Correct) cls += " correct"; else if (opt === q2Ans) cls += " incorrect"; }
                  else if (q2Ans === opt) cls += " selected";
                  return <button key={opt} className={cls} style={{ textAlign: "center" }} onClick={() => !confirmed2 && setQ2Ans(opt)} disabled={confirmed2}>{opt}</button>;
                })}
              </div>
              <button className="btn btn-primary" style={{ width: "100%", marginTop: "0.75rem" }} onClick={confirmQ2} disabled={!q2Ans}>Submit Judgement</button>
            </>
          )}

          {step === 3 && (
            <>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>3. Which Mechanisms Apply?</h3>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginBottom: "0.85rem" }}>Select all misinformation mechanisms used in this scenario. You must get the exact combination right.</p>
              {MODULE_NAMES.map((name, i) => {
                const isSelected = q3Sel.has(i);
                const isCorrect = correctMechanisms.includes(i);
                let borderColor = "var(--border)";
                let bg = "white";
                if (q3Submitted) { if (isCorrect) { borderColor = "#86efac"; bg = "#f0fdf4"; } else if (isSelected && !isCorrect) { borderColor = "#fca5a5"; bg = "#fef2f2"; } }
                else if (isSelected) { borderColor = "var(--primary)"; bg = "var(--primary-light)"; }
                return (
                  <button
                    key={i}
                    onClick={() => toggleMechanism(i)}
                    disabled={q3Submitted}
                    style={{ width: "100%", textAlign: "left", padding: "0.6rem 0.8rem", marginBottom: "0.45rem", borderRadius: 8, border: `1.5px solid ${borderColor}`, background: bg, cursor: q3Submitted ? "default" : "pointer", fontSize: "0.86rem", fontWeight: isSelected ? 700 : 400, display: "flex", alignItems: "center", gap: "0.5rem", transition: "all 0.15s" }}
                  >
                    <span style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${isSelected ? "var(--primary)" : "#d1d5db"}`, background: isSelected ? "var(--primary)" : "white", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.7rem", color: "white", fontWeight: 800 }}>{isSelected ? "✓" : ""}</span>
                    {moduleIcons[i]} {name}
                    {q3Submitted && isCorrect && <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "#166534", fontWeight: 700 }}>✓ Correct</span>}
                    {q3Submitted && isSelected && !isCorrect && <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "#991b1b", fontWeight: 700 }}>✗ Not this one</span>}
                  </button>
                );
              })}
              <button className="btn btn-primary" style={{ width: "100%", marginTop: "0.4rem" }} onClick={submitMechanisms} disabled={q3Sel.size === 0 || q3Submitted}>
                {q3Submitted ? "Loading result…" : "Submit Mechanisms"}
              </button>
            </>
          )}

          {step === 4 && (
            <>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                {[{ label: `Claim: ${q1C ? "✓" : "✗"}`, ok: q1C }, { label: `Verdict: ${q2C ? "✓" : "✗"}`, ok: q2C }, { label: `Mechanism: ${q3C ? "✓" : "✗"}`, ok: q3C }].map((b) => (
                  <span key={b.label} style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700, background: b.ok ? "#dcfce7" : "#fee2e2", color: b.ok ? "#166534" : "#991b1b" }}>{b.label}</span>
                ))}
              </div>
              <div className="verdict-box">
                <h4>Analysis Result</h4>
                <p className="verdict-line"><strong>Correct Verdict:</strong> <span className="v-chip">{item.q2Verdict}</span></p>
                <p className="verdict-line"><strong>Mechanisms:</strong> {correctMechanisms.map((i) => MODULE_NAMES[i]).join(" + ")}</p>
                <p className="verdict-line"><strong>Analysis:</strong> {item.explanation}</p>
                <p className="verdict-line"><strong>Tactic:</strong> {item.tactic}</p>
                <p className="verdict-line"><strong>Reference:</strong> {item.reference}</p>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} onClick={() => setPage(back)}>Back to {backLabel}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ME PAGE ───────────────────────────────────────────────────────────────
function MePage({ state, setState, setPage, user, onLogout }: { state: AppState; setState: (s: AppState) => void; setPage: (p: Page) => void; user: User; onLogout: () => void }) {
  const totalPracticed = state.completedPractices.length;
  const keyCheckCount = (state.keyCheckPassed || []).length;
  const allKeyChecksDone = keyCheckCount === moduleData.length;

  const allCorrectCount = Object.values(state.practiceResults).filter((r) => r.q1 && r.q2 && r.q3 !== false).length;
  const practiceAccuracy = totalPracticed > 0 ? Math.round((allCorrectCount / totalPracticed) * 100) : 0;

  const pre = state.pretestScore ?? null;
  const post = state.posttestScore ?? null;
  const totalQ = selfSkillsAssessmentData.initial.items.length;
  const growthPoints = pre !== null && post !== null ? post - pre : null;
  const growthPct = pre !== null && post !== null && pre > 0 ? Math.round(((post - pre) / pre) * 100) : null;

  const continueModule = state.lastLearningModule !== null && !(state.keyCheckPassed || []).includes(state.lastLearningModule)
    ? state.lastLearningModule : null;

  const practiceSetEarned = practiceItems.every((item) => {
    const r = state.practiceResults[item.id];
    return r && r.q1 && r.q2 && r.q3 === true;
  });

  const badges = [
    { emoji: "📋", name: "Baseline Set", earned: state.selfAssessments.initial.completed, desc: "Initial assessment complete" },
    { emoji: "🔍", name: "Claim Spotter", earned: (state.keyCheckPassed || []).includes(0), desc: "Module 1 key check passed" },
    { emoji: "🎭", name: "Source Critic", earned: (state.keyCheckPassed || []).includes(1), desc: "Module 2 key check passed" },
    { emoji: "😤", name: "Calm Reader", earned: (state.keyCheckPassed || []).includes(2), desc: "Module 3 key check passed" },
    { emoji: "🍒", name: "Cherry Picker", earned: (state.keyCheckPassed || []).includes(3), desc: "Module 4 key check passed" },
    { emoji: "📊", name: "Data Analyst", earned: (state.keyCheckPassed || []).includes(4), desc: "Module 5 key check passed" },
    { emoji: "🎓", name: "Full Curriculum", earned: allKeyChecksDone, desc: "All 5 key checks passed" },
    { emoji: "🏋️", name: "Practice Set", earned: practiceSetEarned, desc: "All 50 practice scenarios fully correct" },
    { emoji: "🎯", name: "Post-test Taken", earned: state.selfAssessments.final.completed, desc: "Final assessment completed" },
    { emoji: "📈", name: "Growth Champion", earned: growthPoints !== null && growthPoints > 0, desc: "Post-test score beats pre-test score" },
  ];
  const earnedCount = badges.filter((b) => b.earned).length;

  const nextAction: { label: string; cta: string; page: Page } | null = (() => {
    if (!state.selfAssessments.initial.completed) return { label: "Start here: take the initial self-assessment to set your baseline.", cta: "Take Initial Assessment", page: "assessment-pre" };
    const nextModule = moduleData.findIndex((_, i) => !(state.keyCheckPassed || []).includes(i));
    if (nextModule !== -1) return { label: `Next: pass the Key Check for Module ${nextModule + 1} — ${moduleData[nextModule].title}.`, cta: "Go to Learning", page: "learning" };
    if (!state.selfAssessments.final.completed) return { label: "You've passed all Key Checks! Take the final assessment to measure your growth.", cta: "Take Final Assessment", page: "assessment-post" };
    if (!practiceSetEarned) return { label: "Keep practising — complete and score 100% on all 50 scenarios to earn Practice Set.", cta: "Go to Practice", page: "practice" };
    return null;
  })();

  return (
    <div className="page-wrap">
      <h1 style={{ fontSize: "1.55rem", fontWeight: 800, marginBottom: "1.1rem" }}>My Progress</h1>

      {/* Next-action prompt */}
      {nextAction ? (
        <div className="alert alert-yellow" style={{ marginBottom: "1.1rem" }}>
          <span style={{ fontSize: "1.1rem" }}>👉</span>
          <div>
            <strong>What to do next</strong>
            <p style={{ margin: "0.2rem 0 0.5rem", fontSize: "0.87rem" }}>{nextAction.label}</p>
            <button className="btn btn-primary btn-sm" onClick={() => setPage(nextAction.page)}>{nextAction.cta}</button>
          </div>
        </div>
      ) : (
        <div className="alert alert-green" style={{ marginBottom: "1.1rem" }}>
          <span>🏆</span>
          <span><strong>All done!</strong> You've completed the full curriculum, taken both assessments, and mastered all practice scenarios. Excellent work!</span>
        </div>
      )}

      {/* Profile + stats */}
      <div className="grid-2">
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>🧑‍🎓</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>{user.name}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
            </div>
            <button onClick={onLogout} style={{ background: "transparent", border: "1.5px solid var(--border)", color: "var(--text-muted)", padding: "0.35rem 0.7rem", borderRadius: 8, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>Log out</button>
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginBottom: "0.85rem" }}>Member since {new Date(user.joinedAt).toLocaleDateString("en-AU", { month: "short", year: "numeric" })}</div>
          <div className="stat-row"><span>Scenarios practiced</span><strong>{totalPracticed}</strong></div>
          <div className="stat-row"><span>Key checks passed</span><strong>{keyCheckCount} / {moduleData.length}</strong></div>
          <div className="stat-row"><span>3-step accuracy</span><strong>{totalPracticed > 0 ? `${practiceAccuracy}%` : "—"}</strong></div>
          <div className="stat-row"><span>Badges earned</span><strong>{earnedCount} / {badges.length}</strong></div>
          {continueModule !== null && (
            <div style={{ marginTop: "0.85rem", padding: "0.7rem", background: "var(--primary-light)", borderRadius: 8, border: "1.5px solid #93c5fd" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--primary)", marginBottom: "0.25rem" }}>Continue where you left off</div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.4rem" }}>{moduleData[continueModule].title}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                {(state.completedModules || []).includes(continueModule) ? "Ready for Key Check" : `Card ${state.currentCard + 1} of ${moduleData[continueModule].cards.length}`}
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => { setState({ ...state, currentModule: continueModule, lastLearningModule: continueModule }); setPage("lesson"); }}>Resume →</button>
            </div>
          )}
        </div>

        {/* Growth score */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Skill Growth Score</div>
          {pre !== null && post !== null ? (
            <>
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.85rem" }}>
                <div style={{ flex: 1, textAlign: "center", padding: "0.85rem", background: "#f8fafc", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Pre-test</div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>{pre}<span style={{ fontSize: "0.9rem", fontWeight: "normal", color: "var(--text-muted)" }}>/{totalQ}</span></div>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "0.85rem", background: "#f8fafc", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Post-test</div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>{post}<span style={{ fontSize: "0.9rem", fontWeight: "normal", color: "var(--text-muted)" }}>/{totalQ}</span></div>
                </div>
              </div>
              <div style={{ textAlign: "center", padding: "0.85rem", borderRadius: 8, background: growthPoints !== null && growthPoints > 0 ? "#f0fdf4" : growthPoints === 0 ? "#fffbeb" : "#fef2f2", border: `1.5px solid ${growthPoints !== null && growthPoints > 0 ? "#86efac" : growthPoints === 0 ? "#fcd34d" : "#fca5a5"}` }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: growthPoints !== null && growthPoints > 0 ? "var(--success)" : growthPoints === 0 ? "#d97706" : "var(--danger)" }}>
                  {growthPoints !== null && growthPoints > 0 ? `+${growthPoints}` : growthPoints === 0 ? "±0" : growthPoints}
                  {growthPct !== null && <span style={{ fontSize: "0.9rem", fontWeight: 600, marginLeft: "0.3rem" }}>({growthPct > 0 ? "+" : ""}{growthPct}%)</span>}
                </div>
                <div style={{ fontSize: "0.78rem", marginTop: "0.2rem", color: "var(--text-muted)" }}>
                  {growthPoints !== null && growthPoints > 0 ? "Score improved — well done!" : growthPoints === 0 ? "Same score — keep practicing!" : "Score dipped — review the modules"}
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.88rem" }}>
              {pre === null ? "Complete the initial assessment to set your baseline." : "Pass all 5 key checks to unlock the final assessment."}
              <div style={{ marginTop: "0.75rem" }}>
                <button className="btn btn-primary btn-sm" onClick={() => setPage(pre === null ? "assessment-pre" : "learning")}>{pre === null ? "Take Initial Assessment" : "Continue Learning"}</button>
              </div>
            </div>
          )}
          <div style={{ marginTop: "0.85rem" }}>
            <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.55rem" }}>Module Key Checks</div>
            {moduleData.map((mod, i) => {
              const passed = (state.keyCheckPassed || []).includes(i);
              const read = (state.completedModules || []).includes(i);
              return (
                <div key={i} className="mod-prog-row">
                  <div className="mod-prog-label" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>{moduleIcons[i]} {mod.title}</div>
                  <div className="mod-prog-bar"><div className="mod-prog-fill" style={{ width: passed ? "100%" : read ? "60%" : "0%", background: passed ? "var(--success)" : "var(--primary)" }} /></div>
                  <div className="mod-prog-pct">{passed ? "✓" : read ? "60%" : "0%"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 9 Badges */}
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>Awards &amp; Badges</div>
        <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Earn all 9 badges by completing key checks, improving your score, and mastering practice scenarios.</p>
        <div className="badge-row">
          {badges.map((b) => (
            <div key={b.name} className={`badge-pill ${b.earned ? "earned" : "locked"}`}>
              <div style={{ fontSize: "1.3rem" }}>{b.emoji}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, marginTop: "2px" }}>{b.name}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "1px" }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {(state.recentActivity || []).length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: "0.65rem" }}>Recent Activity</div>
          {(state.recentActivity || []).slice(0, 5).map((a, i) => (
            <div key={i} className="stat-row" style={{ gap: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem" }}>● {a.text}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{a.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Final assessment unlock */}
      <div className="card" style={{ border: allKeyChecksDone ? "1.5px solid #86efac" : "1.5px dashed var(--border)", background: allKeyChecksDone ? "#f0fdf4" : "#fafafa", textAlign: "center" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Final Self-Skills Assessment</h3>
        {allKeyChecksDone ? (
          <>
            <p style={{ fontSize: "0.87rem", color: "#374151", marginBottom: "0.85rem" }}>All key checks passed! Take the final assessment to measure your growth.</p>
            {state.selfAssessments.final.completed
              ? <span style={{ padding: "4px 12px", borderRadius: "999px", background: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: "0.84rem" }}>Final Assessment Done ✓</span>
              : <button className="btn btn-primary" onClick={() => setPage("assessment-post")}>Start Final Assessment →</button>}
          </>
        ) : (
          <>
            <p style={{ fontSize: "0.87rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              🔒 Pass all {moduleData.length} key checks to unlock.{" "}
              <strong style={{ color: "var(--primary)" }}>{keyCheckCount}/{moduleData.length} passed</strong>
            </p>
            <button className="btn btn-outline" disabled>Locked</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── WEEKLY PAGE ────────────────────────────────────────────────────────────
function WeeklyPage({ state, setPage, openScenario, requireAuth }: {
  state: AppState; setPage: (p: Page) => void; openScenario: (item: PracticeItem) => void; requireAuth: (action: () => void) => void;
}) {
  const today = new Date();
  const allPublished = getWeeklyModules().filter((w) => w.published && !w.deleted).sort((a, b) => a.sortOrder - b.sortOrder);
  const activeWeeklyModules = allPublished.filter((wm) => {
    if (!wm.startDate && !wm.endDate) return true;
    const start = wm.startDate ? new Date(wm.startDate) : null;
    const end = wm.endDate ? new Date(wm.endDate) : null;
    if (start && today < start) return false;
    if (end && today > end) return false;
    return true;
  });

  function openLinkedScenario(practiceId: string) {
    const found = practiceId === "misinfo-week" ? misinfoThisWeekItem : practiceItems.find((p) => p.id === practiceId);
    if (found) requireAuth(() => openScenario(found));
  }

  const misinfoWeekDone = state.completedPractices.includes("misinfo-week");

  return (
    <div className="page-wrap">
      <div className="hero" style={{ background: "linear-gradient(135deg, #5B21B6 0%, #2563eb 100%)" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.65, marginBottom: "0.3rem" }}>VERIFY-AU</div>
        <h1>Weekly Focus</h1>
        <p>Curated media literacy topics updated each week to match current events in Australian politics and elections.</p>
      </div>

      {/* Week 1 baseline — always shown */}
      <div className="card" style={{ borderLeft: "4px solid #7c3aed" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#7c3aed", marginBottom: "0.2rem" }}>Week 1 · Baseline</div>
            <h3 style={{ fontWeight: 800, fontSize: "1.05rem", margin: 0 }}>Misinfo This Week</h3>
          </div>
          <span style={{ padding: "3px 10px", borderRadius: "999px", background: "#dcfce7", color: "#166534", fontSize: "0.75rem", fontWeight: 700 }}>Active</span>
        </div>
        <p style={{ fontSize: "0.87rem", color: "var(--text-muted)", marginBottom: "0.65rem" }}>A real-world misinformation scenario drawn from Australian election content — practise your 3-step analysis.</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => openLinkedScenario("misinfo-week")}
            style={{ padding: "0.5rem 0.85rem", borderRadius: 8, border: `1.5px solid ${misinfoWeekDone ? "#86efac" : "var(--border)"}`, background: misinfoWeekDone ? "#f0fdf4" : "white", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", color: misinfoWeekDone ? "#166534" : "var(--text)" }}
          >
            {misinfoWeekDone ? "✓ " : ""}The "Pencil-Gate" Theory
          </button>
        </div>
      </div>

      {activeWeeklyModules.length === 0 ? (
        <div className="empty-state"><div className="e-icon">📅</div><strong>No additional weekly content this week.</strong><p>Check back soon — the admin team publishes new topics weekly.</p></div>
      ) : (
        activeWeeklyModules.map((wm) => {
          const linkedItems = practiceItems.filter((p) => (wm.linkedQuestions || []).includes(p.id));

          return (
            <div key={wm.id} className="card" style={{ borderLeft: `4px solid ${wm.color || "var(--primary)"}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: wm.color || "var(--primary)", marginBottom: "0.2rem" }}>{wm.label}</div>
                  <h3 style={{ fontWeight: 800, fontSize: "1.05rem", margin: 0 }}>{wm.title}</h3>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: "999px", background: "#dcfce7", color: "#166534", fontSize: "0.75rem", fontWeight: 700 }}>Active</span>
              </div>

              <p style={{ fontSize: "0.87rem", color: "var(--text-muted)", marginBottom: "0.65rem" }}>{wm.description}</p>

              {wm.context && (
                <div style={{ background: "#f8fafc", borderLeft: "3px solid var(--border)", borderRadius: 6, padding: "0.65rem 0.85rem", fontSize: "0.83rem", color: "#374151", marginBottom: "0.75rem" }}>
                  <strong>Context:</strong> {wm.context}
                </div>
              )}

              {(wm.tags || []).length > 0 && (
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
                  {wm.tags.map((tag) => (
                    <span key={tag} style={{ padding: "2px 9px", borderRadius: "999px", background: "var(--primary-light)", color: "var(--primary-dark)", fontSize: "0.74rem", fontWeight: 700, border: "1px solid #93c5fd" }}>{tag}</span>
                  ))}
                </div>
              )}

              {linkedItems.length > 0 && (
                <>
                  <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.45rem", color: "var(--text)" }}>Related Practice Scenarios</div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {linkedItems.map((it) => {
                      const done = state.completedPractices.includes(it.id);
                      return (
                        <button
                          key={it.id}
                          onClick={() => openLinkedScenario(it.id)}
                          style={{ padding: "0.5rem 0.85rem", borderRadius: 8, border: `1.5px solid ${done ? "#86efac" : "var(--border)"}`, background: done ? "#f0fdf4" : "white", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", color: done ? "#166534" : "var(--text)" }}
                        >
                          {done ? "✓ " : ""}{it.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {(wm.startDate || wm.endDate) && (
                <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {wm.startDate && `From ${new Date(wm.startDate).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}`}
                  {wm.endDate && ` · Until ${new Date(wm.endDate).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}`}
                </div>
              )}
            </div>
          );
        })
      )}

      <div style={{ textAlign: "center", padding: "1.5rem 0 0.5rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
        New weekly content is added by educators and administrators. Check back each week.
      </div>
    </div>
  );
}

// ─── ASSESSMENT PAGE ────────────────────────────────────────────────────────
function AssessmentPage({ type, state, setState, setPage }: {
  type: "pre" | "post"; state: AppState; setState: (s: AppState) => void; setPage: (p: Page) => void;
}) {
  const data = type === "pre" ? selfSkillsAssessmentData.initial : selfSkillsAssessmentData.final;
  const assessKey = type === "pre" ? "initial" : "final";
  const assessState = state.selfAssessments[assessKey];
  const [answers, setAnswers] = useState<(number | null)[]>(assessState.answers.length > 0 ? assessState.answers : new Array(data.items.length).fill(null));
  const [currentIdx, setCurrentIdx] = useState(assessState.currentIndex || 0);
  const [isDone, setIsDone] = useState(assessState.completed);

  const item: AssessItem = data.items[currentIdx];
  const currentAns = answers[currentIdx];
  const isLast = currentIdx === data.items.length - 1;
  const totalQ = data.items.length;

  function select(i: number) { if (isDone) return; const a = [...answers]; a[currentIdx] = i; setAnswers(a); }

  function next() {
    if (!isLast) {
      setCurrentIdx(currentIdx + 1);
      setState({ ...state, selfAssessments: { ...state.selfAssessments, [assessKey]: { ...assessState, currentIndex: currentIdx + 1, answers } } });
    } else {
      const score = answers.filter((a, i) => a === data.items[i].correctIndex).length;
      const newState = addActivity({ ...state, selfAssessments: { ...state.selfAssessments, [assessKey]: { currentIndex: 0, answers, completed: true } }, ...(type === "pre" ? { pretestScore: score, completedPretest: true } : { posttestScore: score }) }, type === "pre" ? `Completed initial assessment: ${score}/${totalQ}` : `Completed final assessment: ${score}/${totalQ}`);
      setState(newState);
      setIsDone(true);
    }
  }

  if (isDone || assessState.completed) {
    const score = type === "pre" ? state.pretestScore : state.posttestScore;
    const finalAns = assessState.completed ? assessState.answers : answers;
    const pct = ((score ?? 0) / totalQ) * 100;
    const emoji = pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚";
    const msg = pct >= 80 ? "Excellent — strong critical thinking skills." : pct >= 50 ? "Good start — modules will sharpen your skills." : "The modules will help you build these skills step by step.";
    return (
      <div className="page-wrap">
        <div className="card assess-wrap" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{emoji}</div>
          <h2 style={{ fontWeight: 800, fontSize: "1.4rem" }}>Assessment Complete!</h2>
          <p style={{ color: "var(--text-muted)", margin: "0.3rem 0 0.5rem" }}>You scored</p>
          <div className="score-big">{score}<span style={{ fontSize: "1.2rem", fontWeight: "normal", color: "var(--text-muted)" }}>/{totalQ}</span></div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: "0.5rem 0 1.5rem" }}>{msg}</p>
          {data.items.map((q, i) => {
            const ans = finalAns[i];
            const correct = ans === q.correctIndex;
            return (
              <div key={i} style={{ textAlign: "left", border: `1px solid ${correct ? "#86efac" : "#fca5a5"}`, borderRadius: 8, padding: "0.7rem 0.9rem", marginBottom: "0.5rem", background: correct ? "#f0fdf4" : "#fef2f2" }}>
                <div style={{ fontSize: "0.77rem", fontWeight: 700, color: correct ? "#166534" : "#991b1b", marginBottom: "3px" }}>{correct ? "✓ Correct" : "✗ Incorrect"} — {q.skill}</div>
                <div style={{ fontSize: "0.82rem" }}><strong>Your answer:</strong> {ans !== null ? q.options[ans] : "No answer"}{!correct && <><br /><strong>Correct:</strong> {q.options[q.correctIndex]}</>}</div>
              </div>
            );
          })}
          <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={() => setPage(type === "pre" ? "learning" : "me")}>{type === "pre" ? "Start Learning →" : "View My Progress →"}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <button className="back-btn" onClick={() => setPage(type === "pre" ? "learning" : "me")}>← Cancel</button>
      <div className="assess-wrap">
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--primary)", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>{data.title}</div>
          <h2 style={{ fontWeight: 800 }}>Question {currentIdx + 1} of {data.items.length}</h2>
          <div className="progress-bar" style={{ marginTop: "0.5rem" }}><div className="progress-fill" style={{ width: `${(currentIdx / data.items.length) * 100}%` }} /></div>
        </div>
        <div className="card">
          <span className="src-chip">{item.sourceLabel}</span>
          <div style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", margin: "4px 0 6px" }}>Skill: {item.skill}</div>
          <div className="assess-post" dangerouslySetInnerHTML={{ __html: item.postText }} />
          <p style={{ fontWeight: 700, fontSize: "0.95rem", margin: "0.85rem 0 0.7rem" }}>{item.question}</p>
          {item.options.map((opt, i) => (
            <button key={i} className={`option-btn${currentAns === i ? " selected" : ""}`} onClick={() => select(i)}>{opt}</button>
          ))}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button className="btn btn-outline" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>← Back</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={next} disabled={currentAns === null}>{isLast ? "Submit Assessment" : "Next →"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN / SIGNUP MODAL ──────────────────────────────────────────────────
function LoginModal({ onAuth, onClose, reason }: { onAuth: (u: User) => void; onClose: () => void; reason?: string; }) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) { setError("Please enter a valid email address."); return; }
    const registry = loadRegistry();
    if (mode === "signup") {
      const cleanName = name.trim();
      if (cleanName.length < 2) { setError("Please enter your name (at least 2 characters)."); return; }
      if (registry[cleanEmail]) { setError("This email is already registered. Switch to Login instead."); return; }
      const user: User = { name: cleanName, email: cleanEmail, joinedAt: new Date().toISOString() };
      registry[cleanEmail] = user; saveRegistry(registry); saveUser(user); onAuth(user);
    } else {
      const user = registry[cleanEmail];
      if (!user) { setError("No account found for this email. Sign up first."); return; }
      saveUser(user); onAuth(user);
    }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", animation: "fadeIn 0.18s ease-out" }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 420, padding: "2rem 1.75rem", position: "relative", margin: 0 }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 10, right: 12, background: "transparent", border: "none", fontSize: "1.4rem", color: "var(--text-muted)", cursor: "pointer", lineHeight: 1 }}>×</button>
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <div style={{ fontWeight: 800, fontSize: "1.6rem", color: "var(--primary)" }}>VERIFY<span style={{ color: "var(--accent)" }}>-AU</span></div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>{reason || "Sign up or log in to track your progress."}</p>
        </div>
        <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 10, padding: 4, marginBottom: "1.25rem" }}>
          {(["signup", "login"] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "0.55rem", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.88rem", background: mode === m ? "white" : "transparent", color: mode === m ? "var(--primary)" : "var(--text-muted)", boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
              {m === "signup" ? "Sign Up" : "Log In"}
            </button>
          ))}
        </div>
        <h2 style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: "0.3rem" }}>{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.1rem" }}>{mode === "signup" ? "Just your name and email — no password needed." : "Enter your email to continue where you left off."}</p>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <div style={{ marginBottom: "0.85rem" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.3rem" }}>Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Freya Sharma" autoFocus style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: 8, border: "1.5px solid var(--border)", fontSize: "0.95rem", boxSizing: "border-box" }} />
            </div>
          )}
          <div style={{ marginBottom: "0.85rem" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.3rem" }}>Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoFocus={mode === "login"} style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: 8, border: "1.5px solid var(--border)", fontSize: "0.95rem", boxSizing: "border-box" }} />
          </div>
          {error && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "0.55rem 0.7rem", borderRadius: 8, fontSize: "0.82rem", marginBottom: "0.85rem", border: "1px solid #fecaca" }}>{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.7rem", fontSize: "0.95rem" }}>{mode === "signup" ? "Create account & Start →" : "Log in →"}</button>
        </form>
        <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "1.1rem" }}>
          {mode === "signup" ? "Already have an account? " : "New here? "}
          <button type="button" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }} style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<User | null>(loadUser);
  const [state, setStateRaw] = useState<AppState>(loadState);
  const [page, setPage] = useState<Page>("learning");
  const [scenarioItem, setScenarioItem] = useState<PracticeItem | null>(null);
  const [scenarioBack, setScenarioBack] = useState<"learning" | "practice" | "weekly">("practice");
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginReason, setLoginReason] = useState<string | undefined>(undefined);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setState(s: AppState) {
    setStateRaw(s);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveState(s), 300);
  }

  function openScenario(item: PracticeItem, back: "learning" | "practice" | "weekly" = "practice") {
    setScenarioItem(item); setScenarioBack(back); setPage("scenario");
  }

  function requireAuth(action: () => void) {
    if (user) { action(); return; }
    pendingActionRef.current = action;
    setLoginReason("Sign up or log in to continue — your progress will be saved.");
    setLoginOpen(true);
  }

  function openSignIn() { pendingActionRef.current = null; setLoginReason(undefined); setLoginOpen(true); }

  function handleAuth(u: User) {
    setUser(u); setLoginOpen(false);
    const pending = pendingActionRef.current; pendingActionRef.current = null;
    if (pending) setTimeout(pending, 0);
  }

  function logout() { saveUser(null); setUser(null); setPage("learning"); }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar page={page} setPage={setPage} user={user} onSignIn={openSignIn} onLogout={logout} requireAuth={requireAuth} />
      {page === "learning" && <LearningPage state={state} setState={setState} setPage={setPage} setScenarioItem={(item) => openScenario(item, "learning")} userName={user ? user.name : "Guest"} loggedIn={!!user} requireAuth={requireAuth} />}
      {page === "lesson" && <LessonPage state={state} setState={setState} setPage={setPage} />}
      {page === "practice" && <PracticePage state={state} setState={setState} setPage={setPage} setScenarioItem={(item) => openScenario(item, "practice")} loggedIn={!!user} requireAuth={requireAuth} />}
      {page === "scenario" && scenarioItem && <ScenarioPage item={scenarioItem} state={state} setState={setState} setPage={setPage} scenarioBack={scenarioBack} />}
      {page === "me" && user && <MePage state={state} setState={setState} setPage={setPage} user={user} onLogout={logout} />}
      {page === "weekly" && <WeeklyPage state={state} setPage={setPage} openScenario={(item) => openScenario(item, "weekly")} requireAuth={requireAuth} />}
      {page === "assessment-pre" && <AssessmentPage type="pre" state={state} setState={setState} setPage={setPage} />}
      {page === "assessment-post" && <AssessmentPage type="post" state={state} setState={setState} setPage={setPage} />}
      {loginOpen && <LoginModal reason={loginReason} onAuth={handleAuth} onClose={() => { setLoginOpen(false); pendingActionRef.current = null; }} />}
    </div>
  );
}
