import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, CartesianGrid } from "recharts";

// ══════════════════════════════════════════════════════════════
// The Hollow Win — Companion Visualization & Case Study Browser
// Postnieks (2026, HW) Working Paper
// ══════════════════════════════════════════════════════════════

const FONTS = { mono: "'JetBrains Mono', monospace", serif: "'Newsreader', serif" };
const BG = "#0A0A0F";
const BORDER = "rgba(255,255,255,0.06)";
const MUTED = "rgba(255,255,255,0.35)";
const DIM = "rgba(255,255,255,0.5)";
const ACCENT = "#E85D3A";
const GREEN = "#059669";
const YELLOW = "#F59E0B";

// === CASE STUDIES ===
const HOLLOW_WIN_CASES = [
  { name: "LIBOR Manipulation", years: "2005–2012", cab: "(0,1,1)", penalties: "$9B+", system: "Benchmark integrity ($350T notional)", mechanism: "False rate submissions", section: "§3.2" },
  { name: "Lysine Cartel", years: "1992–1995", cab: "(0,1,1)", penalties: "$100M+", system: "Livestock/food supply chains", mechanism: "Price-fixing (70% increase in 9 months)", section: "§3.3" },
  { name: "AI Agent Collusion", years: "2024–2025", cab: "(0,1,1)", penalties: "N/A (simulation)", system: "Market pricing integrity", mechanism: "Independent optimization converges to supracompetitive pricing", section: "§3.4" },
  { name: "Vitamin Cartel", years: "1990–1999", cab: "(0,1,1)", penalties: "$1.5B+", system: "Pharmaceutical/food supply", mechanism: "9-year conspiracy; DOJ: 'most pervasive ever'", section: "§3.5" },
  { name: "RealPage Rent-Fixing", years: "2016–2025", cab: "(0,1,1)", penalties: "$141M+ (initial)", system: "Competitive rental market", mechanism: "Algorithmic pricing from nonpublic competitor data", section: "§3.5" },
  { name: "Auto Parts Cartel", years: "2011–2016", cab: "(0,1,1)", penalties: "$2.9B", system: "Automotive supply chains", mechanism: "46 companies, 65 executives; coordinated at supplier summits", section: "§3.5" },
];

const WIN_WIN_WIN_CASES = [
  { name: "Montreal Protocol", years: "1987–present", cab: "(1,1,1)", system: "Ozone layer", mechanism: "CFC phase-out; DuPont supported once substitutes viable", section: "§3.7" },
  { name: "SOFR Transition", years: "2014–2023", cab: "(1,1,1)", system: "Benchmark integrity", mechanism: "Transaction-based rate replaced manipulable survey", section: "§3.8" },
  { name: "Basel III Capital Requirements", years: "2010–present", cab: "(1,1,1)", system: "Financial system stability", mechanism: "Higher capital buffers mandated post-2008", section: "§3.8" },
  { name: "EU REACH Regulation", years: "2007–present", cab: "(1,1,1)", system: "Chemical safety commons", mechanism: "Registration/evaluation of 22,000+ substances", section: "§3.8" },
  { name: "Kimberley Process", years: "2003–present", cab: "(1,1,1)", system: "Conflict-free diamond supply", mechanism: "Certification scheme; 99.8% conflict-diamond reduction", section: "§3.8" },
];

const CONTESTED_CASES = [
  { name: "Pharmaceutical R&D JV", classification: "Depends on C", c_options: "C=innovation system → (1,1,1); C=drug pricing → (0,1,1)", section: "§3.9" },
  { name: "Environmental Permit", classification: "Depends on C", c_options: "C=local env → (1,1,1); C=regional ecosystem → (0,1,1)", section: "§3.10" },
  { name: "Platform Data-Sharing", classification: "Depends on C", c_options: "C=recommendation quality → (1,1,1); C=user privacy → (0,1,1)", section: "§3.11" },
  { name: "Gig Economy Classification", classification: "Depends on C", c_options: "C=labor market flexibility → (1,1,1); C=worker protections → (0,1,1)", section: "§3.11" },
  { name: "Nuclear Energy Expansion", classification: "Depends on C", c_options: "C=carbon reduction → (1,1,1); C=waste/safety → (0,1,1)", section: "§3.11" },
  { name: "Sports Anti-Doping", classification: "Depends on C", c_options: "C=competitive integrity → (0,1,1); C=national prestige → (1,1,1)", section: "§3.11" },
  { name: "AI Training Data", classification: "Depends on C", c_options: "C=model capability → (1,1,1); C=information commons → (0,1,1)", section: "§3.11" },
];

