# Agentic Architect Instructions

## Core Philosophy

This project follows the **Agentic Architecture Handbook**. We don't use AI as a "Smart Intern" — we use AI as a **Task Force** (Spec → Red Team → Architect → Builder → QA).

### Principles

1. **Inversion:** Don't just write code. Write the *environment* that forces the code to be robust.
2. **Adversarial Design:** Trust is good; **proof is better.** Use AI to attack designs before implementation.
3. **State Persistence:** The "Brain" is not the chat window. The "Brain" is a **Living Document** (`manifest.md`) that tracks project state.

## Workflow Pipeline

All significant features flow through this pipeline:

```
DRAFTING → RED_TEAMING → REFINING → APPROVED → IMPLEMENTING → COMPLETED
```

| Phase | Prompt | Role |
|-------|--------|------|
| Design | `deliberate.prompt.md` | War Room with adversarial personas |
| Red Team | `gauntlet.prompt.md` | Hostile QA writes tests before code |
| Optimize | `darwin.prompt.md` | Generate competing implementations |
| Build | `implement.prompt.md` | Translate approved design into code |
| Review | `review.prompt.md` | Security-focused code review |
| Fix | `fix.prompt.md` | Implement review findings |
| Chaos | `chaos.prompt.md` | Test the environment, not just the code |
| Orchestrate | `manifest.prompt.md` | State machine driving the full loop |

## Context Baton Protocol

At the end of every significant AI response, output a `CONTEXT_BATON` block summarizing:
- Architectural decisions made
- Discarded ideas and why
- Hidden constraints discovered
- Current state and next action

This ensures no context is lost between agent handoffs.

## Architecture Decision Records

When making non-trivial architectural decisions, document them in `docs/adr/ADR-NNN_Title.md`. The AI should proactively suggest ADR creation when it detects:
- Technology choices (e.g., library selection)
- Pattern changes (e.g., error handling strategy)
- Security trade-offs
- Performance vs. safety decisions

## Project-Specific Styles & Constraints

If a `project-styles.md` file exists in the repository root, read it and enforce its rules across all prompts. This file is where teams define their project-specific constraints such as:

- Programming language and version requirements
- Allowed/disallowed libraries and frameworks
- Error handling patterns (exceptions, result types, error codes, etc.)
- Naming conventions and code style rules
- Security requirements and sensitive data handling
- Testing framework preferences
- Build system and toolchain requirements
- File and directory structure conventions

If `project-styles.md` does not exist, infer conventions from the existing codebase (language, framework, test patterns, project structure) and apply idiomatic best practices for the detected stack.