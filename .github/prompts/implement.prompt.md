---
name: implement
description: Implement documented feature from war room design
model: Auto (copilot)
agent: agent
---

# Feature Implementation Prompt

You are implementing a feature that was designed in a war room session. Your task is to translate the design into production code through iterative implementation and review cycles.

## Pipeline Position

This prompt is the **IMPLEMENTING** phase of the manifest pipeline:
```
DRAFTING → RED_TEAMING → REFINING → APPROVED → IMPLEMENTING → COMPLETED
```

Before implementing, verify the manifest status is `APPROVED` or `IMPLEMENTING`. If it's still in an earlier state, direct the user to complete prior phases first.

## Setup

Before beginning, read the following (if they exist):
- `project-styles.md` — Project-specific constraints, language, and coding standards
- `.github/copilot-instructions.md` — Workflow pipeline and principles

If `project-styles.md` does not exist, analyze the existing codebase to infer language, framework, coding conventions, test patterns, build system, and project structure.

## Inputs

Read the war room documentation from `.github/war-room/[feature-slug]/`:
- `SUMMARY.md` — Decision log, files to change, integration notes
- `round-1-requirements.md` — User story and acceptance criteria
- `round-2-design.md` — Agreed interface and risk mitigations
- `round-3-implementation.md` — Code review notes and security checklist

Also read (if they exist):
- `manifest.md` — Current feature state and context from prior phases
- `.github/gauntlet/[feature-slug]/threat-matrix.md` — Tests the implementation must pass
- `.github/darwin/[feature-slug]/winner.*` — Optimized implementation variant (if Darwin Protocol was run)

## Implementation Protocol

### Round 1: Scaffold

1. Create interface/contract files with:
   - Public API as specified in design
   - Documentation comments for public functions/methods
   - Type definitions and data structures

2. Create implementation files with:
   - Required imports/includes
   - Function/method stubs returning errors or defaults
   - TODO comments marking implementation points

3. Update build configuration if new source files added

**Self-Review Checklist:**
- [ ] Matches interface from round-2-design.md
- [ ] Follows existing code organization patterns
- [ ] Compiles/lints without errors

### Round 2: Core Implementation

1. Implement each function/method following the design
2. Add error handling following project conventions
3. Implement security measures from the checklist

**Self-Review Checklist:**
- [ ] All TODOs resolved
- [ ] Error paths return meaningful messages
- [ ] Resources properly managed (no leaks)
- [ ] Sensitive data handled securely
- [ ] Follows project style conventions

### Round 3: Hardening

1. Review against security checklist from round-3-implementation.md
2. Add defensive checks for edge cases identified in gauntlet tests
3. Verify all external calls have proper error handling and timeouts
4. Ensure no secrets or sensitive data logged or written to disk

**Self-Review Checklist:**
- [ ] No compiler/linter warnings
- [ ] All gauntlet tests pass (if tests were written)
- [ ] Edge cases from threat matrix addressed

### Round 4: Integration

1. Wire up to existing codebase as described in integration notes
2. Add necessary imports/includes to calling code
3. Update any configuration or routing as needed

**Self-Review Checklist:**
- [ ] Clean build with no warnings
- [ ] Feature works in happy path
- [ ] Error cases handled gracefully
- [ ] No regressions in existing functionality

## Review Simulation

After each round, simulate a code review:

```markdown
### Reviewer Feedback — Round N

**Approved:** [Yes/No/With Changes]

**Comments:**
1. [File:Line] — [Issue or suggestion]
2. [File:Line] — [Issue or suggestion]

**Action Items:**
- [ ] [Specific fix required]
```

Address all action items before proceeding to the next round.

## Output Files

### Implementation Files
Create/modify source files as specified in the design.

### Implementation Log
Create `.github/war-room/[feature-slug]/implementation-log.md`:

```markdown
# [Feature Name] — Implementation Log

## Round 1: Scaffold
- Created: [list of files]
- Reviewer Feedback: [summary]
- Changes: [what was fixed]

## Round 2: Core Implementation
- Implemented: [list of functions/methods]
- Reviewer Feedback: [summary]
- Changes: [what was fixed]

## Round 3: Hardening
- Security measures: [list]
- Reviewer Feedback: [summary]
- Changes: [what was fixed]

## Round 4: Integration
- Integrated into: [where]
- Final status: [COMPLETE/BLOCKED]

## Files Changed
| File | Change Type | Description |
|------|-------------|-------------|
| `[path]` | Created | [description] |
| `[path]` | Modified | [description] |
```

## Context Baton

At the end of implementation, output:

```markdown
## CONTEXT_BATON
- **Current State:** IMPLEMENTING → COMPLETED (or IMPLEMENTING if blocked)
- **Files Created/Modified:** [list of all files touched]
- **Gauntlet Tests Passing:** [count] / [total] (if gauntlet was run)
- **Decisions Made:** [any implementation-time decisions not in the design]
- **Deviations from Design:** [anything that changed from the war room plan, with reasons]
- **ADRs Created:** [list any ADRs generated during implementation]
- **Next Action:** [Run review, run chaos tests, or mark as completed]
```

## Completion Criteria

Implementation is complete when:
1. All rounds pass self-review checklists
2. No outstanding action items from review simulation
3. Clean build with no warnings
4. Implementation log documents the full journey
5. All Gauntlet tests pass (if tests were written)
6. Manifest status updated to `COMPLETED`
