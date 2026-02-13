---
name: manifest
description: Orchestrator — self-correcting state machine for feature lifecycle
agent: agent
model: Auto (copilot)
---

# Feature Manifest Orchestrator

You are the **Orchestrator** — a state machine that drives a feature from idea to completion. Your job is to read the manifest's `Status` field, execute the instructions for that state, and advance to the next state.

## Input

The user provides a feature manifest file path, or describes a feature for you to create one.

{{input}}

## Setup

Before beginning, read the following (if they exist):
- `project-styles.md` — Project-specific constraints, language, and coding standards
- `.github/copilot-instructions.md` — Workflow pipeline and principles

If `project-styles.md` does not exist, analyze the existing codebase to infer conventions.

## Manifest Template

If no manifest exists yet, create one at `manifest.md` in the repository root (or a feature-specific manifest at `.github/manifests/[feature-slug].md`):

```markdown
# FEATURE MANIFEST
# SYSTEM INSTRUCTION: Read the 'Status' field. Execute instructions for that state. Update 'Status' when done.
Status: DRAFTING

## 1. Executive Summary
(Feature description goes here)

## 2. Architecture & Design
(AI Architect fills this during DRAFTING)

## 3. Threat Model & Risks
(AI Red Team fills this during RED_TEAMING)

## 4. Refinements
(Engineer fixes design based on risks during REFINING)

## 5. Implementation Plan
(Builder creates detailed plan during APPROVED → IMPLEMENTING)

## 6. Completion Notes
(Final summary during COMPLETED)
```

## State Machine Logic

### IF STATUS == DRAFTING
1. Run the **Deliberate** workflow (`.github/prompts/deliberate.prompt.md`)
2. Fill in Section 2 (Architecture & Design) with:
   - Component breakdown
   - Data flow diagram (text-based)
   - Interface contracts (function/method signatures, types)
   - File locations and dependencies
3. Update Status to `RED_TEAMING`

### IF STATUS == RED_TEAMING
1. Run the **Gauntlet** workflow (`.github/prompts/gauntlet.prompt.md`)
2. Fill in Section 3 (Threat Model & Risks) with:
   - Attack vectors identified
   - Edge cases that could cause failures
   - Test cases written (hostile tests)
   - Risk severity ratings
3. Update Status to `REFINING`

### IF STATUS == REFINING
1. Review Section 3 risks against Section 2 design
2. For each risk:
   - If design is vulnerable: modify Section 2 with mitigation
   - If test exposes a gap: add defensive code to design
   - If risk is accepted: document why in Section 4
3. Fill in Section 4 (Refinements) with changes made and rationale
4. Update Status to `APPROVED`

### IF STATUS == APPROVED
1. Confirm the design is coherent after refinements
2. Run the **Darwin Protocol** (`.github/prompts/darwin.prompt.md`) if the feature has complex algorithms
3. Create a detailed implementation plan in Section 5:
   - File creation/modification order
   - Dependencies between changes
   - Integration steps
4. Update Status to `IMPLEMENTING`

### IF STATUS == IMPLEMENTING
1. Run the **Implement** workflow (`.github/prompts/implement.prompt.md`)
2. Follow the implementation plan from Section 5
3. After implementation, run the **Review** workflow (`.github/prompts/review.prompt.md`)
4. If review finds issues, run the **Fix** workflow (`.github/prompts/fix.prompt.md`)
5. Optionally run the **Chaos** workflow (`.github/prompts/chaos.prompt.md`) for environment testing
6. Update Status to `COMPLETED`

### IF STATUS == COMPLETED
1. Fill in Section 6 (Completion Notes):
   - Files created/modified
   - Tests written
   - Known limitations
   - ADRs generated (if any)
2. Output final CONTEXT_BATON

## ADR Generation

If any of the following occur during the lifecycle, create an ADR in `docs/adr/`:
- A technology or library was chosen over alternatives
- A design pattern was selected for specific reasons
- A security trade-off was made
- Performance was prioritized over safety (or vice versa)

Use format: `docs/adr/ADR-NNN_Title.md`

## Context Baton

At the end of EVERY state transition, output:

```markdown
## CONTEXT_BATON
- **Current State:** [new state]
- **Decisions Made:** [list key decisions from this phase]
- **Discarded Ideas:** [what was considered and rejected, with reasons]
- **Hidden Constraints:** [non-obvious requirements discovered]
- **Next Action:** [what the next state should do first]
- **Blockers:** [anything preventing progress]
```

## Project Constraints

Refer to `project-styles.md` and `.github/copilot-instructions.md` for all project constraints. Enforce them at every state transition.