// === CALVANO RECLASSIFICATION ===
const CALVANO_DATA = [
  { name: "Hollow Win (0,1,1)", value: 53, color: ACCENT },
  { name: "Other c=0", value: 24, color: "#991B1B" },
  { name: "c=1 outcomes", value: 23, color: GREEN },
];

// === CONFLICTORING PROTOCOL — GENERIC + LIBOR WORKED EXAMPLE ===
const CONFLICTORING = [
  { step: 1, title: "Name the Parties", phase: "diagnostic",
    desc: "Identify A, B, and the system C they are embedded in. The system boundary must be stated explicitly — classification depends on it.",
    libor: "A = Panel banks (Barclays, UBS, Deutsche Bank, RBS, etc.). B = Counterparty banks and traders on the other side. System C = Global financial benchmark integrity — $350 trillion in contracts referenced LIBOR daily." },
  { step: 2, title: "Classify the Current Outcome", phase: "diagnostic",
    desc: "Apply the 8-outcome taxonomy. Is this Win-Win-Win (1,1,1) or Hollow Win (0,1,1)? Measure or estimate W.",
    libor: "Classification: Hollow Win (0,1,1). Both sides of the rate-submission conspiracy gained — supracompetitive spreads, controlled funding costs. But benchmark integrity was destroyed. Standard vocabulary at the time called it 'cooperation' and 'market-making.'" },
  { step: 3, title: "Identify the PST Axioms", phase: "diagnostic",
    desc: "Do all three Private-Systemic Tension axioms hold? (1) Overlapping interests, (2) System independence, (3) System dependence. If any fails, the impossibility does not apply.",
    libor: "All three hold. (1) Overlapping interests: both sets of banks gained from rate manipulation. (2) System independence: benchmark integrity cannot be expressed as a function of bank payoffs — W is structurally orthogonal. (3) System dependence: rate submissions directly set the benchmark. Every manipulation moved W." },
  { step: 4, title: "Compute System Beta", phase: "diagnostic",
    desc: "β_W = −dW/dΠ. The marginal rate of system welfare destruction per dollar of private gain. This is the SAPM's central measurement.",
    libor: "β_W ≈ 5.5. Penalties exceeded $9 billion across 12+ institutions. Seven years undetected. The ratio of system damage to private gain was extreme — every dollar of spread manipulation destroyed multiples in benchmark trust, contract reliability, and regulatory integrity." },
  { step: 5, title: "Estimate Crossover Time", phase: "diagnostic",
    desc: "T* = δ/(ηλ). When does the Hollow Win collapse into outright failure? This is the countdown clock.",
    libor: "T* ≤ 0 by the time regulators acted. The system damage had already exceeded the cumulative private gains. The Hollow Win had collapsed — the question was no longer 'when will it break' but 'how badly has it already broken.' Detection came from a whistleblower, not from market signals." },
  { step: 6, title: "Map the Response Ladder", phase: "resolution",
    desc: "Four tiers of intervention. Tier 1: Individual (document, whistleblow). Tier 2: Firm (incentive redesign). Tier 3: Industry (regulatory intervention). Tier 4: Sovereign (treaty, structural reform).",
    libor: "Tier 1 = CFTC whistleblower program (§748) — this is how the scheme was initially exposed. Tier 3 = Regulatory restructuring and $9B+ in penalties across institutions. Tier 4 = FSB benchmark reform and the SOFR transition — international coordination to replace the manipulable survey with a transaction-based rate." },
  { step: 7, title: "Select Minimum Sufficient Intervention", phase: "resolution",
    desc: "The lowest tier that breaks PST. Overkill wastes resources and creates resistance. But under-intervention leaves the Hollow Win intact.",
    libor: "Minimum sufficient intervention = Tier 4 sovereign coordination. Penalties alone (Tier 3) could not fix the structural vulnerability — LIBOR's survey-based design made it permanently manipulable. Only replacing the benchmark architecture (SOFR) broke the PST axioms by design." },
  { step: 8, title: "Verify Escape — Confirm Win-Win-Win", phase: "resolution",
    desc: "Confirm C flips from 0 to 1. Win-Win-Win (1,1,1) is the target, not just mitigation. The system must be verifiably preserved.",
    libor: "SOFR transition verified Win-Win-Win (1,1,1). The new benchmark is transaction-based — derived from ~$1 trillion/day in overnight repo trades. Benchmark integrity restored. C = 1. The game was redesigned so that the PST axioms no longer hold simultaneously." },
];

