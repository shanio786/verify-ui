import { useState, useEffect, useRef } from "react";
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
    if (raw) {
      const saved = JSON.parse(raw);
      return { ...defaultState, ...saved };
    }
  } catch {}
  return { ...defaultState };
}

function saveState(s: AppState) {
  try {
    localStorage.setItem("verifyAuState_v3", JSON.stringify(s));
  } catch {}
}

// --- MODULE ICON COLOURS ---
const moduleColors = [
  { bg: "#e0eeff", icon: "🔍" },
  { bg: "#fff3e0", icon: "🎭" },
  { bg: "#fce4ec", icon: "😤" },
  { bg: "#e8f5e9", icon: "🍒" },
  { bg: "#f3e5f5", icon: "📊" },
];

// --- VERDICT CHIP ---
function VerdictChip({ v }: { v: string }) {
  const cls =
    v === "False"
      ? "verdict-false"
      : v === "True"
      ? "verdict-true"
      : v === "Misleading"
      ? "verdict-misleading"
      : "verdict-unsupported";
  return <span className={`verdict-chip ${cls}`}>{v}</span>;
}

// ===================== NAVBAR =====================
function Navbar({
  page,
  setPage,
}: {
  page: Page;
  setPage: (p: Page) => void;
}) {
  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        VERIFY<span>-AU</span>
      </div>
      <div className="nav-links">
        {(["learning", "practice", "me"] as Page[]).map((p) => (
          <button
            key={p}
            className={`nav-btn ${page === p || (page === "lesson" && p === "learning") || (page === "scenario" && p === "practice") ? "active" : ""}`}
            onClick={() => setPage(p)}
          >
            {p === "learning" ? "Learning" : p === "practice" ? "Practice" : "Me"}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ===================== LEARNING PAGE =====================
function LearningPage({
  state,
  setState,
  setPage,
  setScenarioItem,
}: {
  state: AppState;
  setState: (s: AppState) => void;
  setPage: (p: Page) => void;
  setScenarioItem: (item: PracticeItem) => void;
}) {
  const pretestDone = state.selfAssessments.initial.completed;
  const totalPracticed = state.completedPractices.length;
  const totalModules = moduleData.length;
  const doneModules = state.completedModules.length;

  function openModule(idx: number) {
    setState({ ...state, currentModule: idx, currentCard: 0, lastLearningModule: idx });
    setPage("lesson");
  }

  function openMisinfoWeek() {
    setScenarioItem(misinfoThisWeekItem);
    setPage("scenario");
  }

  return (
    <div className="page-wrap">
      {/* Hero */}
      <div className="hero-card">
        <div className="nav-logo" style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "0.25rem" }}>
          VERIFY-AU
        </div>
        <h1>Hi, Freya 👋</h1>
        <p>Equip yourself with the tools to navigate Australian election information.</p>
        {pretestDone && (
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.82rem" }}>
              {doneModules}/{totalModules} modules done
            </span>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.82rem" }}>
              {totalPracticed} scenarios practiced
            </span>
          </div>
        )}
      </div>

      {/* Resume current activity */}
      {state.lastLearningModule !== null && !state.completedModules.includes(state.lastLearningModule) && (
        <div className="current-card">
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "#1e5fab", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
              Continue where you left off
            </div>
            <div style={{ fontWeight: 600, color: "#1a2e4a" }}>
              {moduleData[state.lastLearningModule].title}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#666", marginTop: "0.15rem" }}>
              Card {state.currentCard + 1} of {moduleData[state.lastLearningModule].cards.length}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => openModule(state.lastLearningModule!)}>
            Resume
          </button>
        </div>
      )}

      {/* Pre-test nudge */}
      {!pretestDone && (
        <div className="alert-box alert-info" style={{ padding: "1rem", borderRadius: "0.75rem", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "1.1rem" }}>💡</span>
          <div>
            <strong>Start with a quick self-check</strong>
            <p style={{ margin: "0.25rem 0 0.5rem" }}>
              A short 6-question assessment helps you understand your starting skills before learning.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => setPage("assessment-pre")}>
              Start Self-Assessment
            </button>
          </div>
        </div>
      )}

      {/* Pre-test done */}
      {pretestDone && state.pretestScore !== null && (
        <div className="alert-box alert-success" style={{ marginBottom: "1.25rem" }}>
          <span>✅</span>
          <span>
            <strong>Initial Self-Assessment complete</strong> — you scored {state.pretestScore}/6. Now work through the modules below.
          </span>
        </div>
      )}

      {/* Self-skills assessment modules */}
      <div className="section-title">Self-Skills Assessment</div>
      <div className="grid-2" style={{ marginBottom: "1.25rem" }}>
        {selfSkillsAssessmentData.initial.items.map((item) => {
          const icons = ["🔍", "⚖️", "🎯", "📷", "📋", "🗳️"];
          const colors = ["#e0eeff", "#fff3e0", "#fce4ec", "#e8f5e9", "#f3e5f5", "#e0f2fe"];
          const idx = selfSkillsAssessmentData.initial.items.indexOf(item);
          const answered = state.selfAssessments.initial.answers[idx];
          const correct = answered === item.correctIndex;
          return (
            <div key={item.pairId} className="assess-module-card">
              <div className="assess-icon" style={{ background: colors[idx] }}>
                {icons[idx]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2e4a" }}>{item.skill}</div>
                <div style={{ fontSize: "0.78rem", color: "#888" }}>{item.difficulty}</div>
              </div>
              {pretestDone && (
                <span style={{
                  padding: "3px 8px", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700,
                  background: correct ? "#d1fae5" : "#fee2e2",
                  color: correct ? "#065f46" : "#991b1b"
                }}>
                  {correct ? "Correct" : "Review"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Misinfo This Week */}
      <div className="misinfo-card">
        <div>
          <div className="tag">Misinfo This Week</div>
          <h3>The "Pencil-Gate" Theory</h3>
          <p>Claims about erasable AEC pencils are trending. Practice identifying the claim and spotting the tactic.</p>
        </div>
        <button className="btn btn-outline" style={{ whiteSpace: "nowrap", flexShrink: 0 }} onClick={openMisinfoWeek}>
          Quick Analysis
        </button>
      </div>

      {/* Modules */}
      <div className="section-title">Mechanisms &amp; Tactics</div>
      <div className="grid-3">
        {moduleData.map((mod, idx) => {
          const isDone = state.completedModules.includes(idx);
          const needsReview = state.moduleNeedsReview.includes(idx);
          const col = moduleColors[idx];
          return (
            <div
              key={idx}
              className={`module-card ${isDone ? "done" : ""} ${needsReview ? "review" : ""}`}
              onClick={() => openModule(idx)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "0.5rem",
                  background: col.bg, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", flexShrink: 0
                }}>
                  {col.icon}
                </div>
                <div className="module-tag">{mod.label}</div>
                {isDone && <span className="module-status-tag status-done">Done</span>}
                {needsReview && <span className="module-status-tag status-review">Review</span>}
              </div>
              <h3>{mod.title}</h3>
              <p>{mod.desc}</p>
              {isDone && (
                <div className="progress-bar" style={{ marginTop: "0.75rem" }}>
                  <div className="progress-fill" style={{ width: "100%" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================== LESSON (FLASHCARD) PAGE =====================
function LessonPage({
  state,
  setState,
  setPage,
}: {
  state: AppState;
  setState: (s: AppState) => void;
  setPage: (p: Page) => void;
}) {
  const mod = moduleData[state.currentModule];
  const cardIdx = state.currentCard;
  const card = mod.cards[cardIdx];
  const total = mod.cards.length;
  const isLast = cardIdx === total - 1;
  const isDone = state.completedModules.includes(state.currentModule);

  function next() {
    if (cardIdx < total - 1) {
      setState({ ...state, currentCard: cardIdx + 1 });
    }
  }

  function prev() {
    if (cardIdx > 0) {
      setState({ ...state, currentCard: cardIdx - 1 });
    }
  }

  function markComplete() {
    const newDone = state.completedModules.includes(state.currentModule)
      ? state.completedModules
      : [...state.completedModules, state.currentModule];
    const allDone = newDone.length === moduleData.length;
    setState({ ...state, completedModules: newDone, posttestUnlocked: allDone });
    setPage("learning");
  }

  function markReview() {
    const newReview = state.moduleNeedsReview.includes(state.currentModule)
      ? state.moduleNeedsReview
      : [...state.moduleNeedsReview, state.currentModule];
    setState({ ...state, moduleNeedsReview: newReview });
    setPage("learning");
  }

  return (
    <div className="page-wrap">
      <button className="back-btn" onClick={() => setPage("learning")}>
        ← Back to Learning Hub
      </button>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <div className="module-tag" style={{ fontSize: "0.75rem" }}>{mod.label}</div>
        <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: "#1a2e4a", marginTop: "0.4rem" }}>
          {mod.title}
        </h2>
        <p style={{ color: "#666", fontSize: "0.88rem" }}>{mod.desc}</p>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginBottom: "1.5rem" }}>
        {mod.cards.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === cardIdx ? 24 : 8,
              height: 8,
              borderRadius: 999,
              background: i < cardIdx ? "#1e6fc0" : i === cardIdx ? "#1e6fc0" : "#dde",
              transition: "all 0.3s",
              opacity: i < cardIdx ? 0.5 : 1,
            }}
          />
        ))}
      </div>

      {/* Flashcard */}
      <div className="flashcard">
        <h2>{card.t}</h2>
        <p>{card.p}</p>
        <div className="au-box">
          <strong>🇦🇺 AU Example: </strong>{card.au}
        </div>
        <div className="reflect-box">
          <strong>Key check: </strong>{card.reflect}
        </div>
      </div>

      <p className="card-counter">
        Card {cardIdx + 1} of {total}
      </p>

      <div className="flashcard-nav">
        <button className="btn btn-outline" onClick={prev} disabled={cardIdx === 0}>
          ← Previous
        </button>
        {!isLast ? (
          <button className="btn btn-primary" onClick={next}>
            Next →
          </button>
        ) : (
          <button className="btn btn-primary" onClick={markComplete} style={{ background: "#16a34a" }}>
            Complete Module ✓
          </button>
        )}
      </div>

      {isLast && !isDone && (
        <div className="complete-box" style={{ marginTop: "1.5rem" }}>
          <strong>You've reached the end of this module!</strong>
          <p style={{ fontSize: "0.87rem", color: "#444", margin: "0.5rem 0" }}>
            Mark it as done or flag for review.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="btn btn-outline btn-sm" onClick={markReview}>
              Flag for Review
            </button>
            <button className="btn btn-primary btn-sm" onClick={markComplete} style={{ background: "#16a34a" }}>
              Mark Done &amp; Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== PRACTICE HUB =====================
function PracticePage({
  state,
  setState,
  setPage,
  setScenarioItem,
}: {
  state: AppState;
  setState: (s: AppState) => void;
  setPage: (p: Page) => void;
  setScenarioItem: (item: PracticeItem) => void;
}) {
  const [tab, setTab] = useState<"bank" | "done">("bank");
  const pretestDone = state.selfAssessments.initial.completed;

  const banked = practiceItems.filter((p) => !state.completedPractices.includes(p.id));
  const done = practiceItems.filter((p) => state.completedPractices.includes(p.id));

  function openScenario(item: PracticeItem) {
    setScenarioItem(item);
    setPage("scenario");
  }

  return (
    <div className="page-wrap">
      <h1 style={{ fontWeight: 800, fontSize: "1.6rem", color: "#1a2e4a", marginBottom: "1rem" }}>
        Practice Hub
      </h1>

      {!pretestDone && (
        <div className="alert-box alert-info" style={{ marginBottom: "1.25rem" }}>
          <span>💡</span>
          <div>
            <strong>Complete the self-assessment first</strong> to measure your improvement.{" "}
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
          <div className="empty-state">
            <div style={{ fontSize: "2.5rem" }}>🎉</div>
            <p><strong>All scenarios completed!</strong></p>
            <p>Switch to the Practiced tab to review your work.</p>
          </div>
        ) : (
          <div className="practice-grid">
            {banked.map((item) => (
              <div key={item.id} className="practice-card" onClick={() => openScenario(item)}>
                <div className="source-chip">{item.sourceLabel}</div>
                <div className="practice-label">{item.label}</div>
                <h4>{item.title}</h4>
                <p>{item.subtitle.split("|")[0]}</p>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "done" && (
        done.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: "2.5rem" }}>📚</div>
            <p><strong>No scenarios practiced yet.</strong></p>
            <p>Head to the Question Bank to get started.</p>
          </div>
        ) : (
          <div className="practice-grid">
            {done.map((item) => {
              const res = state.practiceResults[item.id];
              const bothRight = res?.q1 && res?.q2;
              return (
                <div key={item.id} className={`practice-card done-card`} onClick={() => openScenario(item)}>
                  <div className="source-chip">{item.sourceLabel}</div>
                  <div className="practice-label">{item.label}</div>
                  <h4>{item.title}</h4>
                  <div style={{ marginTop: "0.5rem" }}>
                    <span style={{
                      padding: "3px 8px", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700,
                      background: bothRight ? "#d1fae5" : "#fee2e2",
                      color: bothRight ? "#065f46" : "#991b1b"
                    }}>
                      {bothRight ? "✓ Both correct" : "Needs review"}
                    </span>
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

// ===================== SCENARIO PAGE =====================
function ScenarioPage({
  item,
  state,
  setState,
  setPage,
  fromMisinfo,
}: {
  item: PracticeItem;
  state: AppState;
  setState: (s: AppState) => void;
  setPage: (p: Page) => void;
  fromMisinfo?: boolean;
}) {
  const [step, setStep] = useState(1);
  const [q1Ans, setQ1Ans] = useState<number | null>(null);
  const [q2Ans, setQ2Ans] = useState<string | null>(null);
  const [submitted1, setSubmitted1] = useState(false);
  const [submitted2, setSubmitted2] = useState(false);

  function submitQ1() {
    if (q1Ans === null) return;
    setSubmitted1(true);
    setTimeout(() => setStep(2), 600);
  }

  function submitQ2() {
    if (!q2Ans) return;
    setSubmitted2(true);
    // Save results
    if (item.id !== "misinfo-week") {
      const q1Correct = q1Ans === item.q1Correct;
      const q2Correct = q2Ans === item.q2Correct;
      const newCompleted = state.completedPractices.includes(item.id)
        ? state.completedPractices
        : [...state.completedPractices, item.id];
      setState({
        ...state,
        completedPractices: newCompleted,
        practiceResults: {
          ...state.practiceResults,
          [item.id]: { q1: q1Correct, q2: q2Correct },
        },
      });
    }
    setStep(3);
  }

  const q1Correct = q1Ans === item.q1Correct;
  const q2Correct = q2Ans === item.q2Correct;

  return (
    <div className="page-wrap">
      <button className="back-btn" onClick={() => setPage(fromMisinfo ? "learning" : "practice")}>
        ← {fromMisinfo ? "Back to Learning" : "Back to Practice"}
      </button>

      {/* Step indicator */}
      <div className="steps-wrap" style={{ maxWidth: 400 }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.4rem", flex: s < 3 ? 1 : undefined }}>
            <div className={`step-dot ${step > s ? "done" : step === s ? "active" : "pending"}`}>
              {step > s ? "✓" : s}
            </div>
            {s < 3 && <div className="step-line" />}
          </div>
        ))}
        <span style={{ fontSize: "0.82rem", color: "#888", marginLeft: "0.5rem" }}>
          {step === 1 ? "Identify Claim" : step === 2 ? "Judge Claim" : "Result"}
        </span>
      </div>

      <div className="scenario-wrap">
        {/* Left: Post */}
        <div className="card">
          <div className="source-chip">{item.sourceLabel}</div>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#1a2e4a", margin: "0.5rem 0" }}>
            {item.title}
          </h3>
          <p style={{ fontSize: "0.82rem", color: "#888", margin: "0 0 0.75rem" }}>{item.subtitle}</p>
          <div className="post-bubble" dangerouslySetInnerHTML={{ __html: item.postText }} />
          <div className="context-box">
            <strong>Context:</strong> {item.contextText}
          </div>
        </div>

        {/* Right: Questions */}
        <div className="card">
          {step === 1 && (
            <>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.75rem" }}>
                1. Identify the Claim
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#555", marginBottom: "1rem" }}>
                {item.q1}
              </p>
              {item.q1Options.map((opt, i) => {
                let cls = "option-btn";
                if (submitted1) {
                  if (i === item.q1Correct) cls += " correct";
                  else if (i === q1Ans) cls += " incorrect";
                } else if (q1Ans === i) cls += " selected";
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => !submitted1 && setQ1Ans(i)}
                    disabled={submitted1}
                  >
                    {opt}
                  </button>
                );
              })}
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "0.5rem" }}
                onClick={submitQ1}
                disabled={q1Ans === null}
              >
                Confirm Answer
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.75rem" }}>
                2. Judge the Claim
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#555", marginBottom: "1rem" }}>
                {item.q2Question}
              </p>
              <div className="grid-2">
                {item.q2Options.map((opt) => {
                  let cls = "option-btn";
                  if (submitted2) {
                    if (opt === item.q2Correct) cls += " correct";
                    else if (opt === q2Ans) cls += " incorrect";
                  } else if (q2Ans === opt) cls += " selected";
                  return (
                    <button
                      key={opt}
                      className={cls}
                      style={{ textAlign: "center" }}
                      onClick={() => !submitted2 && setQ2Ans(opt)}
                      disabled={submitted2}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "0.75rem" }}
                onClick={submitQ2}
                disabled={!q2Ans}
              >
                Submit Judgement
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ padding: "4px 10px", borderRadius: "999px", background: q1Correct ? "#d1fae5" : "#fee2e2", color: q1Correct ? "#065f46" : "#991b1b", fontSize: "0.8rem", fontWeight: 700 }}>
                  Claim: {q1Correct ? "✓ Correct" : "✗ Incorrect"}
                </span>
                <span style={{ padding: "4px 10px", borderRadius: "999px", background: q2Correct ? "#d1fae5" : "#fee2e2", color: q2Correct ? "#065f46" : "#991b1b", fontSize: "0.8rem", fontWeight: 700 }}>
                  Verdict: {q2Correct ? "✓ Correct" : "✗ Incorrect"}
                </span>
              </div>
              <div className="verdict-box">
                <h4>Analysis Result</h4>
                <div className="verdict-line"><strong>Correct Verdict:</strong> <VerdictChip v={item.q2Verdict} /></div>
                <div className="verdict-line"><strong>Explanation:</strong> {item.explanation}</div>
                <div className="verdict-line"><strong>Tactic / Mechanism:</strong> {item.tactic}</div>
                <div className="verdict-line"><strong>Reference:</strong> {item.reference}</div>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "1rem" }}
                onClick={() => setPage(fromMisinfo ? "learning" : "practice")}
              >
                Back to {fromMisinfo ? "Learning" : "Practice Hub"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== ME PAGE =====================
function MePage({
  state,
  setPage,
}: {
  state: AppState;
  setPage: (p: Page) => void;
}) {
  const totalPracticed = state.completedPractices.length;
  const correctPractices = Object.values(state.practiceResults).filter((r) => r.q1 && r.q2).length;
  const avgScore = totalPracticed > 0 ? Math.round((correctPractices / totalPracticed) * 100) : 0;
  const doneModules = state.completedModules.length;
  const allModulesDone = doneModules === moduleData.length;

  const badges = [
    { name: "Claim Spotter", icon: "🛡️", earned: totalPracticed >= 1, desc: "Completed first scenario" },
    { name: "Fact Finder", icon: "🔍", earned: correctPractices >= 3, desc: "3 correct judgements" },
    { name: "Logic Pro", icon: "🧠", earned: allModulesDone, desc: "All modules done" },
    { name: "Module Master", icon: "⭐", earned: doneModules >= 3, desc: "3 modules complete" },
    { name: "Scholar", icon: "🎓", earned: state.selfAssessments.initial.completed && state.selfAssessments.final.completed, desc: "Both assessments done" },
  ];

  const preScore = state.pretestScore;
  const postScore = state.posttestScore;

  function scoreClass(s: number | null) {
    if (s === null) return "";
    if (s >= 5) return "score-high";
    if (s >= 3) return "score-mid";
    return "score-low";
  }

  return (
    <div className="page-wrap">
      <h1 style={{ fontWeight: 800, fontSize: "1.6rem", color: "#1a2e4a", marginBottom: "1.25rem" }}>
        My Progress
      </h1>

      <div className="grid-2">
        {/* Profile */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #1e6fc0, #1a3f70)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
              🧑‍🎓
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Freya</div>
              <div style={{ fontSize: "0.82rem", color: "#888" }}>Student Researcher</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "#666" }}>Scenarios completed</span>
              <strong>{totalPracticed}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "#666" }}>Modules done</span>
              <strong>{doneModules} / {moduleData.length}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "#666" }}>Accuracy rate</span>
              <strong>{totalPracticed > 0 ? `${avgScore}%` : "—"}</strong>
            </div>
          </div>
        </div>

        {/* Module Progress */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>Module Progress</div>
          {moduleData.map((mod, i) => {
            const done = state.completedModules.includes(i);
            const review = state.moduleNeedsReview.includes(i);
            return (
              <div key={i} className="mod-progress-row">
                <div className="mod-progress-label">{mod.title}</div>
                <div className="mod-progress-bar">
                  <div className="mod-progress-fill" style={{ width: done ? "100%" : "0%", background: review ? "#ef4444" : "#1e6fc0" }} />
                </div>
                <div className="mod-progress-pct">{done ? (review ? "Review" : "100%") : "0%"}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Improvement */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>Skill Improvement</div>
        <div className="skill-compare">
          <div className="skill-val">
            <p>INITIAL SELF-ASSESSMENT</p>
            {preScore !== null ? (
              <h2>
                {preScore}/6 <span className={`score-pill ${scoreClass(preScore)}`} style={{ fontSize: "1rem" }}>
                  {preScore >= 5 ? "Strong" : preScore >= 3 ? "Good" : "Developing"}
                </span>
              </h2>
            ) : (
              <div className="locked-val">—</div>
            )}
          </div>
          <div className="skill-divider" />
          <div className="skill-val">
            <p>FINAL SELF-ASSESSMENT</p>
            {postScore !== null ? (
              <h2>
                {postScore}/6 <span className={`score-pill ${scoreClass(postScore)}`} style={{ fontSize: "1rem" }}>
                  {postScore >= 5 ? "Strong" : postScore >= 3 ? "Good" : "Developing"}
                </span>
              </h2>
            ) : (
              <div className="locked-val">🔒 Locked</div>
            )}
          </div>
        </div>
        {preScore !== null && postScore !== null && (
          <p style={{ textAlign: "center", marginTop: "0.75rem", fontWeight: 700, color: postScore >= preScore ? "#16a34a" : "#dc2626" }}>
            {postScore >= preScore ? `↑ Improvement: +${postScore - preScore} points` : `↓ Change: ${postScore - preScore} points`}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.75rem" }}>Awards &amp; Badges</div>
        <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.75rem" }}>
          Earn badges by completing lessons, improving your skills, and maintaining strong accuracy.
        </p>
        <div className="badge-grid">
          {badges.map((b) => (
            <div key={b.name} className={`badge-item ${b.earned ? "earned" : ""}`} style={{ opacity: b.earned ? 1 : 0.4 }}>
              <div className="badge-icon">{b.icon}</div>
              <div className="badge-name">{b.name}</div>
              <div style={{ fontSize: "0.7rem", color: "#888", marginTop: "0.15rem" }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Assessment Unlock */}
      <div className="card" style={{ border: allModulesDone ? "1.5px solid #16a34a" : "1.5px dashed #ccc", background: allModulesDone ? "#f0fdf4" : "#f9f9f9", textAlign: "center" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>
          Final Self-Skills Assessment
        </h3>
        {allModulesDone ? (
          <>
            <p style={{ fontSize: "0.88rem", color: "#555", marginBottom: "0.75rem" }}>
              All modules complete! Take the final assessment to measure your progress.
            </p>
            {state.selfAssessments.final.completed ? (
              <span className="score-pill score-high">Final Assessment Done ✓</span>
            ) : (
              <button className="btn btn-primary" onClick={() => setPage("assessment-post")}>
                Start Final Assessment
              </button>
            )}
          </>
        ) : (
          <>
            <p style={{ fontSize: "0.88rem", color: "#666", marginBottom: "0.75rem" }}>
              🔒 Complete all {moduleData.length} learning modules to unlock the final assessment.
              <br />
              <span style={{ color: "#1e6fc0", fontWeight: 600 }}>{doneModules} / {moduleData.length} done</span>
            </p>
            <button className="btn btn-outline" disabled>
              Locked
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ===================== ASSESSMENT PAGE =====================
function AssessmentPage({
  type,
  state,
  setState,
  setPage,
}: {
  type: "pre" | "post";
  state: AppState;
  setState: (s: AppState) => void;
  setPage: (p: Page) => void;
}) {
  const data = type === "pre" ? selfSkillsAssessmentData.initial : selfSkillsAssessmentData.final;
  const assessKey = type === "pre" ? "initial" : "final";
  const assessState = state.selfAssessments[assessKey];
  const [answers, setAnswers] = useState<(number | null)[]>(assessState.answers.length > 0 ? assessState.answers : new Array(data.items.length).fill(null));
  const [currentIdx, setCurrentIdx] = useState(assessState.currentIndex || 0);
  const [submitted, setSubmitted] = useState(false);

  const item: AssessItem = data.items[currentIdx];
  const currentAns = answers[currentIdx];

  function selectAnswer(i: number) {
    if (submitted) return;
    const newAns = [...answers];
    newAns[currentIdx] = i;
    setAnswers(newAns);
  }

  function next() {
    if (currentIdx < data.items.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setState({
        ...state,
        selfAssessments: {
          ...state.selfAssessments,
          [assessKey]: { ...assessState, currentIndex: currentIdx + 1, answers },
        },
      });
    } else {
      // Complete
      const score = answers.filter((a, i) => a === data.items[i].correctIndex).length;
      const newState = {
        ...state,
        selfAssessments: {
          ...state.selfAssessments,
          [assessKey]: { currentIndex: 0, answers, completed: true },
        },
        ...(type === "pre" ? { pretestScore: score, completedPretest: true } : { posttestScore: score }),
      };
      setState(newState);
      setSubmitted(true);
    }
  }

  function prev() {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  }

  const isLast = currentIdx === data.items.length - 1;

  if (submitted || assessState.completed) {
    const score = type === "pre" ? state.pretestScore : state.posttestScore;
    const finalAnswers = assessState.completed ? assessState.answers : answers;
    return (
      <div className="page-wrap">
        <div className="card assess-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>
            {(score ?? 0) >= 5 ? "🎉" : (score ?? 0) >= 3 ? "👍" : "📚"}
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: "#1a2e4a" }}>
            Assessment Complete!
          </h2>
          <p style={{ color: "#666", marginBottom: "1rem" }}>You scored</p>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#1e6fc0", marginBottom: "0.5rem" }}>
            {score}/6
          </div>
          <p style={{ fontSize: "0.88rem", color: "#888", marginBottom: "1.5rem" }}>
            {(score ?? 0) >= 5 ? "Excellent! You have strong critical thinking skills." : (score ?? 0) >= 3 ? "Good start! The modules will sharpen your skills further." : "The modules will help you build these skills step by step."}
          </p>

          {/* Review answers */}
          <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
            {data.items.map((q, i) => {
              const ans = finalAnswers[i];
              const correct = ans === q.correctIndex;
              return (
                <div key={i} style={{ padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "0.5rem", background: correct ? "#f0fdf4" : "#fef2f2", border: `1px solid ${correct ? "#86efac" : "#fca5a5"}` }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: correct ? "#16a34a" : "#dc2626", marginBottom: "0.25rem" }}>
                    {correct ? "✓ Correct" : "✗ Incorrect"} — {q.skill}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#444" }}>
                    <strong>Your answer:</strong> {ans !== null ? q.options[ans] : "No answer"}<br />
                    {!correct && <span><strong>Correct:</strong> {q.options[q.correctIndex]}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <button className="btn btn-primary" onClick={() => setPage(type === "pre" ? "learning" : "me")}>
            {type === "pre" ? "Start Learning →" : "View My Progress →"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <button className="back-btn" onClick={() => setPage(type === "pre" ? "learning" : "me")}>
        ← Cancel Assessment
      </button>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", color: "#1e6fc0", letterSpacing: "0.05em", marginBottom: "0.35rem" }}>
            {data.title}
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "1.3rem", color: "#1a2e4a", marginBottom: "0.25rem" }}>
            Question {currentIdx + 1} of {data.items.length}
          </h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentIdx) / data.items.length) * 100}%` }} />
          </div>
        </div>

        <div className="card">
          <div className="source-chip">{item.sourceLabel}</div>
          <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#1e6fc0", marginBottom: "0.5rem" }}>
            Skill tested: {item.skill}
          </div>
          <div className="assess-post" dangerouslySetInnerHTML={{ __html: item.postText }} />
          <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#1a2e4a", margin: "0.75rem 0" }}>
            {item.question}
          </p>
          {item.options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${currentAns === i ? "selected" : ""}`}
              onClick={() => selectAnswer(i)}
            >
              {opt}
            </button>
          ))}

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
            <button className="btn btn-outline" onClick={prev} disabled={currentIdx === 0}>
              ← Back
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={next}
              disabled={currentAns === null}
            >
              {isLast ? "Submit Assessment" : "Next Question →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN APP =====================
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

  function handleSetPage(p: Page) {
    setPage(p);
    if (p !== "scenario") setFromMisinfo(false);
  }

  function openScenario(item: PracticeItem, misinfo = false) {
    setScenarioItem(item);
    setFromMisinfo(misinfo);
    setPage("scenario");
  }

  return (
    <div style={{ minHeight: "100vh", background: "hsl(220, 20%, 97%)" }}>
      <Navbar page={page} setPage={handleSetPage} />

      {page === "learning" && (
        <LearningPage
          state={state}
          setState={setState}
          setPage={handleSetPage}
          setScenarioItem={(item) => openScenario(item, true)}
        />
      )}
      {page === "lesson" && (
        <LessonPage state={state} setState={setState} setPage={handleSetPage} />
      )}
      {page === "practice" && (
        <PracticePage
          state={state}
          setState={setState}
          setPage={handleSetPage}
          setScenarioItem={(item) => openScenario(item, false)}
        />
      )}
      {page === "scenario" && scenarioItem && (
        <ScenarioPage
          item={scenarioItem}
          state={state}
          setState={setState}
          setPage={handleSetPage}
          fromMisinfo={fromMisinfo}
        />
      )}
      {page === "me" && (
        <MePage state={state} setPage={handleSetPage} />
      )}
      {page === "assessment-pre" && (
        <AssessmentPage type="pre" state={state} setState={setState} setPage={handleSetPage} />
      )}
      {page === "assessment-post" && (
        <AssessmentPage type="post" state={state} setState={setState} setPage={handleSetPage} />
      )}
    </div>
  );
}
