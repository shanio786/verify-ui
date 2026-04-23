import { useState, useRef } from "react";
import { moduleData, practiceItems, selfSkillsAssessmentData, misinfoThisWeekItem } from "./data";
import type { PracticeItem, AssessItem } from "./data";

type Page = "learning" | "practice" | "me" | "lesson" | "scenario" | "assessment-pre" | "assessment-post";

interface AppState {
  completedModules: number[];
  moduleNeedsReview: number[];
  completedPractices: string[];
  practiceResults: Record<string, { q1: boolean; q2: boolean }>;
  currentModule: number;
  currentCard: number;
  lastLearningModule: number | null;
  pretestScore: number | null;
  posttestScore: number | null;
  completedPretest: boolean;
  posttestUnlocked: boolean;
  selfAssessments: {
    initial: { currentIndex: number; answers: (number | null)[]; completed: boolean };
    final: { currentIndex: number; answers: (number | null)[]; completed: boolean };
  };
}

const defaultState: AppState = {
  completedModules: [],
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
  selfAssessments: {
    initial: { currentIndex: 0, answers: [], completed: false },
    final: { currentIndex: 0, answers: [], completed: false },
  },
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem("verifyAuState_v3");
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultState };
}

function saveState(s: AppState) {
  try { localStorage.setItem("verifyAuState_v3", JSON.stringify(s)); } catch {}
}

const moduleIcons = ["🔍", "🎭", "😤", "🍒", "📊"];
const moduleColors = ["#e0eeff", "#fff3e0", "#fce4ec", "#e8f5e9", "#f3e5f5"];

// ─── NAVBAR ────────────────────────────────────────────────────────────────
function Navbar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const isL = ["learning", "lesson", "assessment-pre", "assessment-post"].includes(page);
  const isP = ["practice", "scenario"].includes(page);
  const isM = page === "me";
  return (
    <nav className="nav">
      <div className="nav-logo">VERIFY<span>-AU</span></div>
      <div className="nav-links">
        <button className={`nav-btn ${isL ? "active" : ""}`} onClick={() => setPage("learning")}>Learning</button>
        <button className={`nav-btn ${isP ? "active" : ""}`} onClick={() => setPage("practice")}>Practice</button>
        <button className={`nav-btn ${isM ? "active" : ""}`} onClick={() => setPage("me")}>Me</button>
      </div>
    </nav>
  );
}

