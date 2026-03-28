import { useState } from "react";
import HWCompanion from './hw-companion'
import Curriculum from './Curriculum'
import SAPMNav from "./SAPMNav";

export default function App() {
  const [view, setView] = useState("curriculum"); // "curriculum" | "deepdive"

  if (view === "deepdive") {
    return (
      <>
        <div style={{ position: "fixed", top: 12, left: 16, zIndex: 999 }}>
          <button onClick={() => setView("curriculum")} style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#F59E0B",
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)",
            padding: "6px 14px", borderRadius: 4, cursor: "pointer", letterSpacing: 1,
          }}>
            ← CURRICULUM
          </button>
        </div>
        <HWCompanion />
        <SAPMNav />
      </>
    );
  }

  return (
    <>
      <Curriculum onDeepDive={() => setView("deepdive")} />
      <SAPMNav />
    </>
  );
}
