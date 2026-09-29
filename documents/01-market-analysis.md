# ai-recruitment-auditor — Market Analysis

> **Evidence base.** This document was researched on 2026-09-29 from vendor pricing pages,
> published analyst figures and the owner's market-review work (2026-09-26). No number
> here is invented. Where a figure could not be independently verified it is marked
> **[TO BE VALIDATED]**; verify it before the document is used in an investor or
> grant setting. Sources are listed in §8.

## 1. Product in one sentence

> AI Recruitment Auditor — a B2B recruitment-audit portal aiming to audit hiring pipelines with proctored screens.

## 2. Problem statement

- **Who feels the problem:** Recruiting teams and hiring managers (audit tool); candidate-facing (autohire).
- **What they do today instead:** manual processes, spreadsheets, rented SaaS — see §4.
- **Cost of the status quo:** measurable in lost revenue / manual labor overhead
  **[TO BE VALIDATED for this specific segment]**.

## 3. Market definition

| Field | Value |
| --- | --- |
| Category | ATS / recruitment audit |
| Geographic scope | Global |
| Target segment / persona | Recruiting teams and hiring managers (audit tool); candidate-facing (autohire) |
| Estimated total addressable market | ATS is a mature, heavily funded category (Greenhouse, Lever, Ashby, Workable, Recruitee) **[TO BE VALIDATED — cite a specific figure]** |
| Serviceable addressable market | Depends on distribution reach; **[TO BE VALIDATED]** |
| Beachhead segment | Recruiting teams and hiring managers (audit tool); candidate-facing (autohire) |

## 4. Demand signals

> Real and substantial, but dominated by incumbents with PLG + enterprise sales

| Signal | Evidence | Status |
| --- | --- | --- |
| Category demand | Mature/validated category with well-funded entrants | Confirmed |
| Competitive floor | Incumbent pricing and free tiers are public and low | Confirmed (see §5) |
| Own sales/usage data | Not instrumented in this repo | **[TO BE MEASURED]** |

## 5. Competitive landscape

| Competitor | Entry price (2026) | Positioning | Weakness we can exploit |
| --- | --- | --- | --- |
| **Greenhouse** | Quote | Enterprise hiring suite | Long sales cycle |
| **Lever** | Quote | ATS + CRM | Enterprise |
| **Ashby** | ~$400–1200/mo | Modern PLG ATS | Rising cost curve |
| **Workable** | from ~$99/job | SMB ATS | Per-job pricing |
| **Recruitee** | from ~$70/mo | SMB ATS | Crowded segment |

## 6. Differentiation

Grounded in what this build actually does (see `06-architecture.md`):

- **Distinctive capability in code:** None defensible as a product today. Value is as a code-review / AI-generator audit specimen (no auth layer detected), not a deployable SaaS.
- **Capability a competitor would need to replicate:** proxy of the build's core path.
- **Why defensible:** depth of vertical fit and delivery ownership, not a generic dashboard.

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Category commoditized / incumbent floor falling | Medium–High | Medium | Position on differentiation above, not price |
| Unverified market figures | High | High | Keep `[TO BE VALIDATED]` markers until sourced |
| Claims ahead of code (demo vs. shipped) | Medium | High | Keep README/copy aligned with the source tree |

## 8. Sources

Accessed 2026-09-29; vendor pricing changes — re-verify before any pricing decision.

- https://www.ashbyhq.com/pricing
- https://www.workable.com/pricing
- https://recruitee.com/pricing
