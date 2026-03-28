import { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

// ══════════════════════════════════════════════════════════════
// SAPM Curriculum — 8 Chapters
// Postnieks Impossibility Program
// Palette matched to c-adjusted-gdp.vercel.app
// ══════════════════════════════════════════════════════════════

const M = "'JetBrains Mono',monospace";
const S = "'Newsreader',serif";
const BG = "#0D0D0D";
const SURFACE = "#1A1A1A";
const TEXT = "#F5F0E8";
const GOLD = "#F59E0B";
const RED = "#EF4444";
const GREEN = "#22C55E";
const MUTED = "rgba(255,255,255,0.35)";
const BORDER = "rgba(255,255,255,0.1)";
const DIM = "rgba(255,255,255,0.55)";

// ─── TOOLTIP ─────────────────────────────────────────────────
const GLOSSARY = {
  "β_W": "System welfare beta — the marginal rate of system welfare destruction per dollar of private gain. β_W = −dW/dΠ.",
  "PST": "Private-Systemic Tension — the three axioms (overlapping interests, system independence, system dependence) under which the impossibility holds.",
  "T*": "Crossover time — the predicted time until a Hollow Win collapses into outright failure. T* = δ/(ηλ).",
  "W": "System welfare — an independent variable measuring the health of the shared system (market, commons, benchmark, ecosystem). W cannot be computed from bilateral payoffs.",
  "Hollow Win": "Outcome (0,1,1) — both parties gain, but the system is destroyed. Standard analysis calls this 'mutual gain.' It is not.",
  "c-adjusted GDP": "GDP minus the welfare cost of system-degrading activity across all SAPM-calibrated sectors. The welfare-adjusted measure of national output.",
  "GDSS": "Group Decision Support System — software platforms (INSPIRE, SmartSettle, Negoisst, GMCR) used to facilitate negotiations. All current GDSS are structurally W-blind.",
  "SAPM": "System Asset Pricing Model — the measurement framework that calibrates welfare betas for sectors and computes welfare-adjusted output. The CAPM of welfare economics.",
  "CAPM": "Capital Asset Pricing Model — Sharpe, Lintner, Mossin (1964). Measures how much an asset moves with the market. SAPM applies the same logic to welfare destruction.",
  "Win-Win-Win": "Outcome (1,1,1) — both parties gain AND the system is preserved. The only genuinely good outcome. The target of the Conflictoring protocol.",
  "μ": "Shadow price of welfare — the weight applied to welfare costs in the c-adjusted GDP formula. μ = 1.0 means full calibrated beta recognition.",
  "Πˢᵃ": "System-adjusted payoff — private payoff minus the welfare cost: Πˢᵃ = Π − μ* · ΔW.",
  "δ": "Private surplus — the total private gain accumulated during a Hollow Win period.",
  "η": "Feedback coupling — the fraction of system damage that feeds back to the agent through regulatory, legal, or reputational channels.",
  "λ": "Annual system welfare loss rate — the annual dollar cost of system degradation across all channels.",
};

function Tip({ term, children }) {
  const [show, setShow] = useState(false);
  const text = GLOSSARY[term] || term;
  return (
    <span style={{ position: "relative", display: "inline" }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{ borderBottom: `1px dotted ${GOLD}`, color: GOLD, cursor: "help" }}
      >
        {children || term}
      </span>
      {show && (
        <span style={{
          position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
          background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4,
          padding: "8px 12px", fontFamily: M, fontSize: 11, color: DIM,
          width: 280, zIndex: 100, lineHeight: 1.6, marginBottom: 4,
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

// ─── CHAPTER METADATA ────────────────────────────────────────
const CHAPTERS = [
  { id: 1, title: "The Lie in the Number", time: "3 min" },
  { id: 2, title: "The Missing Dimension", time: "3 min" },
  { id: 3, title: "The Eight Outcomes", time: "4 min" },
  { id: 4, title: "The Proof", time: "4 min" },
  { id: 5, title: "Measuring the Damage", time: "4 min" },
  { id: 6, title: "The GDSS Problem", time: "3 min" },
  { id: 7, title: "The Conflictoring Protocol", time: "4 min" },
  { id: 8, title: "The Domain Theorems", time: "4 min" },
];

// ─── SHARED COMPONENTS ───────────────────────────────────────
function ChapterHead({ num, title, subtitle, time }) {
  return (
    <div style={{ marginBottom: 32, paddingTop: 48 }}>
      <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 3, marginBottom: 8 }}>
        CHAPTER {num} · {time} read
      </div>
      <h2 style={{ fontFamily: S, fontSize: 28, fontWeight: 300, color: TEXT, margin: 0, lineHeight: 1.3 }}>
        {title}
      </h2>
      {subtitle && (
        <div style={{ fontFamily: S, fontSize: 15, color: DIM, marginTop: 8, fontStyle: "italic", lineHeight: 1.6 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function P({ children }) {
  return <p style={{ fontFamily: S, fontSize: 15, color: TEXT, lineHeight: 1.8, margin: "0 0 16px" }}>{children}</p>;
}

function GoldCallout({ children }) {
  return (
    <div style={{ padding: "16px 20px", background: "rgba(245,158,11,0.06)", border: `1px solid rgba(245,158,11,0.15)`, borderRadius: 4, margin: "24px 0", fontFamily: S, fontSize: 14, color: GOLD, lineHeight: 1.7, fontStyle: "italic" }}>
      {children}
    </div>
  );
}

function Card({ children, border, bg }) {
  return (
    <div style={{ padding: "16px 20px", background: bg || SURFACE, border: `1px solid ${border || BORDER}`, borderRadius: 4, marginBottom: 12 }}>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontFamily: M, fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 6 }}>{children}</div>;
}

// ═══════════════════════════════════════════════════════════════
// CHAPTER 1 — THE LIE IN THE NUMBER
// ═══════════════════════════════════════════════════════════════
function Chapter1() {
  return (
    <div id="ch1">
      <ChapterHead num={1} title="GDP says the economy grew. It is lying." subtitle="Not imprecisely. Not approximately. Structurally, constitutively, permanently lying — about the one thing that matters most." time="3 min" />

      <P>GDP counts every transaction with a positive sign. Cancer treatment counts. The lawsuit after the industrial spill counts. The security industry that grows when crime rises counts. As long as money changes hands, it goes in the ledger as output.</P>

      <P>Simon Kuznets built the GDP framework and delivered it to Congress in 1934. His warning was immediate: "The welfare of a nation can scarcely be inferred from a measurement of national income." He built the tool and told us not to use it for the one thing we'd use it for. Nobody listened.</P>

      <P>In 2009, Joseph Stiglitz, Amartya Sen, and Jean-Paul Fitoussi produced a landmark Commission report documenting GDP's failures. They proposed a dashboard of supplementary indicators — inequality, environmental quality, subjective well-being. The recommendation was intellectually correct and practically inert. A dashboard without a common unit of account cannot generate rankings or inform tradeoffs.</P>

      <P>The problem was never that we lacked the right indicators. The problem is deeper than that. And it took until 2026 to prove it.</P>

      {/* GDP LEDGER VISUAL */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "32px 0" }}>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "16px 20px" }}>
          <div style={{ fontFamily: M, fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 12 }}>WHAT GDP RECORDS — LIBOR MANIPULATION</div>
          {[
            ["Trading desk revenues", "+$2.3B"],
            ["Legal fees (both sides)", "+$480M"],
            ["Regulatory compliance costs", "+$220M"],
            ["Enforcement fines", "+$9.0B"],
            ["Remediation consulting", "+$340M"],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontFamily: M, fontSize: 12, color: DIM }}>{label}</span>
              <span style={{ fontFamily: M, fontSize: 12, color: GREEN }}>{val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", marginTop: 4 }}>
            <span style={{ fontFamily: M, fontSize: 12, fontWeight: 600, color: TEXT }}>TOTAL GDP CONTRIBUTION</span>
            <span style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: GREEN }}>+$12.3B ✓</span>
          </div>
        </div>

        <div style={{ background: SURFACE, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 4, padding: "16px 20px" }}>
          <div style={{ fontFamily: M, fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 12 }}>WHAT GDP CANNOT RECORD</div>
          {[
            ["Benchmark integrity", "DESTROYED"],
            ["$350 trillion in contracts mispriced", "UNDETECTABLE"],
            ["Trust in financial infrastructure", "UNDETECTABLE"],
            ["Future cost of system collapse", "UNDETECTABLE"],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontFamily: M, fontSize: 12, color: DIM }}>{label}</span>
              <span style={{ fontFamily: M, fontSize: 12, color: RED }}>{val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", marginTop: 4 }}>
            <span style={{ fontFamily: M, fontSize: 12, fontWeight: 600, color: TEXT }}>TOTAL <Tip term="W">W</Tip> CONTRIBUTION</span>
            <span style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: RED }}>??? ✗</span>
          </div>
        </div>
      </div>

      <GoldCallout>
        GDP recorded $12.3 billion of positive output from one of the largest financial frauds in history. Every dollar of cleanup counted the same as every dollar of production.
      </GoldCallout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHAPTER 2 — THE MISSING DIMENSION
// ═══════════════════════════════════════════════════════════════
function Chapter2() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div id="ch2">
      <ChapterHead num={2} title="Two dimensions have driven us to ruin. While telling us we were victorious." subtitle="Every framework in negotiation theory, bargaining theory, and cooperative game theory operates in two dimensions. That is not a coincidence. It is an axiom. And it is wrong." time="3 min" />

      <P>Standard analysis of any deal asks two questions:</P>
      <P>1. Did A win or lose?<br/>2. Did B win or lose?</P>

      <P>Four outcomes. 2×2. Every framework you have ever been taught — Nash bargaining, Kalai-Smorodinsky, Rubinstein alternating offers, the Shapley value, the core, the nucleolus — operates in this space. Every negotiation support system deployed today — INSPIRE, SmartSettle Infinity, Negoisst, GMCR — monitors only these two dimensions.</P>

      <P>The problem is not that these frameworks are poorly implemented. The problem is that they are monitoring the wrong space.</P>

      <P>There is a third variable: C. Did the shared system survive?</P>

      <P>Not A's system. Not B's system. The system both parties are embedded in — the market, the benchmark, the commons, the ecosystem, the regulatory infrastructure that makes their deal possible in the first place.</P>

      <P>When C = 1, the system survives. When C = 0, the system is degraded. And here is the impossibility: C cannot be computed from A's payoff and B's payoff. Not approximately. Not with better data. Not with a smarter algorithm. Structurally, constitutively, permanently — C is outside the space that A and B's payoffs define.</P>

      <P>The LIBOR traders were making money. The benchmark they depended on for their entire business model was being destroyed. No analysis of what they received that day told them anything about what was happening to the system they depended on. Standard analysis said: win-win. The correct analysis: they were burning down the building while counting the furniture.</P>

      {/* THE DIMENSION REVEAL */}
      <div style={{ margin: "32px 0" }}>
        <div style={{ fontFamily: M, fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 12 }}>
          {revealed ? "WHAT IS ACTUALLY THERE" : "WHAT STANDARD ANALYSIS SEES"}
        </div>

        {!revealed ? (
          /* 2×2 grid */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, maxWidth: 500 }}>
            {[
              { a: 0, b: 0, label: "MISERY", color: MUTED },
              { a: 0, b: 1, label: "B WINS", color: DIM },
              { a: 1, b: 0, label: "A WINS", color: DIM },
              { a: 1, b: 1, label: "MUTUAL GAIN ✓", color: GOLD },
            ].map(cell => (
              <div key={cell.label} style={{
                padding: "20px 16px", textAlign: "center",
                background: cell.a === 1 && cell.b === 1 ? "rgba(245,158,11,0.1)" : SURFACE,
                border: cell.a === 1 && cell.b === 1 ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
                borderRadius: 4,
              }}>
                <div style={{ fontFamily: M, fontSize: 11, color: cell.color, fontWeight: cell.a === 1 && cell.b === 1 ? 600 : 400 }}>{cell.label}</div>
                <div style={{ fontFamily: M, fontSize: 9, color: MUTED, marginTop: 4 }}>
                  A={cell.a} B={cell.b}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 2×2×2 grid — revealed */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, maxWidth: 500 }}>
            {[
              { a: 0, b: 0, cells: [
                { c: 1, label: "STABLE MISERY", color: MUTED },
                { c: 0, label: "MISERY", color: RED },
              ]},
              { a: 0, b: 1, cells: [
                { c: 1, label: "B SACRIFICED", color: DIM },
                { c: 0, label: "B PLUNDERS", color: RED },
              ]},
              { a: 1, b: 0, cells: [
                { c: 1, label: "A SACRIFICED", color: DIM },
                { c: 0, label: "A PLUNDERS", color: RED },
              ]},
              { a: 1, b: 1, cells: [
                { c: 1, label: "WIN, WIN, WIN ✓", color: GREEN },
                { c: 0, label: "HOLLOW WIN ✗", color: RED },
              ]},
            ].map((quad, qi) => (
              <div key={qi} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {quad.cells.map(cell => (
                  <div key={cell.label} style={{
                    padding: "14px 16px", textAlign: "center",
                    background: cell.label.includes("WIN, WIN") ? "rgba(34,197,94,0.08)"
                      : cell.label.includes("HOLLOW") ? "rgba(239,68,68,0.08)"
                      : SURFACE,
                    border: cell.label.includes("WIN, WIN") ? `2px solid ${GREEN}`
                      : cell.label.includes("HOLLOW") ? `2px solid ${RED}`
                      : `1px solid ${BORDER}`,
                    borderRadius: 4,
                  }}>
                    <div style={{ fontFamily: M, fontSize: 10, color: cell.color, fontWeight: 600 }}>{cell.label}</div>
                    <div style={{ fontFamily: M, fontSize: 9, color: MUTED, marginTop: 2 }}>
                      C={cell.c} A={quad.a} B={quad.b}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Toggle button */}
        <button onClick={() => setRevealed(!revealed)} style={{
          fontFamily: M, fontSize: 11, padding: "10px 20px", marginTop: 16,
          background: revealed ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
          border: `1px solid ${revealed ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
          color: revealed ? RED : GOLD, borderRadius: 4, cursor: "pointer",
        }}>
          {revealed ? "← BACK TO 2×2" : "REVEAL THE THIRD DIMENSION →"}
        </button>

        {revealed && (
          <div style={{ fontFamily: M, fontSize: 11, color: RED, marginTop: 16, padding: "8px 12px", background: "rgba(239,68,68,0.06)", border: `1px solid rgba(239,68,68,0.15)`, borderRadius: 4 }}>
            STANDARD ANALYSIS CANNOT DISTINGUISH WIN, WIN, WIN FROM HOLLOW WIN
          </div>
        )}
      </div>

      <GoldCallout>
        Every framework ever built for negotiation, bargaining, or cooperative game theory optimizes for the gold cell — and cannot tell whether it landed in green or crimson.
      </GoldCallout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHAPTER 3 — THE EIGHT OUTCOMES
// ═══════════════════════════════════════════════════════════════
const OUTCOMES = [
  { name: "WIN, WIN, WIN", c:1, a:1, b:1, inside: "Both parties are gaining. The system is healthy. Future deals are possible.", standard: "Cooperation. Mutual gain. Pareto optimal.", realCase: "Montreal Protocol (1987): nations phased out CFCs. Ozone layer recovered.", color: GREEN, bg: "rgba(34,197,94,0.06)" },
  { name: "MISERY", c:0, a:0, b:0, inside: "Everyone is losing. The system is collapsing.", standard: "Market failure. Lose-lose.", realCase: "Fisheries collapse: all parties lose as the commons depletes.", color: RED, bg: "rgba(239,68,68,0.04)" },
  { name: "A PLUNDERS", c:0, a:1, b:0, inside: "A is winning. B is losing. The system is being destroyed in the process.", standard: "Competitive advantage. Market power.", realCase: "Monopoly extraction destroying supplier ecosystem.", color: RED, bg: "rgba(239,68,68,0.04)" },
  { name: "B PLUNDERS", c:0, a:0, b:1, inside: "B is winning. A is losing. The system is being destroyed.", standard: "Competitive advantage.", realCase: "Predatory pricing destroying market structure.", color: RED, bg: "rgba(239,68,68,0.04)" },
  { name: "HOLLOW WIN", c:0, a:1, b:1, inside: "Both parties are gaining. Everything looks fine. The system is being destroyed.", standard: "Mutual gain. Win-win. Pareto efficient. Recommend acceptance.", realCase: "LIBOR (2005–2012). VW Dieselgate (2009–2015). Lysine cartel (1992–1995). Algorithmic collusion (happening now).", color: RED, bg: "rgba(239,68,68,0.08)", highlight: true },
  { name: "STABLE MISERY", c:1, a:0, b:0, inside: "Both parties are losing. But the system survives. This can persist indefinitely.", standard: "Stalemate. Mutual loss.", realCase: "Arms control negotiations: both sides bear costs, but war is avoided.", color: MUTED, bg: SURFACE },
  { name: "A SACRIFICED", c:1, a:0, b:1, inside: "B gains. A loses. But the system is preserved. A is bearing the cost of system preservation.", standard: "One-sided concession.", realCase: "Whistleblower: A (the insider) bears personal cost to preserve system integrity.", color: DIM, bg: SURFACE },
  { name: "B SACRIFICED", c:1, a:1, b:0, inside: "A gains. B loses. System preserved.", standard: "One-sided concession.", realCase: "Regulated utility: firm (B) accepts rate limits to preserve access to infrastructure.", color: DIM, bg: SURFACE },
];

function Chapter3() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div id="ch3">
      <ChapterHead num={3} title="There are eight ways a deal can end. Standard analysis can see four. The one it cannot see is the most common." subtitle="Each outcome has a name. Most have no name in the existing literature. They should." time="4 min" />

      <P>Click each outcome to see: what it looks like from inside, what standard analysis calls it, and a real case where it appeared.</P>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "24px 0" }}>
        {OUTCOMES.map((o, i) => (
          <div key={o.name} onClick={() => setExpanded(expanded === i ? null : i)} style={{
            padding: "14px 18px", background: o.bg, cursor: "pointer",
            border: o.highlight ? `2px solid ${RED}` : o.name === "WIN, WIN, WIN" ? `2px solid ${GREEN}` : `1px solid ${BORDER}`,
            borderRadius: 4, transition: "all 0.2s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: M, fontSize: 12, fontWeight: 600, color: o.color }}>{o.name}</div>
                <div style={{ fontFamily: M, fontSize: 10, color: MUTED, marginTop: 2 }}>({o.c},{o.a},{o.b})</div>
              </div>
              <span style={{ fontFamily: M, fontSize: 10, color: MUTED }}>{expanded === i ? "−" : "+"}</span>
            </div>
            {expanded === i && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                <Label>INSIDE VIEW</Label>
                <div style={{ fontFamily: S, fontSize: 13, color: TEXT, lineHeight: 1.6, marginBottom: 10 }}>{o.inside}</div>
                <Label>STANDARD LABEL</Label>
                <div style={{ fontFamily: M, fontSize: 11, color: o.highlight ? RED : DIM, marginBottom: 10 }}>{o.standard}</div>
                <Label>REAL CASE</Label>
                <div style={{ fontFamily: S, fontSize: 13, color: GOLD, lineHeight: 1.6 }}>{o.realCase}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <GoldCallout>
        The <Tip term="Hollow Win">Hollow Win</Tip> (0,1,1) and <Tip term="Win-Win-Win">Win, Win, Win</Tip> (1,1,1) are indistinguishable from inside the deal. Both parties are gaining in both cases. Standard analysis labels both "mutual gain." This is not a measurement error. It is a structural impossibility — C cannot be computed from what A and B received. This is what the Private Pareto Theorem proves.
      </GoldCallout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHAPTER 4 — THE PROOF
// ═══════════════════════════════════════════════════════════════
const CANON = [
  { num: 1, year: 1785, name: "Condorcet Voting Paradox", authors: "Condorcet", nobel: null },
  { num: 2, year: 1951, name: "Arrow's Impossibility", authors: "Arrow", nobel: 1972 },
  { num: 3, year: 1970, name: "Sen's Liberal Paradox", authors: "Sen", nobel: 1998 },
  { num: 4, year: 1972, name: "Hurwicz Impossibility", authors: "Hurwicz", nobel: 2007 },
  { num: 5, year: 1973, name: "Gibbard's Theorem", authors: "Gibbard", nobel: null },
  { num: 6, year: 1975, name: "Gibbard–Satterthwaite", authors: "Gibbard, Satterthwaite", nobel: null },
  { num: 7, year: 1977, name: "Green–Laffont", authors: "Green, Laffont", nobel: null },
  { num: 8, year: 1979, name: "Holmström Budget-Balance", authors: "Holmström", nobel: 2016 },
  { num: 9, year: 1982, name: "Balinski–Young", authors: "Balinski, Young", nobel: null },
  { num: 10, year: 1982, name: "Roth's Matching", authors: "Roth", nobel: 2012 },
  { num: 11, year: 1983, name: "Myerson–Satterthwaite", authors: "Myerson, Satterthwaite", nobel: 2007 },
  { num: 12, year: 1988, name: "Moulin's No-Show Paradox", authors: "Moulin", nobel: null },
  { num: 13, year: 2000, name: "Laffont–Maskin Collusion", authors: "Laffont, Maskin", nobel: 2007 },
  { num: 14, year: 2001, name: "Kaplow–Shavell", authors: "Kaplow, Shavell", nobel: null },
  { num: 15, year: 2002, name: "List–Pettit Judgment Aggregation", authors: "List, Pettit", nobel: null },
  { num: 16, year: 2026, name: "Private Pareto Theorem", authors: "Postnieks", nobel: null },
];

const CAPM_SAPM = [
  ["Full name", "Capital Asset Pricing Model", "System Asset Pricing Model"],
  ["Developed", "Sharpe, Lintner, Mossin (1964)", "Postnieks (2026)"],
  ["Measures", "Market risk", "Welfare risk"],
  ["Key variable", "β (market beta)", "β_W (welfare beta)"],
  ["Formula", "β = Cov(r,r_m)/Var(r_m)", "β_W = −dW/dΠ"],
  ["What it says", "How much this asset moves with the market", "How much social welfare this sector destroys per dollar of private gain"],
  ["High value means", "High market risk", "High welfare destruction per dollar"],
  ["Used for", "Portfolio construction, cost of capital", "Policy design, regulatory intervention, negotiation diagnosis"],
  ["Key output", "Risk-adjusted expected return", "Welfare-adjusted output (c-adjusted GDP)"],
  ["Calibration", "Historical price data", "Monte Carlo analysis of empirical externality literature"],
  ["Validated by", "Decades of asset pricing research", "VW Dieselgate: T* = 6.1 years predicted, ~6 years observed"],
];

function Chapter4() {
  const [pstExpanded, setPstExpanded] = useState(null);
  return (
    <div id="ch4">
      <ChapterHead num={4} title="This is not a theory. Not a tendency. Not an observation. It is a proof." subtitle="The 16th impossibility theorem in economics. In the tradition of Arrow, Sen, Hurwicz, Myerson. The first to prove that the bilateral payoff space itself is blind." time="4 min" />

      <P>An impossibility theorem does not say something is unlikely. It says it cannot exist — that no mechanism, however cleverly designed, can simultaneously satisfy a specified set of conditions. The proof is deductive. The conclusion is permanent.</P>

      <P>Arrow (1951) proved no voting rule can be simultaneously fair, rational, and non-dictatorial. The profession gave him the Nobel Prize in 1972. Myerson and Satterthwaite (1983) proved bilateral trade cannot be simultaneously efficient, individually rational, and budget-balanced when both parties hold private information. Nobel Prize for Myerson in 2007.</P>

      <P>The Private Pareto Theorem (Postnieks, 2026) proves: in any game where three conditions hold, system welfare <Tip term="W">W</Tip> cannot be expressed as any function of what the parties received. Not approximately. Not under certain conditions. Structurally, constitutively, permanently.</P>

      {/* PST AXIOM CARDS */}
      <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 1, margin: "32px 0 12px" }}>
        THE THREE CONDITIONS (<Tip term="PST">PST</Tip> — PRIVATE-SYSTEMIC TENSION)
      </div>

      {[
        { key: "overlap", title: "OVERLAPPING INTERESTS", plain: "Both parties benefit from cooperating. There is a deal to be made.", english: "A and B both want to make the deal.", why: "If there were no deal, there would be no Hollow Win." },
        { key: "indep", title: "SYSTEM INDEPENDENCE (The key axiom)", plain: "System welfare W is not reducible to agent payoffs. W exists independently of what A and B receive.", english: "The health of the system is a separate variable — not a function of how much A or B got.", why: "This is what makes the impossibility bite. If W could be computed from payoffs, standard analysis would suffice." },
        { key: "dep", title: "SYSTEM DEPENDENCE", plain: "Agent activity affects W. The deal changes the system.", english: "What A and B do together has consequences for the system around them.", why: "If the deal had no systemic consequences, there would be nothing to detect." },
      ].map((axiom, i) => (
        <div key={axiom.key} onClick={() => setPstExpanded(pstExpanded === i ? null : i)} style={{
          padding: "16px 20px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4,
          marginBottom: 8, cursor: "pointer",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: M, fontSize: 12, fontWeight: 600, color: GOLD }}>{axiom.title}</div>
            <span style={{ fontFamily: M, fontSize: 10, color: MUTED }}>{pstExpanded === i ? "−" : "+"}</span>
          </div>
          <div style={{ fontFamily: S, fontSize: 13, color: DIM, marginTop: 4 }}>{axiom.plain}</div>
          {pstExpanded === i && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
              <Label>PLAIN ENGLISH</Label>
              <div style={{ fontFamily: S, fontSize: 13, color: TEXT, marginBottom: 8 }}>{axiom.english}</div>
              <Label>WHY IT MATTERS</Label>
              <div style={{ fontFamily: S, fontSize: 13, color: GOLD, fontStyle: "italic" }}>{axiom.why}</div>
            </div>
          )}
        </div>
      ))}

      {/* WHAT THESE WORDS ACTUALLY MEAN */}
      <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 2, margin: "32px 0 12px" }}>WHAT THESE WORDS ACTUALLY MEAN</div>

      <div style={{ padding: "20px 24px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4, marginBottom: 12 }}>
        <div style={{ fontFamily: M, fontSize: 11, fontWeight: 600, color: GOLD, marginBottom: 8 }}>AXIOM 1 — OVERLAPPING INTERESTS</div>
        <P>Both sides want to make a deal. There is something to be gained by cooperating. Without this, there is no negotiation and no <Tip term="Hollow Win">Hollow Win</Tip>.</P>
        <div style={{ padding: "12px 16px", background: "rgba(245,158,11,0.04)", borderRadius: 4, marginTop: 8 }}>
          <Label>LIBOR EXAMPLE</Label>
          <div style={{ fontFamily: S, fontSize: 13, color: DIM, lineHeight: 1.7 }}>Two LIBOR panel banks both benefit from submitting manipulated rates. The deal exists. The cooperation is real.</div>
        </div>
      </div>

      <div style={{ padding: "20px 24px", background: SURFACE, border: `2px solid rgba(245,158,11,0.2)`, borderRadius: 4, marginBottom: 12 }}>
        <div style={{ fontFamily: M, fontSize: 11, fontWeight: 600, color: GOLD, marginBottom: 8 }}>AXIOM 2 — SYSTEM INDEPENDENCE <span style={{ color: RED, fontSize: 10, fontWeight: 400 }}>(THE KEY ONE)</span></div>
        <P>The health of the shared system is a separate fact — it cannot be calculated from what A got or what B got. You could know everything about both payoffs and still have no idea whether the system survived.</P>
        <div style={{ padding: "12px 16px", background: "rgba(245,158,11,0.04)", borderRadius: 4, marginTop: 8, marginBottom: 8 }}>
          <Label>LIBOR EXAMPLE</Label>
          <div style={{ fontFamily: S, fontSize: 13, color: DIM, lineHeight: 1.7 }}>Knowing exactly what each LIBOR trader earned tells you nothing about whether the global benchmark is intact. The benchmark's health is a different variable. It lives outside the payoff space.</div>
        </div>
        <div style={{ fontFamily: S, fontSize: 13, color: GOLD, fontStyle: "italic", lineHeight: 1.7 }}>
          This is the key axiom because without it, standard analysis would suffice. The theorem stands or falls on this one.
        </div>
      </div>

      <div style={{ padding: "20px 24px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4, marginBottom: 12 }}>
        <div style={{ fontFamily: M, fontSize: 11, fontWeight: 600, color: GOLD, marginBottom: 8 }}>AXIOM 3 — SYSTEM DEPENDENCE</div>
        <P>What A and B do together has real consequences for the system around them. Their deal is not isolated.</P>
        <div style={{ padding: "12px 16px", background: "rgba(245,158,11,0.04)", borderRadius: 4, marginTop: 8 }}>
          <Label>LIBOR EXAMPLE</Label>
          <div style={{ fontFamily: S, fontSize: 13, color: DIM, lineHeight: 1.7 }}>LIBOR rate submissions directly set the benchmark. If the deal had no effect on anything outside itself, there would be nothing to detect.</div>
        </div>
      </div>

      {/* WHEN ALL THREE HOLD / WHEN ANY ONE FAILS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0 24px" }}>
        <div style={{ padding: "20px", background: "rgba(239,68,68,0.06)", border: `1px solid rgba(239,68,68,0.15)`, borderRadius: 4 }}>
          <div style={{ fontFamily: M, fontSize: 10, color: RED, letterSpacing: 1, marginBottom: 8 }}>WHEN ALL THREE HOLD</div>
          <div style={{ fontFamily: S, fontSize: 13, color: TEXT, lineHeight: 1.8 }}>
            Every bilaterally efficient outcome degrades the system. And no analysis of what the parties received can detect it.
          </div>
        </div>
        <div style={{ padding: "20px", background: "rgba(34,197,94,0.06)", border: `1px solid rgba(34,197,94,0.15)`, borderRadius: 4 }}>
          <div style={{ fontFamily: M, fontSize: 10, color: GREEN, letterSpacing: 1, marginBottom: 8 }}>WHEN ANY ONE FAILS</div>
          <div style={{ fontFamily: S, fontSize: 13, color: TEXT, lineHeight: 1.8 }}>
            The impossibility does not apply. The framework specifies exactly 12 game types where at least one axiom fails — pure exchange economies, zero-sum games, congestion games, cooperatives. In those domains, this theorem says nothing.
          </div>
        </div>
      </div>

      {/* COMPACT CANON TIMELINE */}
      <div style={{ fontFamily: M, fontSize: 10, color: MUTED, letterSpacing: 1, margin: "32px 0 12px" }}>THE 16-THEOREM CANON</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {CANON.map(t => (
          <div key={t.num} style={{
            display: "grid", gridTemplateColumns: "28px 40px 1fr 80px",
            padding: "6px 12px", alignItems: "center",
            background: t.num === 16 ? "rgba(245,158,11,0.06)" : "transparent",
            border: t.num === 16 ? `1px solid rgba(245,158,11,0.15)` : "1px solid transparent",
            borderRadius: 2,
          }}>
            <span style={{ fontFamily: M, fontSize: 10, color: t.num === 16 ? GOLD : MUTED }}>#{t.num}</span>
            <span style={{ fontFamily: M, fontSize: 10, color: DIM }}>{t.year}</span>
            <span style={{ fontFamily: M, fontSize: 11, color: t.num === 16 ? GOLD : TEXT }}>{t.name}</span>
            <span style={{ fontFamily: M, fontSize: 9, color: t.nobel ? GOLD : "rgba(255,255,255,0.15)" }}>{t.nobel ? `★ ${t.nobel}` : ""}</span>
          </div>
        ))}
      </div>

      <GoldCallout>The 15 preceding theorems proved you cannot get what you want. This one proves you cannot see what you are losing.</GoldCallout>

      {/* CAPM VS SAPM TABLE */}
      <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 1, margin: "32px 0 12px" }}>
        <Tip term="CAPM">CAPM</Tip> VS <Tip term="SAPM">SAPM</Tip>
      </div>
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
        {CAPM_SAPM.map(([label, capm, sapm], i) => (
          <div key={label} style={{
            display: "grid", gridTemplateColumns: "140px 1fr 1fr",
            borderBottom: i < CAPM_SAPM.length - 1 ? `1px solid ${BORDER}` : "none",
          }}>
            <div style={{ padding: "10px 14px", fontFamily: M, fontSize: 10, color: MUTED, background: "rgba(255,255,255,0.02)" }}>{label}</div>
            <div style={{ padding: "10px 14px", fontFamily: M, fontSize: 11, color: DIM, borderLeft: `1px solid ${BORDER}` }}>{capm}</div>
            <div style={{ padding: "10px 14px", fontFamily: M, fontSize: 11, color: GOLD, borderLeft: `1px solid ${BORDER}` }}>{sapm}</div>
          </div>
        ))}
      </div>

      <P style={{ marginTop: 16 }}>
        <span style={{ fontFamily: S, fontSize: 14, color: DIM, lineHeight: 1.7 }}>
          <Tip term="CAPM">CAPM</Tip> told investors that some assets are riskier than they look. <Tip term="SAPM">SAPM</Tip> tells governments that some industries are more destructive than they look. Same architecture. Same logical structure. Different stakes.
        </span>
      </P>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHAPTER 5 — MEASURING THE DAMAGE
// ═══════════════════════════════════════════════════════════════
const BETA_CHART_DATA = [
  { domain: "PFAS / Forever Chemicals", beta: 35.2, tip: "The C-F bond — 485 kJ/mol — is stronger than any biological degradation mechanism. These chemicals accumulate permanently. For every $1 the industry earns, it destroys $35 of social welfare." },
  { domain: "Gene Drive Deployment", beta: 12.4, tip: "Self-propagating genetic constructs released into wild populations. No recall mechanism post-release." },
  { domain: "Opioid Ecosystem", beta: 10.2, tip: "Pharmaceutical-industrial regulatory capture. The Sackler model: revenue from addiction." },
  { domain: "Monoculture Agriculture", beta: 8.6, tip: "730:1 generational asymmetry — pathogens reproduce 730 times for every crop cycle. Genetic uniformity is a systemic vulnerability." },
  { domain: "Chemical/POPs", beta: 8.4, tip: "Persistent organic pollutants beyond PFAS. Legacy chemical persistence in ecosystems and human tissue." },
  { domain: "CRE/Urban Hollowing", beta: 8.4, tip: "Commercial real estate vacancy cascades destroying urban cores and municipal tax bases." },
  { domain: "Big Tech/Surveillance", beta: 7.4, tip: "Data extraction, attention monetization, epistemic degradation, labor displacement, alignment risk. For every $1 of platform revenue, $7.40 of welfare is destroyed." },
  { domain: "Frontier AI", beta: 7.4, tip: "Demonstrated capability cannot be unlearned. Capability advances faster than alignment because demonstrating capability is one experiment; proving alignment is a research program." },
  { domain: "Tobacco", beta: 6.5, tip: "Combustible nicotine addiction. Decades of documented harm, industry concealment, regulatory capture." },
  { domain: "Student Loans", beta: 6.3, tip: "Financialized human capital extraction. Non-dischargeable debt securitization." },
  { domain: "Gambling", beta: 6.3, tip: "Predatory extraction. Engineered addiction targeting vulnerable populations." },
  { domain: "Pharmacy Benefit Mgmt", beta: 6.3, tip: "Rebate intermediary. Opaque pricing infrastructure in US pharmaceutical distribution." },
  { domain: "Oil & Gas", beta: 6.2, tip: "Global fossil fuel extraction. Atmospheric carbon loading and stranded asset risk." },
  { domain: "Ultra-Processed Food", beta: 6.2, tip: "Obesity, type 2 diabetes, cardiovascular disease, metabolic syndrome. The epidemiological burden of industrial food formulation." },
  { domain: "Coal", beta: 6.1, tip: "Non-essential thermal coal combustion. The highest-emission energy source per unit of output." },
  { domain: "Bitcoin PoW", beta: 5.0, tip: "Proof-of-work energy consumption. Permissionless architecture prevents welfare internalization." },
  { domain: "Fisheries", beta: 4.72, tip: "External forcing impossibility. Ocean warming operates outside fisheries management's institutional reach." },
  { domain: "Deep-Sea Mining", beta: 4.7, tip: "Polymetallic nodule formation rate: 10–20mm per million years. Extraction destroys habitat that took millions of years to form." },
  { domain: "Aviation Emissions", beta: 4.6, tip: "High-altitude emissions. Contrail cirrus and non-CO₂ forcing effects." },
  { domain: "Topsoil Erosion", beta: 4.3, tip: "Topsoil forms at 1cm per 100–1,000 years. Industrial agriculture erodes it 10–100× faster. We are farming the principal." },
  { domain: "Algorithmic Pricing", beta: 4.2, tip: "Independent optimization converges to supracompetitive pricing. No intent required." },
  { domain: "Gig Economy", beta: 4.2, tip: "Worker misclassification. Externalizing employment costs to workers and social safety nets." },
  { domain: "Water Privatization", beta: 4.2, tip: "Commodifying a common-pool resource. Access inequality and infrastructure underinvestment." },
  { domain: "WMD Capability", beta: 3.0, tip: "Transferred weapons knowledge is permanently enabling. The barrier to replication drops irreversibly." },
  { domain: "Arms & Defense", beta: 2.4, tip: "Legitimate arms transfers. Dual-use technology diffusion and conflict enablement." },
  { domain: "AMR (Antibiotics)", beta: 2.1, tip: "Therapeutic lethality constitutively selects for resistance. Every dose that cures also selects for bacteria that can survive the next dose." },
  { domain: "Cement Calcination", beta: 1.35, tip: "CaCO₃ → CaO + CO₂ is conservation of mass, not a design choice. Every concrete structure releases CO₂ that cannot be avoided by switching fuels." },
  { domain: "Nuclear Fission", beta: 0.53, tip: "The only sector below 1.0. Nuclear's near-zero combustion externalities partially offset its radioactive waste obligations. The SAPM does not presuppose any sector is bad." },
];

function Chapter5() {
  return (
    <div id="ch5">
      <ChapterHead num={5} title="Every dollar of apparent output has a welfare cost. Here is what it costs." subtitle="The System Asset Pricing Model calibrates welfare betas for 32 sectors. The results are not subtle." time="4 min" />

      <P>Welfare beta (<Tip term="β_W">β_W</Tip>) measures the marginal rate of system welfare destruction per dollar of private gain. A sector with β_W = 1.0 destroys one dollar of social welfare for every dollar of revenue. A sector with β_W = 35.2 destroys thirty-five.</P>

      <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 1, margin: "24px 0 12px" }}>β_W RANKINGS</div>
      <div style={{ height: 680 }}>
        <ResponsiveContainer>
          <BarChart data={BETA_CHART_DATA} layout="vertical" margin={{ left: 160, right: 30, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis type="number" tick={{ fill: MUTED, fontFamily: M, fontSize: 10 }} />
            <YAxis type="category" dataKey="domain" tick={{ fill: DIM, fontFamily: M, fontSize: 9 }} width={150} interval={0} />
            <RTooltip
              contentStyle={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: M, fontSize: 11, color: DIM, maxWidth: 320 }}
              formatter={(val, name, props) => [props.payload.tip, `β_W = ${val}`]}
            />
            <Bar dataKey="beta" radius={[0, 3, 3, 0]}>
              {BETA_CHART_DATA.map((d, i) => (
                <Cell key={i} fill={d.beta >= 10 ? RED : d.beta >= 6 ? GOLD : d.beta >= 2 ? GOLD : GREEN} fillOpacity={d.beta >= 6 ? 0.7 : 0.5} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* C-ADJUSTED GDP PANEL */}
      <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 1, margin: "32px 0 12px" }}>
        <Tip term="c-adjusted GDP">C-ADJUSTED GDP</Tip> — THE WELFARE-ADJUSTED ACCOUNTS
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { val: "$5.0T", label: "US Hollow Win (17.5% of $28.8T GDP)", note: "That is more than the entire GDP of Japan vanishing from the US welfare accounts every year." },
          { val: "$10.8T", label: "OECD Hollow Win (16.0%)", note: "Germany's entire economy. Gone from the welfare accounts. Every year." },
          { val: "$7.0T", label: "BRICS+ Hollow Win (23.3%)", note: "Nearly a quarter of BRICS+ apparent output is welfare destruction." },
          { val: "$1.3T", label: "Middle East Petrostates (38.8%)", note: "Nearly forty cents of every dollar of apparent output." },
        ].map(d => (
          <Card key={d.val} border="rgba(245,158,11,0.15)" bg="rgba(245,158,11,0.04)">
            <div style={{ fontFamily: M, fontSize: 28, color: RED, fontWeight: 600 }}>{d.val}</div>
            <div style={{ fontFamily: M, fontSize: 11, color: TEXT, marginTop: 4 }}>{d.label}</div>
            <div style={{ fontFamily: S, fontSize: 13, color: DIM, marginTop: 8, fontStyle: "italic" }}>{d.note}</div>
          </Card>
        ))}
      </div>

      <div style={{ padding: "20px 24px", background: "rgba(239,68,68,0.06)", border: `2px solid rgba(239,68,68,0.15)`, borderRadius: 4, margin: "24px 0", textAlign: "center" }}>
        <div style={{ fontFamily: M, fontSize: 36, color: RED, fontWeight: 600 }}>~$20T</div>
        <div style={{ fontFamily: M, fontSize: 12, color: TEXT, marginTop: 4 }}>Global annual <Tip term="Hollow Win">Hollow Win</Tip></div>
        <div style={{ fontFamily: S, fontSize: 14, color: DIM, marginTop: 8, fontStyle: "italic" }}>The largest unmeasured number in economics. Larger than the US economy in 1980.</div>
      </div>

      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <a href="https://c-adjusted-gdp.vercel.app" target="_blank" rel="noopener noreferrer" style={{
          fontFamily: M, fontSize: 11, padding: "10px 24px", display: "inline-block",
          background: "rgba(245,158,11,0.1)", border: `1px solid rgba(245,158,11,0.3)`,
          color: GOLD, borderRadius: 4, textDecoration: "none",
        }}>EXPLORE THE C-ADJUSTED GDP DASHBOARD →</a>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHAPTER 6 — THE GDSS PROBLEM
// ═══════════════════════════════════════════════════════════════
function Chapter6() {
  const [reqExpanded, setReqExpanded] = useState(null);
  return (
    <div id="ch6">
      <ChapterHead num={6} title="Every negotiation platform ever built is facilitating Hollow Wins. Right now. By design." subtitle="Not because they are poorly built. Because they are monitoring the wrong space. This is fixable. Here is what fix looks like." time="3 min" />

      <P>Group Decision Support Systems — INSPIRE, SmartSettle Infinity, Negoisst, GMCR — are the software infrastructure of modern negotiation. They help parties find Pareto-efficient agreements: deals where neither party can do better without the other doing worse.</P>

      <P>By Proposition 2 of the Private Pareto Theorem, every one of these platforms is operating in a structurally <Tip term="W">W</Tip>-blind space. They accept two classes of input: party utilities and issue weights. No function of those inputs can determine system welfare. The platforms are not failing — they are doing exactly what they were designed to do. The design is the problem.</P>

      {/* GDSS COMPARISON */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "32px 0" }}>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "16px 20px" }}>
          <div style={{ fontFamily: M, fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 12 }}>CURRENT <Tip term="GDSS">GDSS</Tip> SCREEN</div>
          {[
            ["Party A payoff", "847 utils ✓", GREEN],
            ["Party B payoff", "823 utils ✓", GREEN],
            ["Pareto efficiency", "94% ✓", GREEN],
            ["Joint gain", "+$2.3M ✓", GREEN],
            ["RECOMMENDATION", "ACCEPT ✓", GREEN],
          ].map(([l, v, c]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontFamily: M, fontSize: 11, color: DIM }}>{l}</span>
              <span style={{ fontFamily: M, fontSize: 11, color: c }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ background: SURFACE, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 4, padding: "16px 20px" }}>
          <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 1, marginBottom: 12 }}>W-AWARE GDSS SCREEN</div>
          {[
            ["Party A payoff", "847 utils ✓", GREEN],
            ["Party B payoff", "823 utils ✓", GREEN],
            ["System welfare (W)", "-$4.7M ⚠", GOLD],
            ["β_W (this domain)", "6.2 ⚠", GOLD],
            ["System-adjusted payoff", "-$2.4M ✗", RED],
            ["T* (crossover time)", "4.2 years ⚠", GOLD],
            ["CLASSIFICATION", "HOLLOW WIN (0,1,1) ✗", RED],
            ["RECOMMENDATION", "DO NOT ACCEPT ✗", RED],
          ].map(([l, v, c]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontFamily: M, fontSize: 11, color: DIM }}>{l}</span>
              <span style={{ fontFamily: M, fontSize: 11, color: c }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* THREE REQUIREMENTS */}
      <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 1, margin: "24px 0 12px" }}>THE THREE REQUIREMENTS</div>

      {[
        { id: "R1", title: "INDEPENDENT W-MONITORING CHANNEL", body: "The platform must accept a W-signal from a source external to the negotiating parties. Not derived from their payoffs — independent of them. For financial benchmarks: independent rate submissions. For environmental commons: third-party environmental monitoring. For labor markets: independent workforce welfare metrics." },
        { id: "R2", title: "DECOMPOSED PAYOFF DISPLAY", body: "Show both parties not just their payoff, but their system-adjusted payoff: Πˢᵃ = Π − μ* · ΔW. A deal that looks like +$2.3M of joint gain may be -$2.4M of welfare-adjusted joint gain. Parties need to see both numbers." },
        { id: "R3", title: "TRAJECTORY DETECTION", body: "Show T*: the predicted time until the Hollow Win collapses into outright failure. A deal with T* = 4.2 years is a ticking clock. Parties accepting it are accepting a 4-year window before the system fails. They should know." },
      ].map((r, i) => (
        <div key={r.id} onClick={() => setReqExpanded(reqExpanded === i ? null : i)} style={{
          padding: "16px 20px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4,
          marginBottom: 8, cursor: "pointer",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: M, fontSize: 12, color: GOLD }}><span style={{ color: MUTED }}>{r.id} —</span> {r.title}</div>
            <span style={{ fontFamily: M, fontSize: 10, color: MUTED }}>{reqExpanded === i ? "−" : "+"}</span>
          </div>
          {reqExpanded === i && (
            <div style={{ fontFamily: S, fontSize: 13, color: DIM, marginTop: 12, lineHeight: 1.7 }}>{r.body}</div>
          )}
        </div>
      ))}

      <GoldCallout>
        The minimum viable product — accept a <Tip term="W">W</Tip>-signal, compute system-adjusted payoff, display the result, flag agreements where the system-adjusted payoff is negative — can be deployed in weeks. This is a software update, not a legislative cycle.
      </GoldCallout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHAPTER 7 — THE CONFLICTORING PROTOCOL
// ═══════════════════════════════════════════════════════════════
const CSTEPS = [
  { step: 1, title: "NAME THE PARTIES AND THE SYSTEM", phase: "diagnostic",
    desc: "Identify A, B, and the system C they are embedded in. State the system boundary explicitly. Classification depends on it.",
    libor: "A = Panel banks. B = Counterparty institutions. System = Global financial benchmark ($350 trillion in contracts referencing LIBOR).",
    why: "Under a narrow boundary (individual trading desks), the outcome looks like bilateral profit. Under the correct boundary (global benchmark integrity), it is Hollow Win." },
  { step: 2, title: "CLASSIFY THE CURRENT OUTCOME", phase: "diagnostic",
    desc: "Apply the taxonomy. Assign (c, a, b). Is this Hollow Win (0,1,1) or Win-Win-Win (1,1,1)?",
    libor: "c=0 (benchmark integrity destroyed), a=1 (panel banks gained), b=1 (counterparty banks gained on positions). Classification: (0,1,1) Hollow Win. Standard vocabulary called it 'cooperation.'" },
  { step: 3, title: "VERIFY THE THREE PST AXIOMS", phase: "diagnostic",
    desc: "Do all three conditions hold? If any fails, the impossibility does not apply.",
    libor: "Overlapping Interests ✓ (both parties benefited from rate manipulation). System Independence ✓ (benchmark integrity not reducible to bank payoffs). System Dependence ✓ (rate submissions directly determined W). All three hold. Impossibility applies." },
  { step: 4, title: "COMPUTE SYSTEM BETA AND WELFARE COST", phase: "diagnostic",
    desc: "β_W = −dW/dΠ. Estimate the welfare destruction per dollar of private gain.",
    libor: "β_W ≈ 5.5. Total welfare cost: $9B+ in documented penalties, plus unquantified damage to benchmark integrity, counterparty trust, and regulatory confidence. Seven years undetected." },
  { step: 5, title: "ESTIMATE CROSSOVER TIME", phase: "diagnostic",
    desc: "T* = δ/(ηλ). When does the Hollow Win collapse into outright failure?",
    libor: "T* ≤ 0 by the time regulators acted — the system had already failed. The Hollow Win had run past its crossover point before detection." },
  { step: 6, title: "MAP THE RESPONSE LADDER", phase: "resolution",
    desc: "Four tiers. Each actor type has a tier. Each tier has a minimum sufficient intervention.",
    libor: "Tier 1 = CFTC whistleblower (§748). Tier 3 = Regulatory restructuring and $9B+ in penalties. Tier 4 = FSB benchmark reform — the SOFR transition." },
  { step: 7, title: "SELECT THE MINIMUM SUFFICIENT INTERVENTION", phase: "resolution",
    desc: "The lowest tier that breaks PST. Overkill wastes resources and creates resistance.",
    libor: "Minimum sufficient = Tier 4 (sovereign coordination). The SOFR transition required international coordination across all major financial jurisdictions. No lower tier was sufficient." },
  { step: 8, title: "VERIFY ESCAPE", phase: "resolution",
    desc: "Confirm C flips from 0 to 1. Win-Win-Win is the target.",
    libor: "LIBOR → SOFR: Benchmark integrity restored. Transaction-based rate replacing panel bank estimates. Classification: Win-Win-Win (1,1,1). Escape confirmed." },
];

const WHISTLE = [
  { prog: "SEC WHISTLEBLOWER", statute: "Dodd-Frank §21F", covers: "Securities fraud, benchmark manipulation, accounting fraud", reward: "10–30% of sanctions exceeding $1 million", anon: "Available through attorney", protection: "Federal law", cumulative: "$6B+ awarded to whistleblowers to date", best: "Financial sector Hollow Wins (LIBOR-type cases)" },
  { prog: "CFTC WHISTLEBLOWER", statute: "§748", covers: "Commodities, derivatives, futures fraud", reward: "10–30% of sanctions exceeding $1 million", anon: "Same structure as SEC", protection: "Federal law", cumulative: "$380M+ awarded", best: "Derivatives manipulation, algorithmic collusion in commodity markets" },
  { prog: "DOJ FALSE CLAIMS ACT", statute: "Qui Tam", covers: "Fraud against the federal government", reward: "15–30% of recovered funds", anon: "Filed under seal", protection: "Federal law", cumulative: "$75B+ recovered (total FCA)", best: "Defense contractor fraud, healthcare billing fraud, government procurement" },
  { prog: "IRS WHISTLEBLOWER", statute: "§7623", covers: "Tax fraud exceeding $2M", reward: "15–30% of collected proceeds", anon: "Confidential", protection: "Federal law", cumulative: "$6.5B+ collected", best: "Corporate tax evasion as part of a Hollow Win structure" },
];

function Chapter7() {
  const [cStep, setCStep] = useState(0);
  return (
    <div id="ch7">
      <ChapterHead num={7} title="You are inside a Hollow Win. Here is what you do." subtitle="Eight steps. Four levels of actors. A solution for each level. And for the person on the inside: a financial incentive that most people do not know exists." time="4 min" />

      <P>The Conflictoring protocol is an 8-step procedure for diagnosing and escaping <Tip term="Hollow Win">Hollow Win</Tip> situations. It uses an intent-free detection standard — it does not require proof that anyone intended to harm the system. If the outcome is classified as Hollow Win (0,1,1), the protocol applies.</P>

      {/* STEPPER */}
      <div style={{ display: "flex", gap: 2, margin: "24px 0 16px" }}>
        {CSTEPS.map((s, i) => (
          <div key={i} onClick={() => setCStep(i)} style={{
            flex: 1, height: 4, borderRadius: 2, cursor: "pointer",
            background: i <= cStep ? (s.phase === "diagnostic" ? GOLD : GREEN) : BORDER,
          }} />
        ))}
      </div>
      <div style={{ fontFamily: M, fontSize: 10, letterSpacing: 2, color: cStep < 5 ? GOLD : GREEN, marginBottom: 16 }}>
        {cStep < 5 ? "DIAGNOSTIC PHASE" : "RESOLUTION PHASE"} — STEP {cStep + 1} OF 8
      </div>

      {(() => {
        const s = CSTEPS[cStep];
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <Label>PROTOCOL — STEP {s.step}</Label>
              <div style={{ fontFamily: M, fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontFamily: S, fontSize: 14, color: DIM, lineHeight: 1.7 }}>{s.desc}</div>
            </Card>
            <Card border="rgba(245,158,11,0.15)" bg="rgba(245,158,11,0.04)">
              <Label>LIBOR — WORKED EXAMPLE</Label>
              <div style={{ fontFamily: S, fontSize: 13, color: DIM, lineHeight: 1.7, marginBottom: s.why ? 8 : 0 }}>{s.libor}</div>
              {s.why && <div style={{ fontFamily: S, fontSize: 12, color: GOLD, fontStyle: "italic", lineHeight: 1.6 }}>{s.why}</div>}
            </Card>
          </div>
        );
      })()}

      <div style={{ display: "flex", justifyContent: "space-between", margin: "16px 0 32px" }}>
        <button onClick={() => setCStep(Math.max(0, cStep - 1))} disabled={cStep === 0} style={{ fontFamily: M, fontSize: 11, padding: "8px 20px", background: cStep === 0 ? "transparent" : "rgba(245,158,11,0.1)", border: `1px solid ${BORDER}`, color: cStep === 0 ? MUTED : GOLD, borderRadius: 4, cursor: cStep === 0 ? "default" : "pointer" }}>← BACK</button>
        <button onClick={() => setCStep(Math.min(7, cStep + 1))} disabled={cStep === 7} style={{ fontFamily: M, fontSize: 11, padding: "8px 20px", background: cStep === 7 ? "transparent" : "rgba(245,158,11,0.1)", border: `1px solid ${BORDER}`, color: cStep === 7 ? MUTED : GOLD, borderRadius: 4, cursor: cStep === 7 ? "default" : "pointer" }}>NEXT →</button>
      </div>

      {/* FOUR LEVELS OF ACTORS */}
      <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 1, margin: "32px 0 12px" }}>THE FOUR LEVELS OF ACTORS</div>

      {/* LEVEL 1 — THE INSIDER */}
      <Card border="rgba(245,158,11,0.2)" bg="rgba(245,158,11,0.04)">
        <div style={{ fontFamily: M, fontSize: 12, color: GOLD, fontWeight: 600, marginBottom: 8 }}>LEVEL 1 — THE INSIDER</div>
        <div style={{ fontFamily: S, fontSize: 13, color: DIM, lineHeight: 1.7, marginBottom: 12 }}>
          You work at a company, a bank, a firm, a government agency. You have seen the <Tip term="Hollow Win">Hollow Win</Tip> from the inside. You know what is happening.
        </div>
        <div style={{ fontFamily: M, fontSize: 11, color: TEXT, lineHeight: 2 }}>
          1. Document everything. Time-stamped. Contemporaneous.<br/>
          2. Consult a whistleblower attorney before doing anything else.<br/>
          3. File a claim under the applicable federal program.
        </div>
      </Card>

      {/* THE WHISTLEBLOWER MATH */}
      <div style={{ padding: "24px", background: "rgba(239,68,68,0.06)", border: `2px solid rgba(239,68,68,0.2)`, borderRadius: 4, margin: "24px 0", textAlign: "center" }}>
        <div style={{ fontFamily: S, fontSize: 20, color: RED, lineHeight: 1.5, fontWeight: 600, marginBottom: 16 }}>
          THE LIBOR TRADERS LEFT BETWEEN $900 MILLION AND $2.7 BILLION ON THE TABLE.
        </div>
        <div style={{ fontFamily: S, fontSize: 14, color: DIM, lineHeight: 1.7, marginBottom: 16 }}>
          The LIBOR manipulation generated approximately $9 billion in regulatory sanctions. Under the Dodd-Frank whistleblower program (SEC §21F), a qualifying whistleblower receives 10–30% of sanctions over $1 million.
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
          <div>
            <div style={{ fontFamily: M, fontSize: 36, color: GOLD, fontWeight: 600 }}>$900M</div>
            <div style={{ fontFamily: M, fontSize: 11, color: MUTED }}>10% of $9B</div>
          </div>
          <div style={{ fontFamily: M, fontSize: 36, color: MUTED, alignSelf: "center" }}>to</div>
          <div>
            <div style={{ fontFamily: M, fontSize: 36, color: GOLD, fontWeight: 600 }}>$2.7B</div>
            <div style={{ fontFamily: M, fontSize: 11, color: MUTED }}>30% of $9B</div>
          </div>
        </div>
        <div style={{ fontFamily: S, fontSize: 13, color: DIM, lineHeight: 1.7, marginTop: 16 }}>
          One person. One claim. Filed before the investigation concluded.
        </div>
        <div style={{ fontFamily: S, fontSize: 13, color: RED, lineHeight: 1.7, marginTop: 8 }}>
          The traders who manipulated LIBOR went to prison. The traders who reported it — had any of them chosen to — would have received between nine hundred million and two point seven billion dollars from the United States government, legal immunity, and protected employment status. They did not know this option existed.
        </div>
      </div>

      {/* OBJECTION CARD */}
      <div style={{ padding: "24px", background: "rgba(239,68,68,0.04)", border: `2px solid rgba(239,68,68,0.2)`, borderRadius: 4, margin: "24px 0" }}>
        <div style={{ fontFamily: M, fontSize: 13, fontWeight: 700, color: RED, letterSpacing: 1, marginBottom: 12 }}>
          'I AM ALREADY INSIDE THE FRAUD. IT IS TOO LATE.'
        </div>
        <div style={{ fontFamily: S, fontSize: 14, color: DIM, lineHeight: 1.8 }}>
          This is the most common reason people inside a Hollow Win do not come forward. It is factually wrong. The most important whistleblower case in US history was brought by a man who was not a bystander. He was a participant.
        </div>
      </div>

      {/* THE BIRKENFELD CASE */}
      <div style={{ padding: "28px", background: SURFACE, border: `2px solid rgba(245,158,11,0.3)`, borderRadius: 4, margin: "24px 0" }}>
        <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 2, marginBottom: 16 }}>THE BIRKENFELD CASE</div>

        <div style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 4 }}>Bradley Birkenfeld</div>
        <div style={{ fontFamily: S, fontSize: 14, color: DIM, lineHeight: 1.8, marginBottom: 20 }}>
          UBS private banker. He personally helped wealthy American clients hide assets in secret Swiss accounts. He was not an observer. He was inside the fraud.
        </div>

        <Label>WHAT HE DID</Label>
        <div style={{ fontFamily: S, fontSize: 14, color: DIM, lineHeight: 1.8, marginBottom: 20 }}>
          In 2007, after UBS failed to address the illegal activity internally, he brought comprehensive documentation to the DOJ, IRS, and Senate Permanent Subcommittee on Investigations.
        </div>

        <Label>WHAT HAPPENED TO HIM</Label>
        <div style={{ fontFamily: M, fontSize: 12, color: DIM, lineHeight: 2.2, marginBottom: 20 }}>
          Pleaded guilty to conspiracy to defraud the United States<br/>
          Sentenced to 40 months in prison<br/>
          Served <span style={{ color: GOLD, fontWeight: 600 }}>31 months</span> at Schuylkill County Federal Correctional Institution<br/>
          Fine: $30,000
        </div>

        <Label>WHAT HAPPENED FIVE WEEKS AFTER HIS RELEASE</Label>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "16px 0 24px", padding: "20px", background: "rgba(245,158,11,0.06)", borderRadius: 4 }}>
          <div style={{ fontFamily: M, fontSize: 11, color: MUTED, marginBottom: 8 }}>IRS §7623 WHISTLEBLOWER AWARD</div>
          <div style={{ fontFamily: M, fontSize: 42, color: GOLD, fontWeight: 700 }}>$104,000,000</div>
          <div style={{ height: 1, background: BORDER, width: "60%", margin: "16px 0" }} />
          <div style={{ fontFamily: M, fontSize: 48, color: GOLD, fontWeight: 700 }}>$115,556</div>
          <div style={{ fontFamily: M, fontSize: 12, color: MUTED, marginTop: 4 }}>FOR EVERY SINGLE DAY HE SPENT IN PRISON</div>
        </div>

        <Label>WHAT HIS DISCLOSURES TRIGGERED</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "12px 0 20px" }}>
          <div style={{ textAlign: "center", padding: "12px", background: "rgba(245,158,11,0.04)", borderRadius: 4 }}>
            <div style={{ fontFamily: M, fontSize: 24, color: GOLD, fontWeight: 600 }}>$780M</div>
            <div style={{ fontFamily: M, fontSize: 10, color: MUTED }}>UBS FINE</div>
          </div>
          <div style={{ textAlign: "center", padding: "12px", background: "rgba(245,158,11,0.04)", borderRadius: 4 }}>
            <div style={{ fontFamily: M, fontSize: 24, color: GOLD, fontWeight: 600 }}>120+</div>
            <div style={{ fontFamily: M, fontSize: 10, color: MUTED }}>CRIMINAL INDICTMENTS</div>
          </div>
          <div style={{ textAlign: "center", padding: "12px", background: "rgba(245,158,11,0.04)", borderRadius: 4 }}>
            <div style={{ fontFamily: M, fontSize: 24, color: GOLD, fontWeight: 600 }}>56,000+</div>
            <div style={{ fontFamily: M, fontSize: 10, color: MUTED }}>DELINQUENT TAXPAYERS CAME FORWARD</div>
          </div>
          <div style={{ textAlign: "center", padding: "12px", background: "rgba(245,158,11,0.04)", borderRadius: 4 }}>
            <div style={{ fontFamily: M, fontSize: 24, color: GOLD, fontWeight: 600 }}>$11B+</div>
            <div style={{ fontFamily: M, fontSize: 10, color: MUTED }}>US TAX COLLECTIONS FROM HIS DISCLOSURE</div>
          </div>
        </div>

        <Label>THE LEGAL PRECEDENT</Label>
        <div style={{ fontFamily: S, fontSize: 14, color: DIM, lineHeight: 1.8, marginBottom: 20 }}>
          Participants in a fraud — not just observers — are eligible for IRS whistleblower awards. The IRS did not reduce his award for his participation in the wrongdoing. The government stated explicitly: they needed a knowledgeable insider. Only insiders have the information that matters.
        </div>

        <div style={{ padding: "20px", background: "rgba(239,68,68,0.04)", border: `1px solid rgba(239,68,68,0.15)`, borderRadius: 4 }}>
          <Label>THE INJUSTICE THAT MAKES IT REAL</Label>
          <div style={{ fontFamily: S, fontSize: 15, color: TEXT, lineHeight: 1.9, marginTop: 8 }}>
            Of all UBS executives implicated or indicted — including Birkenfeld's direct superiors — he was the only one who served prison time. The people above him paid fines and walked. He blew the whistle and went to prison. Then received $104 million.
          </div>
          <div style={{ fontFamily: S, fontSize: 15, color: GOLD, lineHeight: 1.9, marginTop: 12, fontWeight: 600 }}>
            The system is imperfect. The math still works.
          </div>
        </div>
      </div>

      {/* IMPORTANT DISTINCTIONS */}
      <div style={{ padding: "16px 20px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4, margin: "0 0 24px" }}>
        <div style={{ fontFamily: M, fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 8 }}>IMPORTANT DISTINCTION</div>
        <div style={{ fontFamily: S, fontSize: 13, color: DIM, lineHeight: 1.8 }}>
          Birkenfeld used the IRS §7623 program (tax fraud). LIBOR traders would use SEC §21F or CFTC §748 (financial benchmark manipulation). Different programs. Same architecture: 10–30% of sanctions, participants eligible, no maximum award. The Birkenfeld case is the proof of concept.
        </div>
      </div>

      {/* FOUR FEDERAL PROGRAMS */}
      <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 1, margin: "24px 0 12px" }}>THE FOUR FEDERAL PROGRAMS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {WHISTLE.map(w => (
          <div key={w.prog} style={{ padding: "16px 20px", background: SURFACE, border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 4 }}>
            <div style={{ fontFamily: M, fontSize: 11, fontWeight: 600, color: GOLD, marginBottom: 2 }}>{w.prog}</div>
            <div style={{ fontFamily: M, fontSize: 10, color: MUTED, marginBottom: 8 }}>{w.statute}</div>
            <div style={{ fontFamily: M, fontSize: 10, color: DIM, lineHeight: 1.8 }}>
              Covers: {w.covers}<br/>
              Reward: {w.reward}<br/>
              Anonymity: {w.anon}<br/>
              Track record: {w.cumulative}<br/>
              Best for: {w.best}
            </div>
          </div>
        ))}
      </div>

      <P>Total across all programs: $95B+ in cumulative enforcement recoveries.</P>

      <GoldCallout>
        The institutional infrastructure for Tier 1 response already exists. It has generated $95 billion. Most people inside a <Tip term="Hollow Win">Hollow Win</Tip> do not know it is there.
      </GoldCallout>

      {/* LEVELS 2–4 */}
      <Card>
        <div style={{ fontFamily: M, fontSize: 12, color: GOLD, fontWeight: 600, marginBottom: 8 }}>LEVEL 2 — THE EXECUTIVE OR BOARD MEMBER</div>
        <div style={{ fontFamily: S, fontSize: 13, color: DIM, lineHeight: 1.7 }}>
          You have authority over the game design. Restructure compensation to align with system welfare. Commission an independent <Tip term="W">W</Tip>-audit of major revenue streams. Implement the three <Tip term="GDSS">GDSS</Tip> requirements (R1, R2, R3). The question: "Which of our revenue streams has the highest <Tip term="β_W">β_W</Tip>? What are we building on?"
        </div>
      </Card>
      <Card>
        <div style={{ fontFamily: M, fontSize: 12, color: GOLD, fontWeight: 600, marginBottom: 8 }}>LEVEL 3 — THE REGULATOR OR INDUSTRY BODY</div>
        <div style={{ fontFamily: S, fontSize: 13, color: DIM, lineHeight: 1.7 }}>
          Mandate W-monitoring as a condition of market participation. Require decomposed payoff reporting. Design structural separation to break <Tip term="PST">PST</Tip>. The question: "Which sectors in our jurisdiction have β_W {">"} 2.0? What is our <Tip term="T*">T*</Tip> for each?"
        </div>
      </Card>
      <Card>
        <div style={{ fontFamily: M, fontSize: 12, color: GOLD, fontWeight: 600, marginBottom: 8 }}>LEVEL 4 — THE SOVEREIGN OR INTERNATIONAL BODY</div>
        <div style={{ fontFamily: S, fontSize: 13, color: DIM, lineHeight: 1.7 }}>
          Treaty-based commons governance (the Montreal Protocol model). International benchmark reform (FSB post-LIBOR). Mandate <Tip term="c-adjusted GDP">c-adjusted GDP</Tip> as a supplementary national account. The question: "Which of our PST domains have T* under 10 years?"
        </div>
      </Card>

      <GoldCallout>
        The Conflictoring protocol does not require intent. If the outcome is classified as <Tip term="Hollow Win">Hollow Win</Tip> (0,1,1), the protocol applies — regardless of whether anyone in the game intended to harm the system. Q-learning algorithms reach Hollow Win outcomes without communication, instruction, or awareness. The Folk Theorem guarantees that capable optimizers discover collusion as a stable equilibrium. The protocol catches it anyway.
      </GoldCallout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHAPTER 8 — THE DOMAIN THEOREMS
// ═══════════════════════════════════════════════════════════════
const DOMAINS = [
  { group: "THERMODYNAMIC PERMANENCE", domains: [
    { name: "PFAS / MOLECULAR PERSISTENCE FLOOR", plain: "PFAS are 'forever chemicals' — per- and polyfluoroalkyl substances used in nonstick coatings, firefighting foam, food packaging, and thousands of industrial applications. The carbon-fluorine bond that makes them useful also makes them indestructible by any biological process. They accumulate in soil, water, and human tissue. There is no natural mechanism to break them down.", theorem: "The C-F bond energy (485 kJ/mol) exceeds the energy available to any biological degradation mechanism. No market mechanism can reduce PFAS contamination below a structural floor while PFAS production continues. The floor is set by thermodynamics, not regulatory failure.", beta: "≥ 2.5", expiry: "Class-wide production ban AND non-persistent substitutes at scale. Not met." },
  ]},
  { group: "EVOLUTIONARY ARMS RACES", domains: [
    { name: "AMR / EFFICACY CEILING", plain: "Antibiotics work by killing bacteria. But killing bacteria selects for bacteria that can survive the antibiotic. The same molecular event that cures the patient — therapeutic lethality — selects for resistance. This is not a side effect. It is an evolutionary consequence of the mechanism of action.", theorem: "Therapeutic lethality constitutively selects for resistance. No market mechanism can decouple antibiotic use from resistance development. Every dose that cures also selects.", beta: "2.1", expiry: "Extraction-rate management only — slow enough use that resistance cannot establish. Not compatible with current medical practice at scale." },
    { name: "MONOCULTURE AGRICULTURE / GENETIC UNIFORMITY FLOOR", plain: "Modern industrial agriculture plants vast areas with genetically identical crops. This maximizes yield efficiency. It also means a pathogen that can infect one plant can infect all of them. The Irish Potato Famine was monoculture failure. The current global wheat supply is more genetically uniform than it was then. The generational asymmetry is 730:1 — pathogens reproduce 730 times for every crop cycle.", theorem: null, beta: "8.6", expiry: "Mandatory diversification at scale. Not met." },
  ]},
  { group: "RADIOACTIVE DECAY", domains: [
    { name: "NUCLEAR FISSION / PERSISTENCE FLOOR", plain: "Nuclear fission generates no combustion emissions and produces extraordinary energy density. It also produces radioactive waste with half-lives measured in thousands to millions of years. Radioactive decay rates are fundamental physical constants. No engineering, no regulation, no market mechanism can accelerate them.", theorem: null, beta: "0.53 — THE ONLY DOMAIN BELOW 1.0", expiry: "None — half-lives are not negotiable.", callout: "Nuclear is not clean. But it is the least destructive per dollar of output of any energy sector examined. The SAPM does not presuppose that any sector is bad. It measures what it costs." },
  ]},
  { group: "IRREVERSIBLE CAPABILITY DIFFUSION", domains: [
    { name: "FRONTIER AI / ALIGNMENT CEILING", plain: "Once an AI capability is demonstrated — GPT-4 can do X, AlphaFold can fold proteins — that capability cannot be unlearned. The knowledge that it is possible, the architectural insight that achieved it, diffuses irreversibly through the research community. Capability advances faster than alignment because demonstrating capability is one experiment; proving alignment is a research program that may never converge.", theorem: null, beta: "7.40", expiry: "Formal verification at the capability frontier. Not currently achievable." },
  ]},
  { group: "ARCHITECTURAL CONSTRAINTS", domains: [
    { name: "BLOCKCHAIN / PROTOCOL WELFARE FLOOR", plain: "Permissionless blockchain networks — Bitcoin, Ethereum — allow anyone to participate without identity verification or accountability. This is the design feature. It is also why welfare costs cannot be internalized through protocol design alone: there is no mechanism to exclude actors who impose welfare costs, because exclusion requires permission, and the protocol is permissionless.", theorem: null, beta: "≥ 1.0", expiry: "Sovereign custody regulation. Not at scale." },
  ]},
  { group: "GEOCHEMICAL", domains: [
    { name: "DEEP-SEA MINING / ABYSSAL RECOVERY FLOOR", plain: "The deep ocean floor — below 4,000 meters — is covered with polymetallic nodules containing cobalt, nickel, manganese, and copper. These nodules form at 10 to 20 millimeters per million years. The organisms that live on them — sponges, corals, microbial communities — have no other substrate. When you mine the nodule, you destroy the habitat. The habitat cannot recover on any human timescale.", theorem: null, beta: "≥ 2.0", expiry: "Cobalt-free batteries exceeding 85% market share before extraction commences. Not met." },
    { name: "TOPSOIL EROSION / PEDOGENESIS FLOOR", plain: "Topsoil — the thin layer of biologically active soil that makes agriculture possible — forms at 1 centimeter per 100 to 1,000 years. Industrial agriculture erodes it at rates 10 to 100 times faster than formation. Once gone, it cannot be replaced on any agricultural timescale. We are farming the principal.", theorem: null, beta: "≥ 1.8", expiry: "Regenerative agriculture exceeding 50% of global cropland. Not met." },
  ]},
  { group: "PROCESS CHEMISTRY", domains: [
    { name: "CEMENT / CALCINATION FLOOR", plain: "Concrete is made from cement. Cement is made from limestone (CaCO₃). To make cement, you heat limestone until it releases CO₂: CaCO₃ → CaO + CO₂. This is not a fuel choice. This is conservation of mass. The carbon in limestone must go somewhere when you break the calcium carbonate bond. It goes into the atmosphere. Every concrete structure ever built released CO₂ that cannot be avoided by switching to renewable energy.", theorem: null, beta: "≥ 1.35", expiry: "Calcium silicate cement exceeding 1% of global clinker output. Not met." },
  ]},
  { group: "INFORMATIONAL", domains: [
    { name: "WMD / CAPABILITY DIFFUSION CEILING", plain: "Once someone demonstrates that a weapon can be built — a nuclear device, a specific pathogen, an autonomous weapons system — the knowledge that it is possible cannot be erased. The barrier to replication drops permanently. Transferred weapons knowledge is enabling in a way that persists regardless of what happens to the original weapon.", theorem: null, beta: null, expiry: "Security competition ends. Not a realistic near-term scenario." },
  ]},
  { group: "INSTITUTIONAL", domains: [
    { name: "PLATFORM MONOPOLY / GATEKEEPER RATCHET", plain: "Network effects mean the platform becomes more valuable as more people use it. Zero-price lock-in means users cannot leave without losing their social graph, their reviews, their history. Data feedback means the platform gets better at predicting behavior as it accumulates more data. These three mechanisms together generate a self-reinforcing floor: the platform cannot be displaced by a better product because the switching cost is the entire network.", theorem: null, beta: "≥ 2.8", expiry: "Structural dissolution (AT&T-class breakup)." },
  ]},
  { group: "JURISDICTIONAL", domains: [
    { name: "ORBITAL DEBRIS / CONGESTION CEILING", plain: "Low Earth orbit — the band of space 200 to 2,000 kilometers above Earth where GPS, weather, and communications satellites operate — is filling with debris from satellite collisions and launches. Each collision generates more debris. At some density, a chain reaction begins — Kessler Syndrome — where collision-generated debris triggers more collisions, making the entire orbital band unusable. No single sovereign controls this space. No treaty has enforcement mechanisms. The orbit cannot be cleaned once Kessler Syndrome begins.", theorem: null, beta: "≥ 12.0", expiry: "Orbital-use fee regime plus mandatory low-altitude deployment. Not at scale." },
    { name: "FISHERIES / EXTERNAL FORCING IMPOSSIBILITY", plain: "Fish populations can be managed. Ocean temperatures cannot — not by fisheries management. As ocean warming accelerates, fish populations are shifting poleward, coral reefs are bleaching, and the ecosystems that fisheries depend on are restructuring. The impossibility is jurisdictional: the thing destroying the fishery (atmospheric CO₂ concentration) operates entirely outside the institutional reach of fisheries management.", theorem: null, beta: null, expiry: "Atmospheric CO₂ ≤ 300 ppm. Not achievable under any current trajectory." },
  ]},
  { group: "BIOLOGICAL", domains: [
    { name: "GENE DRIVES / ECOLOGICAL RATCHET FLOOR", plain: "A gene drive is a genetic technology that spreads a chosen trait through an entire wild population — potentially the entire species — within a few generations. They are being developed to eliminate malaria mosquitoes, control invasive species, and eradicate agricultural pests. Once a gene drive is released into a wild population, it cannot be recalled. The construct propagates itself. There is no off switch.", theorem: null, beta: "≥ 4.2", expiry: "Contained drives only (daisy-chain or threshold architectures that limit spread). Not currently dominant in the field." },
  ]},
];

function Chapter8() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div id="ch8">
      <ChapterHead num={8} title="Some Hollow Wins cannot be fixed from inside the game. Ever." subtitle="In sixteen domains, the impossibility is not structural — it is physical. The C-F bond does not negotiate. Radioactive decay constants are not adjustable by regulation. Evolutionary selection pressure does not respond to market incentives." time="4 min" />

      <P>The Private Pareto Theorem proves that bilateral optimization is constitutively blind to system welfare. In seventeen documented domains, this means no private mechanism can achieve <Tip term="Win-Win-Win">Win-Win-Win</Tip> without deliberate institutional redesign. That is the parent result.</P>

      <P>In sixteen of those domains, something stronger holds: no market mechanism — not regulation, not incentives, not carbon pricing, not better technology within the current paradigm — can reduce system welfare destruction below a structural floor. The floor is set not by institutional failure but by physics, biology, chemistry, or orbital mechanics.</P>

      <P>Each follows Arrow's logical architecture — three constitutive axioms, conjunction guarantees an irreducible floor — except the axioms are empirical facts about the physical world, not value judgments about rational preferences.</P>

      {DOMAINS.map((g, gi) => (
        <div key={g.group} style={{ marginTop: 32 }}>
          <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 2, marginBottom: 12 }}>
            GROUP {gi + 1} — {g.group}
          </div>
          {g.domains.map((d, di) => {
            const key = `${gi}-${di}`;
            const isExpanded = expanded === key;
            return (
              <div key={key} onClick={() => setExpanded(isExpanded ? null : key)} style={{
                padding: "16px 20px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4,
                marginBottom: 8, cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: M, fontSize: 12, fontWeight: 600, color: TEXT }}>{d.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {d.beta && <span style={{ fontFamily: M, fontSize: 11, color: GOLD }}>β_W: {d.beta}</span>}
                    <span style={{ fontFamily: M, fontSize: 10, color: MUTED }}>{isExpanded ? "−" : "+"}</span>
                  </div>
                </div>
                {/* ALWAYS show plain English */}
                <div style={{ fontFamily: S, fontSize: 14, color: DIM, lineHeight: 1.7, marginTop: 8 }}>{d.plain}</div>

                {isExpanded && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                    {d.theorem && (
                      <div style={{ marginBottom: 10 }}>
                        <Label>THE THEOREM</Label>
                        <div style={{ fontFamily: M, fontSize: 11, color: TEXT, lineHeight: 1.7 }}>{d.theorem}</div>
                      </div>
                    )}
                    {d.callout && (
                      <div style={{ padding: "10px 14px", background: "rgba(245,158,11,0.06)", border: `1px solid rgba(245,158,11,0.15)`, borderRadius: 4, marginBottom: 10 }}>
                        <div style={{ fontFamily: S, fontSize: 12, color: GOLD, fontStyle: "italic" }}>{d.callout}</div>
                      </div>
                    )}
                    <Label>EXPIRY CONDITION</Label>
                    <div style={{ fontFamily: M, fontSize: 11, color: RED }}>{d.expiry}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* THE STRUCTURAL BREAK */}
      <div style={{ padding: "24px", background: "rgba(245,158,11,0.06)", border: `2px solid rgba(245,158,11,0.2)`, borderRadius: 4, margin: "40px 0" }}>
        <div style={{ fontFamily: S, fontSize: 15, color: GOLD, lineHeight: 1.8 }}>
          The 15 theorems in the existing economics canon are built on value judgments. Kenneth Arrow said so himself — he characterized his axioms as "value judgments that express the doctrines of citizens' sovereignty and rationality in a very general form." The Stanford Encyclopedia of Philosophy confirms: they are "not supposed to express more or less indubitable truths."
        </div>
        <div style={{ fontFamily: S, fontSize: 15, color: GOLD, lineHeight: 1.8, marginTop: 12 }}>
          The profession accepted those theorems. It gave out Nobel Prizes for them.
        </div>
        <div style={{ fontFamily: S, fontSize: 15, color: GOLD, lineHeight: 1.8, marginTop: 12 }}>
          The 16 proposed domain theorems are built on physical constants. Conservation of mass. Radioactive decay rates. The C-F bond energy. The geochemical rate of nodule formation. These are not value judgments. They are measured facts confirmed by independent experimental replication across centuries.
        </div>
        <div style={{ fontFamily: S, fontSize: 18, color: GOLD, lineHeight: 1.8, marginTop: 16, fontWeight: 600, textAlign: "center" }}>
          The C-F bond has never lost an arbitration.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN CURRICULUM COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Curriculum({ onDeepDive }) {
  const [activeChapter, setActiveChapter] = useState(1);
  const chapterRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = parseInt(entry.target.id.replace("ch", ""));
          if (id) setActiveChapter(id);
        }
      });
    }, { threshold: 0.3 });

    for (let i = 1; i <= 8; i++) {
      const el = document.getElementById(`ch${i}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG, color: TEXT, fontFamily: S }}>
      {/* Sidebar nav — desktop */}
      <nav style={{
        width: 220, position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        borderRight: `1px solid ${BORDER}`, padding: "24px 16px", flexShrink: 0,
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 2, marginBottom: 16 }}>CURRICULUM</div>
        {CHAPTERS.map(ch => (
          <a key={ch.id} href={`#ch${ch.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`ch${ch.id}`)?.scrollIntoView({ behavior: "smooth" }); }} style={{
            display: "block", padding: "8px 10px", borderRadius: 4, textDecoration: "none",
            background: activeChapter === ch.id ? "rgba(245,158,11,0.08)" : "transparent",
            borderLeft: activeChapter === ch.id ? `3px solid ${GOLD}` : "3px solid transparent",
          }}>
            <div style={{ fontFamily: M, fontSize: 10, color: activeChapter === ch.id ? GOLD : MUTED }}>{ch.id}. {ch.title}</div>
            <div style={{ fontFamily: M, fontSize: 9, color: MUTED, marginTop: 2 }}>{ch.time}</div>
          </a>
        ))}
        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          <div style={{ fontFamily: M, fontSize: 9, color: MUTED, marginBottom: 4 }}>TOTAL: ~25 MIN</div>
          {onDeepDive && (
            <button onClick={onDeepDive} style={{ fontFamily: M, fontSize: 10, color: GOLD, background: "rgba(245,158,11,0.08)", border: `1px solid rgba(245,158,11,0.15)`, padding: "8px 12px", borderRadius: 4, cursor: "pointer", width: "100%", textAlign: "left" }}>
              DEEP DIVE →
            </button>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, maxWidth: 800, padding: "0 32px 80px", margin: "0 auto" }}>
        <Chapter1 />
        <div style={{ borderTop: `1px solid ${BORDER}`, margin: "48px 0" }} />
        <Chapter2 />
        <div style={{ borderTop: `1px solid ${BORDER}`, margin: "48px 0" }} />
        <Chapter3 />
        <div style={{ borderTop: `1px solid ${BORDER}`, margin: "48px 0" }} />
        <Chapter4 />
        <div style={{ borderTop: `1px solid ${BORDER}`, margin: "48px 0" }} />
        <Chapter5 />
        <div style={{ borderTop: `1px solid ${BORDER}`, margin: "48px 0" }} />
        <Chapter6 />
        <div style={{ borderTop: `1px solid ${BORDER}`, margin: "48px 0" }} />
        <Chapter7 />
        <div style={{ borderTop: `1px solid ${BORDER}`, margin: "48px 0" }} />
        <Chapter8 />

        {/* DEEP DIVE DIVIDER */}
        <div style={{ borderTop: `2px solid ${GOLD}`, margin: "64px 0 32px", paddingTop: 24, textAlign: "center" }}>
          <div style={{ fontFamily: M, fontSize: 10, color: GOLD, letterSpacing: 3 }}>DEEP DIVE — FOR RESEARCHERS AND PRACTITIONERS</div>
          <div style={{ fontFamily: S, fontSize: 13, color: MUTED, marginTop: 8 }}>Interactive timeline, domain theorems, β_W rankings, T* explorer, case comparison, Conflictoring walkthrough</div>
          {onDeepDive && (
            <button onClick={onDeepDive} style={{ fontFamily: M, fontSize: 11, padding: "10px 24px", marginTop: 16, background: "rgba(245,158,11,0.1)", border: `1px solid rgba(245,158,11,0.3)`, color: GOLD, borderRadius: 4, cursor: "pointer" }}>
              ENTER DEEP DIVE →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