// === WHISTLEBLOWER INFRASTRUCTURE ===
const WHISTLEBLOWER = [
  { program: "SEC Whistleblower", statute: "Dodd-Frank §21F", reward: "10–30% of sanctions > $1M", scope: "Securities fraud, market manipulation, insider trading", cumulative: "$2.2B+ awarded" },
  { program: "CFTC Whistleblower", statute: "CEA §748", reward: "10–30% of sanctions > $1M", scope: "Commodities fraud, benchmark manipulation, spoofing", cumulative: "$380M+ awarded" },
  { program: "FCA Qui Tam", statute: "False Claims Act", reward: "15–30% of recovery", scope: "Government contract fraud, healthcare fraud", cumulative: "$75B+ recovered (total FCA)" },
  { program: "IRS Whistleblower", statute: "IRC §7623", reward: "15–30% of collected proceeds", scope: "Tax fraud, underpayment > $2M", cumulative: "$6.5B+ collected" },
];

const Section = ({ number, title, subtitle }) => (
  <div style={{ marginTop: 48, marginBottom: 24 }}>
    <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: ACCENT, letterSpacing: 2, marginBottom: 6 }}>{number}</div>
    <h2 style={{ fontFamily: FONTS.serif, fontSize: 24, fontWeight: 400, color: "rgba(255,255,255,0.9)", margin: 0 }}>{title}</h2>
    {subtitle && <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: MUTED, marginTop: 4 }}>{subtitle}</div>}
  </div>
);

const Card = ({ children, highlight, color }) => (
  <div style={{ background: highlight ? `rgba(232,93,58,0.04)` : "rgba(255,255,255,0.02)", border: `1px solid ${color || BORDER}`, borderRadius: 2, padding: "16px 20px", marginBottom: 8 }}>
    {children}
  </div>
);

const TABS = [
  { id: "cases", label: "18 Cases" },
  { id: "calvano", label: "Calvano Q-Learning" },
  { id: "conflictoring", label: "Conflictoring" },
  { id: "sapm", label: "SAPM Summary" },
];

