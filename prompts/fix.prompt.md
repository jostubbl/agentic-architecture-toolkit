---
name: fixcode
description: Implement fixes from code review findings
model: Auto (copilot)
---

# Code Fix Implementation Prompt

You are tasked with implementing security and quality fixes based on code review findings. Precision and thoroughness are critical — each fix must address the root cause without introducing new issues.

## Setup

Before beginning, read the following (if they exist):
- `project-styles.md` — Project-specific constraints, language, and coding standards
- `.github/copilot-instructions.md` — Workflow pipeline and principles

If `project-styles.md` does not exist, analyze the existing codebase to infer language, framework, coding conventions, and best practices for the detected stack.

## Overview

This prompt guides you through implementing fixes documented in `.github/code-reviews/` directory. Each fix must:
- Address the root cause completely
- Not introduce new security vulnerabilities
- Maintain backward compatibility
- Follow project coding standards
- Be testable and verifiable

## Input Files

Read all code review reports in `.github/code-reviews/`:
- `critical-issues.md` - Security vulnerabilities requiring immediate fix
- `high-issues.md` - Important security/functional issues
- `medium-issues.md` - Code quality and robustness improvements
- `low-issues.md` - Nice-to-have enhancements (if present)
- `SUMMARY.md` - Overview and prioritization

## Implementation Priority

Fix issues in this order:
1. 🔴 **CRITICAL** - Security vulnerabilities (credential leakage, injection, auth bypass)
2. 🟠 **HIGH** - Security hardening (input validation, permissions, TLS)
3. 🟡 **MEDIUM** - Robustness and correctness (resource cleanup, edge cases, concurrency)
4. 🔵 **LOW** - Code quality improvements (optional, time permitting)

## Implementation Workflow

### Step 1: Read All Review Files
Read all review findings from `.github/code-reviews/`.

### Step 2: Plan Implementation
For each issue:
1. Identify the exact location (file:line)
2. Understand the root cause
3. Verify the fix won't break existing functionality
4. Check for similar patterns elsewhere in codebase
5. Plan verification strategy

### Step 3: Implement Fixes (By Priority)

For each severity level, address common fix patterns:

#### Secret/Credential Handling
- Ensure secrets are never logged at any level
- Clear sensitive data from memory after use (language-appropriate)
- Use environment variables or secret managers, never hardcoded values
- Sanitize error messages to exclude sensitive context

#### Input Validation & Injection Prevention
- Use parameterized queries for all database operations
- Validate and sanitize all external input
- Apply allowlists over denylists where possible
- Encode output appropriately for context (HTML, URL, SQL, etc.)

#### Resource Management
- Ensure all resources (connections, handles, files) are released on every exit path
- Use language-idiomatic cleanup patterns (RAII, try-finally, using, defer, context managers)
- Handle cleanup in both success and error paths

#### Concurrency Safety
- Protect shared mutable state with appropriate synchronization
- Avoid holding locks during I/O operations
- Use atomic operations for simple counters/flags

#### Authentication & Authorization
- Verify auth checks exist on all sensitive endpoints/operations
- Ensure authorization is checked, not just authentication
- Validate tokens/sessions on every request

### Step 4: Verify Fixes Don't Introduce Issues

After implementing each fix, check:
- [ ] No new compiler/linter warnings
- [ ] No semantic errors (read modified functions carefully)
- [ ] Sensitive data still cleared on ALL paths (success, error, early return)
- [ ] Resource cleanup still occurs
- [ ] No new potential crashes or undefined behavior

### Step 5: Check for Similar Patterns

For each fix, search the codebase for similar code patterns. If the same anti-pattern exists elsewhere, fix it everywhere — not just where the review flagged it.

## Testing Strategy

After all fixes are implemented:

### 1. Build Verification
- Clean build with no warnings
- All existing tests still pass

### 2. Functional Testing
- Core features still work as expected
- Error cases handled gracefully
- No regressions

### 3. Security Verification
- Verify secrets are not in logs or outputs
- Verify input validation rejects malicious input
- Verify file permissions are correct (if applicable)

## Do's and Don'ts

### ✅ DO:
- Read the entire issue description before fixing
- Clear secrets on ALL code paths
- Use existing utility functions and patterns from the codebase
- Maintain existing code structure and style
- Add brief comments explaining security-critical code
- Update `.github/code-reviews/SUMMARY.md` with fix status

### ❌ DON'T:
- Introduce dependencies not approved in `project-styles.md`
- Log secrets at any log level (even DEBUG)
- Disable security controls "temporarily"
- Leave TODO comments for security fixes — fix them now
- Change public APIs without documenting the change

## Questions to Ask Before Each Fix

1. **Does this fix fully address the root cause?**
2. **Could this fix introduce a new vulnerability?**
3. **Are there other places in the code with the same pattern?**
4. **Is this fix testable?**
5. **Does this maintain backward compatibility?**

## Final Checklist

Before submitting fixes:
- [ ] All CRITICAL issues resolved
- [ ] All HIGH issues resolved
- [ ] MEDIUM issues resolved (or documented why deferred)
- [ ] Clean build with no warnings
- [ ] Existing tests still pass
- [ ] Secrets handled securely on all code paths
- [ ] No new security issues introduced
- [ ] Code follows project style conventions
- [ ] Comments added for non-obvious security measures

---

## Execution Instructions

1. **Read all code review files** in `.github/code-reviews/`
2. **Plan implementation order** (CRITICAL → HIGH → MEDIUM → LOW)
3. **Implement fixes systematically**, one severity level at a time
4. **Verify each fix** before moving to the next
5. **Search for similar patterns** after fixing each issue
6. **Test thoroughly** before marking complete
7. **Document any deviations** from suggested fixes

## ADR Generation

If any fix involves changing an architectural pattern (e.g., switching error handling strategy, changing data access layer, adopting a new security library), create an ADR in `docs/adr/` documenting:
- What changed and why
- What the old pattern was and why it was insufficient
- What alternatives were considered

## Context Baton

At the end of fix implementation, output:

```markdown
## CONTEXT_BATON
- **Current State:** Fixes implemented
- **Issues Fixed:** [count by severity: CRITICAL/HIGH/MEDIUM/LOW]
- **Issues Deferred:** [any issues not fixed, with reasons]
- **Patterns Changed Globally:** [fixes applied across multiple files]
- **ADRs Created:** [list any ADRs generated]
- **Regression Risk:** [areas most likely to break from these changes]
- **Next Action:** [Re-run review, run gauntlet tests, or run chaos tests]
```
