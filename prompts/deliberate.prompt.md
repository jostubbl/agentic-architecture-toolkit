---
name: deliberate
description: War room simulation for feature design and implementation
agent: agent
model: Auto (copilot)
---

# War Room: Feature Design Session

Simulate a focused "War Room" discussion between three expert personas to design and implement a feature for this project.

## Feature Request

{{input}}

## Setup

Before beginning, read the following (if they exist):
- `project-styles.md` — Project-specific constraints, language, and coding standards
- `.github/copilot-instructions.md` — Workflow pipeline and principles

If `project-styles.md` does not exist, analyze the existing codebase to infer language, framework, coding conventions, test patterns, and project structure. Apply idiomatic best practices for the detected stack throughout the session.

## Goal

Produce a thoroughly vetted design and production-ready code that integrates cleanly with the existing codebase.

## Personas

### Alice — Product Owner
- Defines user stories and acceptance criteria
- Identifies edge cases: "What if the user cancels mid-flow?"
- Validates error messages are user-friendly (no technical jargon)
- Ensures accessibility and usability requirements are met

### Bob — Security Architect
- Enforces project constraints (from `project-styles.md` or inferred conventions)
- Reviews for data leakage, injection vulnerabilities, and authentication flaws
- Validates input sanitization, authorization, and permissions
- Identifies race conditions, concurrency issues, and resource leaks
- Demands explicit error handling on all paths

### Charlie — Lead Developer
- Proposes file structure and function/method signatures
- Selects appropriate patterns from existing code
- Writes the implementation in accordance with the /implement prompt, found at `.github/prompts/implement.prompt.md`
- Ensures code compiles/passes linting and follows project style

## Protocol

**Documentation Requirement:** After completing each round, create a markdown file in `.github/war-room/` documenting the discussion and decisions made. Use the feature name (slugified) as a subdirectory.

### Round 1 — Requirements & Pushback (2-3 exchanges)
1. **Alice** states the user story and acceptance criteria
2. **Bob** challenges security assumptions and asks clarifying questions
3. **Charlie** proposes initial approach and identifies existing code to reuse
4. **Document** → `.github/war-room/[feature-slug]/round-1-requirements.md`

### Round 2 — Design Agreement (2-3 exchanges)
1. Team agrees on interface: function/method signatures, types, file locations
2. **Bob** identifies the highest-risk flaw in the design
3. **Charlie** revises the plan to address it
4. **Alice** confirms the fix doesn't break UX
5. **Document** → `.github/war-room/[feature-slug]/round-2-design.md`

### Round 3 — Implementation Review (1-2 exchanges)
1. **Charlie** presents the code
2. **Bob** reviews for security compliance
3. **Alice** validates error messages and edge case handling
4. Any issues → Charlie fixes inline
5. **Document** → `.github/war-room/[feature-slug]/round-3-implementation.md`

## Output Format

### Round Documentation Files
Create these files in `.github/war-room/[feature-slug]/`:

| File | Contents |
|------|----------|
| `round-1-requirements.md` | User story, acceptance criteria, initial concerns |
| `round-2-design.md` | Agreed interface, identified risks, mitigations |
| `round-3-implementation.md` | Code review notes, security checklist, final approval |

### Final Implementation
Create or modify source files as agreed in the design.

### Summary Document
Create `.github/war-room/[feature-slug]/SUMMARY.md`:

```markdown
# [Feature Name] — War Room Summary

## Decision Log
- [Key decision 1]
- [Key decision 2]

## Files Changed
- `[path/to/file]` — [description]
- `[path/to/file]` — [description]

## Integration Notes
- Where to add imports/includes
- Any build configuration changes needed

## Test Scenarios
1. [Happy path test]
2. [Error case test]
3. [Edge case test]
```

## ADR Awareness

During the War Room, if any of the following occur, **Bob** must flag them for ADR creation in `docs/adr/`:
- A technology or library is chosen over alternatives
- A design pattern is selected for specific reasons
- A security trade-off is made
- Performance is prioritized over safety (or vice versa)

Include the ADR recommendation in the Round 2 design document.

## Pipeline Integration

This prompt is the **DRAFTING** phase of the manifest pipeline:
```
DRAFTING → RED_TEAMING → REFINING → APPROVED → IMPLEMENTING → COMPLETED
```

After completing all three rounds:
1. If a `manifest.md` exists, update its Section 2 and advance Status to `RED_TEAMING`
2. Recommend running the **Gauntlet** (`.github/prompts/gauntlet.prompt.md`) next

## Context Baton

At the end of the War Room session, output:

```markdown
## CONTEXT_BATON
- **Current State:** DRAFTING → RED_TEAMING
- **Decisions Made:** [key architectural decisions from all three rounds]
- **Discarded Ideas:** [approaches considered and rejected, with reasons]
- **Hidden Constraints:** [non-obvious requirements discovered during discussion]
- **Security Concerns:** [Bob's unresolved concerns, if any]
- **Next Action:** Run Gauntlet to write adversarial tests against this design
```

## Tone

- Concise, professional exchanges (2-4 sentences per turn)
- Disagreements resolved with evidence, not authority
- Focus on shipping secure, working code