export default function HWCompanion() {
  const [tab, setTab] = useState("cases");
  const [cStep, setCStep] = useState(0); // 0-indexed: 0=step1, 7=step8, 8=whistleblower panel

  return (
    <div style={{ background: BG, color: "rgba(255,255,255,0.8)", minHeight: "100vh", fontFamily: FONTS.serif }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600&family=Newsreader:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        * { box-sizing: border-box; } body { margin: 0; background: ${BG}; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .pulse { animation: pulse 3s ease-in-out infinite; }
      `}</style>

      <header style={{ borderBottom: `1px solid ${BORDER}`, padding: "32px 0 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: ACCENT, letterSpacing: 3, marginBottom: 12 }}>COMPANION DASHBOARD</div>
              <h1 style={{ fontFamily: FONTS.serif, fontSize: 32, fontWeight: 300, margin: 0, color: "rgba(255,255,255,0.95)", lineHeight: 1.2 }}>The Hollow Win</h1>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginTop: 12 }}>Erik Postnieks · Working Paper v3.5 · March 2026</div>
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: DIM, textAlign: "right", display: "flex", gap: 16, alignItems: "center", marginTop: 8 }}>
              <span><span className="pulse" style={{ color: ACCENT }}>18</span> CASES</span>
              <span style={{ color: BORDER }}>·</span>
              <span><span className="pulse" style={{ color: "#DC2626" }}>53%</span> HOLLOW WIN</span>
              <span style={{ color: BORDER }}>·</span>
              <span><span className="pulse" style={{ color: YELLOW }}>$95B</span> RECOVERED</span>
            </div>
          </div>
        </div>
      </header>

      <nav style={{ borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, background: BG, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              fontFamily: FONTS.mono, fontSize: 11, padding: "12px 20px", border: "none", cursor: "pointer",
              background: tab === t.id ? "rgba(232,93,58,0.08)" : "transparent",
              color: tab === t.id ? ACCENT : MUTED,
              borderBottom: tab === t.id ? `2px solid ${ACCENT}` : "2px solid transparent",
            }}>{t.label}</button>
          ))}
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>

        {tab === "cases" && (
          <div>
            <Section number="§3" title="Eighteen Validated Cases" subtitle="6 Hollow Win + 5 Win-Win-Win + 7 Contested C" />

            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: ACCENT, marginBottom: 12, marginTop: 32 }}>HOLLOW WIN (0,1,1) — 6 CASES</div>
            {HOLLOW_WIN_CASES.map(c => (
              <Card key={c.name} color="rgba(220,38,38,0.15)">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{c.name}</span>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginLeft: 8 }}>{c.years}</span>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginTop: 4 }}>{c.mechanism}</div>
                  </div>
                  <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: "#DC2626" }}>{c.cab}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: YELLOW }}>{c.penalties}</div>
                  </div>
                </div>
              </Card>
            ))}

            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: GREEN, marginBottom: 12, marginTop: 32 }}>WIN, WIN, WIN (1,1,1) — 5 CASES</div>
            {WIN_WIN_WIN_CASES.map(c => (
              <Card key={c.name} color="rgba(5,150,105,0.15)">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{c.name}</span>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginLeft: 8 }}>{c.years}</span>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginTop: 4 }}>{c.mechanism}</div>
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: GREEN }}>{c.cab}</div>
                </div>
              </Card>
            ))}

            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: YELLOW, marginBottom: 12, marginTop: 32 }}>CONTESTED C — 7 CASES</div>
            {CONTESTED_CASES.map(c => (
              <Card key={c.name} color="rgba(245,158,11,0.15)">
                <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{c.name}</span>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginTop: 4 }}>{c.c_options}</div>
              </Card>
            ))}
          </div>
        )}

        {tab === "calvano" && (
          <div>
            <Section number="§3.4a" title="Calvano et al. (2020) Reclassification" subtitle="30 replications of Q-learning algorithmic collusion — first quantitative taxonomy application" />
            <Card highlight>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginBottom: 8 }}>PARAMETERS</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: DIM, lineHeight: 2 }}>
                Base code: Courthoud (2020) Python adaptation of AEA replication package (DOI: 10.3886/E119462V1)<br/>
                N = 30 replications · n = 2 firms · α = 0.15 · β = 4×10⁻⁶ · δ = 0.95 · k = 15 price levels<br/>
                Convergence criterion: 10⁵ stable periods
              </div>
            </Card>
            <div style={{ height: 300, marginTop: 24 }}>
              <ResponsiveContainer>
                <BarChart data={CALVANO_DATA} margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: DIM, fontFamily: FONTS.mono, fontSize: 10 }} />
                  <YAxis tick={{ fill: MUTED, fontFamily: FONTS.mono, fontSize: 10 }} unit="%" />
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: `1px solid ${BORDER}`, fontFamily: FONTS.mono, fontSize: 11 }} />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {CALVANO_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 24 }}>
              <Card><div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED }}>HOLLOW WIN</div><div style={{ fontFamily: FONTS.mono, fontSize: 28, color: ACCENT }}>53%</div></Card>
              <Card><div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED }}>SYSTEM-DEGRADING</div><div style={{ fontFamily: FONTS.mono, fontSize: 28, color: "#DC2626" }}>77%</div></Card>
              <Card><div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED }}>SYSTEM-PRESERVING</div><div style={{ fontFamily: FONTS.mono, fontSize: 28, color: GREEN }}>23%</div></Card>
            </div>
            <Card highlight>
              <div style={{ fontFamily: FONTS.serif, fontSize: 13, color: DIM, lineHeight: 1.7, fontStyle: "italic" }}>
                No intent. No communication. No shared code. Q-learning agents converge to Hollow Win through independent private optimization — exactly as Proposition 10 predicts.
              </div>
            </Card>
          </div>
        )}

        {tab === "conflictoring" && (
          <div>
            <Section number="§7" title="The Conflictoring Protocol" subtitle="Eight steps from diagnosis to institutional redesign — LIBOR worked example" />

            {/* Progress bar */}
            <div style={{ display: "flex", gap: 2, marginBottom: 24 }}>
              {CONFLICTORING.map((s, i) => (
                <div key={i} onClick={() => setCStep(i)} style={{
                  flex: 1, height: 4, borderRadius: 2, cursor: "pointer",
                  background: i <= cStep
                    ? (s.phase === "diagnostic" ? ACCENT : GREEN)
                    : BORDER,
                  transition: "background 0.3s",
                }} />
              ))}
              {/* Whistleblower panel indicator */}
              <div onClick={() => setCStep(8)} style={{
                flex: 1, height: 4, borderRadius: 2, cursor: "pointer",
                background: cStep === 8 ? YELLOW : BORDER,
                transition: "background 0.3s",
              }} />
            </div>

            {/* Phase label */}
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 2, marginBottom: 16, color: cStep === 8 ? YELLOW : cStep < 5 ? ACCENT : GREEN }}>
              {cStep === 8 ? "INSTITUTIONAL INFRASTRUCTURE" : cStep < 5 ? "DIAGNOSTIC PHASE (STEPS 1–5)" : "RESOLUTION PHASE (STEPS 6–8)"}
            </div>

            {/* Step content — two-column layout */}
            {cStep < 8 && (() => {
              const s = CONFLICTORING[cStep];
              const phaseColor = s.phase === "diagnostic" ? ACCENT : GREEN;
              return (
                <div>
                  {/* Step header */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 32, fontWeight: 300, color: phaseColor }}>{s.step}</div>
                    <div>
                      <div style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{s.title}</div>
                      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginTop: 2 }}>Step {s.step} of 8</div>
                    </div>
                  </div>

                  {/* Two-column: Protocol | LIBOR */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: 2 }}>
                      <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: MUTED, letterSpacing: 1, marginBottom: 8 }}>PROTOCOL</div>
                      <div style={{ fontFamily: FONTS.serif, fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                        {s.desc}
                      </div>
                    </div>
                    <div style={{ padding: "16px 20px", background: "rgba(232,93,58,0.04)", border: `1px solid rgba(232,93,58,0.15)`, borderRadius: 2 }}>
                      <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: ACCENT, letterSpacing: 1, marginBottom: 8 }}>LIBOR — WORKED EXAMPLE</div>
                      <div style={{ fontFamily: FONTS.serif, fontSize: 13, color: DIM, lineHeight: 1.7 }}>
                        {s.libor}
                      </div>
                    </div>
                  </div>

                  {/* Step indicator dots */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                    {CONFLICTORING.map((_, i) => (
                      <div key={i} onClick={() => setCStep(i)} style={{
                        width: 8, height: 8, borderRadius: "50%", cursor: "pointer",
                        background: i === cStep ? phaseColor : i < cStep ? "rgba(255,255,255,0.2)" : BORDER,
                      }} />
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Whistleblower Infrastructure Panel (after step 8) */}
            {cStep === 8 && (
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 32, fontWeight: 300, color: YELLOW }}>★</div>
                  <div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>Whistleblower Infrastructure</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginTop: 2 }}>Tier 1 institutional exits — four federal programs</div>
                  </div>
                </div>

                <Card highlight>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: YELLOW, letterSpacing: 1, marginBottom: 8 }}>CUMULATIVE ENFORCEMENT RECOVERIES</div>
                  <div className="pulse" style={{ fontFamily: FONTS.mono, fontSize: 36, color: YELLOW }}>$95B+</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginTop: 4 }}>Across SEC, CFTC, FCA, and IRS whistleblower programs</div>
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                  {WHISTLEBLOWER.map(w => (
                    <div key={w.program} style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: 2 }}>
                      <div style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>{w.program}</div>
                      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: YELLOW, marginBottom: 8 }}>{w.statute}</div>
                      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, lineHeight: 1.8 }}>
                        Reward: {w.reward}<br/>
                        Scope: {w.scope}<br/>
                        Track record: {w.cumulative}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <button onClick={() => setCStep(Math.max(0, cStep - 1))} disabled={cStep === 0} style={{
                fontFamily: FONTS.mono, fontSize: 11, padding: "8px 20px", border: `1px solid ${BORDER}`,
                background: cStep === 0 ? "transparent" : ACCENT + "15", color: cStep === 0 ? MUTED : ACCENT,
                borderRadius: 2, cursor: cStep === 0 ? "default" : "pointer",
              }}>← BACK</button>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, alignSelf: "center" }}>
                {cStep < 8 ? `${cStep + 1} / 8` : "INFRASTRUCTURE"}
              </div>
              <button onClick={() => setCStep(Math.min(8, cStep + 1))} disabled={cStep === 8} style={{
                fontFamily: FONTS.mono, fontSize: 11, padding: "8px 20px", border: `1px solid ${BORDER}`,
                background: cStep === 8 ? "transparent" : (cStep === 7 ? YELLOW + "15" : ACCENT + "15"),
                color: cStep === 8 ? MUTED : (cStep === 7 ? YELLOW : ACCENT),
                borderRadius: 2, cursor: cStep === 8 ? "default" : "pointer",
              }}>{cStep === 7 ? "WHISTLEBLOWER →" : "NEXT →"}</button>
            </div>
          </div>
        )}

        {tab === "sapm" && (
          <div>
            <Section number="§6.1" title="SAPM Summary for Practitioners" subtitle="System beta, crossover time, and what the numbers mean" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { domain: "VW Dieselgate", beta: "6.8", tstar: "5.9 yr", class: "Slow HW → Misery", color: ACCENT },
                { domain: "LIBOR", beta: ">>1", tstar: "≤ 0", class: "Fast HW (Concealed)", color: "#DC2626" },
                { domain: "ERCOT Grid", beta: "2,053", tstar: "N/A", class: "Slow HW → Acute Misery", color: "#7F1D1D" },
              ].map(d => (
                <Card key={d.domain}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED }}>{d.domain.toUpperCase()}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 24, color: d.color, marginTop: 4 }}>β = {d.beta}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginTop: 8 }}>T* = {d.tstar}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: DIM }}>{d.class}</div>
                </Card>
              ))}
            </div>
            <Card highlight>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginBottom: 8 }}>WHAT β_W MEANS</div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 13, color: DIM, lineHeight: 1.7 }}>
                β_W = −dW/dΠ. The marginal rate of system welfare destruction per dollar of private gain. Computed from the quadratic Private-Systemic Frontier (Proposition 15). β_W = 6.8 means every dollar of engineering cost VW avoided by not installing SCR urea systems destroyed $6.80 of system welfare — in health costs, regulatory integrity, competitive distortion, and environmental damage. Full derivation: companion workbook.
              </div>
            </Card>
          </div>
        )}

      </main>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "20px 0", textAlign: "center" }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: "rgba(255,255,255,0.2)" }}>© 2026 Erik Postnieks · erik@woosterllc.com · All rights reserved</div>
      </footer>
    </div>
  );
}