// ─── LEARNING HUB ──────────────────────────────────────────────────────────
function LearningPage({
  state, setState, setPage, setScenarioItem,
}: {
  state: AppState; setState: (s: AppState) => void; setPage: (p: Page) => void;
  setScenarioItem: (item: PracticeItem) => void;
}) {
  const pretestDone = state.selfAssessments.initial.completed;
  const doneModules = state.completedModules.length;
  const totalPracticed = state.completedPractices.length;

  function openModule(idx: number) {
    setState({ ...state, currentModule: idx, currentCard: 0, lastLearningModule: idx });
    setPage("lesson");
  }

  return (
    <div className="page-wrap">
      {/* Hero */}
      <div className="hero">
        <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.65, marginBottom: "0.3rem" }}>VERIFY-AU</div>
        <h1>Hi, Freya 👋</h1>
        <p>Equip yourself with the tools to navigate Australian election information.</p>
        {pretestDone && (
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.18)", padding: "3px 11px", borderRadius: "999px", fontSize: "0.8rem" }}>
              {doneModules}/{moduleData.length} modules done
            </span>
            <span style={{ background: "rgba(255,255,255,0.18)", padding: "3px 11px", borderRadius: "999px", fontSize: "0.8rem" }}>
              {totalPracticed} scenarios practiced
            </span>
          </div>
        )}
      </div>

      {/* Current Activity resume */}
      {state.lastLearningModule !== null && !state.completedModules.includes(state.lastLearningModule) && (
        <div className="current-card">
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--primary)", marginBottom: "0.2rem" }}>
              Continue where you left off
            </div>
            <div style={{ fontWeight: 700 }}>{moduleData[state.lastLearningModule].title}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Card {state.currentCard + 1} of {moduleData[state.lastLearningModule].cards.length}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => openModule(state.lastLearningModule!)}>Resume →</button>
        </div>
      )}

      {/* Pre-test nudge */}
      {!pretestDone && (
        <div className="alert alert-yellow">
          <span style={{ fontSize: "1.1rem" }}>💡</span>
          <div>
            <strong>Start with a quick self-check</strong>
            <p style={{ margin: "0.2rem 0 0.5rem", fontSize: "0.87rem" }}>
              A 6-question assessment helps measure your starting skills before learning.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => setPage("assessment-pre")}>
              Start Self-Assessment
            </button>
          </div>
        </div>
      )}

      {pretestDone && state.pretestScore !== null && (
        <div className="alert alert-green">
          <span>✅</span>
          <span>
            <strong>Initial assessment complete</strong> — you scored {state.pretestScore}/6. Work through the modules below, then take the final assessment.
          </span>
        </div>
      )}

      {/* Self-Skills Assessment grid */}
      <div className="sec-title">Self-Skills Assessment</div>
      <div className="skill-grid">
        {selfSkillsAssessmentData.initial.items.map((item, idx) => {
          const ans = state.selfAssessments.initial.answers[idx];
          const correct = pretestDone && ans === item.correctIndex;
          const wrong = pretestDone && ans !== item.correctIndex;
          const iconColors = ["#e0eeff", "#fff3e0", "#fce4ec", "#e8f5e9", "#f3e5f5", "#e0f2fe"];
          const icons = ["🔍", "⚖️", "🎯", "📷", "📋", "🗳️"];
          return (
            <div key={item.pairId} className="skill-card">
              <div className="skill-icon" style={{ background: iconColors[idx] }}>{icons[idx]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{item.skill}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.difficulty}</div>
              </div>
              {pretestDone && (
                <span style={{
                  fontSize: "0.7rem", fontWeight: 700, padding: "2px 7px", borderRadius: "999px",
                  background: correct ? "#dcfce7" : "#fee2e2",
                  color: correct ? "#166534" : "#991b1b"
                }}>
                  {correct ? "✓" : "✗ Review"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Misinfo This Week */}
      <div className="misinfo-card">
        <div>
          <div className="misinfo-tag">Misinfo This Week</div>
          <h3>The "Pencil-Gate" Theory</h3>
          <p>Claims about erasable AEC pencils are trending. Practice identifying the claim and spotting the tactic.</p>
        </div>
        <button className="btn btn-outline" style={{ flexShrink: 0 }} onClick={() => { setScenarioItem(misinfoThisWeekItem); setPage("scenario"); }}>
          Quick Analysis
        </button>
      </div>

      {/* Mechanisms & Tactics */}
      <div className="sec-title">Mechanisms &amp; Tactics</div>
      <div className="grid-3">
        {moduleData.map((mod, idx) => {
          const isDone = state.completedModules.includes(idx);
          const needsReview = state.moduleNeedsReview.includes(idx);
          return (
            <div key={idx} className={`module-card${isDone ? " done" : ""}${needsReview ? " review" : ""}`}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.55rem" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: moduleColors[idx],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", flexShrink: 0
                }}>
                  {moduleIcons[idx]}
                </div>
                <span className="mod-chip">{mod.label}</span>
                {isDone && <span className="mod-tag done">Done</span>}
                {needsReview && <span className="mod-tag review">Review</span>}
              </div>
              <h3>{mod.title}</h3>
              <p style={{ marginBottom: "0.1rem" }}>{mod.desc}</p>
              {isDone && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "100%", background: needsReview ? "var(--danger)" : "var(--success)" }} />
                </div>
              )}
              {/* Start Learn button */}
              <button
                className="start-btn"
                onClick={(e) => { e.stopPropagation(); setState({ ...state, currentModule: idx, currentCard: 0, lastLearningModule: idx }); setPage("lesson"); }}
              >
                {isDone ? "↩ Review" : "▶ Start Learn"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LESSON (FLASHCARD) PAGE ────────────────────────────────────────────────
function LessonPage({ state, setState, setPage }: {
  state: AppState; setState: (s: AppState) => void; setPage: (p: Page) => void;
}) {
  const mod = moduleData[state.currentModule];
  const cardIdx = state.currentCard;
  const card = mod.cards[cardIdx];
  const total = mod.cards.length;
  const isLast = cardIdx === total - 1;
  const isDone = state.completedModules.includes(state.currentModule);

  function next() { if (cardIdx < total - 1) setState({ ...state, currentCard: cardIdx + 1 }); }
  function prev() { if (cardIdx > 0) setState({ ...state, currentCard: cardIdx - 1 }); }

  function markComplete() {
    const newDone = state.completedModules.includes(state.currentModule)
      ? state.completedModules : [...state.completedModules, state.currentModule];
    setState({ ...state, completedModules: newDone, posttestUnlocked: newDone.length === moduleData.length });
    setPage("learning");
  }

  function markReview() {
    const newReview = state.moduleNeedsReview.includes(state.currentModule)
      ? state.moduleNeedsReview : [...state.moduleNeedsReview, state.currentModule];
    setState({ ...state, moduleNeedsReview: newReview });
    setPage("learning");
  }

  return (
    <div className="page-wrap">
      <button className="back-btn" onClick={() => setPage("learning")}>← Back to Learning Hub</button>

      <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
        <span className="mod-chip">{mod.label}</span>
        <h2 style={{ fontWeight: 800, fontSize: "1.35rem", marginTop: "0.4rem", marginBottom: "0.2rem" }}>{mod.title}</h2>
        <p style={{ fontSize: "0.86rem", color: "var(--text-muted)" }}>{mod.desc}</p>
      </div>

      {/* Dots */}
      <div className="fc-dots">
        {mod.cards.map((_, i) => (
          <div key={i} className={`fc-dot${i === cardIdx ? " active" : i < cardIdx ? " done-dot" : ""}`} />
        ))}
      </div>

      {/* Flashcard */}
      <div className="flashcard">
        <h2>{card.t}</h2>
        <p>{card.p}</p>
        <div className="fc-au"><strong>🇦🇺 AU Example:</strong> {card.au}</div>
        <div className="fc-reflect"><strong>Key check:</strong> {card.reflect}</div>
      </div>

      <p style={{ textAlign: "center", fontSize: "0.84rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
        Card <strong>{cardIdx + 1}</strong> of <strong>{total}</strong>
      </p>

      <div className="fc-nav">
        <button className="btn btn-outline" onClick={prev} disabled={cardIdx === 0}>← Previous</button>
        {!isLast ? (
          <button className="btn btn-primary" onClick={next}>Next →</button>
        ) : (
          <button className="btn btn-success" onClick={markComplete}>Complete Module ✓</button>
        )}
      </div>

      {isLast && !isDone && (
        <div className="complete-box">
          <strong>You've reached the end of this module!</strong>
          <p style={{ fontSize: "0.86rem", color: "#374151", margin: "0.5rem 0 0.85rem" }}>
            Mark it as done to track progress, or flag for review.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="btn btn-outline btn-sm" onClick={markReview}>Flag for Review</button>
            <button className="btn btn-success btn-sm" onClick={markComplete}>Mark Done &amp; Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PRACTICE HUB ──────────────────────────────────────────────────────────
function PracticePage({
  state, setState, setPage, setScenarioItem,
}: {
  state: AppState; setState: (s: AppState) => void; setPage: (p: Page) => void;
  setScenarioItem: (item: PracticeItem) => void;
}) {
  const [tab, setTab] = useState<"bank" | "done">("bank");
  const pretestDone = state.selfAssessments.initial.completed;
  const banked = practiceItems.filter((p) => !state.completedPractices.includes(p.id));
  const done = practiceItems.filter((p) => state.completedPractices.includes(p.id));

  return (
    <div className="page-wrap">
      <h1 style={{ fontSize: "1.55rem", fontWeight: 800, marginBottom: "1.1rem" }}>Practice Hub</h1>

      {!pretestDone && (
        <div className="alert alert-yellow">
          <span>💡</span>
          <div>
            <strong>Complete the self-assessment first</strong> to measure your improvement later.{" "}
            <button className="btn btn-primary btn-sm" style={{ marginTop: "0.35rem" }} onClick={() => setPage("assessment-pre")}>
              Start Assessment
            </button>
          </div>
        </div>
      )}

      <div className="tab-switch">
        <button className={`tab-btn ${tab === "bank" ? "active" : ""}`} onClick={() => setTab("bank")}>
          Question Bank ({banked.length})
        </button>
        <button className={`tab-btn ${tab === "done" ? "active" : ""}`} onClick={() => setTab("done")}>
          Practiced ({done.length})
        </button>
      </div>

      {tab === "bank" && (
        banked.length === 0 ? (
          <div className="empty-state"><div className="e-icon">🎉</div><strong>All scenarios completed!</strong><p>Switch to Practiced tab to review.</p></div>
        ) : (
          <div className="practice-card-grid">
            {banked.map((item) => (
              <div key={item.id} className="pcard" onClick={() => setScenarioItem(item)}>
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
              const bothRight = res?.q1 && res?.q2;
              return (
                <div key={item.id} className="pcard done-card" onClick={() => setScenarioItem(item)}>
                  <div className="src-chip">{item.sourceLabel}</div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--primary)", marginBottom: "0.3rem" }}>{item.label}</div>
                  <h4 style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.4rem", lineHeight: 1.4 }}>{item.title}</h4>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px",
                    background: bothRight ? "#dcfce7" : "#fee2e2",
                    color: bothRight ? "#166534" : "#991b1b"
                  }}>
                    {bothRight ? "✓ Both correct" : "Needs review"}
                  </span>
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
function ScenarioPage({
  item, state, setState, setPage, fromMisinfo,
}: {
  item: PracticeItem; state: AppState; setState: (s: AppState) => void;
  setPage: (p: Page) => void; fromMisinfo?: boolean;
}) {
  const [step, setStep] = useState(1);
  const [q1Ans, setQ1Ans] = useState<number | null>(null);
  const [q2Ans, setQ2Ans] = useState<string | null>(null);
  const [confirmed1, setConfirmed1] = useState(false);
  const [confirmed2, setConfirmed2] = useState(false);

  function confirmQ1() {
    if (q1Ans === null) return;
    setConfirmed1(true);
    setTimeout(() => setStep(2), 500);
  }

  function confirmQ2() {
    if (!q2Ans) return;
    setConfirmed2(true);
    if (item.id !== "misinfo-week") {
      const q1C = q1Ans === item.q1Correct;
      const q2C = q2Ans === item.q2Correct;
      const newCompleted = state.completedPractices.includes(item.id)
        ? state.completedPractices : [...state.completedPractices, item.id];
      setState({ ...state, completedPractices: newCompleted, practiceResults: { ...state.practiceResults, [item.id]: { q1: q1C, q2: q2C } } });
    }
    setStep(3);
  }

  const q1C = q1Ans === item.q1Correct;
  const q2C = q2Ans === item.q2Correct;
  const back = fromMisinfo ? "learning" : "practice";

  return (
    <div className="page-wrap">
      <button className="back-btn" onClick={() => setPage(back)}>← Back to {fromMisinfo ? "Learning" : "Practice"}</button>

      {/* Step indicator */}
      <div className="steps-wrap">
        {[{ label: "1. Identify Claim" }, { label: "2. Judge Claim" }, { label: "3. Result" }].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, flex: i < 2 ? 1 : undefined }}>
            <span className={`step-pill${step === i + 1 ? " active" : step > i + 1 ? " done-step" : ""}`}>{s.label}</span>
            {i < 2 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: "1rem" }}>
        {/* Left: Post content */}
        <div className="card">
          <span className="src-chip">{item.sourceLabel}</span>
          <h3 style={{ fontWeight: 800, fontSize: "0.97rem", margin: "0.5rem 0 0.2rem" }}>{item.title}</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}><em>{item.subtitle}</em></p>
          <div className="post-bubble" dangerouslySetInnerHTML={{ __html: item.postText }} />
          <div className="context-box"><strong>Context:</strong> {item.contextText}</div>
        </div>

        {/* Right: Questions */}
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
              <button className="btn btn-primary" style={{ width: "100%", marginTop: "0.4rem" }} onClick={confirmQ1} disabled={q1Ans === null}>
                Confirm Answer
              </button>
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
              <button className="btn btn-primary" style={{ width: "100%", marginTop: "0.75rem" }} onClick={confirmQ2} disabled={!q2Ans}>
                Submit Judgement
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                {[{ label: `Claim: ${q1C ? "✓" : "✗"}`, ok: q1C }, { label: `Verdict: ${q2C ? "✓" : "✗"}`, ok: q2C }].map((b) => (
                  <span key={b.label} style={{
                    padding: "3px 10px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700,
                    background: b.ok ? "#dcfce7" : "#fee2e2", color: b.ok ? "#166534" : "#991b1b"
                  }}>{b.label}</span>
                ))}
              </div>
              <div className="verdict-box">
                <h4>Analysis Result</h4>
                <p className="verdict-line"><strong>Correct Verdict:</strong> <span className="v-chip">{item.q2Verdict}</span></p>
                <p className="verdict-line"><strong>Analysis:</strong> {item.explanation}</p>
                <p className="verdict-line"><strong>Tactic / Mechanism:</strong> {item.tactic}</p>
                <p className="verdict-line"><strong>Reference:</strong> {item.reference}</p>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} onClick={() => setPage(back)}>
                Back to {fromMisinfo ? "Learning" : "Practice Hub"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ME PAGE ───────────────────────────────────────────────────────────────
function MePage({ state, setPage }: { state: AppState; setPage: (p: Page) => void }) {
  const totalPracticed = state.completedPractices.length;
  const correctCount = Object.values(state.practiceResults).filter((r) => r.q1 && r.q2).length;
  const avgScore = totalPracticed > 0 ? Math.round((correctCount / totalPracticed) * 100) : 0;
  const doneModules = state.completedModules.length;
  const allDone = doneModules === moduleData.length;

  const badges = [
    { name: "🛡️ Claim Spotter", earned: totalPracticed >= 1, desc: "First scenario done" },
    { name: "🔍 Fact Finder", earned: correctCount >= 3, desc: "3 correct judgements" },
    { name: "🧠 Logic Pro", earned: allDone, desc: "All modules done" },
    { name: "⭐ Module Master", earned: doneModules >= 3, desc: "3 modules complete" },
    { name: "🎓 Scholar", earned: state.selfAssessments.initial.completed && state.selfAssessments.final.completed, desc: "Both assessments done" },
  ];

  return (
    <div className="page-wrap">
      <h1 style={{ fontSize: "1.55rem", fontWeight: 800, marginBottom: "1.1rem" }}>My Progress</h1>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>🧑‍🎓</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>Freya</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Student Researcher</div>
            </div>
          </div>
          <div className="stat-row"><span>Scenarios completed</span><strong>{totalPracticed}</strong></div>
          <div className="stat-row"><span>Modules done</span><strong>{doneModules} / {moduleData.length}</strong></div>
          <div className="stat-row"><span>Accuracy rate</span><strong>{totalPracticed > 0 ? `${avgScore}%` : "—"}</strong></div>
          <div className="stat-row"><span>Badges earned</span><strong>{badges.filter(b => b.earned).length} / {badges.length}</strong></div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: "0.85rem" }}>Module Progress</div>
          {moduleData.map((mod, i) => {
            const done = state.completedModules.includes(i);
            const review = state.moduleNeedsReview.includes(i);
            return (
              <div key={i} className="mod-prog-row">
                <div className="mod-prog-label">{mod.title}</div>
                <div className="mod-prog-bar">
                  <div className="mod-prog-fill" style={{ width: done ? "100%" : "0%", background: review ? "var(--danger)" : "var(--primary)" }} />
                </div>
                <div className="mod-prog-pct">{done ? (review ? "Review" : "100%") : "0%"}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill improvement */}
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Skill Improvement</div>
        <div className="score-compare">
          <div className="score-box">
            <div className="score-box-label">Initial Self-Assessment</div>
            {state.pretestScore !== null
              ? <div className="score-big">{state.pretestScore}<span style={{ fontSize: "1.2rem", fontWeight: "normal", color: "var(--text-muted)" }}>/6</span></div>
              : <div style={{ fontSize: "1.4rem", textAlign: "center", padding: "1rem 0", color: "var(--text-muted)" }}>Not done</div>}
          </div>
          <div className="score-box">
            <div className="score-box-label">Final Self-Assessment</div>
            {state.posttestScore !== null
              ? <div className="score-big">{state.posttestScore}<span style={{ fontSize: "1.2rem", fontWeight: "normal", color: "var(--text-muted)" }}>/6</span></div>
              : <div style={{ fontSize: "1.4rem", textAlign: "center", padding: "1rem 0", color: "var(--text-muted)" }}>🔒 Locked</div>}
          </div>
        </div>
        {state.pretestScore !== null && state.posttestScore !== null && (
          <p style={{ textAlign: "center", marginTop: "0.75rem", fontWeight: 700, color: state.posttestScore >= state.pretestScore ? "var(--success)" : "var(--danger)" }}>
            {state.posttestScore >= state.pretestScore ? `↑ Improvement: +${state.posttestScore - state.pretestScore} points` : `↓ Change: ${state.posttestScore - state.pretestScore} points`}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>Awards &amp; Badges</div>
        <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Earn badges by completing modules, improving your skills, and practicing scenarios.</p>
        <div className="badge-row">
          {badges.map((b) => (
            <div key={b.name} className={`badge-pill ${b.earned ? "earned" : "locked"}`}>
              <div style={{ fontSize: "1.3rem" }}>{b.name.split(" ")[0]}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, marginTop: "2px" }}>{b.name.slice(3)}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "1px" }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Final assessment unlock */}
      <div className="card" style={{ border: allDone ? "1.5px solid #86efac" : "1.5px dashed var(--border)", background: allDone ? "#f0fdf4" : "#fafafa", textAlign: "center" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Final Self-Skills Assessment</h3>
        {allDone ? (
          <>
            <p style={{ fontSize: "0.87rem", color: "#374151", marginBottom: "0.85rem" }}>All modules complete! Take the final assessment to measure your progress.</p>
            {state.selfAssessments.final.completed
              ? <span style={{ padding: "4px 12px", borderRadius: "999px", background: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: "0.84rem" }}>Final Assessment Done ✓</span>
              : <button className="btn btn-primary" onClick={() => setPage("assessment-post")}>Start Final Assessment →</button>}
          </>
        ) : (
          <>
            <p style={{ fontSize: "0.87rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              🔒 Complete all {moduleData.length} learning modules to unlock.{" "}
              <strong style={{ color: "var(--primary)" }}>{doneModules}/{moduleData.length} done</strong>
            </p>
            <button className="btn btn-outline" disabled>Locked</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ASSESSMENT PAGE ────────────────────────────────────────────────────────
function AssessmentPage({
  type, state, setState, setPage,
}: {
  type: "pre" | "post"; state: AppState; setState: (s: AppState) => void; setPage: (p: Page) => void;
}) {
  const data = type === "pre" ? selfSkillsAssessmentData.initial : selfSkillsAssessmentData.final;
  const assessKey = type === "pre" ? "initial" : "final";
  const assessState = state.selfAssessments[assessKey];
  const [answers, setAnswers] = useState<(number | null)[]>(
    assessState.answers.length > 0 ? assessState.answers : new Array(data.items.length).fill(null)
  );
  const [currentIdx, setCurrentIdx] = useState(assessState.currentIndex || 0);
  const [isDone, setIsDone] = useState(assessState.completed);

  const item: AssessItem = data.items[currentIdx];
  const currentAns = answers[currentIdx];
  const isLast = currentIdx === data.items.length - 1;

  function select(i: number) {
    if (isDone) return;
    const a = [...answers]; a[currentIdx] = i; setAnswers(a);
  }

  function next() {
    if (!isLast) {
      setCurrentIdx(currentIdx + 1);
      setState({ ...state, selfAssessments: { ...state.selfAssessments, [assessKey]: { ...assessState, currentIndex: currentIdx + 1, answers } } });
    } else {
      const score = answers.filter((a, i) => a === data.items[i].correctIndex).length;
      setState({
        ...state,
        selfAssessments: { ...state.selfAssessments, [assessKey]: { currentIndex: 0, answers, completed: true } },
        ...(type === "pre" ? { pretestScore: score, completedPretest: true } : { posttestScore: score }),
      });
      setIsDone(true);
    }
  }

  if (isDone || assessState.completed) {
    const score = type === "pre" ? state.pretestScore : state.posttestScore;
    const finalAns = assessState.completed ? assessState.answers : answers;
    return (
      <div className="page-wrap">
        <div className="card assess-wrap" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{(score ?? 0) >= 5 ? "🎉" : (score ?? 0) >= 3 ? "👍" : "📚"}</div>
          <h2 style={{ fontWeight: 800, fontSize: "1.4rem" }}>Assessment Complete!</h2>
          <p style={{ color: "var(--text-muted)", margin: "0.3rem 0 0.5rem" }}>You scored</p>
          <div className="score-big">{score}<span style={{ fontSize: "1.2rem", fontWeight: "normal", color: "var(--text-muted)" }}>/6</span></div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: "0.5rem 0 1.5rem" }}>
            {(score ?? 0) >= 5 ? "Excellent — strong critical thinking skills." : (score ?? 0) >= 3 ? "Good start — modules will sharpen your skills." : "The modules will help you build these skills step by step."}
          </p>
          {data.items.map((q, i) => {
            const ans = finalAns[i];
            const correct = ans === q.correctIndex;
            return (
              <div key={i} style={{ textAlign: "left", border: `1px solid ${correct ? "#86efac" : "#fca5a5"}`, borderRadius: 8, padding: "0.7rem 0.9rem", marginBottom: "0.5rem", background: correct ? "#f0fdf4" : "#fef2f2" }}>
                <div style={{ fontSize: "0.77rem", fontWeight: 700, color: correct ? "#166534" : "#991b1b", marginBottom: "3px" }}>
                  {correct ? "✓ Correct" : "✗ Incorrect"} — {q.skill}
                </div>
                <div style={{ fontSize: "0.82rem" }}>
                  <strong>Your answer:</strong> {ans !== null ? q.options[ans] : "No answer"}
                  {!correct && <><br /><strong>Correct:</strong> {q.options[q.correctIndex]}</>}
                </div>
              </div>
            );
          })}
          <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={() => setPage(type === "pre" ? "learning" : "me")}>
            {type === "pre" ? "Start Learning →" : "View My Progress →"}
          </button>
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
          <div className="progress-bar" style={{ marginTop: "0.5rem" }}>
            <div className="progress-fill" style={{ width: `${(currentIdx / data.items.length) * 100}%` }} />
          </div>
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
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={next} disabled={currentAns === null}>
              {isLast ? "Submit Assessment" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [state, setStateRaw] = useState<AppState>(loadState);
  const [page, setPage] = useState<Page>("learning");
  const [scenarioItem, setScenarioItem] = useState<PracticeItem | null>(null);
  const [fromMisinfo, setFromMisinfo] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setState(s: AppState) {
    setStateRaw(s);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveState(s), 300);
  }

  function openScenario(item: PracticeItem, misinfo = false) {
    setScenarioItem(item);
    setFromMisinfo(misinfo);
    setPage("scenario");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar page={page} setPage={setPage} />
      {page === "learning" && <LearningPage state={state} setState={setState} setPage={setPage} setScenarioItem={(item) => openScenario(item, true)} />}
      {page === "lesson" && <LessonPage state={state} setState={setState} setPage={setPage} />}
      {page === "practice" && <PracticePage state={state} setState={setState} setPage={setPage} setScenarioItem={(item) => openScenario(item, false)} />}
      {page === "scenario" && scenarioItem && <ScenarioPage item={scenarioItem} state={state} setState={setState} setPage={setPage} fromMisinfo={fromMisinfo} />}
      {page === "me" && <MePage state={state} setPage={setPage} />}
      {page === "assessment-pre" && <AssessmentPage type="pre" state={state} setState={setState} setPage={setPage} />}
      {page === "assessment-post" && <AssessmentPage type="post" state={state} setState={setState} setPage={setPage} />}
    </div>
  );
}
