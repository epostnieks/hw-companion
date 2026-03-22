# The Hollow Win — Companion Dashboard

Interactive case study browser, Calvano reclassification results, and Conflictoring protocol walkthrough for:

**Postnieks, E. (2026). "The Hollow Win: When the System Breaks, Someone Gets Paid to Fix It." Working Paper, March 2026.**

## What This Contains

### Case Study Browser
Six Hollow Win cases, five Win-Win-Win cases, seven contested-C cases — each with (c,a,b) classification, documented penalties, and timeline.

### Calvano et al. (2020) Reclassification
- N = 30 replications of Q-learning algorithmic collusion simulation
- Base code: Courthoud (2020) Python adaptation of AEA replication package (DOI: 10.3886/E119462V1)
- Parameters: n=2 firms, α=0.15, β=4×10⁻⁶, δ=0.95, k=15 price levels
- Results: 53% of converged outcomes classified as Hollow Win (0,1,1); 77% system-degrading

### Conflictoring Protocol
Eight-step decision tree from diagnosis to institutional redesign (adapted from Shchinnikov 2021).

### Errata (shared with PPT companion)
- LIBOR Act citation: Pub. L. 117-103, div. U (not 117-103, div. U)
- T* variable definitions in §5.2: δ = net private surplus, λ = system welfare loss rate (not "system sensitivity" / "discount rate" as stated)
- β_W ≈ 6.8 is VW Dieselgate, not LIBOR (fix range statement)
- Version number: header v3.3, filename v3.5

## Companion Papers

- Postnieks (2026a) — **The Private Pareto Trap** (formal proofs, SAPM framework)
- Postnieks (2026, HW) — **The Hollow Win** (this paper's companion)
- Postnieks (2026b) — Bitcoin SAPM Calibration
- Postnieks (2026c) — PoS SAPM Cross-Chain Comparison

## Setup

```bash
npm install
npm run dev
```

Deploy: connect to Vercel, framework = Vite.

## Citation

```
Postnieks, E. (2026). "The Hollow Win: When the System Breaks, Someone 
Gets Paid to Fix It." Working Paper, March 2026.
Correspondence: erik@woosterllc.com
```

## License

© 2026 Erik Postnieks. All rights reserved.
