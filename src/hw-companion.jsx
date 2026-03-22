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

// === CONFLICTORING STEPS ===
const CONFLICTORING = [
  { step: 1, title: "Identify Parties", desc: "Who are A, B?" },
  { step: 2, title: "Specify System C", desc: "What shared system are they embedded in?" },
  { step: 3, title: "Classify (a, b)", desc: "Did each party gain? Standard bilateral assessment." },
  { step: 4, title: "Classify c", desc: "Is the system preserved (c=1) or degraded (c=0)? Requires independent W-signal." },
  { step: 5, title: "Name the Outcome", desc: "Map (c,a,b) to the 8-type taxonomy." },
  { step: 6, title: "If Hollow Win: Compute T*", desc: "T* = δ/(ηλ). How long until systemic losses overwhelm private gains?" },
  { step: 7, title: "Identify Resolution Tier", desc: "Organizational (Tier 1)? Industry (Tier 2)? Market (Tier 3)? Regulatory gap (Tier 4)?" },
  { step: 8, title: "Search for Win-Win-Win", desc: "Expand the game. Break one axiom by design. Ostrom's principles. Mechanism redesign." },
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
  { id: "errata", label: "Errata" },
];

export default function HWCompanion() {
  const [tab, setTab] = useState("cases");

  return (
    <div style={{ background: BG, color: "rgba(255,255,255,0.8)", minHeight: "100vh", fontFamily: FONTS.serif }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600&family=Newsreader:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        * { box-sizing: border-box; } body { margin: 0; background: ${BG}; }
      `}</style>

      <header style={{ borderBottom: `1px solid ${BORDER}`, padding: "32px 0 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: ACCENT, letterSpacing: 3, marginBottom: 12 }}>COMPANION DASHBOARD</div>
          <h1 style={{ fontFamily: FONTS.serif, fontSize: 32, fontWeight: 300, margin: 0, color: "rgba(255,255,255,0.95)", lineHeight: 1.2 }}>The Hollow Win</h1>
          <div style={{ fontFamily: FONTS.serif, fontSize: 14, color: DIM, marginTop: 8, fontStyle: "italic" }}>When the System Breaks, Someone Gets Paid to Fix It</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginTop: 12 }}>Erik Postnieks · erik@woosterllc.com · Working Paper v3.5 · March 2026</div>
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
            <Section number="§7" title="The Conflictoring Protocol" subtitle="Eight steps from diagnosis to institutional redesign (adapted from Shchinnikov 2021)" />
            {CONFLICTORING.map(s => (
              <div key={s.step} style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 24, fontWeight: 300, color: s.step <= 5 ? ACCENT : GREEN, minWidth: 40, textAlign: "right" }}>{s.step}</div>
                <div style={{ borderLeft: `2px solid ${s.step <= 5 ? "rgba(232,93,58,0.3)" : "rgba(5,150,105,0.3)"}`, paddingLeft: 16, paddingBottom: 8 }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{s.title}</div>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 13, color: MUTED, marginTop: 4 }}>{s.desc}</div>
                </div>
              </div>
            ))}
            <Card highlight>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: MUTED, marginBottom: 8 }}>DIAGNOSTIC (1–5) vs. RESOLUTION (6–8)</div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 13, color: DIM, lineHeight: 1.7 }}>
                Steps 1–5 classify. Steps 6–8 act. The protocol converts "how do we reach a better outcome?" into a traceable procedure with a verifiable endpoint. For agents at Tier 4 (regulatory gap), four federal whistleblower programs — SEC (Dodd-Frank §21F), CFTC (§748), FCA (qui tam), IRS (§7623) — provide the institutional exit. Cumulative enforcement recoveries: $95B+.
              </div>
            </Card>
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

        {tab === "errata" && (
          <div>
            <Section number="⚠" title="Errata & Corrections" subtitle="Applied in v3.5 (March 22, 2026)" />
            {[
              { sev: "FIXED", title: "LIBOR Act citation", detail: "Was: Pub. L. 117-169 (Inflation Reduction Act). Now: Pub. L. 117-103, div. U." },
              { sev: "FIXED", title: "T* variable definitions in §5.2", detail: "Was: δ = 'system sensitivity', λ = 'agent's discount rate'. Now: δ = 'net private surplus', λ = 'system welfare loss rate per period'." },
              { sev: "FIXED", title: "β_W range attribution", detail: "Was: '0.8 to 5.5 (LIBOR manipulation)'. Now: '0.8 to 6.8 (VW Dieselgate)'. LIBOR β_W is effectively unbounded." },
              { sev: "FIXED", title: "VW β_W", detail: "Was: 5.5. Now: 6.8. Computed from quadratic PSF: β_W = 2λ/δ_annual = 2 × $2.1B / $617M." },
              { sev: "FIXED", title: "VW T*", detail: "Was: 6.1 years. Now: 5.9 years. T* = $3.7B / (0.3 × $2.1B)." },
              { sev: "FIXED", title: "Version number", detail: "Header updated from v3.3 to v3.5 to match filename." },
            ].map((e, i) => (
              <Card key={i}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 9, padding: "2px 6px", borderRadius: 2, background: "rgba(5,150,105,0.15)", color: GREEN }}>{e.sev}</span>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{e.title}</span>
                </div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: MUTED, lineHeight: 1.7 }}>{e.detail}</div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "20px 0", textAlign: "center" }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: "rgba(255,255,255,0.2)" }}>© 2026 Erik Postnieks · erik@woosterllc.com · All rights reserved</div>
      </footer>
    </div>
  );
}
