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
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultState };
}

function saveState(s: AppState) {
  try { localStorage.setItem("verifyAuState_v3", JSON.stringify(s)); } catch {}
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────
function Navbar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const isL = page === "learning" || page === "lesson" || page === "assessment-pre" || page === "assessment-post";
  const isP = page === "practice" || page === "scenario";
  const isM = page === "me";
  return (
    <nav>
      <div className="logo">VERIFY-AU</div>
      <div className="nav-links">
        <button className={isL ? "active" : ""} onClick={() => setPage("learning")}>Learning</button>
        <button className={isP ? "active" : ""} onClick={() => setPage("practice")}>Practice</button>
        <button className={isM ? "active" : ""} onClick={() => setPage("me")}>Me</button>
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

  function openModule(idx: number) {
    setState({ ...state, currentModule: idx, currentCard: 0, lastLearningModule: idx });
    setPage("lesson");
  }

  return (
    <div className="container">
      {/* Header card */}
      <div className="card">
        <h1 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.5rem" }}>Hi, Freya</h1>
        <p>Equip yourself with the tools to navigate Australian election information.</p>

        {/* Pre-test nudge */}
        {!pretestDone && (
          <div className="recommend-box" style={{ marginTop: "1rem", marginBottom: 0 }}>
            <strong>💡 Tip:</strong> You have not completed the initial self-skills assessment yet. This short card-based check helps you understand your current skills before learning.
            <button className="btn" style={{ marginLeft: "10px" }} onClick={() => setPage("assessment-pre")}>
              Start Self-Assessment
            </button>
          </div>
        )}

        {/* Pre-test done */}
        {pretestDone && state.pretestScore !== null && (
          <div className="summary-box" style={{ marginTop: "1rem", marginBottom: 0 }}>
            <strong>Assessment complete.</strong> You scored {state.pretestScore}/6 on the initial self-skills assessment.{" "}
            {doneModules}/{moduleData.length} modules done.
          </div>
        )}
      </div>

      {/* Current Activity */}
      {state.lastLearningModule !== null && !state.completedModules.includes(state.lastLearningModule) && (
        <div className="card">
          <span className="label">Current Activity</span>
          <h3 style={{ marginTop: "0.4rem", marginBottom: "0.25rem" }}>
            {moduleData[state.lastLearningModule].title}
          </h3>
          <p style={{ fontSize: "0.88rem", color: "#555", marginBottom: "0.75rem" }}>
            Card {state.currentCard + 1} of {moduleData[state.lastLearningModule].cards.length} — resume your latest unfinished module.
          </p>
          <button className="btn btn-black" onClick={() => openModule(state.lastLearningModule!)}>Resume</button>
        </div>
      )}

      {/* Self-Skills Assessment */}
      <h3 style={{ marginBottom: "0.75rem" }}>Self-Skills Assessment</h3>
      <div className="skill-grid" style={{ marginBottom: "1.5rem" }}>
        {selfSkillsAssessmentData.initial.items.map((item, idx) => {
          const ans = state.selfAssessments.initial.answers[idx];
          const correct = pretestDone && ans === item.correctIndex;
          const wrong = pretestDone && ans !== item.correctIndex;
          return (
            <div className="skill-card" key={item.pairId}
              style={{ background: correct ? "var(--completed)" : wrong ? "var(--danger)" : "#fff" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "#555", marginBottom: "4px" }}>
                {item.skill}
              </div>
              <div style={{ fontWeight: "bold" }}>{item.difficulty}</div>
              {pretestDone && (
                <div style={{ fontSize: "0.78rem", marginTop: "4px", color: correct ? "#090" : "#900" }}>
                  {correct ? "✓ Correct" : "✗ Review needed"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Misinfo This Week */}
      <div className="card" style={{ background: "var(--highlight)", border: "2px solid #000" }}>
        <span className="label label-black">Misinfo This Week</span>
        <div className="grid-2" style={{ marginTop: "10px", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0 }}>The "Pencil-Gate" Theory</h3>
            <p style={{ marginTop: "0.4rem" }}>
              <small>Claims about erasable AEC pencils are trending again. Practice identifying the claim, judging its status, and spotting the tactic.</small>
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <button className="btn btn-black" onClick={() => { setScenarioItem(misinfoThisWeekItem); setPage("scenario"); }}>
              Quick Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Modules */}
      <h3 style={{ marginBottom: "0.75rem" }}>Mechanisms &amp; Tactics</h3>
      <div className="grid-3">
        {moduleData.map((mod, idx) => {
          const isDone = state.completedModules.includes(idx);
          const needsReview = state.moduleNeedsReview.includes(idx);
          return (
            <div
              key={idx}
              className={`module-card${isDone ? " done" : ""}${needsReview ? " review" : ""}`}
              onClick={() => openModule(idx)}
            >
              <div style={{ marginBottom: "0.4rem" }}>
                <span className="label">{mod.label}</span>
                {isDone && <span className="complete-tag">Done</span>}
                {needsReview && <span className="review-tag">Review</span>}
              </div>
              <h4 style={{ fontWeight: 900, marginBottom: "0.35rem" }}>{mod.title}</h4>
              <p style={{ fontSize: "0.83rem", color: "#555" }}>{mod.desc}</p>
              {isDone && (
                <div className="progress-track" style={{ marginTop: "0.75rem" }}>
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
    const allDone = newDone.length === moduleData.length;
    setState({ ...state, completedModules: newDone, posttestUnlocked: allDone });
    setPage("learning");
  }

  function markReview() {
    const newReview = state.moduleNeedsReview.includes(state.currentModule)
      ? state.moduleNeedsReview : [...state.moduleNeedsReview, state.currentModule];
    setState({ ...state, moduleNeedsReview: newReview });
    setPage("learning");
  }

  return (
    <div className="container">
      <button className="btn" onClick={() => setPage("learning")}>← Back to Hub</button>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <span className="label">{mod.label}</span>
        <h2 style={{ fontWeight: 900, fontSize: "1.3rem", margin: "0.5rem 0 0.25rem" }}>{mod.title}</h2>
        <p style={{ fontSize: "0.88rem", color: "#555" }}>{mod.desc}</p>
      </div>

      {/* Dot progress */}
      <div className="fc-dots">
        {mod.cards.map((_, i) => (
          <div key={i} className={`fc-dot ${i === cardIdx ? "active" : i < cardIdx ? "done-dot" : ""}`} />
        ))}
      </div>

      {/* Flashcard */}
      <div className="flashcard">
        <h2>{card.t}</h2>
        <p style={{ marginBottom: "0" }}>{card.p}</p>
        <div className="soft-box"><strong>🇦🇺 AU Example:</strong> {card.au}</div>
        <div className="soft-box-grey"><strong>Key check:</strong> {card.reflect}</div>
      </div>

      <p style={{ textAlign: "center", marginTop: "0.75rem", fontSize: "0.88rem" }}>
        Card <strong>{cardIdx + 1}</strong> / <strong>{total}</strong>
      </p>

      <div className="fc-nav">
        <button className="btn" onClick={prev} disabled={cardIdx === 0}>Previous</button>
        {!isLast ? (
          <button className="btn btn-black" onClick={next}>Next</button>
        ) : (
          <button className="btn btn-black" onClick={markComplete}>Complete Module ✓</button>
        )}
      </div>

      {isLast && !isDone && (
        <div className="module-complete-box" style={{ display: "block" }}>
          <strong>You've reached the end of this module.</strong>
          <p style={{ fontSize: "0.88rem", marginTop: "0.5rem" }}>
            Mark it as done to track progress, or flag for review to revisit later.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "0.75rem" }}>
            <button className="btn" onClick={markReview}>Flag for Review</button>
            <button className="btn btn-black" onClick={markComplete}>Mark Done &amp; Continue</button>
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
    <div className="container">
      <h1 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "1rem" }}>Practice Hub</h1>

      {!pretestDone && (
        <div className="recommend-box">
          <strong>💡 Tip:</strong> You have not completed the initial self-skills assessment yet. This short card-based check helps you understand your current skills before learning.
          <button className="btn" style={{ marginLeft: "10px" }} onClick={() => setPage("assessment-pre")}>
            Start Self-Assessment
          </button>
        </div>
      )}

      <div className="tab-switch">
        <button className={`btn ${tab === "bank" ? "active" : ""}`} onClick={() => setTab("bank")}>
          Question Bank <span className="count-chip">{banked.length}</span>
        </button>
        <button className={`btn ${tab === "done" ? "active" : ""}`} onClick={() => setTab("done")}>
          Practiced <span className="count-chip">{done.length}</span>
        </button>
      </div>

      {tab === "bank" && (
        banked.length === 0 ? (
          <div className="empty-state">
            <strong>🎉 All scenarios completed!</strong>
            <p style={{ marginTop: "0.5rem" }}>Switch to the Practiced tab to review your work.</p>
          </div>
        ) : (
          <div className="practice-card-grid">
            {banked.map((item) => (
              <div key={item.id} className="pcard" onClick={() => setScenarioItem(item)}>
                <div className="practice-meta">
                  <span className="practice-chip">{item.sourceLabel}</span>
                  <span className="practice-chip">{item.label}</span>
                </div>
                <h4 style={{ fontWeight: 900, marginBottom: "0.3rem", fontSize: "0.9rem" }}>{item.title}</h4>
                <p style={{ fontSize: "0.78rem", color: "#555" }}>{item.subtitle.split("|")[0].trim()}</p>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "done" && (
        done.length === 0 ? (
          <div className="empty-state">
            <strong>📚 No scenarios practiced yet.</strong>
            <p style={{ marginTop: "0.5rem" }}>Head to the Question Bank to get started.</p>
          </div>
        ) : (
          <div className="practice-card-grid">
            {done.map((item) => {
              const res = state.practiceResults[item.id];
              const bothRight = res?.q1 && res?.q2;
              return (
                <div key={item.id} className="pcard done-card" onClick={() => setScenarioItem(item)}>
                  <div className="practice-meta">
                    <span className="practice-chip">{item.sourceLabel}</span>
                    <span className="practice-chip">{item.label}</span>
                    <span className="practice-chip" style={{
                      background: bothRight ? "var(--completed)" : "var(--danger)",
                      borderColor: bothRight ? "#090" : "#900",
                      color: bothRight ? "#090" : "#900"
                    }}>
                      {bothRight ? "✓ Both correct" : "Review"}
                    </span>
                  </div>
                  <h4 style={{ fontWeight: 900, marginBottom: "0.3rem", fontSize: "0.9rem" }}>{item.title}</h4>
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
      setState({
        ...state,
        completedPractices: newCompleted,
        practiceResults: { ...state.practiceResults, [item.id]: { q1: q1C, q2: q2C } },
      });
    }
    setStep(3);
  }

  const q1C = q1Ans === item.q1Correct;
  const q2C = q2Ans === item.q2Correct;
  const back = fromMisinfo ? "learning" : "practice";

  return (
    <div className="container">
      <button className="btn" onClick={() => setPage(back)}>
        ← Back to {fromMisinfo ? "Learning" : "Practice"}
      </button>

      {/* Step indicator */}
      <div className="step-indicator" style={{ marginTop: "0.75rem" }}>
        <span className={`step-dot${step === 1 ? " active" : step > 1 ? " done-step" : ""}`}>1. Identify Claim</span>
        <span className={`step-dot${step === 2 ? " active" : step > 2 ? " done-step" : ""}`}>2. Judge Claim</span>
        <span className={`step-dot${step === 3 ? " active" : ""}`}>3. Result</span>
      </div>

      <div className="grid-2" style={{ marginTop: "1rem" }}>
        {/* Left: Post */}
        <div className="card">
          <span className="label">{item.sourceLabel}</span>
          <h3 style={{ fontWeight: 900, margin: "0.5rem 0 0.25rem" }}>{item.title}</h3>
          <p style={{ fontSize: "0.82rem", color: "#555", marginBottom: "0.5rem" }}><small>{item.subtitle}</small></p>
          <div className="practice-post" dangerouslySetInnerHTML={{ __html: item.postText }} />
          <div className="soft-box"><strong>Context:</strong> {item.contextText}</div>
        </div>

        {/* Right: Questions */}
        <div className="card">
          {step === 1 && (
            <>
              <h3 style={{ marginBottom: "0.75rem" }}>1. Identify the Claim</h3>
              <p style={{ fontSize: "0.88rem", marginBottom: "1rem" }}>{item.q1}</p>
              {item.q1Options.map((opt, i) => {
                let cls = "btn option-btn";
                if (confirmed1) {
                  if (i === item.q1Correct) cls += " correct";
                  else if (i === q1Ans) cls += " incorrect";
                } else if (q1Ans === i) cls += " selected";
                return (
                  <button key={i} className={cls} onClick={() => !confirmed1 && setQ1Ans(i)} disabled={confirmed1}>
                    {opt}
                  </button>
                );
              })}
              <button className="btn btn-black" style={{ width: "100%", marginTop: "0.5rem" }}
                onClick={confirmQ1} disabled={q1Ans === null}>
                Confirm Answer
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 style={{ marginBottom: "0.75rem" }}>2. Judge the Claim</h3>
              <p style={{ fontSize: "0.88rem", marginBottom: "1rem" }}>{item.q2Question}</p>
              <div className="grid-2" style={{ gap: "8px" }}>
                {item.q2Options.map((opt) => {
                  let cls = "btn option-btn";
                  if (confirmed2) {
                    if (opt === item.q2Correct) cls += " correct";
                    else if (opt === q2Ans) cls += " incorrect";
                  } else if (q2Ans === opt) cls += " selected";
                  return (
                    <button key={opt} className={cls} style={{ textAlign: "center" }}
                      onClick={() => !confirmed2 && setQ2Ans(opt)} disabled={confirmed2}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <button className="btn btn-black" style={{ width: "100%", marginTop: "0.75rem" }}
                onClick={confirmQ2} disabled={!q2Ans}>
                Submit Judgement
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="practice-meta">
                <span className="practice-chip" style={{ borderColor: q1C ? "#090" : "#900", color: q1C ? "#090" : "#900" }}>
                  Claim: {q1C ? "✓ Correct" : "✗ Incorrect"}
                </span>
                <span className="practice-chip" style={{ borderColor: q2C ? "#090" : "#900", color: q2C ? "#090" : "#900" }}>
                  Verdict: {q2C ? "✓ Correct" : "✗ Incorrect"}
                </span>
              </div>
              <div className="verdict">
                <h4 style={{ marginBottom: "0.75rem" }}>Analysis Result</h4>
                <p className="practice-result-line"><strong>Correct Verdict:</strong> <span className="v-chip">{item.q2Verdict}</span></p>
                <p className="practice-result-line"><strong>Analysis:</strong> {item.explanation}</p>
                <p className="practice-result-line"><strong>Tactic / Mechanism:</strong> {item.tactic}</p>
                <p className="practice-result-line"><strong>Reference:</strong> {item.reference}</p>
              </div>
              <button className="btn btn-black" style={{ marginTop: "1rem", width: "100%" }}
                onClick={() => setPage(back)}>
                Continue to Next Content
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
    <div className="container">
      <h1 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "1rem" }}>My Progress</h1>

      <div className="grid-2">
        {/* Profile & stats */}
        <div className="card">
          <span className="label">Student Profile</span>
          <h3 style={{ marginTop: "0.5rem", fontWeight: 900 }}>Freya</h3>
          <p style={{ fontSize: "0.82rem", color: "#555", marginBottom: "1rem" }}>Student Researcher</p>
          <div>
            <div className="me-stat-row"><span>Scenarios completed</span><strong>{totalPracticed}</strong></div>
            <div className="me-stat-row"><span>Modules done</span><strong>{doneModules} / {moduleData.length}</strong></div>
            <div className="me-stat-row"><span>Accuracy rate</span><strong>{totalPracticed > 0 ? `${avgScore}%` : "—"}</strong></div>
            <div className="me-stat-row"><span>Badges earned</span><strong>{badges.filter(b => b.earned).length} / {badges.length}</strong></div>
          </div>
        </div>

        {/* Module progress */}
        <div className="card">
          <span className="label">Module Progress</span>
          <div style={{ marginTop: "0.75rem" }}>
            {moduleData.map((mod, i) => {
              const done = state.completedModules.includes(i);
              const review = state.moduleNeedsReview.includes(i);
              return (
                <div key={i} style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem", marginBottom: "3px" }}>
                    <span>{mod.title}</span>
                    <span style={{ color: done ? (review ? "#900" : "#090") : "#999" }}>
                      {done ? (review ? "Review" : "100%") : "0%"}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: done ? "100%" : "0%", background: review ? "#900" : "#000" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skill improvement */}
      <div className="card">
        <span className="label">Skill Improvement</span>
        <div className="score-compare" style={{ marginTop: "0.75rem" }}>
          <div className="score-box">
            <div className="score-box-label">Initial Self-Assessment</div>
            {state.pretestScore !== null ? (
              <div className="score-big">{state.pretestScore}<span style={{ fontSize: "1.2rem", fontWeight: "normal" }}>/6</span></div>
            ) : (
              <div className="locked-text">Not done</div>
            )}
          </div>
          <div className="score-box">
            <div className="score-box-label">Final Self-Assessment</div>
            {state.posttestScore !== null ? (
              <div className="score-big">{state.posttestScore}<span style={{ fontSize: "1.2rem", fontWeight: "normal" }}>/6</span></div>
            ) : (
              <div className="locked-text">🔒 Locked</div>
            )}
          </div>
        </div>
        {state.pretestScore !== null && state.posttestScore !== null && (
          <p style={{ textAlign: "center", marginTop: "0.75rem", fontWeight: 700 }}>
            {state.posttestScore >= state.pretestScore
              ? `↑ Improvement: +${state.posttestScore - state.pretestScore} points`
              : `↓ Change: ${state.posttestScore - state.pretestScore} points`}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="card">
        <span className="label">Badges &amp; Awards</span>
        <p style={{ fontSize: "0.85rem", color: "#555", marginTop: "0.5rem" }}>
          Earn badges by completing lessons, improving your skills, and maintaining strong accuracy.
        </p>
        <div className="badge-row">
          {badges.map((b) => (
            <div key={b.name} className={`badge-pill ${b.earned ? "earned" : "locked"}`}>
              <div>{b.name}</div>
              <div style={{ fontSize: "0.7rem", color: "#666", marginTop: "2px" }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Final assessment */}
      <div className="card" style={{ border: allDone ? "2px dashed #000" : "1px dashed #aaa", background: allDone ? "var(--completed)" : "#fafafa" }}>
        <span className="label">Final Self-Skills Assessment</span>
        {allDone ? (
          <>
            <p style={{ margin: "0.75rem 0" }}>All modules complete! Take the final assessment to measure your progress.</p>
            {state.selfAssessments.final.completed ? (
              <span className="complete-tag" style={{ fontSize: "0.9rem", padding: "4px 10px" }}>Final Assessment Done ✓</span>
            ) : (
              <button className="btn btn-black" onClick={() => setPage("assessment-post")}>Start Final Assessment</button>
            )}
          </>
        ) : (
          <>
            <p style={{ margin: "0.75rem 0", color: "#666" }}>
              🔒 Complete all {moduleData.length} learning modules to unlock. ({doneModules}/{moduleData.length} done)
            </p>
            <button className="btn" disabled>Locked</button>
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
  const [done, setDone] = useState(assessState.completed);

  const item: AssessItem = data.items[currentIdx];
  const currentAns = answers[currentIdx];
  const isLast = currentIdx === data.items.length - 1;

  function select(i: number) {
    if (done) return;
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
      setDone(true);
    }
  }

  // Show results
  if (done || assessState.completed) {
    const score = type === "pre" ? state.pretestScore : state.posttestScore;
    const finalAns = assessState.completed ? assessState.answers : answers;
    return (
      <div className="container assessment-shell">
        <div className="card" style={{ textAlign: "center" }}>
          <h2 style={{ fontWeight: 900, fontSize: "1.4rem", marginBottom: "0.5rem" }}>Assessment Complete!</h2>
          <p>You scored</p>
          <div className="score-big">{score}<span style={{ fontSize: "1.2rem", fontWeight: "normal" }}>/6</span></div>
          <p style={{ fontSize: "0.88rem", color: "#555", marginBottom: "1.5rem" }}>
            {(score ?? 0) >= 5 ? "Excellent — strong critical thinking skills." : (score ?? 0) >= 3 ? "Good start — the modules will sharpen your skills." : "The modules will help you build these skills step by step."}
          </p>

          {/* Answer review */}
          {data.items.map((q, i) => {
            const ans = finalAns[i];
            const correct = ans === q.correctIndex;
            return (
              <div key={i} style={{ textAlign: "left", border: `1px solid ${correct ? "#090" : "#900"}`, padding: "0.75rem", marginBottom: "0.5rem", background: correct ? "var(--completed)" : "var(--danger)" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: correct ? "#090" : "#900", marginBottom: "4px" }}>
                  {correct ? "✓ Correct" : "✗ Incorrect"} — {q.skill}
                </div>
                <div style={{ fontSize: "0.82rem" }}>
                  <strong>Your answer:</strong> {ans !== null ? q.options[ans] : "No answer"}<br />
                  {!correct && <span><strong>Correct:</strong> {q.options[q.correctIndex]}</span>}
                </div>
              </div>
            );
          })}

          <button className="btn btn-black" style={{ marginTop: "0.75rem" }} onClick={() => setPage(type === "pre" ? "learning" : "me")}>
            {type === "pre" ? "Start Learning →" : "View My Progress →"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container assessment-shell">
      <button className="btn" onClick={() => setPage(type === "pre" ? "learning" : "me")}>← Cancel</button>
      <div style={{ margin: "1rem 0 0.5rem" }}>
        <span className="label">{data.title}</span>
        <h2 style={{ fontWeight: 900, marginTop: "0.4rem" }}>Question {currentIdx + 1} of {data.items.length}</h2>
        <div className="progress-track" style={{ marginTop: "0.5rem" }}>
          <div className="progress-fill" style={{ width: `${(currentIdx / data.items.length) * 100}%` }} />
        </div>
      </div>

      <div className="card">
        <span className="label">{item.sourceLabel}</span>
        <p style={{ fontSize: "0.75rem", color: "#555", margin: "4px 0 6px", textTransform: "uppercase" }}>Skill: {item.skill}</p>
        <div className="assessment-post-card" dangerouslySetInnerHTML={{ __html: item.postText }} />
        <p style={{ fontWeight: 700, margin: "1rem 0 0.75rem" }}>{item.question}</p>
        {item.options.map((opt, i) => (
          <button key={i}
            className={`btn option-btn assessment-option${currentAns === i ? " selected" : ""}`}
            onClick={() => select(i)}>
            {opt}
          </button>
        ))}
        <div className="assessment-toolbar">
          <button className="btn" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>← Back</button>
          <button className="btn btn-black" onClick={next} disabled={currentAns === null}>
            {isLast ? "Submit Assessment" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [state, setStateRaw] = useState<AppState>(loadState);
  const [page, setPageRaw] = useState<Page>("learning");
  const [scenarioItem, setScenarioItemRaw] = useState<PracticeItem | null>(null);
  const [fromMisinfo, setFromMisinfo] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setState(s: AppState) {
    setStateRaw(s);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveState(s), 300);
  }

  function setPage(p: Page) { setPageRaw(p); }

  function openScenario(item: PracticeItem, misinfo = false) {
    setScenarioItemRaw(item);
    setFromMisinfo(misinfo);
    setPageRaw("scenario");
  }

  return (
    <>
      <Navbar page={page} setPage={setPage} />
      {page === "learning" && (
        <LearningPage state={state} setState={setState} setPage={setPage}
          setScenarioItem={(item) => openScenario(item, true)} />
      )}
      {page === "lesson" && (
        <LessonPage state={state} setState={setState} setPage={setPage} />
      )}
      {page === "practice" && (
        <PracticePage state={state} setState={setState} setPage={setPage}
          setScenarioItem={(item) => openScenario(item, false)} />
      )}
      {page === "scenario" && scenarioItem && (
        <ScenarioPage item={scenarioItem} state={state} setState={setState}
          setPage={setPage} fromMisinfo={fromMisinfo} />
      )}
      {page === "me" && <MePage state={state} setPage={setPage} />}
      {page === "assessment-pre" && (
        <AssessmentPage type="pre" state={state} setState={setState} setPage={setPage} />
      )}
      {page === "assessment-post" && (
        <AssessmentPage type="post" state={state} setState={setState} setPage={setPage} />
      )}
    </>
  );
}
